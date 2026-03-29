const express = require('express');
const searchService = require('../services/searchService.js');

const router = express.Router();

/**
 * Simple in-memory cache with TTL
 * Key: stringified query params, Value: { data, timestamp }
 */
const cache = new Map();
const CACHE_TTL = 30000; // 30 seconds

/**
 * Clean expired cache entries
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      cache.delete(key);
    }
  }
}, 60000); // Clean every 60 seconds

/**
 * Simple rate limiter middleware (in-memory)
 * Tracks requests per IP, allows 60 requests per 60 seconds
 */
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60000; // 60 seconds
const RATE_LIMIT_MAX = 60;

function rateLimit(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return next();
  }

  const limit = rateLimitMap.get(ip);

  if (now > limit.resetTime) {
    limit.count = 1;
    limit.resetTime = now + RATE_LIMIT_WINDOW;
    return next();
  }

  if (limit.count >= RATE_LIMIT_MAX) {
    return res.status(429).json({
      error: 'Too many requests',
      message: 'Rate limit exceeded. Max 60 requests per 60 seconds.',
    });
  }

  limit.count += 1;
  next();
}

/**
 * GET /api/search
 * Full-text search with filters and pagination
 *
 * Query parameters:
 *   - query (required): Search query string
 *   - category (optional): Category filter
 *   - minPrice (optional): Minimum price
 *   - maxPrice (optional): Maximum price
 *   - sortBy (optional): Sort column ('price', 'title', 'created_at')
 *   - sortOrder (optional): 'ASC' or 'DESC'
 *   - page (optional): Page number (1-indexed, default: 1)
 *   - perPage (optional): Items per page (default: 20, max: 100)
 *
 * Response:
 *   {
 *     data: [...products],
 *     pagination: { total, page, perPage, totalPages },
 *     fromCache: boolean
 *   }
 */
router.get('/search', rateLimit, async (req, res) => {
  try {
    const {
      query,
      category = null,
      minPrice = null,
      maxPrice = null,
      sortBy = null,
      sortOrder = 'ASC',
      page = 1,
      perPage = 20,
    } = req.query;

    // Validate required query parameter
    if (!query || typeof query !== 'string' || !query.trim()) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Query parameter is required and cannot be empty.',
      });
    }

    // Check cache
    const cacheKey = JSON.stringify(req.query);
    const cached = cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return res.json({
        ...cached.data,
        fromCache: true,
      });
    }

    // Execute search
    const result = await searchService.search({
      query: query.trim(),
      category,
      minPrice,
      maxPrice,
      sortBy,
      sortOrder,
      page: parseInt(page, 10),
      perPage: parseInt(perPage, 10),
    });

    // Cache result
    cache.set(cacheKey, {
      data: result,
      timestamp: Date.now(),
    });

    res.json({
      ...result,
      fromCache: false,
    });
  } catch (error) {
    console.error('Search endpoint error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
    });
  }
});

/**
 * GET /api/search/suggest
 * Get autocomplete suggestions
 *
 * Query parameters:
 *   - q (required): Search query for suggestions
 *   - limit (optional): Max suggestions (default: 5, max: 20)
 *
 * Response:
 *   {
 *     suggestions: [string, ...],
 *     fromCache: boolean
 *   }
 */
router.get('/suggest', rateLimit, async (req, res) => {
  try {
    const { q, limit = 5 } = req.query;

    // Validate required parameter
    if (!q || typeof q !== 'string' || !q.trim()) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Parameter "q" is required and cannot be empty.',
      });
    }

    // Check cache
    const cacheKey = JSON.stringify({ suggest: q, limit });
    const cached = cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return res.json({
        suggestions: cached.data,
        fromCache: true,
      });
    }

    // Get suggestions
    const suggestions = await searchService.suggest(q, parseInt(limit, 10));

    // Cache result
    cache.set(cacheKey, {
      data: suggestions,
      timestamp: Date.now(),
    });

    res.json({
      suggestions,
      fromCache: false,
    });
  } catch (error) {
    console.error('Suggest endpoint error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
    });
  }
});

module.exports = router;

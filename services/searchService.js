const Product = require('../models/Product.js');
const QueryBuilder = require('./queryBuilder.js');

/**
 * SearchService: Main service for product search and suggestions
 * Handles full-text search, filtering, sorting, and autocomplete suggestions
 */
class SearchService {
  /**
   * Search products with filters and pagination
   * @param {object} options - Search options
   * @param {string} options.query - Search query (required)
   * @param {string} options.category - Filter by category (optional)
   * @param {number} options.minPrice - Minimum price filter (optional)
   * @param {number} options.maxPrice - Maximum price filter (optional)
   * @param {string} options.sortBy - Sort column: 'price', 'title', 'created_at' (optional)
   * @param {string} options.sortOrder - Sort order: 'ASC', 'DESC' (optional)
   * @param {number} options.page - Page number (1-indexed, default: 1)
   * @param {number} options.perPage - Items per page (max 100, default: 20)
   * @returns {Promise<object>} { data: Product[], pagination: { total, page, perPage, totalPages } }
   * @throws {Error} If database query fails
   */
  async search({
    query,
    category = null,
    minPrice = null,
    maxPrice = null,
    sortBy = null,
    sortOrder = 'ASC',
    page = 1,
    perPage = 20,
  }) {
    try {
      const builder = new QueryBuilder();

      // Build query with filters
      if (query && query.trim()) {
        builder.withFullText(query);
      }

      if (category) {
        builder.withCategory(category);
      }

      if (minPrice !== null || maxPrice !== null) {
        builder.withPriceRange(minPrice, maxPrice);
      }

      if (sortBy) {
        builder.withSort(sortBy, sortOrder);
      }

      builder.withPagination(page, perPage);

      const queryObject = builder.build();

      // Execute search
      const { count, rows } = await Product.findAndCountAll(queryObject);

      const totalPages = Math.ceil(count / builder.limit);

      return {
        data: rows,
        pagination: {
          total: count,
          page: Math.floor((builder.offset / builder.limit) + 1),
          perPage: builder.limit,
          totalPages,
        },
      };
    } catch (error) {
      console.error('SearchService.search error:', error);
      throw new Error(`Search failed: ${error.message}`);
    }
  }

  /**
   * Get autocomplete suggestions based on query
   * Returns distinct product titles matching the search query
   * @param {string} query - Partial search query
   * @param {number} limit - Max suggestions to return (default: 5, max: 20)
   * @returns {Promise<string[]>} Array of suggested titles
   * @throws {Error} If database query fails
   */
  async suggest(query, limit = 5) {
    try {
      if (!query || typeof query !== 'string' || query.trim().length === 0) {
        return [];
      }

      // Limit max suggestions
      const limiter = Math.min(Math.max(1, Math.floor(limit)), 20);

      // Sanitize query
      const sanitized = query
        .replace(/'/g, "''")
        .replace(/"/g, '')
        .replace(/\\/g, '')
        .trim()
        .substring(0, 100);

      if (!sanitized) {
        return [];
      }

      // Use raw query with parameterized binding
      const suggestions = await Product.sequelize.query(
        `
        SELECT DISTINCT title
        FROM products
        WHERE search_vector @@ to_tsquery('russian', :query)
        ORDER BY ts_rank(search_vector, to_tsquery('russian', :query)) DESC
        LIMIT :limit
        `,
        {
          replacements: { query: `${sanitized}:*`, limit: limiter },
          type: require('sequelize').QueryTypes.SELECT,
        }
      );

      return suggestions.map((item) => item.title);
    } catch (error) {
      console.error('SearchService.suggest error:', error);
      throw new Error(`Suggestions failed: ${error.message}`);
    }
  }
}

// Export singleton instance
module.exports = new SearchService();

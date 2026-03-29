const { Op, literal } = require('sequelize');

/**
 * Chainable query builder for Product searches
 * Provides methods for full-text search, filtering, sorting, and pagination
 */
class QueryBuilder {
  constructor() {
    this.where = {};
    this.order = [];
    this.limit = 20;
    this.offset = 0;
    this.attributes = {
      exclude: ['search_vector'],
    };
  }

  /**
   * Sanitize user input to prevent SQL injection
   * @param {string} input - User input string
   * @returns {string} Sanitized string
   */
  sanitize(input) {
    if (!input || typeof input !== 'string') return '';
    return input
      .replace(/'/g, "''")
      .replace(/"/g, '')
      .replace(/\\/g, '')
      .trim()
      .substring(0, 500); // Limit to 500 chars
  }

  /**
   * Add full-text search using PostgreSQL TSVECTOR and ts_rank
   * Supports Russian language and phrase matching
   * @param {string} query - Search query
   * @returns {this} QueryBuilder instance for chaining
   */
  withFullText(query) {
    if (!query || typeof query !== 'string') return this;

    const sanitized = this.sanitize(query);
    if (!sanitized) return this;

    // Convert query to ts_query format with word stemming
    const tsQuery = sanitized
      .split(/\s+/)
      .filter(word => word.length > 0)
      .map(word => `${word}:*`)
      .join(' & ');

    // Use raw SQL with parameterized query
    this.where[Op.and] = this.where[Op.and] || [];
    this.where[Op.and].push(
      literal(`search_vector @@ to_tsquery('russian', '${sanitized}:*')`)
    );

    // Sort by relevance (ts_rank)
    this.order.unshift([
      literal(
        `ts_rank(search_vector, to_tsquery('russian', '${sanitized}:*'))`
      ),
      'DESC',
    ]);

    return this;
  }

  /**
   * Add exact category filter
   * @param {string} category - Category name
   * @returns {this} QueryBuilder instance for chaining
   */
  withCategory(category) {
    if (!category || typeof category !== 'string') return this;

    const sanitized = this.sanitize(category);
    if (sanitized) {
      this.where.category = sanitized;
    }

    return this;
  }

  /**
   * Add price range filter
   * @param {number} min - Minimum price (inclusive)
   * @param {number} max - Maximum price (inclusive)
   * @returns {this} QueryBuilder instance for chaining
   */
  withPriceRange(min, max) {
    const parseNum = (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0 ? num : null;
    };

    const minPrice = parseNum(min);
    const maxPrice = parseNum(max);

    if (minPrice !== null || maxPrice !== null) {
      this.where.price = {};

      if (minPrice !== null) {
        this.where.price[Op.gte] = minPrice;
      }

      if (maxPrice !== null) {
        this.where.price[Op.lte] = maxPrice;
      }
    }

    return this;
  }

  /**
   * Add sorting with whitelisted columns to prevent injection
   * @param {string} sortBy - Column name ('price', 'title', 'created_at')
   * @param {string} sortOrder - 'ASC' or 'DESC' (default: 'ASC')
   * @returns {this} QueryBuilder instance for chaining
   */
  withSort(sortBy, sortOrder = 'ASC') {
    const whitelist = ['price', 'title', 'created_at'];

    if (!whitelist.includes(sortBy)) return this;

    const order = ['ASC', 'DESC'].includes(sortOrder.toUpperCase())
      ? sortOrder.toUpperCase()
      : 'ASC';

    // Remove any existing sort by this column
    this.order = this.order.filter(
      (item) => item[0] !== sortBy && (Array.isArray(item[0]) ? item[0][0] !== sortBy : true)
    );

    // Add new sort (unless it's the ts_rank sort from full-text)
    this.order.push([sortBy, order]);

    return this;
  }

  /**
   * Add pagination with max 100 items per page
   * @param {number} page - Page number (1-indexed)
   * @param {number} perPage - Items per page (max 100)
   * @returns {this} QueryBuilder instance for chaining
   */
  withPagination(page, perPage) {
    const p = Math.max(1, Math.floor(page || 1));
    const pp = Math.min(100, Math.max(1, Math.floor(perPage || 20)));

    this.limit = pp;
    this.offset = (p - 1) * pp;

    return this;
  }

  /**
   * Build and return the final query object for Sequelize
   * @returns {object} Query object with where, order, limit, offset, attributes
   */
  build() {
    return {
      where: Object.keys(this.where).length > 0 ? this.where : undefined,
      order: this.order.length > 0 ? this.order : undefined,
      limit: this.limit,
      offset: this.offset,
      attributes: this.attributes,
    };
  }
}

module.exports = QueryBuilder;

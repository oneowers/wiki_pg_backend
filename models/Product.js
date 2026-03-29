const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');

/**
 * Product model for full-text search
 * Includes TSVECTOR field for PostgreSQL native FTS with Russian language support
 */
const Product = sequelize.define(
  'Product',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Product title',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Product description',
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Product category',
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      comment: 'Product price in UZS',
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment: 'JSON array of product tags',
    },
    search_vector: {
      type: DataTypes.TSVECTOR,
      allowNull: true,
      comment: 'PostgreSQL TSVECTOR for full-text search (auto-generated)',
    },
  },
  {
    tableName: 'products',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['category'],
        name: 'products_category_idx',
      },
      {
        fields: ['price'],
        name: 'products_price_idx',
      },
      {
        fields: ['search_vector'],
        using: 'GIN',
        name: 'products_search_vector_gin',
      },
    ],
  }
);

module.exports = Product;

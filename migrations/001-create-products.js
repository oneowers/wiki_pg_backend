'use strict';

module.exports = {
  /**
   * Migration: Create products table with TSVECTOR and GIN index
   * Includes PostgreSQL trigger for auto-updating search_vector on INSERT/UPDATE
   */
  up: async (queryInterface, Sequelize) => {
    // Create trigger function for updating search_vector
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION update_search_vector()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.search_vector := 
          setweight(to_tsvector('russian', COALESCE(NEW.title, '')), 'A') ||
          setweight(to_tsvector('russian', COALESCE(NEW.description, '')), 'B') ||
          setweight(to_tsvector('russian', COALESCE(NEW.category, '')), 'C');
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Create products table
    await queryInterface.createTable('products', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      category: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      tags: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: [],
      },
      search_vector: {
        type: Sequelize.TSVECTOR,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    // Create GIN index for full-text search
    await queryInterface.sequelize.query(`
      CREATE INDEX products_search_vector_gin ON products USING GIN(search_vector)
    `);

    // Create indexes for filtering
    await queryInterface.sequelize.query(`
      CREATE INDEX products_category_idx ON products(category)
    `);

    await queryInterface.sequelize.query(`
      CREATE INDEX products_price_idx ON products(price)
    `);

    // Create trigger to auto-update search_vector
    await queryInterface.sequelize.query(`
      CREATE TRIGGER products_search_vector_trigger
      BEFORE INSERT OR UPDATE ON products
      FOR EACH ROW EXECUTE FUNCTION update_search_vector();
    `);
  },

  down: async (queryInterface) => {
    // Drop trigger
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS products_search_vector_trigger ON products;
    `);

    // Drop function
    await queryInterface.sequelize.query(`
      DROP FUNCTION IF EXISTS update_search_vector();
    `);

    // Drop table (indexes are dropped automatically)
    await queryInterface.dropTable('products');
  },
};

// Script to add test products to database
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    dialectModule: require('pg'),
    logging: console.log,
    pool: {
      max: 10,
      min: 2,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);

const Product = sequelize.define('Product', {
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
  },
  tags: {
    type: Sequelize.JSONB,
    allowNull: true,
  },
  search_vector: {
    type: Sequelize.TSVECTOR,
    allowNull: true,
  },
}, {
  tableName: 'products',
  timestamps: true,
  underscored: true,
});

async function addTestData() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    // Create table if not exists
    await Product.sync();

    // Add test products
    const testProducts = [
      {
        title: 'Luxury Gift Box Premium',
        description: 'Elegant gift box with premium chocolates and accessories',
        category: 'Gift Boxes',
        price: 150.00,
        tags: ['luxury', 'chocolate', 'premium'],
      },
      {
        title: 'Romantic Flower Bouquet',
        description: 'Beautiful fresh flowers for special occasions',
        category: 'Flowers',
        price: 75.50,
        tags: ['flowers', 'romantic', 'fresh'],
      },
      {
        title: 'Designer Perfume Set',
        description: 'Exclusive perfume collection from top brands',
        category: 'Perfumes',
        price: 200.00,
        tags: ['perfume', 'designer', 'luxury'],
      },
      {
        title: 'Chocolate Assortment',
        description: 'Premium Belgian chocolates in elegant packaging',
        category: 'Sweets',
        price: 45.99,
        tags: ['chocolate', 'belgian', 'premium'],
      },
      {
        title: 'Personalized Jewelry Box',
        description: 'Custom engraved jewelry box for special keepsakes',
        category: 'Accessories',
        price: 89.99,
        tags: ['jewelry', 'personalized', 'engraved'],
      },
    ];

    for (const product of testProducts) {
      await Product.create(product);
      console.log(`Created product: ${product.title}`);
    }

    console.log('All test products added successfully!');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

addTestData();
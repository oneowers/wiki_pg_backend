'use strict';
const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create Users table

    
await queryInterface.createTable("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  phone_number: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: "GHOST" },
  last_code: { type: DataTypes.STRING },
  last_code_time: { type: DataTypes.DATE },
  code_expiration_time: { type: DataTypes.DATE },
  BrandId: { type: DataTypes.INTEGER, allowNull: true },
  last_name: { type: DataTypes.STRING, allowNull: true },
  first_name: { type: DataTypes.STRING, allowNull: true },
  profile_image: { type: DataTypes.STRING, allowNull: true },
  country: { type: DataTypes.STRING, allowNull: true },
}); 

await queryInterface.createTable("basket", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

await queryInterface.createTable("basket_device", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

await queryInterface.createTable("device", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  img: { type: DataTypes.STRING, allowNull: false },
  views: { type: DataTypes.INTEGER, allowNull: false },
  device_comments: { type: DataTypes.STRING, allowNull: true },
  description: { type: DataTypes.TEXT, allowNull: true }, // Change to TEXT
  owner_id: { type: DataTypes.INTEGER, allowNull: false },
});


await queryInterface.createTable("type", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
});

await queryInterface.createTable("brand", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
  color: { type: DataTypes.STRING, allowNull: false },
  cover_image: { type: DataTypes.STRING, allowNull: true },
  street_address: { type: DataTypes.STRING, allowNull: true },
  city: { type: DataTypes.STRING, allowNull: true },
  state: { type: DataTypes.STRING, allowNull: true },
  zip: { type: DataTypes.INTEGER, allowNull: true },
  sms_message: { type: DataTypes.INTEGER, allowNull: true },
});

await queryInterface.createTable("rating", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  rating: { type: DataTypes.INTEGER, allowNull: false },
});

await queryInterface.createTable("device_info", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
});

await queryInterface.createTable("comment", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  text: { type: DataTypes.STRING, allowNull: false },
});

await queryInterface.createTable("type_brand", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

await queryInterface.createTable("furniture", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.INTEGER, allowNull: false },
  rating: { type: DataTypes.INTEGER, allowNull: false },
  img: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  owner_id: { type: DataTypes.INTEGER, allowNull: false },
});

await queryInterface.createTable("order", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  scene_size_x: { type: DataTypes.INTEGER, allowNull: false },
  scene_size_y: { type: DataTypes.INTEGER, allowNull: false },
  furniture_list: { type: DataTypes.JSON, allowNull: false },
});
  },
  down: async (queryInterface, Sequelize) => {
    // Drop all tables in reverse order
    await queryInterface.dropTable('user');
    await queryInterface.dropTable('basket');
    await queryInterface.dropTable('basket_device');
    await queryInterface.dropTable('device');
    await queryInterface.dropTable('type');
    await queryInterface.dropTable('brand');
    await queryInterface.dropTable('rating');
    await queryInterface.dropTable('device_info');
    await queryInterface.dropTable('comment');
    await queryInterface.dropTable('type_brand');
    await queryInterface.dropTable('furniture');
    await queryInterface.dropTable('order');
    // Drop other tables similarly...
  }
};

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Table name differs across environments: could be 'device' (freezeTableName)
    // or Sequelize default plural 'devices'. We support both.
    let tableName = 'device';
    try {
      await queryInterface.describeTable(tableName);
    } catch (_e) {
      tableName = 'devices';
      await queryInterface.describeTable(tableName);
    }

    await queryInterface.addColumn(tableName, 'price', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
  },

  async down(queryInterface, Sequelize) {
    let tableName = 'device';
    try {
      await queryInterface.describeTable(tableName);
    } catch (_e) {
      tableName = 'devices';
      await queryInterface.describeTable(tableName);
    }

    await queryInterface.removeColumn(tableName, 'price');
  },
};


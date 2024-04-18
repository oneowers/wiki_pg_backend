'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('devices', 'device_comments', {
      type: Sequelize.STRING,
      allowNull: true, // Modify to allow null values
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert the column to disallow null values if needed
    await queryInterface.changeColumn('devices', 'device_comments', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  }
};

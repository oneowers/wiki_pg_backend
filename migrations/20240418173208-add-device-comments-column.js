'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('devices', 'device_comments', {
      type: Sequelize.STRING, // Adjust the data type according to your requirements
      allowNull: true, // Modify as needed
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('devices', 'device_comments');
  }
};

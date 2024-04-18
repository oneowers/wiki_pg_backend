'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('devices', 'description', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('devices', 'description', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};

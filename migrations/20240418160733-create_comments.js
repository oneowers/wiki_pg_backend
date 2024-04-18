'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('comments', {
      device_id: { type: Sequelize.INTEGER, allowNull: false },
    });
  }
};

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('devices', 'comments', {
      type: Sequelize.STRING
    });
    await queryInterface.addColumn('devices', 'views', {
      type: Sequelize.INTEGER
    });
    await queryInterface.addColumn('devices', 'owner_id', {
      type: Sequelize.INTEGER
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('devices', 'coments');
    // Add other column changes here
  }
};

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'last_name', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('users', 'first_name', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('users', 'profile_image', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'last_name');
    await queryInterface.removeColumn('users', 'first_name');
    await queryInterface.removeColumn('users', 'profile_image');
  }
};

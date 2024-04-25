'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('users', 'last_name', {
      type: Sequelize.STRING,
      allowNull: true, // Allow null values
    });

    await queryInterface.changeColumn('users', 'first_name', {
      type: Sequelize.STRING,
      allowNull: true, // Allow null values
    });

    await queryInterface.changeColumn('users', 'profile_image', {
      type: Sequelize.STRING,
      allowNull: true, // Allow null values
    });
  },

  down: async (queryInterface, Sequelize) => {
    // If you want to revert the changes, you can revert the columns back to their original state.
    await queryInterface.changeColumn('users', 'last_name', {
      type: Sequelize.STRING,
      allowNull: false, // Change back to not null
    });

    await queryInterface.changeColumn('users', 'first_name', {
      type: Sequelize.STRING,
      allowNull: false, // Change back to not null
    });

    await queryInterface.changeColumn('users', 'profile_image', {
      type: Sequelize.STRING,
      allowNull: false, // Change back to not null
    });
  },
};

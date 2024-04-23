'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('brands', 'cover_image', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('brands', 'street_address', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('brands', 'city', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('brands', 'state', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('brands', 'zip', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn('brands', 'sms_message', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // The down migration should revert the changes made in the up migration
    await queryInterface.addColumn('users', 'cover_image', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('users', 'street_address', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('users', 'city', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('users', 'state', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('users', 'zip', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn('users', 'sms_message', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn('users', 'description', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('brands', 'cover_image', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('brands', 'street_address', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('brands', 'city', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('brands', 'state', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('brands', 'zip', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn('brands', 'sms_message', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.removeColumn('users', 'profile_image');
    await queryInterface.removeColumn('users', 'country');
  },
};

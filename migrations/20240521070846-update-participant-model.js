'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if the 'company' column exists
    const tableInfo = await queryInterface.describeTable('participants');
    if (!tableInfo.company) {
      await queryInterface.addColumn('participants', 'company', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    await queryInterface.changeColumn('participants', 'phone_number', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn('participants', 'email', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Optionally, remove unique constraints if necessary
    await queryInterface.removeConstraint('participants', 'participants_phone_number_key');
    await queryInterface.removeConstraint('participants', 'participants_email_key');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('participants', 'phone_number', {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    });

    await queryInterface.changeColumn('participants', 'email', {
      type: Sequelize.STRING,
      unique: true,
      allowNull: true,
    });

    await queryInterface.removeColumn('participants', 'company');

    // Optionally, add unique constraints back if necessary
    await queryInterface.addConstraint('participants', {
      fields: ['phone_number'],
      type: 'unique',
      name: 'participants_phone_number_key'
    });

    await queryInterface.addConstraint('participants', {
      fields: ['email'],
      type: 'unique',
      name: 'participants_email_key'
    });
  }
};

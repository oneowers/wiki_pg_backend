'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('comments', 'device_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'devices', // Assuming 'devices' is the name of the table referenced by the 'device_id' column
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('comments', 'device_id');
  }
};

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Добавление столбцов user_id и brand_id
    await queryInterface.addColumn('order', 'user_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
    await queryInterface.addColumn('order', 'brand_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Удаление добавленных столбцов
    await queryInterface.removeColumn('order', 'user_id');
    await queryInterface.removeColumn('order', 'brand_id');
  }
};

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('orders', 'userId', 'user_id');
    await queryInterface.renameColumn('orders', 'brandId', 'brand_id');
  },

  down: async (queryInterface, Sequelize) => {
    // Обратные операции, если нужно откатить миграцию
    await queryInterface.renameColumn('orders', 'user_id', 'userId');
    await queryInterface.renameColumn('orders', 'brand_id', 'brandId');
  }
};

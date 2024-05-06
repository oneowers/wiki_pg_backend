'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Orders', 'userId', 'user_id');
    await queryInterface.renameColumn('Orders', 'brandId', 'brand_id');
  },

  down: async (queryInterface, Sequelize) => {
    // Обратные операции, если нужно откатить миграцию
    await queryInterface.renameColumn('Orders', 'user_id', 'userId');
    await queryInterface.renameColumn('Orders', 'brand_id', 'brandId');
  }
};

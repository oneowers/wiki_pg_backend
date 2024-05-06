'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Удалить дубликаты userId и brandId
    await queryInterface.removeColumn('orders', 'userId');
    await queryInterface.removeColumn('orders', 'brandId');
    // Переименовать user_id и brand_id
    await queryInterface.renameColumn('orders', 'user_id', 'userId');
    await queryInterface.renameColumn('orders', 'brand_id', 'brandId');
  },

  down: async (queryInterface, Sequelize) => {
    // Если нужно откатить миграцию, добавьте обратные операции
    await queryInterface.addColumn('orders', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn('orders', 'brandId', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.renameColumn('orders', 'userId', 'user_id');
    await queryInterface.renameColumn('orders', 'brandId', 'brand_id');
  }
};

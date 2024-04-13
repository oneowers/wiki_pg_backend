'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'last_code', {
      type: Sequelize.INTEGER
    });

    await queryInterface.addColumn('users', 'last_code_time', {
      type: Sequelize.DATE
    });

    await queryInterface.addColumn('users', 'code_expiration_time', {
      type: Sequelize.DATE
    });
  },

  down: async (queryInterface, Sequelize) => {
    // В методе down ничего не делаем, чтобы сохранить добавленные столбцы
  }
};

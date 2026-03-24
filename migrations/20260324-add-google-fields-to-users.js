'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('users');

    // Добавляем email если ещё нет
    if (!tableDescription.email) {
      await queryInterface.addColumn('users', 'email', {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true,
      });
    }

    // Добавляем google_id если ещё нет
    if (!tableDescription.google_id) {
      await queryInterface.addColumn('users', 'google_id', {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true,
      });
    }

    // Делаем phone_number необязательным если ещё не так
    await queryInterface.changeColumn('users', 'phone_number', {
      type: Sequelize.STRING,
      unique: true,
      allowNull: true,
    });

    // Делаем password необязательным (для Google-авторизации)
    await queryInterface.changeColumn('users', 'password', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('users');

    if (tableDescription.email) {
      await queryInterface.removeColumn('users', 'email');
    }
    if (tableDescription.google_id) {
      await queryInterface.removeColumn('users', 'google_id');
    }
  }
};

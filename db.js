const { Sequelize } = require('sequelize');

module.exports = new Sequelize(
    process.env.POSTGRES_DATABASE, // Use the database name from the environment variable
    process.env.POSTGRES_USER,     // Use the database user from the environment variable
    process.env.POSTGRES_PASSWORD, // Use the database password from the environment variable
    {
        dialect: 'postgres',
        host: process.env.POSTGRES_HOST, // Use the database host from the environment variable
        port: process.env.DB_PORT,       // Use the database port from the environment variable
        ssl: true, // Ensure SSL is enabled
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false // Avoid rejection of unauthorized connections
            }
        }
    }
);

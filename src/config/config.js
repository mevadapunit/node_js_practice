require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Punit@123',
    database: process.env.DB_NAME || 'node_new',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5002,
    dialect: process.env.SEQUELIZE_DIALECT || 'mysql',
    logging: process.env.SEQUELIZE_LOGGING === 'true'
  },
  test: {
    username: process.env.TEST_DB_USER || 'root',
    password: process.env.TEST_DB_PASSWORD || 'Punit@123',
    database: process.env.TEST_DB_NAME || 'test_database',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5002,
    dialect: process.env.SEQUELIZE_DIALECT || 'mysql',
    logging: process.env.SEQUELIZE_LOGGING === 'true'
  },
  production: {
    username: process.env.PROD_DB_USER || 'root',
    password: process.env.PROD_DB_PASSWORD || 'Punit@123',
    database: process.env.PROD_DB_NAME || 'prod_database',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5002,
    dialect: process.env.SEQUELIZE_DIALECT || 'mysql',
    logging: process.env.SEQUELIZE_LOGGING === 'true'
  }
};

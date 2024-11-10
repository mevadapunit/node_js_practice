const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.NODE_ENV === 'production') {
  // Production environment
  sequelize = new Sequelize(
    process.env.PROD_DB_NAME,
    process.env.PROD_DB_USER,
    process.env.PROD_DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: process.env.SEQUELIZE_DIALECT,
      logging: process.env.SEQUELIZE_LOGGING === 'true',
    }
  );
} else if (process.env.NODE_ENV === 'test') {
  // Test environment
  sequelize = new Sequelize(
    process.env.TEST_DB_NAME,
    process.env.TEST_DB_USER,
    process.env.TEST_DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: process.env.SEQUELIZE_DIALECT,
      logging: process.env.SEQUELIZE_LOGGING === 'true',
    }
  );
} else {
  // Development environment (default)
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: process.env.SEQUELIZE_DIALECT,
      logging: process.env.SEQUELIZE_LOGGING === 'true',
    }
  );
}

module.exports = sequelize;

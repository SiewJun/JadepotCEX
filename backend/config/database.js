const { Sequelize } = require('sequelize');
const config = require('./config.json');

// Initialize Sequelize instance
const sequelize = new Sequelize(config.development);

// Test the database connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection successful');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

// Export Sequelize instance
module.exports = { sequelize, testConnection };

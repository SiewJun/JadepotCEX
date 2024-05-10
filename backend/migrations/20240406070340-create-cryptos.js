'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Cryptos', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      symbol: {
        type: Sequelize.STRING,
        allowNull: false
      },
      currentPrice: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      marketCap: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      totalSupply: {
        type: Sequelize.FLOAT, 
        allowNull: true 
      },
      maxSupply: {
        type: Sequelize.FLOAT, 
        allowNull: true 
      },
      circulatingSupply: {
        type: Sequelize.FLOAT, 
        allowNull: true 
      },
      imageUrl: {
        type: Sequelize.STRING, 
        allowNull: true
      },
      priceChangePercentage: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Cryptos');
  }
};

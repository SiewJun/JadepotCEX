const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Crypto = sequelize.define('Crypto', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  symbol: {
    type: DataTypes.STRING,
    allowNull: false
  },
  currentPrice: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  marketCap: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  totalSupply: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  maxSupply: {
    type: DataTypes.FLOAT, 
    allowNull: true 
  },
  circulatingSupply: {
    type: DataTypes.FLOAT, 
    allowNull: true 
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  priceChangePercentage: {
    type: DataTypes.FLOAT,
    allowNull: true
  }
});

module.exports = Crypto;

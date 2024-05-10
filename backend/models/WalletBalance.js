const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const WalletBalance = sequelize.define('WalletBalance', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  walletId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Wallets',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false
  },
  balance: {
    type: DataTypes.DECIMAL,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'WalletBalances',
  timestamps: false
});

module.exports = WalletBalance;

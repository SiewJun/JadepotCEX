const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); // Import Sequelize instance
const WalletBalance = require('./WalletBalance');

const Wallet = sequelize.define('Wallet', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: {
      model: 'Users',
      key: 'id'
    },
  },
}, {
  tableName: 'Wallets',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

Wallet.hasMany(WalletBalance, { foreignKey: 'walletId', onDelete: 'CASCADE' });
WalletBalance.belongsTo(Wallet, { foreignKey: 'walletId' });

module.exports = Wallet;

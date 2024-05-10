const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const UserProfile = require('./UserProfile');
const Wallet = require('./Wallet');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user'
  }
});

User.hasOne(UserProfile, { foreignKey: 'userId', onDelete: 'CASCADE' });
UserProfile.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Wallet, { foreignKey: 'userId', onDelete: 'CASCADE' });
Wallet.belongsTo(User, { foreignKey: 'userId' });

module.exports = User;

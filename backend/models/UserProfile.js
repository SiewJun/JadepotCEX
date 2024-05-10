const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); // Import Sequelize instance

const UserProfile = sequelize.define('UserProfile', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: {
      model: 'User',
      key: 'id'
    }
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  dob: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  nric: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true
  },
  profilePhotoPath: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = UserProfile;

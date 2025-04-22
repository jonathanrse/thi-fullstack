const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { v4: uuidv4 } = require('uuid')

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: uuidv4,
    primaryKey: true,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  prenom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ville: {
    type: DataTypes.STRING,
    allowNull: false
  },
  numero: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('candidate', 'admin'),
    defaultValue: 'candidate'
  },
  cv1Path: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "Chemin vers le premier CV"
  },
  cv1Name: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "Nom du premier CV"
  },
  cv2Path: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "Chemin vers le deuxième CV"
  },
  cv2Name: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "Nom du deuxième CV"
  },
  cv3Path: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "Chemin vers le troisième CV"
  },
  cv3Name: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "Nom du troisième CV"
  }
}, {
  timestamps: true
});

module.exports = User;

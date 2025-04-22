// models/Category.js

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true // Pour éviter les doublons de noms de catégories
  }
}, {
  timestamps: true
});

module.exports = Category;

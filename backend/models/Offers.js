// models/Offers.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Category = require('./Category');

const Offers = sequelize.define('Offers', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  salary: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ville: {
    type: DataTypes.STRING,
    allowNull: false
  },
  typeContrat: {
    type: DataTypes.ENUM('interim', 'CDI', 'CDD'),
    defaultValue: 'interim'
  },
  dateDebut: {
    type: DataTypes.DATE,
    allowNull: false
  },
  duration: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true
});

// Modification de l'alias pour éviter les conflits
Offers.belongsToMany(Category, { through: 'OfferCategory', as: 'offerCategories' });
Category.belongsToMany(Offers, { through: 'OfferCategory', as: 'categoryOffers' });

module.exports = Offers;

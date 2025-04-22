const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

// Importation des modèles
const User = require('./User');
const Offers = require('./Offers');
const Category = require('./Category');
const Candidatures = require('./Candidatures');

// Définir les associations entre Offers et Category
Offers.belongsToMany(Category, { through: 'OfferCategory', as: 'categories' });
Category.belongsToMany(Offers, { through: 'OfferCategory', as: 'offers' });

// Les associations pour Candidatures sont déjà définies dans le fichier Candidatures.js
// User.hasMany(Candidatures, { foreignKey: 'userId', as: 'applications' });
// Offers.hasMany(Candidatures, { foreignKey: 'offerId', as: 'applications' });
// Candidatures.belongsTo(User, { foreignKey: 'userId', as: 'candidate' });
// Candidatures.belongsTo(Offers, { foreignKey: 'offerId', as: 'offer' });

// Synchronisation des modèles avec la base de données
sequelize.sync({ force: false })  // `force: false` évite de supprimer les données existantes.
  .then(() => {
    console.log('Tables et associations synchronisées');
  })
  .catch((err) => {
    console.error('Erreur lors de la synchronisation', err);
  });

// Exportation des modèles et sequelize
module.exports = {
  User,
  Offers,
  Category,
  Candidatures,
  sequelize
};

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
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
  }
}, {
  timestamps: true
});

// Synchronisation du modèle avec la base de données
User.sync({ force: false })  // Met à jour la table sans la supprimer, idéal en développement
  .then(() => {
    console.log('Le modèle User est synchronisé avec la base de données');
  })
  .catch((err) => {
    console.error('Erreur lors de la synchronisation du modèle User:', err);
  });

module.exports = User;

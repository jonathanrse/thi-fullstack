const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Offers = require('./Offers');

const Candidatures = sequelize.define('Candidatures', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  selectedCvId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: "ID du CV sélectionné (1, 2 ou 3)"
  },
  motivationLetter: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: "Lettre de motivation facultative"
  },
  status: {
    type: DataTypes.ENUM('pending', 'reviewing', 'accepted', 'rejected'),
    defaultValue: 'pending',
    comment: "Statut de la candidature"
  },
  applicationDate: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    comment: "Date de candidature"
  },
  reviewDate: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: "Date de traitement par l'admin"
  },
  adminComment: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: "Commentaire interne de l'administrateur (non visible par le candidat)"
  },
  feedback: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: "Retour donné au candidat"
  }
}, {
  timestamps: true
});

// Définition des associations
Candidatures.belongsTo(User, { foreignKey: 'userId', as: 'candidate' });
Candidatures.belongsTo(Offers, { foreignKey: 'offerId', as: 'offer' });

// Relation inverse
User.hasMany(Candidatures, { foreignKey: 'userId', as: 'applications' });
Offers.hasMany(Candidatures, { foreignKey: 'offerId', as: 'applications' });

module.exports = Candidatures;

const { Sequelize } = require('sequelize');
const migration = require('../migrations/add-cv-columns');
const sequelize = require('../config/database');

async function runMigration() {
  console.log('Début de la migration...');
  
  try {
    // Exécuter la migration
    await migration.up(sequelize.getQueryInterface(), Sequelize);
    console.log('Migration terminée avec succès !');
  } catch (error) {
    console.error('Erreur lors de la migration:', error);
  } finally {
    // Fermer la connexion à la base de données
    await sequelize.close();
  }
}

// Exécuter la migration
runMigration(); 
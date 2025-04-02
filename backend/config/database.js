const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('thi', 'postgres', '', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432,
  logging: false //Ajouter les logs dans la console
});

// Tester la connexion
sequelize.authenticate()
  .then(() => {
    console.log('Connexion à la base de données réussie');
  })
  .catch((err) => {
    console.error('Erreur de connexion à la base de données:', err);
  });

module.exports = sequelize;

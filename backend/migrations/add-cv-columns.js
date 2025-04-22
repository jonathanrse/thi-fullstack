'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('Users', 'cv1Path', {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "Chemin vers le premier CV"
      });
      
      await queryInterface.addColumn('Users', 'cv1Name', {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "Nom du premier CV"
      });
      
      await queryInterface.addColumn('Users', 'cv2Path', {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "Chemin vers le deuxième CV"
      });
      
      await queryInterface.addColumn('Users', 'cv2Name', {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "Nom du deuxième CV"
      });
      
      await queryInterface.addColumn('Users', 'cv3Path', {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "Chemin vers le troisième CV"
      });
      
      await queryInterface.addColumn('Users', 'cv3Name', {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "Nom du troisième CV"
      });
      
      console.log('Colonnes CV ajoutées avec succès à la table Users');
      return Promise.resolve();
    } catch (error) {
      console.error('Erreur lors de l\'ajout des colonnes CV:', error);
      return Promise.reject(error);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeColumn('Users', 'cv1Path');
      await queryInterface.removeColumn('Users', 'cv1Name');
      await queryInterface.removeColumn('Users', 'cv2Path');
      await queryInterface.removeColumn('Users', 'cv2Name');
      await queryInterface.removeColumn('Users', 'cv3Path');
      await queryInterface.removeColumn('Users', 'cv3Name');
      
      console.log('Colonnes CV supprimées avec succès de la table Users');
      return Promise.resolve();
    } catch (error) {
      console.error('Erreur lors de la suppression des colonnes CV:', error);
      return Promise.reject(error);
    }
  }
}; 
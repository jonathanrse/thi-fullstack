const Category = require('../../models/Category');

exports.listCategories = async (req, res) => {
  try {
    // Récupérer toutes les catégories
    const categories = await Category.findAll();

    // Vérifier si des catégories existent
    if (categories.length === 0) {
      return res.status(404).json({ message: 'Aucune catégorie disponible' });
    }

    // Retourner la liste des catégories
    res.status(200).json({ categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des catégories' });
  }
};

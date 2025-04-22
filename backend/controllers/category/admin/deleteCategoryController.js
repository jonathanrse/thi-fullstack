const Category = require('../../../models/Category');

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }

    await category.destroy();
    res.status(200).json({ message: 'Catégorie supprimée avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la suppression de la catégorie' });
  }
};

// controllers/category/createCategoryController.js
const Category = require('../../../models/Category');

exports.createCategory = async (req, res) => {
  const { name } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ message: 'Le nom de la catégorie est requis' });
    }

    const existingCategory = await Category.findOne({ where: { name } });
    if (existingCategory) {
      return res.status(400).json({ message: 'Cette catégorie existe déjà' });
    }

    const newCategory = await Category.create({ name });
    res.status(201).json({ message: 'Catégorie créée avec succès', category: newCategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la création de la catégorie' });
  }
};

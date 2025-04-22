const Offers = require('../../models/Offers');
const Category = require('../../models/Category');

exports.listOffers = async (req, res) => {
  try {
    // Récupérer toutes les offres d'emploi avec leurs catégories
    const offers = await Offers.findAll({
      include: {
        model: Category,
        as: 'offerCategories',
        through: { attributes: [] } // Ne pas inclure les attributs de la table de jointure
      },
      order: [['createdAt', 'DESC']] // Trier par date de création (plus récentes d'abord)
    });

    // Vérifier si des offres sont trouvées
    if (offers.length === 0) {
      return res.status(404).json({ message: 'Aucune offre d\'emploi disponible' });
    }

    // Retourner la liste des offres d'emploi
    res.status(200).json({ offers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des offres d\'emploi' });
  }
};

const Offers = require('../../../models/Offers');
const Category = require('../../../models/Category');

exports.listOffersAdmin = async (req, res) => {
  try {
    // Récupérer l'agence de l'admin depuis le middleware
    const agence = req.agence;

    if (!agence) {
      return res.status(400).json({ message: 'Aucune agence associée à cet administrateur' });
    }

    // Récupérer toutes les offres d'emploi de l'agence de l'admin
    const offers = await Offers.findAll({
      where: {
        agence: agence
      },
      include: {
        model: Category,
        as: 'offerCategories',
        through: { attributes: [] } // Ne pas inclure les attributs de la table de jointure
      },
      order: [['createdAt', 'DESC']] // Trier par date de création (plus récentes d'abord)
    });

    // Retourner la liste des offres d'emploi
    res.status(200).json({ offers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des offres d\'emploi' });
  }
}; 
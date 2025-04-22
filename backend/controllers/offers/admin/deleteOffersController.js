const Offers = require('../../../models/Offers');

exports.deleteOffer = async (req, res) => {
  const { id } = req.params;

  try {
    const offer = await Offers.findByPk(id);

    if (!offer) {
      return res.status(404).json({ message: 'Offre non trouvée' });
    }

    await offer.destroy();

    res.status(200).json({ message: 'Offre supprimée avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'offre' });
  }
};

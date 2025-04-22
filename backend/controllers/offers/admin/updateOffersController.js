const Offers = require('../../../models/Offers');
const Category = require('../../../models/Category');

exports.updateOffer = async (req, res) => {
  const { id } = req.params;
  const { title, description, salary, ville, typeContrat, dateDebut, duration, categoryIds } = req.body;

  try {
    // Trouver l'offre
    const offer = await Offers.findByPk(id);

    if (!offer) {
      return res.status(404).json({ message: "Offre d'emploi non trouvée" });
    }

    // Mettre à jour les champs s'ils sont fournis
    if (title) offer.title = title;
    if (description) offer.description = description;
    if (salary) offer.salary = salary;
    if (ville) offer.ville = ville;
    if (typeContrat) offer.typeContrat = typeContrat;
    if (dateDebut) offer.dateDebut = dateDebut;
    if (duration !== undefined) offer.duration = duration;

    await offer.save();

    // Gérer les catégories si elles sont fournies
    if (categoryIds && Array.isArray(categoryIds)) {
      // Récupérer les instances de catégories
      const categories = await Category.findAll({
        where: {
          id: categoryIds
        }
      });

      // Mettre à jour les associations
      await offer.setOfferCategories(categories);
    }

    // Récupérer l'offre mise à jour avec ses catégories
    const updatedOffer = await Offers.findByPk(id, {
      include: {
        model: Category,
        as: 'offerCategories'
      }
    });

    res.status(200).json({ 
      message: "Offre mise à jour avec succès", 
      offer: updatedOffer 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la mise à jour de l'offre" });
  }
};

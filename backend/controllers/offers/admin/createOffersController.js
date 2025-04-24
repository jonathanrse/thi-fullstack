// controllers/offers/createOfferController.js
const Offers = require('../../../models/Offers');
const Category = require('../../../models/Category');

exports.createOffer = async (req, res) => {
  const { title, description, salary, ville, typeContrat, dateDebut, duration, categoryIds } = req.body;

  try {
    if (!title || !description || !salary || !ville || !dateDebut) {
      return res.status(400).json({ message: 'Champs obligatoires manquants' });
    }

    // Récupération de l'agence depuis le middleware
    const agence = req.agence;
    
    if (!agence) {
      return res.status(400).json({ message: 'Aucune agence associée à cet administrateur' });
    }

    // Créer l'offre avec l'agence de l'admin connecté
    const nouvelleOffre = await Offers.create({
      title,
      description,
      salary,
      ville,
      typeContrat,
      dateDebut,
      duration,
      agence // Ajout de l'agence
    });

    // Associer les catégories à l'offre
    if (categoryIds && Array.isArray(categoryIds)) {
      const categoryInstances = await Category.findAll({
        where: {
          id: categoryIds  // Recherche les catégories par ID
        }
      });

      // Vérifie si toutes les catégories existent
      if (categoryInstances.length !== categoryIds.length) {
        return res.status(400).json({ message: 'Certaines catégories n\'existent pas' });
      }

      // Ajouter les catégories à l'offre
      await nouvelleOffre.setOfferCategories(categoryInstances);
    }

    // Inclure les catégories dans la réponse en utilisant le nouvel alias
    const offerWithCategories = await nouvelleOffre.reload({
      include: {
        model: Category,
        as: 'offerCategories',  // Utilisation de l'alias modifié
      },
    });

    res.status(201).json({
      message: 'Offre créée avec succès',
      offre: offerWithCategories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la création de l\'offre' });
  }
};

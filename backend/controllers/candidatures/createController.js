const { Candidatures, Offers, User } = require('../../models');

/**
 * Créer une nouvelle candidature en utilisant un CV du profil utilisateur
 */
exports.createCandidature = async (req, res) => {
  try {
    const { offerId, motivationLetter, selectedCvId } = req.body;
    const userId = req.user.id; // L'ID de l'utilisateur est récupéré du token JWT

    // Vérifier si l'offre existe
    const offer = await Offers.findByPk(offerId);
    if (!offer) {
      return res.status(404).json({ message: "L'offre n'a pas été trouvée" });
    }

    // Vérifier si l'utilisateur a déjà postulé à cette offre
    const existingCandidature = await Candidatures.findOne({
      where: {
        userId,
        offerId
      }
    });

    if (existingCandidature) {
      return res.status(400).json({ message: "Vous avez déjà postulé à cette offre" });
    }

    // Récupérer l'utilisateur pour vérifier si le CV sélectionné existe
    const user = await User.findByPk(userId);
    
    // Vérifier si le CV sélectionné existe bien dans le profil de l'utilisateur
    let cvExists = true; // Default to true if CV is optional

    if (selectedCvId !== null) {
      switch(parseInt(selectedCvId)) {
        case 1:
          cvExists = !!user.cv1Path;
          break;
        case 2:
          cvExists = !!user.cv2Path;
          break;
        case 3:
          cvExists = !!user.cv3Path;
          break;
        default:
          return res.status(400).json({ message: "L'ID du CV sélectionné est invalide. Veuillez choisir 1, 2 ou 3." });
      }

      if (!cvExists) {
        return res.status(400).json({ message: `Vous n'avez pas de CV #${selectedCvId} enregistré dans votre profil.` });
      }
    }

    // Créer la candidature
    const candidature = await Candidatures.create({
      userId,
      offerId,
      selectedCvId: selectedCvId !== null ? parseInt(selectedCvId) : null,
      motivationLetter,
      status: 'pending',
      applicationDate: new Date()
    });

    // Renvoyer la candidature créée avec les informations de l'offre
    return res.status(201).json({
      message: "Candidature envoyée avec succès",
      candidature: {
        id: candidature.id,
        status: candidature.status,
        applicationDate: candidature.applicationDate,
        selectedCvId: candidature.selectedCvId,
        offer: {
          id: offer.id,
          title: offer.title
        }
      }
    });

  } catch (error) {
    console.error("Erreur lors de la création de la candidature:", error);
    return res.status(500).json({ message: "Erreur lors de la création de la candidature" });
  }
}; 
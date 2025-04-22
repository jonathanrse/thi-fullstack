const { Candidatures, Offers } = require('../../models');

/**
 * Récupérer toutes les candidatures de l'utilisateur connecté
 */
exports.getUserCandidatures = async (req, res) => {
  try {
    const userId = req.user.id; // L'ID de l'utilisateur est récupéré du token JWT

    // Récupérer toutes les candidatures de l'utilisateur avec les informations de l'offre
    const candidatures = await Candidatures.findAll({
      where: { userId },
      include: [
        {
          model: Offers,
          as: 'offer',
          attributes: ['id', 'title', 'description', 'salary', 'ville', 'typeContrat', 'dateDebut', 'duration']
        }
      ],
      order: [['applicationDate', 'DESC']] // Les plus récentes d'abord
    });

    return res.status(200).json({
      message: "Candidatures récupérées avec succès",
      candidatures
    });

  } catch (error) {
    console.error("Erreur lors de la récupération des candidatures:", error);
    return res.status(500).json({ message: "Erreur lors de la récupération des candidatures" });
  }
};

/**
 * Récupérer les détails d'une candidature spécifique de l'utilisateur
 */
exports.getUserCandidatureDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Récupérer la candidature avec les détails de l'offre
    const candidature = await Candidatures.findOne({
      where: { 
        id,
        userId // Assurez-vous que la candidature appartient bien à cet utilisateur
      },
      include: [
        {
          model: Offers,
          as: 'offer',
          attributes: ['id', 'title', 'description', 'salary', 'ville', 'typeContrat', 'dateDebut', 'duration']
        }
      ]
    });

    if (!candidature) {
      return res.status(404).json({ message: "Candidature non trouvée ou vous n'avez pas les droits pour y accéder" });
    }

    return res.status(200).json({
      message: "Détails de la candidature récupérés avec succès",
      candidature
    });

  } catch (error) {
    console.error("Erreur lors de la récupération des détails de la candidature:", error);
    return res.status(500).json({ message: "Erreur lors de la récupération des détails de la candidature" });
  }
}; 
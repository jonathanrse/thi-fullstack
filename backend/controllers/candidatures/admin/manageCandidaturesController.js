const { Candidatures, User, Offers } = require('../../../models');

/**
 * Récupérer toutes les candidatures (admin) - filtrées par agence
 */
exports.getAllCandidatures = async (req, res) => {
  try {
    // Récupérer l'agence de l'admin connecté depuis le middleware
    const agence = req.agence;

    if (!agence) {
      return res.status(400).json({ message: 'Aucune agence associée à cet administrateur' });
    }

    // Récupérer toutes les candidatures pour les offres de cette agence
    const candidatures = await Candidatures.findAll({
      include: [
        {
          model: User,
          as: 'candidate',
          attributes: ['id', 'nom', 'prenom', 'email', 'ville', 'numero']
        },
        {
          model: Offers,
          as: 'offer',
          attributes: ['id', 'title', 'description', 'salary', 'ville', 'typeContrat', 'dateDebut', 'duration', 'agence'],
          where: { agence: agence } // Filtrer par agence ici
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
 * Récupérer les détails d'une candidature spécifique (admin)
 */
exports.getCandidatureDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const agence = req.agence;

    // Récupérer la candidature avec les informations détaillées
    const candidature = await Candidatures.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: 'candidate',
          attributes: ['id', 'nom', 'prenom', 'email', 'ville', 'numero', 'cv1Path', 'cv2Path', 'cv3Path', 'cv1Name', 'cv2Name', 'cv3Name']
        },
        {
          model: Offers,
          as: 'offer',
          attributes: ['id', 'title', 'description', 'salary', 'ville', 'typeContrat', 'dateDebut', 'duration', 'agence'],
          where: { agence: agence } // Filtrer par agence ici
        }
      ]
    });

    if (!candidature) {
      return res.status(404).json({ message: "Candidature non trouvée ou non autorisée pour cette agence" });
    }

    // Détecter le chemin du CV utilisé
    let cvPath = null;
    let cvName = null;
    
    switch(candidature.selectedCvId) {
      case 1:
        cvPath = candidature.candidate.cv1Path;
        cvName = candidature.candidate.cv1Name;
        break;
      case 2:
        cvPath = candidature.candidate.cv2Path;
        cvName = candidature.candidate.cv2Name;
        break;
      case 3:
        cvPath = candidature.candidate.cv3Path;
        cvName = candidature.candidate.cv3Name;
        break;
    }

    // Ajouter l'information du CV à la réponse
    const candidatureResponse = candidature.toJSON();
    candidatureResponse.cvInfo = {
      path: cvPath,
      name: cvName
    };

    // Supprimer les chemins des CV dans la réponse (seulement garder celui qui est utilisé)
    delete candidatureResponse.candidate.cv1Path;
    delete candidatureResponse.candidate.cv2Path;
    delete candidatureResponse.candidate.cv3Path;
    delete candidatureResponse.candidate.cv1Name;
    delete candidatureResponse.candidate.cv2Name;
    delete candidatureResponse.candidate.cv3Name;

    return res.status(200).json({
      message: "Détails de la candidature récupérés avec succès",
      candidature: candidatureResponse
    });

  } catch (error) {
    console.error("Erreur lors de la récupération des détails de la candidature:", error);
    return res.status(500).json({ message: "Erreur lors de la récupération des détails de la candidature" });
  }
};

/**
 * Mettre à jour le statut d'une candidature (admin)
 */
exports.updateCandidatureStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminComment, feedback } = req.body;
    const agence = req.agence;

    // Vérifier si la candidature existe et appartient à l'agence de l'admin
    const candidature = await Candidatures.findOne({
      where: { id },
      include: [
        {
          model: Offers,
          as: 'offer',
          where: { agence: agence }
        }
      ]
    });

    if (!candidature) {
      return res.status(404).json({ message: "Candidature non trouvée ou non autorisée pour cette agence" });
    }

    // Valider le statut
    if (status && !['pending', 'reviewing', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: "Statut invalide" });
    }

    // Mettre à jour la candidature
    if (status) candidature.status = status;
    if (adminComment !== undefined) candidature.adminComment = adminComment;
    if (feedback !== undefined) candidature.feedback = feedback;
    
    // Si le statut change, mettre à jour la date de révision
    if (status && status !== candidature.status) {
      candidature.reviewDate = new Date();
    }

    await candidature.save();

    return res.status(200).json({
      message: "Candidature mise à jour avec succès",
      candidature
    });

  } catch (error) {
    console.error("Erreur lors de la mise à jour de la candidature:", error);
    return res.status(500).json({ message: "Erreur lors de la mise à jour de la candidature" });
  }
}; 
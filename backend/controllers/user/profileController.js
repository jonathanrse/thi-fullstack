const User = require('../../models/User');

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // L'ID de l'utilisateur est récupéré du token JWT

    // Trouver l'utilisateur par son ID
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Préparer la réponse avec les informations de profil et CV
    const userProfile = {
      id: user.id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      ville: user.ville,
      numero: user.numero,
      role: user.role,
      cvs: [],
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    // Ajouter les CV disponibles
    if (user.cv1Path && user.cv1Name) {
      userProfile.cvs.push({
        id: 1,
        name: user.cv1Name,
        path: user.cv1Path
      });
    }
    
    if (user.cv2Path && user.cv2Name) {
      userProfile.cvs.push({
        id: 2,
        name: user.cv2Name,
        path: user.cv2Path
      });
    }
    
    if (user.cv3Path && user.cv3Name) {
      userProfile.cvs.push({
        id: 3,
        name: user.cv3Name,
        path: user.cv3Path
      });
    }

    return res.status(200).json({
      message: "Profil récupéré avec succès",
      user: userProfile
    });

  } catch (error) {
    console.error("Erreur lors de la récupération du profil:", error);
    return res.status(500).json({ message: "Erreur lors de la récupération du profil" });
  }
}; 
const User = require('../../../models/User'); // Assurez-vous du bon chemin

// Fonction pour lister tous les utilisateurs
exports.listUsers = async (req, res) => {
  try {
    // Récupérer tous les utilisateurs
    const users = await User.findAll(); // Ou `User.findAll()` selon ton ORM
    
    // Renvoyer les utilisateurs dans un objet avec une propriété users
    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs" });
  }
};

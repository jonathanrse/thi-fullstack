const User = require('../../models/User'); 

exports.deleteUser = async (req, res) => {
  const { id } = req.params; // Récupère l'ID de l'URL

  try {
    // Vérifier que l'ID du JWT correspond bien à l'ID demandé
    if (req.user.id !== id) {
      return res.status(403).json({ message: "Vous ne pouvez supprimer que votre propre compte." });
    }

    // Trouver l'utilisateur par son ID
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Supprimer l'utilisateur
    await user.destroy();

    res.status(200).json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur" });
  }
};

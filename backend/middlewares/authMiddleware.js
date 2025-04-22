const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

const isAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Récupérer le token

  if (!token) {
    return res.status(401).json({ message: "Accès refusé : Token manquant" });
  }

  try {
    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Trouver l'utilisateur dans la BDD
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    req.user = user; // Ajoute l'utilisateur à la requête pour l'utiliser plus tard
    next(); // Passe au contrôleur
  } catch (error) {
    return res.status(401).json({ message: "Token invalide ou expiré" });
  }
};

module.exports = { isAuth };

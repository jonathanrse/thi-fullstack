const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware pour vérifier si l'utilisateur est authentifié et est un admin
const isAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Accès non autorisé, token manquant' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Récupérer l'utilisateur complet depuis la base de données
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    // Vérifier si l'utilisateur est un admin
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès interdit : réservée aux administrateurs' });
    }
    
    // Stocker l'utilisateur complet dans la requête
    req.user = user;

    next(); // L'utilisateur est admin, continue vers le contrôleur
  } catch (error) {
    console.error('Erreur de vérification du token:', error);
    return res.status(401).json({ message: 'Token invalide' });
  }
};

module.exports = { isAdmin };

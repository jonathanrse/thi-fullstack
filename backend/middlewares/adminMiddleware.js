const jwt = require('jsonwebtoken');

// Middleware pour vérifier si l'utilisateur est authentifié et est un admin
const isAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Accès non autorisé, token manquant' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Vérifie le token
    req.user = decoded; // Ajoute les informations de l'utilisateur au `req
    
    // Vérifie si l'utilisateur est un admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès interdit : réservée aux administrateurs' });
    }

    next(); // L'utilisateur est admin, continue vers le contrôleur
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide' });
  }
};

module.exports = { isAdmin };

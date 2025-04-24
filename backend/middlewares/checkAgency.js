/**
 * Middleware pour vérifier l'accès par agence
 * Ce middleware doit être utilisé après le middleware d'authentification
 */
const checkAgency = (req, res, next) => {
  console.log('checkAgency middleware - user:', req.user);
  
  // Vérifier si l'utilisateur est connecté et est un admin
  if (!req.user || req.user.role !== 'admin') {
    console.log('Erreur: utilisateur non admin ou non connecté');
    return res.status(403).json({
      success: false,
      message: "Accès non autorisé. Vous devez être administrateur."
    });
  }

  // Vérifier si l'administrateur a une agence assignée
  if (!req.user.agence) {
    console.log('Erreur: pas d\'agence assignée, user:', req.user);
    return res.status(403).json({
      success: false,
      message: "Aucune agence assignée à votre compte. Contactez l'administrateur principal."
    });
  }

  // Stocker l'agence dans la requête pour y accéder facilement dans les contrôleurs
  req.agence = req.user.agence;
  console.log('Agence assignée:', req.agence);

  // Continuer vers le prochain middleware ou le contrôleur
  next();
};

module.exports = checkAgency; 
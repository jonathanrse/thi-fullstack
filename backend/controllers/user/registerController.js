const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');  // Importer le modèle User

// Fonction d'inscription avec validation
exports.register = [
  // Validation des données
  body('email').isEmail().withMessage('Veuillez fournir un email valide'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Le mot de passe doit avoir au moins 8 caractères')
    .matches(/\d/)
    .withMessage('Le mot de passe doit contenir au moins un chiffre')
    .matches(/[A-Z]/)
    .withMessage('Le mot de passe doit contenir au moins une lettre majuscule')
    .matches(/[a-z]/)
    .withMessage('Le mot de passe doit contenir au moins une lettre minuscule')
    .matches(/[@$!%*?&.]/)
    .withMessage('Le mot de passe doit contenir un caractère spécial'),
  body('nom').notEmpty().withMessage('Le nom est requis'),
  body('prenom').notEmpty().withMessage('Le prénom est requis'),
  body('ville').notEmpty().withMessage('La ville est requise'),
  body('numero').notEmpty().withMessage('Le numéro est requis'),


  // Vérification des erreurs
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Extraire les données de la requête
    const { nom, prenom, ville, numero, email, password } = req.body;

    try {
      // Vérifier si l'utilisateur existe déjà (par email)
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé' });
      }

      // Hacher le mot de passe avant de l'enregistrer
      const hashedPassword = await bcrypt.hash(password, 10);

      // Créer un nouvel utilisateur dans la base de données avec le mot de passe haché
      const newUser = await User.create({
        nom,
        prenom,
        ville,
        numero,
        email,
        password: hashedPassword,  // Utilisation du mot de passe haché
      });

      // Renvoyer une réponse avec les données de l'utilisateur créé
      return res.status(201).json({
        message: 'Utilisateur créé avec succès',
        user: {
          id: newUser.id,
          nom: newUser.nom,
          prenom: newUser.prenom,
          email: newUser.email,
          role: newUser.role,
        },
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erreur lors de l\'inscription' });
    }
  },
];

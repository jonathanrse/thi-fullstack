const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuration de Multer pour le stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/cvs';
    // Créer le répertoire s'il n'existe pas
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Générer un nom de fichier unique avec timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'cv-' + uniqueSuffix + ext);
  }
});

// Filtre pour accepter uniquement les fichiers PDF
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Seuls les fichiers PDF sont acceptés'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Limite de 5MB
}).fields([
  { name: 'cv1', maxCount: 1 },
  { name: 'cv2', maxCount: 1 },
  { name: 'cv3', maxCount: 1 }
]);

exports.updateUser = async (req, res) => {
  // Utilisation de multer pour gérer l'upload
  upload(req, res, async (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        // Erreur Multer
        return res.status(400).json({ message: `Erreur d'upload: ${err.message}` });
      } else {
        // Autre erreur
        return res.status(400).json({ message: err.message });
      }
    }

    const { id } = req.params; // Récupère l'ID depuis l'URL
    const { email, ville, numero, password, cv1Name, cv2Name, cv3Name } = req.body; // Champs à mettre à jour

    try {
      // Vérifier que l'ID du JWT correspond bien à l'ID demandé
      if (req.user.id !== id) {
        // Supprimer les fichiers uploadés si l'accès est refusé
        if (req.files) {
          Object.values(req.files).forEach(fileArray => {
            fileArray.forEach(file => {
              fs.unlinkSync(file.path);
            });
          });
        }
        return res.status(403).json({ message: "Vous ne pouvez modifier que votre propre compte." });
      }

      // Trouver l'utilisateur par son ID
      const user = await User.findByPk(id);
      if (!user) {
        // Supprimer les fichiers uploadés si l'utilisateur n'existe pas
        if (req.files) {
          Object.values(req.files).forEach(fileArray => {
            fileArray.forEach(file => {
              fs.unlinkSync(file.path);
            });
          });
        }
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      // Vérification si l'email est unique
      if (email && email !== user.email) {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
          return res.status(400).json({ message: "Cet email est déjà utilisé par un autre utilisateur." });
        }
        user.email = email;
      }

      // Mise à jour des autres champs
      if (ville) user.ville = ville;
      if (numero) user.numero = numero;
      
      if (password) {
        // Assurer que le mot de passe est bien renseigné et différent de l'ancien
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          return res.status(400).json({ message: "Le nouveau mot de passe doit être différent de l'ancien." });
        }
        user.password = await bcrypt.hash(password, 10);
      }

      // Gestion des CV uploadés
      if (req.files) {
        // CV 1
        if (req.files.cv1 && req.files.cv1[0]) {
          // Supprimer l'ancien CV1 s'il existe
          if (user.cv1Path && fs.existsSync(user.cv1Path)) {
            fs.unlinkSync(user.cv1Path);
          }
          user.cv1Path = req.files.cv1[0].path;
          user.cv1Name = cv1Name || req.files.cv1[0].originalname;
        }

        // CV 2
        if (req.files.cv2 && req.files.cv2[0]) {
          // Supprimer l'ancien CV2 s'il existe
          if (user.cv2Path && fs.existsSync(user.cv2Path)) {
            fs.unlinkSync(user.cv2Path);
          }
          user.cv2Path = req.files.cv2[0].path;
          user.cv2Name = cv2Name || req.files.cv2[0].originalname;
        }

        // CV 3
        if (req.files.cv3 && req.files.cv3[0]) {
          // Supprimer l'ancien CV3 s'il existe
          if (user.cv3Path && fs.existsSync(user.cv3Path)) {
            fs.unlinkSync(user.cv3Path);
          }
          user.cv3Path = req.files.cv3[0].path;
          user.cv3Name = cv3Name || req.files.cv3[0].originalname;
        }
      }

      // Sauvegarde de l'utilisateur mis à jour
      await user.save();

      // Préparer la réponse sans exposer le mot de passe
      const userResponse = {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        ville: user.ville,
        numero: user.numero,
        role: user.role,
        cv1Name: user.cv1Name,
        cv2Name: user.cv2Name,
        cv3Name: user.cv3Name,
        updatedAt: user.updatedAt
      };

      res.status(200).json({ 
        message: "Utilisateur mis à jour avec succès", 
        user: userResponse 
      });
    } catch (error) {
      console.error(error);
      // Supprimer les fichiers uploadés en cas d'erreur
      if (req.files) {
        Object.values(req.files).forEach(fileArray => {
          fileArray.forEach(file => {
            fs.unlinkSync(file.path);
          });
        });
      }
      res.status(500).json({ message: "Erreur lors de la mise à jour de l'utilisateur" });
    }
  });
};

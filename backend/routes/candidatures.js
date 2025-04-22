const express = require('express');
const router = express.Router();

// Contrôleurs
const createController = require('../controllers/candidatures/createController');
const getUserCandidaturesController = require('../controllers/candidatures/getUserCandidaturesController');
const adminCandidaturesController = require('../controllers/candidatures/admin/manageCandidaturesController');

// Middlewares
const { isAuth } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/adminMiddleware');

// Routes pour les candidats
router.post('/create', isAuth, createController.createCandidature);
router.get('/my-applications', isAuth, getUserCandidaturesController.getUserCandidatures);
router.get('/my-applications/:id', isAuth, getUserCandidaturesController.getUserCandidatureDetails);

// Routes pour les admins
router.get('/admin/all', isAdmin, adminCandidaturesController.getAllCandidatures);
router.get('/admin/:id', isAdmin, adminCandidaturesController.getCandidatureDetails);
router.put('/admin/:id', isAdmin, adminCandidaturesController.updateCandidatureStatus);

module.exports = router; 
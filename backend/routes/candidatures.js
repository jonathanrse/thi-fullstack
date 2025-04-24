const express = require('express');
const router = express.Router();

// Contrôleurs
const createController = require('../controllers/candidatures/createController');
const getUserCandidaturesController = require('../controllers/candidatures/getUserCandidaturesController');
const adminCandidaturesController = require('../controllers/candidatures/admin/manageCandidaturesController');

// Middlewares
const { isAuth } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/adminMiddleware');
const checkAgency = require('../middlewares/checkAgency');

// Routes pour les candidats
router.post('/create', isAuth, createController.createCandidature);
router.get('/my-applications', isAuth, getUserCandidaturesController.getUserCandidatures);
router.get('/my-applications/:id', isAuth, getUserCandidaturesController.getUserCandidatureDetails);

// Routes pour les admins - protégées par agence
router.get('/admin/all', isAdmin, checkAgency, adminCandidaturesController.getAllCandidatures);
router.get('/admin/:id', isAdmin, checkAgency, adminCandidaturesController.getCandidatureDetails);
router.put('/admin/:id', isAdmin, checkAgency, adminCandidaturesController.updateCandidatureStatus);

module.exports = router; 
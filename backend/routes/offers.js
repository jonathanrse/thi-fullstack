const express = require('express');
const router = express.Router();
const { listOffers } = require('../controllers/offers/listOffersController');
const { createOffer } = require('../controllers/offers/admin/createOffersController');
const { updateOffer } = require('../controllers/offers/admin/updateOffersController');
const { deleteOffer } = require('../controllers/offers/admin/deleteOffersController');
const { listOffersAdmin } = require('../controllers/offers/admin/listOffersAdminController');
const { isAdmin } = require('../middlewares/adminMiddleware');
const checkAgency = require('../middlewares/checkAgency');

// Route publique - accessible à tous
router.get('/list', listOffers);

// Routes protégées par agence - accessible seulement aux admins de l'agence correspondante
router.get('/admin/list', isAdmin, checkAgency, listOffersAdmin);
router.post('/create', isAdmin, checkAgency, createOffer);
router.put('/update/:id', isAdmin, checkAgency, updateOffer);
router.delete('/delete/:id', isAdmin, checkAgency, deleteOffer);

module.exports = router;

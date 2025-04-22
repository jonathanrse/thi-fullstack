const express = require('express');
const router = express.Router();
const { listOffers } = require('../controllers/offers/listOffersController');
const { createOffer } = require('../controllers/offers/admin/createOffersController');
const { updateOffer } = require('../controllers/offers/admin/updateOffersController');
const { deleteOffer } = require('../controllers/offers/admin/deleteOffersController');
const { isAdmin } = require('../middlewares/adminMiddleware');

// Route pour récupérer toutes les offres d'emploi
router.get('/list', listOffers);
// Route pour créer des offres
router.post('/create', createOffer);
// Route pour modifier des offres
router.put('/update/:id', isAdmin, updateOffer);
// Route pour delete une offre
router.delete('/delete/:id', isAdmin, deleteOffer);

module.exports = router;

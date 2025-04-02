const express = require('express');
const router = express.Router();
const registerController = require('../controllers/user/registerController');  // On va définir la logique dans un contrôleur
const loginController = require('../controllers/user/loginController');  // On va définir la logique dans un contrôleur
const listUserController = require('../controllers/user/admin/listUserController');
const { isAdmin } = require('../middlewares/authMiddleware'); // Importer le middleware

// ADMIN
router.get('/list', isAdmin, listUserController.listUsers)

// USER
router.post('/register', registerController.register);
router.post('/login', loginController.login);


module.exports = router;

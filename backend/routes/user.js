const express = require('express');
const router = express.Router();

const registerController = require('../controllers/user/registerController');  // On va définir la logique dans un contrôleur
const loginController = require('../controllers/user/loginController');  // On va définir la logique dans un contrôleur
const listUserController = require('../controllers/user/admin/listUserController');
const updateController = require('../controllers/user/updateController');
const deleteController = require('../controllers/user/deleteController');
const profileController = require('../controllers/user/profileController');

const { isAdmin } = require('../middlewares/adminMiddleware'); // Importer le middleware
const { isAuth } = require('../middlewares/authMiddleware')

// ADMIN
router.get('/list', isAdmin, listUserController.listUsers)

// USER + Admin
router.post('/register', registerController.register);
router.post('/login', loginController.login);
router.get('/profile', isAuth, profileController.getUserProfile);
router.put('/update/:id', isAuth, updateController.updateUser);
router.delete('/delete/:id', isAuth, deleteController.deleteUser);

module.exports = router;
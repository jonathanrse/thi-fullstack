const express = require('express');
const router = express.Router();
const { createCategory } = require('../controllers/category/admin/createCategoryMiddleware');
const { deleteCategory } = require('../controllers/category/admin/deleteCategoryController');
const { listCategories } = require('../controllers/category/listCategoryController');
const { isAdmin } = require('../middlewares/adminMiddleware');

router.post('/create', isAdmin, createCategory);
router.delete('/delete/:id', isAdmin, deleteCategory);
router.get('/list', listCategories);

module.exports = router;
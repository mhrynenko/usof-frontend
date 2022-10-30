const express = require('express');

const category = require('../controllers/category-controller');
const checkRole = require('../middleware/role-middleware');

const router = express.Router();

router.get ('/api/categories', category.getAll);
router.get ('/api/categories/:category_id', category.getOne);
router.get ('/api/categories/:category_id/posts', category.getPosts);

router.post ('/api/categories', checkRole('admin'), category.create);
router.patch ('/api/categories/:category_id', checkRole('admin'), category.update);

router.delete ('/api/categories/:category_id', checkRole('admin'), category.deleteOne);

module.exports = router;
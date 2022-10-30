const express = require('express');

const post = require('../controllers/post-controller');
const checkAuth = require('../middleware/auth-middleware');
const checkRole = require('../middleware/role-middleware')
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

const router = express.Router();

router.get ('/api/posts', post.getAll);
router.get ('/api/posts/:post_id', post.getOne);
router.get ('/api/posts/:post_id/comments', post.getOneComments);
router.get ('/api/posts/:post_id/categories', post.getOneCategories);
router.get ('/api/posts/:post_id/like', post.getOneLikes);

router.post ('/api/posts', upload.array('files'), checkAuth, post.create); 
router.post ('/api/posts/:post_id/comments', upload.array('files'), checkAuth, post.createComment); 
router.post ('/api/posts/:post_id/like', checkAuth, post.createLike);

router.patch ('/api/posts/:post_id', upload.array('files'), checkAuth, post.update);
router.patch ('/api/posts/:post_id/status', checkRole('admin'), post.updateStatus); 
router.delete ('/api/posts/:post_id', checkAuth, post.deleteOne); 
router.delete ('/api/posts/:post_id/like', checkAuth, post.deleteLike);

module.exports = router;
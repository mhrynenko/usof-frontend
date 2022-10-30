const express = require('express');

const comment = require('../controllers/comment-controller');
const checkAuth = require('../middleware/auth-middleware');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

const router = express.Router();

router.get ('/api/comments/:comment_id', comment.getOne);
router.get ('/api/comments/:comment_id/like', comment.getOneLikes);

router.post ('/api/comments/:comment_id/like', checkAuth, comment.createLike);
router.patch ('/api/comments/:comment_id', checkAuth, upload.array('files'), comment.update);

router.delete ('/api/comments/:comment_id', checkAuth, comment.deleteOne);
router.delete ('/api/comments/:comment_id/like', checkAuth, comment.deleteLike);

module.exports = router;
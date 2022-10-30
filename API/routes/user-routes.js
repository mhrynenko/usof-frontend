const express = require('express');
const user = require('../controllers/user-controller');
const checkRole = require('../middleware/role-middleware');
const checkAuth = require('../middleware/auth-middleware');

const multer  = require('multer')
const upload = multer({ 
    dest: 'uploads/',
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
          cb(null, true);
        } else {
          cb(null, false);
          return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
})

const router = express.Router();

router.get ('/api/users', checkRole('admin'), user.getAll);
router.get ('/api/users/avatar', user.getAvatar);
router.get ('/api/users/:user_id', checkAuth, user.getOne);
router.post ('/api/users/', checkRole('admin'), user.create);
router.patch ('/api/users/role', checkRole('admin'), user.status);
router.patch ('/api/users/avatar', checkAuth, upload.single('avatar'), user.avatar);
router.patch ('/api/users/:user_id', checkAuth, user.userData);
router.delete ('/api/users/:user_id', checkAuth, user.deleteOne);

module.exports = router;
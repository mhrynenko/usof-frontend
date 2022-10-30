const express = require('express');
const auth = require('../controllers/auth-controller');

const router = express.Router();

router.post ('/api/auth/register', auth.register);
router.post ('/api/auth/login', auth.login);
router.post ('/api/auth/logout', auth.logout);
router.post ('/api/auth/password-reset', auth.password_reset);
router.post ('/api/auth/password-reset/:confirm_token', auth.password_reset_confirm);
router.get ('/api/auth/email-confirm/:confirm_token', auth.email_confirm)

module.exports = router;
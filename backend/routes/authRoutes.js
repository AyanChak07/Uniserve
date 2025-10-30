const express = require('express');
const { register, login, getMe, verifyEmail, resendOTP } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/verify-email', verifyEmail);  
router.post('/resend-otp', resendOTP);

module.exports = router;
//uniserve.mailer@gmail.com

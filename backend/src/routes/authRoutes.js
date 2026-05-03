const express = require('express');
const router = express.Router();
const { register, login, demoLogin, getMe, forgotPassword, resetPassword, updateDetails } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/demo', demoLogin);
router.get('/me', protect, getMe);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.put('/updatedetails', protect, updateDetails);

module.exports = router;

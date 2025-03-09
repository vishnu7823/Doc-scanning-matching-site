const express = require('express')
const router = express.Router();
const {register,userlogin,userProfile} = require('../Controllers/authController');
const authmMiddleware = require('../middleware/authMiddleware')

router.post('/register',register);
router.post('/login',userlogin);
router.get('/profile',authmMiddleware,userProfile);

module.exports = router;
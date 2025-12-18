const express = require('express');
const router = express.Router();
const authMiddelware = require('../middelware/auth-middelware');
const {registerUser,loginUser,changePassword}=require('../controllers/auth-controllers');


//all routes are telated to authentication & authorization
router.post('/register',registerUser);
router.post('/login',loginUser);
router.post('/changepassword',authMiddelware,changePassword);



module.exports = router; 


const express = require('express');
const router = express.Router();
const authMiddelware = require('../middelware/auth-middelware');
const adminMiddelware = require('../middelware/admin-middelware')


router.get('/welcome',authMiddelware,adminMiddelware,(req,res)=>{
    res.json({
        message:'welcome to admin page'
    })
})

module.exports = router;
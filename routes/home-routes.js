const express = require('express');
const authMiddelware = require('../middelware/auth-middelware')
const router = express.Router();

router.get('/welcome',authMiddelware, (req, res) => {
    const {username,userId,role } = req.userInfo;
    res.json({ message: 'welcome to the home page',
        user:{
            _id:userId,
            username,
            role
        }
     });
});

module.exports = router;





const express = require('express');
const authMiddelware = require('../middelware/auth-middelware');
const adminMiddelware = require('../middelware/admin-middelware');
const uploadMiddelware = require('../middelware/upload-middelware');
const {uploadImageController,fetchImagesController,deleteImageController} = require('../controllers/image-controller');


const router = express.Router()

//upload the image
router.post('/upload',authMiddelware//give userInfo
    ,adminMiddelware,//check user or not
    uploadMiddelware.single('image'),//upload in cloudinary
    uploadImageController  );//store in our database


//to get all the images
router.get('/fetch-images',authMiddelware,fetchImagesController);

//to delete an image
//693bc3c915b8ecade75168c6
router.delete('/delete-image/:id',authMiddelware,adminMiddelware,deleteImageController);


module.exports = router
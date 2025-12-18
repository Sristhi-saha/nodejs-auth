const fs = require('fs');
const Image = require('../models/image');
const { uploadToCloudinary } = require('../helpers/Cloudinary_helper');
const cloudinary = require('../config/cloudinary');

const uploadImageController = async (req, res) => {
    try {
        // check if file is missing
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'File is required. Please upload an image file.'
            });
        }

        // upload to Cloudinary
        const { url, publicId } = await uploadToCloudinary(req.file.path);//this publis id is required to delted the iamge from cloudinary

        // store image info in MongoDB
        const newlyUploadedImage = new Image({
            url,
            publicId,
            uploadedBy: req.userInfo.userId
        });

        await newlyUploadedImage.save();

        // delete the file from local uploads folder
        fs.unlinkSync(req.file.path);

        res.status(201).json({
            success: true,
            message: "Image uploaded successfully",
            image: newlyUploadedImage
        });

    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
};

const fetchImagesController = async(req,res)=>{
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 2;
        const skip = (page-1) * limit;

        const sortBy = req.query.sortBy || 'createdAt';
        const sortorder = req.query.sortorder === "asc" ? 1 : -1;
        const totalImages = await Image.countDocuments();
        const totalPages = Math.ceil(totalImages/limit);

        const sortObj = {};
        sortObj[sortBy] = sortorder
        const images = await Image.find().sort(sortObj).skip(skip).limit(limit);


        
        if(images){
            res.status(200).json({
                success:true,
                currentPage:page,
                totalPages:totalPages,
                totalImages:totalImages,
                data:images
            })
        }
    }catch(e){
        console.log(e);
        res.status(500).json({
            success:false,
            message:e.message
        })
    }
}

const deleteImageController = async(req,res)=>{
    try{
        //get the image id from request.params
        const getcurrentImageIdToBeDeleted = req.params.id;
        //find the user id
        const userId = req.userInfo.userId;

        //find the image in database
        const imageToBeDeleted = await Image.findById(getcurrentImageIdToBeDeleted);
        if(!imageToBeDeleted){
            return res.status(404).json({
                success:false,
                message:"Image not found"
            })
        }
        //check if the logged in user is the owner of the image
        if(imageToBeDeleted.uploadedBy.toString() !== userId){
            return res.status(403).json({
                success:false,
                message:"You are not authorized to delete this image you havent upload it"
            })
        }   
        //delete this image from the cloudinary
        await cloudinary.uploader.destroy(imageToBeDeleted.publicId);

        //delete the image from database
        await Image.findByIdAndDelete(getcurrentImageIdToBeDeleted);

        res.status(200).json({
            success:true,
            message:"Image deleted successfully"
        });


    }catch(e){
        console.log(e);
        res.status(500).json({
            success:false,
            message:e.message
        })
    }
}  


module.exports = {
    uploadImageController,
    fetchImagesController,
    deleteImageController
};

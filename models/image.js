const mongoose = require('mongoose');

const imageschema = new mongoose.Schema({
    url:{
        type:String,
        required:true//mandatory field
    },
    
        publicId :{
            type:String,
            required:true
        },

        uploadedBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        }

   
},{timestamps:true});

module.exports = mongoose.model('Imgage',imageschema);
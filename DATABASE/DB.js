

const mongoose = require('mongoose');


const connectedDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log('connection successfully');
    }catch(e){
        console.log('mongodb connection failed');
    }
}

module.exports = connectedDB;
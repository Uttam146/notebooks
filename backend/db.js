const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://Utt_user31:Utt12345@cluster0.o9czz.mongodb.net/inotebook"

const connectToMongo = () =>{
    mongoose.connect(mongoURI, ()=>{
        console.log("Connected to Mongo Successfully");
    })
}

module.exports = connectToMongo;
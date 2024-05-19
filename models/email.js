const mongoose = require("mongoose");
// const review = require("./review.js");
const Schema = mongoose.Schema;
// const Review = require("./review.js");
const { required } = require("joi");
const { title } = require("faker/lib/locales/az");


const emailSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    subject : {
        type:String,
        required:true,
    },
    body : {
        type:String,
        
    },
    sender:{
        type:String,
        required:true,
    },
 
    createdAt:[{
        type:Date,
        default:Date.now(),
    }
   ],
     owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
  
   

});


const Email = mongoose.model("Email",emailSchema);


module.exports = Email;
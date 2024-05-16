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
        required:true,
    },
    sender:{
        type:String,
        required:true,
    },
    // receiver :[
          
    //     {
    //         type:String,
    //         required:true,
    //     },
    // ],
    createdAt:[{
        type:Date,
        default:Date.now(),
    }
   ],

     
    
    
    // owner:{
    //     type:Schema.Types.ObjectId,
    //     ref:"User",
    // },
  
   

});

// listingSchema.post("findOneAndDelete",async(email)=>{
//     if(listing){
//        await Review.deleteMany({_id:{$in :listing.reviews}});
        
//     }
// });

const Email = mongoose.model("Email",emailSchema);


module.exports = Email;
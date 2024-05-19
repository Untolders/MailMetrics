const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const subscriberSchema= new Schema({
    username:{
         type:String,
         required:true,
         unique: false
    },
    email:{
        type:String,
        required:true,
        unique: true
    },
    age:{
        type:Number,
        required:true,
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
});

subscriberSchema.index({ owner: 1, email: 1 }, { unique: true });



module.exports = mongoose.model("Subscriber",subscriberSchema);
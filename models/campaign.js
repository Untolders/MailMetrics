const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const campaignSchema = new Schema({
    emailId: {
        type: Schema.Types.ObjectId,
        ref: "Email",
        required: true
    },  
    receiver: [{
        type: Schema.Types.ObjectId,
        ref: "Subscriber",
        required: true,
    }],
    data: {
        views: [{
            subscriber: {
                type: Schema.Types.ObjectId,
                ref: "Subscriber"
            },
            time: {
                type: Date,
                default: () => new Date()
            }
        }],
        clicks: [{
            subscriber: {
                type: Schema.Types.ObjectId,
                ref: "Subscriber"
            },
            time: {
                type: Date,
                default: () => new Date()
            }
        }],
    },
    sendAt: [{
        type: Date,
        default: () => new Date()
    }],
    owner:{
        type: Schema.Types.ObjectId,
                ref: "User"

    }
});

module.exports = mongoose.model("Campaign", campaignSchema);

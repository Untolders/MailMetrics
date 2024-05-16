const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Subscriber = require("./subscriber.js");

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
    }]
});

module.exports = mongoose.model("Campaign", campaignSchema);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const crypto = require("crypto"); // Import Node.js crypto module

const senderEmailSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    appPassword: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
        required: true,
    }
});

senderEmailSchema.index({ owner: 1, email: 1 }, { unique: true });



module.exports = mongoose.model("SenderEmail", senderEmailSchema);

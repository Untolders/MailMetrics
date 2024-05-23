const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const crypto = require("crypto");
const {generateOTP} = require("../utils/verificationMail.js");

// Define the schema
const verificationTokenSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600, // 1 hour
    }
});

// Static method to generate a token
verificationTokenSchema.statics.generateToken = async function(ownerId) {
    const token =   await generateOTP(); // Generate a random token
    const salt = crypto.randomBytes(16).toString('hex'); // Generate a random salt

    // Hash the token with the salt
    const hashedToken = crypto.pbkdf2Sync(token, salt, 1000, 64, 'sha512').toString('hex');

    // Save the hashed token and salt to the database
    const verificationToken = await this.create({
        owner: ownerId,
        token: hashedToken,
        salt: salt
    });

    // Return the original token and the document for further use
    return {
        verificationToken,
        token // Return the original token for sending to the user
    };
};

// Method to verify a token
verificationTokenSchema.statics.verifyToken = async function(ownerId, token) {
    const record = await this.findOne({ owner: ownerId });
    if (!record) {
        return false;
    }

    const hashedToken = crypto.pbkdf2Sync(token, record.salt, 1000, 64, 'sha512').toString('hex');
    return hashedToken === record.token;
};

module.exports = mongoose.model("VerificationToken", verificationTokenSchema);

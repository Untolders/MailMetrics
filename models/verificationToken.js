const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const crypto = require("crypto"); // Import Node.js crypto module

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
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600, // 1 hour
    }
});

verificationTokenSchema.statics.generateToken = function(ownerId) {
    const token = crypto.randomBytes(32).toString('hex'); // Generate a random token
    const salt = crypto.randomBytes(16).toString('hex'); // Generate a random salt

    // Hash the token with the salt
    const hashedToken = crypto.pbkdf2Sync(token, salt, 1000, 64, 'sha512').toString('hex');

    // Save the hashed token to the database
    return this.create({
        owner: ownerId,
        token: hashedToken
    });
};

module.exports = mongoose.model("VerificationToken", verificationTokenSchema);

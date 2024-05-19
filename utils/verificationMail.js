const nodemailer = require('nodemailer');

// Generate OTP
// Generate OTP using dynamic import
const generateOTP = async () => {
    const cryptoRandomString = await import("crypto-random-string");
    return cryptoRandomString.default({ length: 6, type: 'numeric' });
};


// Set up nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAILMETRICS_MAIL,
        pass: process.env.MAILMETRICS_PASSWORD
    }
});

module.exports = { transporter, generateOTP };

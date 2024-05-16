var nodemailer = require('nodemailer');

module.exports= transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SENDER_MAIL,
    pass: process.env.SENDER_MAIL_PASSWORD
  }
});



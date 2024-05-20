var nodemailer = require('nodemailer');

// Default transporter using environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SENDER_MAIL,
    pass: process.env.SENDER_MAIL_PASSWORD
  }
});

// Function to create a transporter with dynamic credentials
function createUserTransporter(email, password) {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: email,
      pass: password
    }
  });
}

// Export both the default transporter and the function
module.exports = {
  transporter,
  createUserTransporter
};

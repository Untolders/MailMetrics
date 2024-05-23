const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const key = crypto.createHash('sha256').update(String(process.env.SECRET)).digest('base64').substring(0, 32);
const iv = crypto.randomBytes(16);  // Generate a secure random initialization vector

function encryptToken(token) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return { iv: iv.toString('hex'), encryptedData: encrypted };
}

function decryptToken(encryptedToken) {
  const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(encryptedToken.iv, 'hex'));
  let decrypted = decipher.update(encryptedToken.encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}


module.exports = {encryptToken, decryptToken};


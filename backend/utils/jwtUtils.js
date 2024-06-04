const jwt = require('jsonwebtoken');

const secretKey = 'gotAsecretcanyoukeepIT?';

function generateToken(payload) {
    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
}

function verifyToken(token) {
    try {
        return jwt.verify(token, secretKey);
    } catch (err) {
        return null;
    }
}

module.exports = { generateToken, verifyToken };

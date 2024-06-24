const jwt = require('jsonwebtoken');

const secretKey = 'gotAsecretcanyoukeepIT?';

function generateToken(payload) {
    return jwt.sign(payload, secretKey, { expiresIn: '1d' });
}

function verifyToken(token) {
    try {
        return jwt.verify(token, secretKey);
    } catch (err) {
        return null;
    }
}

function authenticateToken(req) {
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.token;
    if (!token) return null;
  
    return verifyToken(token);
  }

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

module.exports = { generateToken, verifyToken, parseJwt, authenticateToken };

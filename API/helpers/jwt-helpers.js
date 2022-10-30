const jwt = require('jsonwebtoken');

const generateAccessToken = (login, status, id) => {
    const payload = { 
        status,
        login,
        id,
    }

    return jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn: '6h'});
};


module.exports = {
    generateAccessToken,
}
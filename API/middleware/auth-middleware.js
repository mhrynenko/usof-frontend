const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.json ({
                error : 'User is not authorized'
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        req.user = decoded;
        next();
    } catch {
        return res.json ({
            error : 'User is not authorized'
        })
    }
}
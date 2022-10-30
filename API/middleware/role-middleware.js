const jwt = require('jsonwebtoken');

module.exports = function(role) {
    return function (req, res, next) {
        try {
            if (!req.cookies.token) {
                return res.json ({
                    error : 'User is not authorized'
                })
            }
    
            const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET_KEY);

            if (req.cookies.status !== role) {
                return res.json ({
                    error : 'No permissions'
                })
            } 

            req.user = decoded;
            next();
        } catch {
            return res.json ({
                message : 'user is not authorized'
            })
        }
    }
}


    
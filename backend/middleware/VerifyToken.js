const jwt = require('jsonwebtoken')
const response = require ('../config/response')

const verifyToken = (req, res, next) =>{
    const authHeader = req.headers['authorization'];
    if(!authHeader) return response(401, null, "Token tidak di temukan", res)

    const token = authHeader.split(' ')[1];
    if(!token) return response(401, null, "Token tidak di temukan", res)

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,
            (err, decoded) => {
                if(err) return response(403, null, "Token tidak valid atau kadaluarsa", res);
                req.userId = decoded.userId;
                req.username = decoded.username;
                req.userType = decoded.userType;
                next()
            }
        )
}

module.exports = {verifyToken}
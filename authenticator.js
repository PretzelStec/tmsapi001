const jwt = require('jsonwebtoken');
require('dotenv').config();

const perms = {"admins":["GET", "POST", "DELETE", "PATCH"], "owners_operators":["GET", "PATCH"], "company_drivers":["GET", "PATCH"], "accountants":["GET", "PATCH"], "dispatchers":["GET", "POST", "DELETE", "PATCH"]}

function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null){
        return res.status(401).json({
            status:"failed",
            message : "not authorized null token"
        })
    }
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if(err) return res.status(401).json({
            status:"failed",
            message : "not authorized"
        })
        req.user = user
        if( perms[req.user.role].includes(req.method)){
            next()
        }else{
            return res.status(401).json({
                status:"failed",
                message : "not authorized bad method"
            })
        }
    })
}

module.exports = authenticateToken;
const jwt = require("jsonwebtoken");
const TokenBlacklist = require("../models/TokenBlacklist");

const protect = async (req, res, next) => {
    try{
        let token;

        if(
            req.headers.authorization && 
            req.headers.authorization.startsWith("Bearer ")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if(!token) {
            return res.status(401).json({
                message: "Not authorized, token missing"
            });
        }

        const blacklistedToken = await TokenBlacklist.findOne({ token });

        if(blacklistedToken) {
            return res.status(401).json({
                message: "Token has been revoked"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );

        req.user = decoded;

        next();
    } catch(error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: "You are not authorized to access this rosource"
            });
        }

        next();
    };
};

module.exports = { protect, authorize };
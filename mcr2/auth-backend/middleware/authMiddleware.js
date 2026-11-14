
const jwt = require("jsonwebtoken");
const TokenBlacklist = require("../models/TokenBlacklist");

const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "No token provided"
            });
        }

        const token = authHeader.split(" ")[1];

        const isBlacklisted = await TokenBlacklist.findOne({ token });

        if (isBlacklisted) {
            return res.status(401).json({
                message: "Token has been logged out"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};


const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: "You are not authorized"
            });
        }

        next();
    };
};


module.exports = { protect, authorizeRoles };

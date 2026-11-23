const jwt = require("jsonwebtoken");

const generateAccessToken = (userId, role) => {
    return jwt.sign(
        { id: userId, role},
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};

const generateRefreshToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
};


const generateTokens = (user) => {
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    return { accessToken, refreshToken };
};


module.exports = generateTokens;

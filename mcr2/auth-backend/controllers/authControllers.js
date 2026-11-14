
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const RefreshToken = require("../models/RefreshToken");
const TokenBlacklist = require("../models/TokenBlacklist");

const {
    generateAccessToken,
    generateRefreshToken,
    hashToken
} = require("../utils/generateTokens");


const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const accessToken = generateAccessToken(user);

        const refreshToken = generateRefreshToken();

        await RefreshToken.create({
            userId: user._id,
            tokenHash: hashToken(refreshToken),
            expiresAt: new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000
            )
        });

        res.status(200).json({
            message: "Login successful",
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
};


const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            user
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
};


const getAdminDashboard = (req, res) => {
    res.status(200).json({
        message: "Welcome to Admin Dashboard",
        user: req.user
    });
};


const refreshAccessToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                message: "Refresh token is required"
            });
        }

        const hashedToken = hashToken(refreshToken);

        const storedToken = await RefreshToken.findOne({
            tokenHash: hashedToken
        });

        if (!storedToken || storedToken.revokedAt) {
            return res.status(401).json({
                message: "Invalid refresh token"
            });
        }

        if (storedToken.expiresAt <= new Date()) {
            return res.status(401).json({
                message: "Refresh token expired"
            });
        }

        const user = await User.findById(storedToken.userId);

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        storedToken.revokedAt = new Date();
        await storedToken.save();

        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken();

        await RefreshToken.create({
            userId: user._id,
            tokenHash: hashToken(newRefreshToken),
            expiresAt: new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000
            )
        });

        res.status(200).json({
            message: "Token refreshed successfully",
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
};


const logoutUser = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];

        const decoded = jwt.decode(token);

        if (!decoded || !decoded.exp) {
            return res.status(401).json({
                message: "Invalid access token"
            });
        }

        await TokenBlacklist.create({
            token,
            expiresAt: new Date(decoded.exp * 1000)
        });

        const { refreshToken } = req.body;

        if (refreshToken) {
            await RefreshToken.findOneAndUpdate(
                {
                    tokenHash: hashToken(refreshToken),
                    userId: req.user.id,
                    revokedAt: null
                },
                {
                    revokedAt: new Date()
                }
            );
        }

        res.status(200).json({
            message: "Logout successful"
        });

    } catch (error) {
        res.status(500).json({
            message: "Logout failed"
        });
    }
};


module.exports = {
    registerUser,
    loginUser,
    getProfile,
    getAdminDashboard,
    refreshAccessToken,
    logoutUser
};

const User = require("../models/User");
const generateTokens = require("../utils/generateTokens");
const jwt = require("jsonwebtoken");
const TokenBlacklist = require("../models/TokenBlacklist");

const registerUser = async (req, res) => {
    try{
        const {name, email, password} = req.body;

        if(!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid email format"
            });
        }

        if(password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters"
            });
        }

        const existingUser = await User.findOne({ email });

        if(existingUser) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        const user = await User.create({
            name,
            email,
            password
        });


        res.status(201).json({
            message: " User registerd successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    }
    catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        res.status(500).json({
            message: error.message
        });
    }
};


const loginUser = async (req, res) => {
    try{
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(400).json({
                message: "Email asb password are required"
            });
        }

        const user = await User.findOne({ email });

        if(!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isMatch = await user.comparePassword(password);

        if(!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }


        const {accessToken, refreshToken} = generateTokens(user);
        user.refreshToken = refreshToken;
        await user.save();


        res.status(200).json({
            message: "Login Successful",
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch(error) {
        res.status(500).json({
            message: error.message
        });
    }
};


const logoutUser = async (req, res) => {
    try{
        const token = req.headers.authorization.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );

        const expiresAt = new Date(decoded.exp * 1000);

        await TokenBlacklist.create({
            token,
            expiresAt
        });

        await User.findByIdAndUpdate(req.user.id, {
            refreshToken: null
        });
    } catch(error) {
        res.status(500).json({
            message: error.message
        });
    }
};



const refreshAccessToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({
                message: "Refresh token required"
            });
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({
                message: "Invalid refresh token"
            });
        }

        const tokens = generateTokens(user);

        user.refreshToken = tokens.refreshToken;
        await user.save();

        res.status(200).json({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
        });

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired refresh token"
        });
    }
};




module.exports = { registerUser, loginUser, logoutUser, refreshAccessToken };
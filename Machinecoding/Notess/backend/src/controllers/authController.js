const User = require("../models/User");

const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

const registerUser = async(req, res) => {
    try{

        const {name, email, password} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({
                message: "All fields are required"
            });
        }
    }
}
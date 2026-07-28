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
        
        const userExists = await User.findOne({email});

        if(userExists) {
            return res.status(400).json({
                message: "User already exists"
            });
        }


        const hashedPassword = await bcrypt.hash(password, 10);  //hashing count total-------

        const user = await User.create({
            name,
            email,
            password:hashedPassword   //this is because model has name password but we are using hashed password.....so we are writting hashed password as password: hashedpassword 
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });
    }
    catch(error) {
        res.status(500).json({
            message:error.message
        });
    }
};

module.exports = {registerUser};  //used when exporting multiple function from the same controllers---- 
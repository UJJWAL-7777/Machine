const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async(req, res, next) => {
    try{
        let token;

        if(req.headers.authorization && 
            req.headers.authorization.startsWith("Bearer")) {

                token = req.headers.authorization.split(" ")[1];

                const decoded = jwt.verify( token, process.env.JWT_SECRET );
                req.user = await User.findById(jwt.decode.id).select("-password");  //'-' means exclude this field 

                next();
        }
        else{
            return res.status(401).json({
                message: "Not authorized, token missing"
            });
        }
    }
    catch(error) {  
        return res.status(401).json({
            message: "Not authorized, invalid token"
        });
    }
};

module.exports = {
    protect
};
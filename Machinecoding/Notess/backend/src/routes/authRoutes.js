const express = require("express");
const router = express.Router();

const {registerUser, loginUser} = require("../controllers/authController");
const {registerValidator, loginValidator} = require("../validators/authValidator");


router.post("/register",registerValidator, registerUser);   //Instead of app.post(...).... we use router.post(...)..... because all auth routes stay together....
router.post("/login",loginValidator, loginUser);



module.exports = router;

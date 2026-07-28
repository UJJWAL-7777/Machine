const express = require("express");
const router = express.Router();

const {registerUser} = require("../controllers/authController");


router.post("/register", registerUser);   //Instead of app.post(...).... we use router.post(...)..... because all auth routes stay together....




module.exports = router;

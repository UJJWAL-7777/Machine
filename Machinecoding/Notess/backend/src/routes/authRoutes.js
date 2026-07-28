const express = require("express");
const router = express.Router();

const {registerUser, loginUser} = require("../controllers/authController");


router.post("/register", registerUser);   //Instead of app.post(...).... we use router.post(...)..... because all auth routes stay together....
router.post("/login", loginUser);



module.exports = router;

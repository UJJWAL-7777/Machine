const express = require("express");
const router = express.Router();

const { registerUser, loginUser, logoutUser, refreshAccessToken } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshAccessToken);
router.post("/logout", protect, logoutUser);

module.exports = router;

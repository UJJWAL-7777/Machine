
const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser,
    getProfile,
    getAdminDashboard,
    refreshAccessToken,
    logoutUser
} = require("../controllers/authControllers");

const {
    protect,
    authorizeRoles
} = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);
router.get("/admin", protect, authorizeRoles("admin"), getAdminDashboard);
router.post("/refresh", refreshAccessToken);
router.post("/logout", protect, logoutUser);

module.exports = router;

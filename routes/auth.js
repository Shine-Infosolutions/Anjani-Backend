const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const { login, getMe, logout, changePassword } = require("../controllers/authController");

router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/logout", protect, logout);
router.post("/change-password", protect, changePassword);

module.exports = router;

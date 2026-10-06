const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  signup,
  verifyOTP,
  login,
  resendOTP,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  updateProfile,
  getAdminStats,
} = require("../controllers/authController");

const router = express.Router();

// Signup
router.post("/signup", signup);

// Signup OTP verification
router.post("/verify-otp", verifyOTP);

// Login
router.post("/login", login);

// Resend signup OTP
router.post("/resend-otp", resendOTP);

// Forgot password - send OTP
router.post("/forgot-password", forgotPassword);

// Forgot password - verify OTP
router.post("/verify-reset-otp", verifyResetOTP);

// Forgot password - reset password
router.post("/reset-password", resetPassword);

// Admin Stats
router.get(
  "/admin-stats",
  getAdminStats
);

// Update profile
router.put("/profile", protect, updateProfile);

module.exports = router;
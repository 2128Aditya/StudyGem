const express = require("express");
const protect = require("../middleware/authMiddleware");
const { getProfileStats } = require("../controllers/profileController");

const router = express.Router();

router.get("/stats", protect, getProfileStats);

module.exports = router;

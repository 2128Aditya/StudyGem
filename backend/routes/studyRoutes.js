const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  getStudyProgress,
  updateStudyProgress,
} = require("../controllers/studyController");

const router = express.Router();

router.get("/progress", protect, getStudyProgress);

router.post("/progress", protect, updateStudyProgress);

module.exports = router;
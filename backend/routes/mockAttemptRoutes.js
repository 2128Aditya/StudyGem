const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  saveMockTestAttempt,
} = require("../controllers/mockAttemptController");

const router = express.Router();

router.post(
  "/attempt",
  protect,
  saveMockTestAttempt
);

module.exports = router;
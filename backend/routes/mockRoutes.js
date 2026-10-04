const express = require("express");

const {
  generateMockQuestions,
} = require("../controllers/mockController");

const router = express.Router();

router.post("/generate", generateMockQuestions);

module.exports = router;
const express = require("express");

const {
  getCurrentAffairs,
  getCurrentAffairById,
  updateCurrentAffairsManually,
} = require("../controllers/currentAffairsController");

const router = express.Router();

// Get all current affairs
router.get(
  "/",
  getCurrentAffairs
);

// Manual Current Affairs update
// Browser se test karne ke liye GET temporarily use kar rahe hain
router.get(
  "/update",
  updateCurrentAffairsManually
);

// Manual Current Affairs update
// Proper API request ke liye POST bhi available rahega
router.post(
  "/update",
  updateCurrentAffairsManually
);

// Get single current affair
router.get(
  "/:id",
  getCurrentAffairById
);

module.exports = router;
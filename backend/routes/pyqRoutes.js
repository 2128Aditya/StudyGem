const express = require("express");

const {
  getPYQs,
  uploadPYQ,
  updatePYQ,
  deletePYQ,
  viewPYQ,
  downloadPYQ,
} = require("../controllers/pyqController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

// ==========================================
// GET ALL PYQs
// Student + Admin
// ==========================================
router.get("/", getPYQs);

// ==========================================
// VIEW PDF
// Student + Admin
// ==========================================
router.get("/:id/view", viewPYQ);

// ==========================================
// DOWNLOAD PDF
// Student + Admin
// ==========================================
router.get("/:id/download", downloadPYQ);

// ==========================================
// ADMIN UPLOAD
// ==========================================
router.post(
  "/upload",
  protect,
  adminOnly,
  uploadPYQ
);

// ==========================================
// ADMIN UPDATE
// ==========================================
router.put(
  "/:id",
  protect,
  adminOnly,
  updatePYQ
);

// ==========================================
// ADMIN DELETE
// ==========================================
router.delete(
  "/:id",
  protect,
  adminOnly,
  deletePYQ
);

module.exports = router;
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
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// GET ALL PYQs
router.get("/", getPYQs);

// VIEW PDF
router.get("/:id/view", viewPYQ);

// DOWNLOAD PDF
router.get("/:id/download", downloadPYQ);

// ADMIN UPLOAD
router.post(
  "/upload",
  protect,
  adminOnly,
  upload.single("file"),
  uploadPYQ
);

// ADMIN UPDATE
router.put(
  "/:id",
  protect,
  adminOnly,
  upload.single("file"),
  updatePYQ
);

// ADMIN DELETE
router.delete(
  "/:id",
  protect,
  adminOnly,
  deletePYQ
);

module.exports = router;
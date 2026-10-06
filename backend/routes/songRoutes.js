const express = require("express");

const {
  addSong,
  getSongs,
  getAllSongs,
  deleteSong,
  toggleSong,
} = require("../controllers/songController");

const uploadSong = require("../middleware/songUploadMiddleware");

const router = express.Router();

router.get("/", getSongs);

router.get("/admin", getAllSongs);

router.post(
  "/add",
  uploadSong.fields([
    {
      name: "audio",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  addSong
);

router.delete("/:id", deleteSong);

router.patch("/:id/toggle", toggleSong);

module.exports = router;
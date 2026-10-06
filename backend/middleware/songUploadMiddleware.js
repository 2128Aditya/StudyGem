const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (
    file.fieldname === "audio" ||
    file.fieldname === "thumbnail"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file field."), false);
  }
};

const uploadSong = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

module.exports = uploadSong;
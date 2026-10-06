const Song = require("../models/Song");
const cloudinary = require("../config/cloudinary");

const addSong = async (req, res) => {
  try {
    const { title, artist, order } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Song title is required",
      });
    }

    const audioFile = req.files?.audio?.[0];
    const thumbnailFile = req.files?.thumbnail?.[0];

    if (!audioFile) {
      return res.status(400).json({
        success: false,
        message: "Audio file is required",
      });
    }

    const audioUpload = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "video",
          folder: "studyGem/songs",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      stream.end(audioFile.buffer);
    });

    let thumbnailUpload = null;

    if (thumbnailFile) {
      thumbnailUpload = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "image",
            folder: "studyGem/song-thumbnails",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        stream.end(thumbnailFile.buffer);
      });
    }

    const song = await Song.create({
      title,
      artist: artist || "StudyGem",
      audioUrl: audioUpload.secure_url,
      audioPublicId: audioUpload.public_id,
      thumbnailUrl: thumbnailUpload?.secure_url || "",
      thumbnailPublicId: thumbnailUpload?.public_id || "",
      order: Number(order) || 0,
    });

    return res.status(201).json({
      success: true,
      message: "Song uploaded successfully",
      song,
    });
  } catch (error) {
    console.error("Add song error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to upload song",
      error: error.message,
    });
  }
};

const getSongs = async (req, res) => {
  try {
    const songs = await Song.find({
      isActive: true,
    }).sort({
      order: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      total: songs.length,
      songs,
    });
  } catch (error) {
    console.error("Get songs error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch songs",
      error: error.message,
    });
  }
};

const getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find().sort({
      order: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      total: songs.length,
      songs,
    });
  } catch (error) {
    console.error("Get all songs error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch songs",
      error: error.message,
    });
  }
};

const deleteSong = async (req, res) => {
  try {
    const { id } = req.params;

    const song = await Song.findById(id);

    if (!song) {
      return res.status(404).json({
        success: false,
        message: "Song not found",
      });
    }

    if (song.audioPublicId) {
      await cloudinary.uploader.destroy(song.audioPublicId, {
        resource_type: "video",
      });
    }

    if (song.thumbnailPublicId) {
      await cloudinary.uploader.destroy(song.thumbnailPublicId, {
        resource_type: "image",
      });
    }

    await Song.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Song deleted successfully",
    });
  } catch (error) {
    console.error("Delete song error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete song",
      error: error.message,
    });
  }
};

const toggleSong = async (req, res) => {
  try {
    const { id } = req.params;

    const song = await Song.findById(req.params.id);

    if (!song) {
      return res.status(404).json({
        success: false,
        message: "Song not found",
      });
    }

    song.isActive = !song.isActive;

    await song.save();

    res.status(200).json({
      success: true,
      message: song.isActive
        ? "Song activated successfully"
        : "Song deactivated successfully",
      song,
    });
  } catch (error) {
    console.error("Toggle song error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update song",
      error: error.message,
    });
  }
};

module.exports = {
  addSong,
  getSongs,
  getAllSongs,
  deleteSong,
  toggleSong,
};
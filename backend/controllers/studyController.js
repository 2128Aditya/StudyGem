const User = require("../models/User");

// Get current user's study progress
const getStudyProgress = async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication data not found.",
      });
    }

    const user = await User.findById(userId).select("studyProgress");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      studyProgress: user.studyProgress || [],
    });
  } catch (error) {
    console.error("Get Study Progress Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch study progress.",
      error: error.message,
    });
  }
};


// Add study time to a subject
const updateStudyProgress = async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId;

    const {
      subject,
      studiedMinutes,
      targetMinutes,
    } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication data not found.",
      });
    }

    if (!subject) {
      return res.status(400).json({
        success: false,
        message: "Subject is required.",
      });
    }

    if (
      studiedMinutes !== undefined &&
      (!Number.isFinite(Number(studiedMinutes)) ||
        Number(studiedMinutes) < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Studied minutes must be a valid positive number.",
      });
    }

    if (
      targetMinutes !== undefined &&
      (!Number.isFinite(Number(targetMinutes)) ||
        Number(targetMinutes) < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Target minutes must be a valid positive number.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const cleanSubject = subject.trim();

    const existingSubject = user.studyProgress.find(
      (item) =>
        item.subject.toLowerCase() ===
        cleanSubject.toLowerCase()
    );

    if (existingSubject) {
      if (studiedMinutes !== undefined) {
        existingSubject.studiedMinutes = Number(studiedMinutes);
      }

      if (targetMinutes !== undefined) {
        existingSubject.targetMinutes = Number(targetMinutes);
      }
    } else {
      user.studyProgress.push({
        subject: cleanSubject,
        studiedMinutes:
          studiedMinutes !== undefined
            ? Number(studiedMinutes)
            : 0,
        targetMinutes:
          targetMinutes !== undefined
            ? Number(targetMinutes)
            : 0,
      });
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Study progress updated successfully.",
      studyProgress: user.studyProgress,
    });
  } catch (error) {
    console.error("Update Study Progress Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update study progress.",
      error: error.message,
    });
  }
};


module.exports = {
  getStudyProgress,
  updateStudyProgress,
};
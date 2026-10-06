const CurrentAffair = require("../models/CurrentAffair");

const {
  updateCurrentAffairs,
} = require("../services/currentAffairsService");

const getCurrentAffairs = async (req, res) => {
  try {
    const {
      category = "all",
      language = "english",
      date,
    } = req.query;

    const allowedLanguages = [
      "english",
      "hinglish",
      "hindi",
    ];

    const selectedLanguage =
      allowedLanguages.includes(language)
        ? language
        : "english";

    const query = {};

    if (date) {
      query.date = date;
    } else {
      const today = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
      }).format(new Date());

      query.date = today;
    }

    if (
      category &&
      category.toLowerCase() !== "all"
    ) {
      query.category = category;
    }

    const affairs = await CurrentAffair.find(query)
      .sort({
        publishedAt: -1,
        createdAt: -1,
      })
      .lean();

    const formattedAffairs = affairs.map((affair) => {
      const translated =
        affair.language?.[selectedLanguage] || {};

      return {
        _id: affair._id,
        date: affair.date,

        title:
          translated.title ||
          affair.title,

        category: affair.category,

        summary:
          translated.summary ||
          affair.summary,

        importantPoints:
          translated.importantPoints?.length
            ? translated.importantPoints
            : affair.importantPoints,

        examFocus: affair.examFocus,

        source: affair.source,

        publishedAt: affair.publishedAt,

        tags: affair.tags,

        generatedBy: affair.generatedBy,
      };
    });

    const categoryCounts = {};

    for (const affair of affairs) {
      categoryCounts[affair.category] =
        (categoryCounts[affair.category] || 0) + 1;
    }

    return res.status(200).json({
      success: true,
      date: query.date,
      language: selectedLanguage,
      category,
      total: formattedAffairs.length,
      categoryCounts,
      affairs: formattedAffairs,
    });
  } catch (error) {
    console.error(
      "Get Current Affairs Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch current affairs.",
      error: error.message,
    });
  }
};

const getCurrentAffairById = async (req, res) => {
  try {
    const { id } = req.params;

    const affair =
      await CurrentAffair.findById(id).lean();

    if (!affair) {
      return res.status(404).json({
        success: false,
        message:
          "Current affair not found.",
      });
    }

    return res.status(200).json({
      success: true,
      affair,
    });
  } catch (error) {
    console.error(
      "Get Current Affair By ID Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch current affair.",
      error: error.message,
    });
  }
};

/*
  MANUAL CURRENT AFFAIRS UPDATE

  This endpoint runs the complete pipeline:

  RSS
    ↓
  Groq AI
    ↓
  MongoDB
*/

const updateCurrentAffairsManually = async (
  req,
  res
) => {
  try {
    console.log(
      "Manual Current Affairs update requested."
    );

    const result =
      await updateCurrentAffairs();

    return res.status(200).json({
      success: true,

      message:
        "Current Affairs update completed.",

      result,
    });
  } catch (error) {
    console.error(
      "Manual Current Affairs Update Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Current Affairs update failed.",

      error: error.message,
    });
  }
};

module.exports = {
  getCurrentAffairs,
  getCurrentAffairById,
  updateCurrentAffairsManually,
};
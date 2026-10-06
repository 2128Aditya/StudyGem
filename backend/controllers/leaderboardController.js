const mongoose = require("mongoose");
const MockTestAttempt = require("../models/MockTestAttempt");
const User = require("../models/User");

const getLeaderboard = async (req, res) => {
  try {
    const { period = "all" } = req.query;

    let startDate = null;
    const now = new Date();

    if (period === "week") {
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);
    }

    if (period === "month") {
      startDate = new Date(now);
      startDate.setMonth(startDate.getMonth() - 1);
      startDate.setHours(0, 0, 0, 0);
    }

    const matchStage = {};

    if (startDate) {
      matchStage.createdAt = {
        $gte: startDate,
      };
    }

    const leaderboard = await MockTestAttempt.aggregate([
      {
        $match: matchStage,
      },

      {
        $group: {
          _id: "$user",

          points: {
            $sum: "$score",
          },

          tests: {
            $sum: 1,
          },

          totalQuestions: {
            $sum: "$totalQuestions",
          },

          totalCorrect: {
            $sum: "$correct",
          },

          totalAttempted: {
            $sum: "$attempted",
          },

          lastTestDate: {
            $max: "$createdAt",
          },
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },

      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: false,
        },
      },

      {
        $project: {
          _id: 0,

          userId: "$_id",

          name: {
            $ifNull: ["$user.name", "StudyGem Student"],
          },

          email: "$user.email",

          profileImage: {
            $ifNull: ["$user.profileImage", ""],
          },

          points: 1,
          tests: 1,
          totalQuestions: 1,
          totalCorrect: 1,
          totalAttempted: 1,
          lastTestDate: 1,
        },
      },

      {
        $sort: {
          points: -1,
          totalCorrect: -1,
          tests: -1,
          userId: 1,
        },
      },
    ]);

    const formattedLeaderboard = leaderboard.map((user, index) => {
      const accuracy =
        user.totalAttempted > 0
          ? Math.round(
              (user.totalCorrect / user.totalAttempted) * 100
            )
          : 0;

      return {
        rank: index + 1,

        userId: user.userId,

        name: user.name,

        username:
          "@" +
          user.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .replace(/[^a-z0-9_]/g, ""),

        points: user.points,

        tests: user.tests,

        accuracy,

        avatar: user.profileImage || "/aadi.png",

        streak: 0,
      };
    });

    let currentUserRank = null;

    if (req.user?.id) {
      const currentUser = formattedLeaderboard.find(
        (user) =>
          String(user.userId) === String(req.user.id)
      );

      if (currentUser) {
        currentUserRank = currentUser.rank;
      }
    }

    return res.status(200).json({
      success: true,

      period,

      leaderboard: formattedLeaderboard,

      currentUserRank,

      totalLearners: formattedLeaderboard.length,

      totalTests: formattedLeaderboard.reduce(
        (total, user) => total + user.tests,
        0
      ),

      totalPoints: formattedLeaderboard.reduce(
        (total, user) => total + user.points,
        0
      ),
    });
  } catch (error) {
    console.error("Leaderboard Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load leaderboard.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

module.exports = {
  getLeaderboard,
};
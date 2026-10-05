const MockTestAttempt = require("../models/MockTestAttempt");

const getProfileStats = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const attempts = await MockTestAttempt.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();

    const totalTests = attempts.length;
    const totalQuestions = attempts.reduce((sum, item) => sum + (item.totalQuestions || 0), 0);
    const correct = attempts.reduce((sum, item) => sum + (item.correct || 0), 0);
    const wrong = attempts.reduce((sum, item) => sum + (item.wrong || 0), 0);
    const skipped = attempts.reduce((sum, item) => sum + (item.skipped || 0), 0);
    const totalScore = attempts.reduce((sum, item) => sum + (item.score || 0), 0);
    const maxScore = attempts.reduce((sum, item) => sum + (item.maxScore || 0), 0);
    const attempted = correct + wrong;
    const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

    const subjectMap = new Map();

    attempts.forEach((attempt) => {
      const subjects = Array.isArray(attempt.subjects) && attempt.subjects.length
        ? attempt.subjects
        : [attempt.topic || "General"];

      // If a test contains multiple subjects, distribute the test's question
      // totals equally across those subjects so the dashboard stays consistent.
      const divisor = Math.max(subjects.length, 1);

      subjects.forEach((subject) => {
        const name = String(subject || "General").trim() || "General";
        const current = subjectMap.get(name) || { name, questions: 0, correct: 0, attempted: 0 };
        current.questions += Math.round((attempt.totalQuestions || 0) / divisor);
        current.correct += Math.round((attempt.correct || 0) / divisor);
        current.attempted += Math.round((attempt.attempted || 0) / divisor);
        subjectMap.set(name, current);
      });
    });

    const colors = [
      "bg-[#7c3aed]",
      "bg-[#4f46e5]",
      "bg-[#8b5cf6]",
      "bg-[#6366f1]",
      "bg-[#a855f7]",
      "bg-[#6d28d9]",
    ];

    const subjectPerformance = Array.from(subjectMap.values())
      .map((item, index) => ({
        name: item.name,
        questions: item.questions,
        accuracy: item.attempted > 0 ? Math.round((item.correct / item.attempted) * 100) : 0,
        color: colors[index % colors.length],
      }))
      .sort((a, b) => b.questions - a.questions)
      .slice(0, 12);

    const now = new Date();
    const dayKeys = [];
    const weeklyActivity = [];
    const weeklyAccuracy = [];

    for (let offset = 6; offset >= 0; offset -= 1) {
      const date = new Date(now);
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - offset);
      const key = date.toISOString().slice(0, 10);
      dayKeys.push(key);

      const dayAttempts = attempts.filter((attempt) => {
        if (!attempt.createdAt) return false;
        const attemptDate = new Date(attempt.createdAt);
        attemptDate.setHours(0, 0, 0, 0);
        return attemptDate.toISOString().slice(0, 10) === key;
      });

      const questions = dayAttempts.reduce((sum, item) => sum + (item.totalQuestions || 0), 0);
      const dayCorrect = dayAttempts.reduce((sum, item) => sum + (item.correct || 0), 0);
      const dayAttempted = dayAttempts.reduce((sum, item) => sum + (item.attempted || 0), 0);

      weeklyActivity.push(questions);
      weeklyAccuracy.push(dayAttempted > 0 ? Math.round((dayCorrect / dayAttempted) * 100) : 0);
    }

    const completedDateSet = new Set(
      attempts
        .filter((item) => item.createdAt)
        .map((item) => {
          const date = new Date(item.createdAt);
          date.setHours(0, 0, 0, 0);
          return date.toISOString().slice(0, 10);
        })
    );

    let streak = 0;
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);

    // A streak starts today, or yesterday if today's activity has not happened yet.
    if (!completedDateSet.has(cursor.toISOString().slice(0, 10))) {
      cursor.setDate(cursor.getDate() - 1);
    }

    while (completedDateSet.has(cursor.toISOString().slice(0, 10))) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }

    const badges = [
      totalTests >= 1,
      accuracy >= 80 && attempted > 0,
      totalQuestions >= 100,
      streak >= 7,
      totalQuestions >= 500,
      totalTests >= 10,
      accuracy >= 90 && attempted > 0,
    ].filter(Boolean).length;

    // Rank users by total score. This is calculated from stored attempts and
    // therefore reflects real performance without storing a separate rank.
    const leaderboard = await MockTestAttempt.aggregate([
      {
        $group: {
          _id: "$user",
          totalScore: { $sum: "$score" },
        },
      },
      { $sort: { totalScore: -1, _id: 1 } },
    ]);

    const rankIndex = leaderboard.findIndex((item) => String(item._id) === String(userId));
    const leaderboardRank = rankIndex >= 0 ? rankIndex + 1 : null;

    const recentTests = attempts.slice(0, 10).map((item) => ({
      title: item.exam || "Mock Test",
      date: item.createdAt
        ? new Date(item.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "—",
      questions: item.totalQuestions || 0,
      correct: item.correct || 0,
      wrong: item.wrong || 0,
      skipped: item.skipped || 0,
      score: item.score || 0,
      maxScore: item.maxScore || 0,
      accuracy: item.accuracy || 0,
    }));

    return res.status(200).json({
      success: true,
      stats: {
        totalTests,
        totalQuestions,
        correct,
        wrong,
        skipped,
        attempted,
        totalScore,
        maxScore,
        accuracy,
        streak,
        leaderboardRank,
        badges,
        weeklyActivity,
        weeklyAccuracy,
        subjectPerformance,
        recentTests,
      },
    });
  } catch (error) {
    console.error("Get Profile Stats Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while loading profile stats.",
      error: error.message,
    });
  }
};

module.exports = {
  getProfileStats,
};

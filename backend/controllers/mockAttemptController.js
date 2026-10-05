const MockTestAttempt = require("../models/MockTestAttempt");

const saveMockTestAttempt = async (req, res) => {
  try {
    const {
      testConfig,
      questions = [],
      answers = {},
      timeTakenSeconds = 0,
    } = req.body;

    if (!testConfig) {
      return res.status(400).json({
        success: false,
        message: "Test configuration is required.",
      });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Questions are required.",
      });
    }

    const totalQuestions = questions.length;

    let attempted = 0;
    let correct = 0;
    let wrong = 0;
    let skipped = 0;

    const processedQuestions = questions.map((question, index) => {
      const selectedAnswer =
        answers[index] !== undefined
          ? Number(answers[index])
          : null;

      const correctAnswer =
        Number.isInteger(question.answer)
          ? question.answer
          : Number.isInteger(question.correctAnswer)
            ? question.correctAnswer
            : -1;

      const isSkipped = selectedAnswer === null;
      const isCorrect =
        !isSkipped &&
        correctAnswer >= 0 &&
        selectedAnswer === correctAnswer;

      if (isSkipped) {
        skipped++;
      } else {
        attempted++;

        if (isCorrect) {
          correct++;
        } else {
          wrong++;
        }
      }

      return {
        questionId: question.id || index + 1,
        question: question.question || "",
        options: Array.isArray(question.options)
          ? question.options
          : [],
        correctAnswer,
        selectedAnswer,
        topic:
          question.topic ||
          testConfig.topic ||
          "General",
        explanation: question.explanation || "",
        isCorrect,
        isSkipped,
      };
    });

    // Current mock-test UI uses +4 for correct
    // and -1 for wrong.
    const score = correct * 4 - wrong;

    const maxScore = totalQuestions * 4;

    const accuracy =
      attempted > 0
        ? Math.round((correct / attempted) * 100)
        : 0;

    const attempt = await MockTestAttempt.create({
      user: req.user.id,

      exam:
        testConfig.exam ||
        "Mock Test",

      examSubtitle:
        testConfig.examSubtitle || "",

      subjects:
        Array.isArray(testConfig.subjects)
          ? testConfig.subjects
          : [],

      topic:
        testConfig.topic ||
        "Full Subject",

      difficulty:
        testConfig.difficulty ||
        "Medium",

      language:
        testConfig.language ||
        "English",

      totalQuestions,

      attempted,

      correct,

      wrong,

      skipped,

      score,

      maxScore,

      accuracy,

      timeTakenSeconds:
        Math.max(0, Number(timeTakenSeconds) || 0),

      questions: processedQuestions,
    });

    return res.status(201).json({
      success: true,
      message: "Mock test result saved successfully.",

      attempt: {
        id: attempt._id,
        exam: attempt.exam,
        totalQuestions: attempt.totalQuestions,
        attempted: attempt.attempted,
        correct: attempt.correct,
        wrong: attempt.wrong,
        skipped: attempt.skipped,
        score: attempt.score,
        maxScore: attempt.maxScore,
        accuracy: attempt.accuracy,
        timeTakenSeconds: attempt.timeTakenSeconds,
        createdAt: attempt.createdAt,
      },
    });
  } catch (error) {
    console.error(
      "Save Mock Test Attempt Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while saving the mock test result.",
      error: error.message,
    });
  }
};

module.exports = {
  saveMockTestAttempt,
};
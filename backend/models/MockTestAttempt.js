const mongoose = require("mongoose");

const mockQuestionSchema = new mongoose.Schema(
  {
    questionId: {
      type: Number,
      required: true,
    },

    question: {
      type: String,
      required: true,
    },

    options: {
      type: [String],
      required: true,
    },

    correctAnswer: {
      type: Number,
      required: true,
    },

    selectedAnswer: {
      type: Number,
      default: null,
    },

    topic: {
      type: String,
      default: "General",
    },

    explanation: {
      type: String,
      default: "",
    },

    isCorrect: {
      type: Boolean,
      default: false,
    },

    isSkipped: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const mockTestAttemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    exam: {
      type: String,
      required: true,
    },

    examSubtitle: {
      type: String,
      default: "",
    },

    subjects: {
      type: [String],
      default: [],
    },

    topic: {
      type: String,
      default: "Full Subject",
    },

    difficulty: {
      type: String,
      default: "Medium",
    },

    language: {
      type: String,
      default: "English",
    },

    totalQuestions: {
      type: Number,
      required: true,
    },

    attempted: {
      type: Number,
      default: 0,
    },

    correct: {
      type: Number,
      default: 0,
    },

    wrong: {
      type: Number,
      default: 0,
    },

    skipped: {
      type: Number,
      default: 0,
    },

    score: {
      type: Number,
      default: 0,
    },

    maxScore: {
      type: Number,
      default: 0,
    },

    accuracy: {
      type: Number,
      default: 0,
    },

    timeTakenSeconds: {
      type: Number,
      default: 0,
    },

    questions: {
      type: [mockQuestionSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "MockTestAttempt",
  mockTestAttemptSchema
);
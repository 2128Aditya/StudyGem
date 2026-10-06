const mongoose = require("mongoose");

const currentAffairSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "National",
        "International",
        "Economy",
        "Science & Tech",
        "Defence",
        "Sports",
        "Awards",
        "Appointments",
        "Government Schemes",
        "Environment",
        "Important Places/Reports",
        "Important Facts",
      ],
    },

    summary: {
      type: String,
      required: true,
    },

    importantPoints: {
      type: [String],
      default: [],
    },

    examFocus: {
      type: String,
      default: "",
    },

    source: {
      name: {
        type: String,
        default: "",
      },

      url: {
        type: String,
        default: "",
      },
    },

    publishedAt: {
      type: Date,
      default: null,
    },

    language: {
      english: {
        title: {
          type: String,
          default: "",
        },
        summary: {
          type: String,
          default: "",
        },
        importantPoints: {
          type: [String],
          default: [],
        },
      },

      hinglish: {
        title: {
          type: String,
          default: "",
        },
        summary: {
          type: String,
          default: "",
        },
        importantPoints: {
          type: [String],
          default: [],
        },
      },

      hindi: {
        title: {
          type: String,
          default: "",
        },
        summary: {
          type: String,
          default: "",
        },
        importantPoints: {
          type: [String],
          default: [],
        },
      },
    },

    tags: {
      type: [String],
      default: [],
    },

    sourceId: {
      type: String,
      default: "",
      index: true,
    },

    generatedBy: {
      type: String,
      default: "Groq AI",
    },
  },
  {
    timestamps: true,
  }
);

currentAffairSchema.index({
  date: 1,
  category: 1,
});

currentAffairSchema.index({
  sourceId: 1,
  unique: true,
  sparse: true,
});

module.exports = mongoose.model(
  "CurrentAffair",
  currentAffairSchema
);
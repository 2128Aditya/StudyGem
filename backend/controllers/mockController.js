const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const generateMockQuestions = async (req, res) => {
  try {
    const {
      exam,
      examSubtitle,
      subjects = [],
      topic,
      questionCount = 10,
      difficulty = "Medium",
      language = "English",
    } = req.body;

    // ==========================================
    // BASIC VALIDATION
    // ==========================================

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "Groq API key is not configured.",
      });
    }

    if (!exam) {
      return res.status(400).json({
        success: false,
        message: "Exam is required.",
      });
    }

    if (!Array.isArray(subjects) || subjects.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one subject is required.",
      });
    }

    const count = Math.min(
      Math.max(Number(questionCount) || 10, 1),
      100
    );

    const subjectText = subjects.join(", ");

    // ==========================================
    // AI PROMPT
    // ==========================================

    const prompt = `
You are an expert competitive examination question paper generator for StudyGem.

Your task is to generate exactly ${count} high-quality multiple-choice questions.

EXAM:
${exam}

EXAM TYPE:
${examSubtitle || "Competitive Examination"}

SUBJECTS:
${subjectText}

TOPIC:
${topic || "Full Subject"}

DIFFICULTY:
${difficulty}

LANGUAGE:
${language}

LANGUAGE RULE FOR EXPLANATIONS:

The explanation MUST be written in the same language selected above.

If LANGUAGE is "English":
- Write the explanation completely in English.

If LANGUAGE is "Hindi":
- Write the explanation in Hindi using Devanagari script.
- Do not write the explanation in English.

If LANGUAGE is "Hinglish":
- Write the explanation in natural Hinglish using Roman/English alphabet.
- Explain the concept in simple Hindi mixed with commonly used English technical terms.
- Do NOT use Devanagari script.

IMPORTANT:
The question explanation language must exactly match the selected test language.
Do not use English explanations when Hindi or Hinglish is selected.
IMPORTANT REQUIREMENTS:

1. Generate exactly ${count} questions.
2. Every question must have exactly 4 options.
3. There must be exactly one correct option.
4. correctAnswer must be an integer:
   0 = first option
   1 = second option
   2 = third option
   3 = fourth option
5. Questions must be directly relevant to the selected exam.
6. Questions must be relevant to the selected subject and topic.
7. Match the requested difficulty level.
8. Do not repeat questions.
9. Do not create duplicate options.
10. Avoid ambiguous questions.
11. Do not invent fake facts.
12. Calculation questions must have mathematically correct answers.
13. Competitive examination questions should be exam-oriented.
14. Each question must have a short, useful explanation.
15. The requested language must be respected.
16. Return only the requested structured data.
17. Do not add extra fields.
18. Do not add markdown.
19. Do not add commentary outside the structured response.
20. The explanation must be in the selected test language.
21. The explanation must clearly explain why the correct answer is correct.
22. Do not change the explanation language based on the subject.
23. Keep technical terms in English where they are commonly used, especially in Hinglish.

Generate exactly ${count} questions.
`;

    // ==========================================
    // GROQ STRUCTURED OUTPUT
    // ==========================================

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",

      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],

      temperature: 0.4,

      reasoning_effort: "low",

      reasoning_format: "hidden",

      max_completion_tokens: Math.min(
        Math.max(count * 350, 4000),
        20000
      ),

      response_format: {
        type: "json_schema",

        json_schema: {
          name: "study_gem_mock_test",

          strict: true,

          schema: {
            type: "object",

            properties: {
              questions: {
                type: "array",

                items: {
                  type: "object",

                  properties: {
                    question: {
                      type: "string",
                    },

                    options: {
                      type: "array",

                      items: {
                        type: "string",
                      },
                    },

                    correctAnswer: {
                      type: "integer",
                      enum: [0, 1, 2, 3],
                    },

                    explanation: {
                      type: "string",
                    },

                    topic: {
                      type: "string",
                    },
                  },

                  required: [
                    "question",
                    "options",
                    "correctAnswer",
                    "explanation",
                    "topic",
                  ],

                  additionalProperties: false,
                },
              },
            },

            required: ["questions"],

            additionalProperties: false,
          },
        },
      },
    });

    // ==========================================
    // GET AI RESPONSE
    // ==========================================

    const rawContent =
      completion?.choices?.[0]?.message?.content;

    if (!rawContent) {
      console.error("Empty Groq response:", completion);

      return res.status(500).json({
        success: false,
        message: "AI returned an empty response.",
      });
    }

    // ==========================================
    // PARSE JSON
    // ==========================================

    let parsed;

    try {
      parsed =
        typeof rawContent === "string"
          ? JSON.parse(rawContent)
          : rawContent;
    } catch (parseError) {
      console.error("AI JSON Parse Error:", parseError);
      console.error("Raw AI Response:", rawContent);

      return res.status(500).json({
        success: false,
        message: "AI returned invalid question data.",
      });
    }

    // ==========================================
    // VALIDATE QUESTIONS ARRAY
    // ==========================================

    if (
      !parsed ||
      !Array.isArray(parsed.questions)
    ) {
      return res.status(500).json({
        success: false,
        message: "AI response does not contain valid questions.",
      });
    }

    // ==========================================
    // EXACT QUESTION COUNT CHECK
    // ==========================================

    if (parsed.questions.length !== count) {
      console.error(
        `Expected ${count} questions but received ${parsed.questions.length}`
      );

      return res.status(500).json({
        success: false,
        message: `AI generated ${parsed.questions.length} questions instead of ${count}. Please try again.`,
      });
    }

    // ==========================================
    // QUESTION VALIDATION
    // ==========================================

    const validQuestions = parsed.questions.every(
      (item) => {
        return (
          item &&
          typeof item.question === "string" &&
          item.question.trim().length > 0 &&

          Array.isArray(item.options) &&
          item.options.length === 4 &&

          item.options.every(
            (option) =>
              typeof option === "string" &&
              option.trim().length > 0
          ) &&

          Number.isInteger(item.correctAnswer) &&
          item.correctAnswer >= 0 &&
          item.correctAnswer <= 3 &&

          typeof item.explanation === "string" &&
          item.explanation.trim().length > 0 &&

          typeof item.topic === "string"
        );
      }
    );

    if (!validQuestions) {
      console.error(
        "Invalid question structure:",
        parsed.questions
      );

      return res.status(500).json({
        success: false,
        message: "AI generated an invalid question format.",
      });
    }

    // ==========================================
    // CHECK DUPLICATE QUESTIONS
    // ==========================================

    const normalizedQuestions =
      parsed.questions.map((item) =>
        item.question
          .trim()
          .toLowerCase()
      );

    const uniqueQuestions =
      new Set(normalizedQuestions);

    if (
      uniqueQuestions.size !==
      normalizedQuestions.length
    ) {
      return res.status(500).json({
        success: false,
        message:
          "AI generated duplicate questions. Please try again.",
      });
    }

    // ==========================================
    // FINAL QUESTION FORMAT
    // ==========================================

    const questions = parsed.questions.map(
      (item, index) => ({
        id: index + 1,

        topic:
          item.topic?.trim() ||
          topic ||
          "General",

        question:
          item.question.trim(),

        options:
          item.options.map((option) =>
            option.trim()
          ),

        answer:
          item.correctAnswer,

        explanation:
          item.explanation.trim(),
      })
    );

    // ==========================================
    // SUCCESS RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,

      message:
        "Mock test generated successfully.",

      config: {
        exam,
        examSubtitle,
        subjects,
        topic:
          topic || "Full Subject",
        questionCount: count,
        difficulty,
        language,
      },

      questions,
    });
  } catch (error) {
    // ==========================================
    // ERROR HANDLING
    // ==========================================

    console.error(
      "Generate Mock Questions Error:",
      error
    );

    if (error?.status === 400) {
      return res.status(400).json({
        success: false,
        message:
          error?.error?.error?.message ||
          error?.message ||
          "Groq rejected the request.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Something went wrong while generating the mock test.",
    });
  }
};

module.exports = {
  generateMockQuestions,
};
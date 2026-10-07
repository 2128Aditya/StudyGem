const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// =====================================================
// HELPERS
// =====================================================

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const normalizeQuestion = (question) => {
  return String(question || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[?.!,;:]+$/g, "");
};

const isValidQuestion = (item) => {
  if (!item || typeof item !== "object") {
    return false;
  }

  if (
    typeof item.question !== "string" ||
    !item.question.trim()
  ) {
    return false;
  }

  if (
    !Array.isArray(item.options) ||
    item.options.length !== 4
  ) {
    return false;
  }

  const validOptions = item.options.every(
    (option) =>
      typeof option === "string" &&
      option.trim().length > 0
  );

  if (!validOptions) {
    return false;
  }

  // Duplicate options check
  const normalizedOptions = item.options.map((option) =>
    option.trim().toLowerCase()
  );

  if (
    new Set(normalizedOptions).size !==
    normalizedOptions.length
  ) {
    return false;
  }

  if (
    !Number.isInteger(item.correctAnswer) ||
    item.correctAnswer < 0 ||
    item.correctAnswer > 3
  ) {
    return false;
  }

  if (
    typeof item.explanation !== "string" ||
    !item.explanation.trim()
  ) {
    return false;
  }

  if (
    typeof item.topic !== "string" ||
    !item.topic.trim()
  ) {
    return false;
  }

  return true;
};

// =====================================================
// GENERATE ONE BATCH
// =====================================================

const generateQuestionBatch = async ({
  exam,
  examSubtitle,
  subjects,
  topic,
  difficulty,
  language,
  batchCount,
}) => {
  const subjectText = subjects.join(", ");

  const prompt = `
You are an expert competitive examination question paper generator for StudyGem.

Generate a batch of multiple-choice questions.

TARGET NUMBER:
${batchCount}

IMPORTANT:
Generate at least ${batchCount} valid questions.
You may generate 1 or 2 extra questions if needed, but never generate fewer than ${batchCount}.

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

==================================================
QUESTION REQUIREMENTS
==================================================

1. Every question must be relevant to the selected exam.
2. Every question must be relevant to the selected subject/topic.
3. Match the requested difficulty.
4. Every question must have exactly 4 options.
5. There must be exactly one correct answer.
6. correctAnswer must be:
   0 = first option
   1 = second option
   2 = third option
   3 = fourth option
7. Do not repeat questions.
8. Do not create duplicate options.
9. Avoid ambiguous questions.
10. Do not invent fake facts.
11. Calculation questions must have mathematically correct answers.
12. Questions should be exam-oriented.
13. Every question must have a useful explanation.
14. Return only structured data.
15. Do not add markdown.
16. Do not add commentary.

==================================================
LANGUAGE RULES
==================================================

The explanation must follow the selected language.

If LANGUAGE is "English":
Write the explanation completely in English.

If LANGUAGE is "Hindi":
Write the explanation in Hindi using Devanagari script.

If LANGUAGE is "Hinglish":
Write the explanation in natural Hinglish using Roman/English alphabet.
Do not use Devanagari script.

Do not change explanation language based on the subject.

==================================================
IMPORTANT
==================================================

Generate at least ${batchCount} valid questions.

Make every question different.

Do not return fewer than ${batchCount} questions.
`;

  const completion =
    await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",

      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],

      temperature: 0.3,

      reasoning_effort: "low",

      reasoning_format: "hidden",

      max_completion_tokens: Math.min(
        Math.max(batchCount * 350, 5000),
        12000
      ),

      response_format: {
        type: "json_schema",

        json_schema: {
          name: "study_gem_mock_batch",

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

  const rawContent =
    completion?.choices?.[0]?.message?.content;

  if (!rawContent) {
    throw new Error(
      "AI returned an empty response."
    );
  }

  let parsed;

  try {
    parsed =
      typeof rawContent === "string"
        ? JSON.parse(rawContent)
        : rawContent;
  } catch (error) {
    console.error(
      "AI JSON Parse Error:",
      error
    );

    console.error(
      "Raw AI Response:",
      rawContent
    );

    throw new Error(
      "AI returned invalid question data."
    );
  }

  if (
    !parsed ||
    !Array.isArray(parsed.questions)
  ) {
    throw new Error(
      "AI response does not contain valid questions."
    );
  }

  return parsed.questions;
};

// =====================================================
// MAIN CONTROLLER
// =====================================================

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

    // =================================================
    // BASIC VALIDATION
    // =================================================

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        success: false,
        message:
          "Groq API key is not configured.",
      });
    }

    if (!exam) {
      return res.status(400).json({
        success: false,
        message: "Exam is required.",
      });
    }

    if (
      !Array.isArray(subjects) ||
      subjects.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "At least one subject is required.",
      });
    }

    const count = Math.min(
      Math.max(
        Number(questionCount) || 10,
        1
      ),
      100
    );

    // =================================================
    // BATCH SETTINGS
    // =================================================

    // Maximum 20 questions per AI request.
    // This makes 50/100 question tests much more reliable.
    const batchSize = 20;

    const totalBatches = Math.ceil(
      count / batchSize
    );

    const allQuestions = [];

    const globalQuestionSet = new Set();

    // =================================================
    // GENERATE BATCHES
    // =================================================

    for (
      let batchIndex = 0;
      batchIndex < totalBatches;
      batchIndex++
    ) {
      const remaining =
        count - allQuestions.length;

      const targetForBatch = Math.min(
        batchSize,
        remaining
      );

      let batchQuestions = [];

      // Retry each batch up to 3 times.
      for (
        let attempt = 1;
        attempt <= 3;
        attempt++
      ) {
        try {
          console.log(
            `Generating batch ${
              batchIndex + 1
            }/${totalBatches} - target: ${targetForBatch} - attempt: ${attempt}`
          );

          const generated =
            await generateQuestionBatch({
              exam,
              examSubtitle,
              subjects,
              topic,
              difficulty,
              language,
              batchCount:
                targetForBatch,
            });

          // =========================================
          // FILTER VALID QUESTIONS
          // =========================================

          const validQuestions =
            generated.filter(
              isValidQuestion
            );

          // =========================================
          // REMOVE DUPLICATES
          // =========================================

          const uniqueBatchQuestions = [];

          const localSet = new Set();

          for (const item of validQuestions) {
            const normalized =
              normalizeQuestion(
                item.question
              );

            if (!normalized) {
              continue;
            }

            // Duplicate inside current batch
            if (localSet.has(normalized)) {
              continue;
            }

            // Duplicate with previous batches
            if (
              globalQuestionSet.has(
                normalized
              )
            ) {
              continue;
            }

            localSet.add(normalized);

            uniqueBatchQuestions.push(
              item
            );
          }

          // =========================================
          // IMPORTANT:
          // AI may return 21 when we asked for 20.
          // We simply take the required number.
          // =========================================

          if (
            uniqueBatchQuestions.length >=
            targetForBatch
          ) {
            batchQuestions =
              uniqueBatchQuestions.slice(
                0,
                targetForBatch
              );

            break;
          }

          console.warn(
            `Batch ${
              batchIndex + 1
            } returned only ${
              uniqueBatchQuestions.length
            } valid unique questions. Expected ${targetForBatch}.`
          );

          batchQuestions =
            uniqueBatchQuestions;

          if (attempt < 3) {
            await sleep(1000);
          }
        } catch (error) {
          console.error(
            `Batch ${
              batchIndex + 1
            } attempt ${attempt} failed:`,
            error
          );

          if (attempt < 3) {
            await sleep(1500);
          }
        }
      }

      // =================================================
      // BATCH FAILED
      // =================================================

      if (
        batchQuestions.length <
        targetForBatch
      ) {
        console.error(
          `Unable to generate enough questions for batch ${
            batchIndex + 1
          }.`
        );

        return res.status(502).json({
          success: false,
          message:
            `AI could not generate enough valid questions for this mock test. Generated ${allQuestions.length + batchQuestions.length} of ${count}. Please try again.`,
        });
      }

      // =================================================
      // ADD BATCH TO FINAL ARRAY
      // =================================================

      for (const item of batchQuestions) {
        const normalized =
          normalizeQuestion(
            item.question
          );

        if (
          globalQuestionSet.has(
            normalized
          )
        ) {
          continue;
        }

        globalQuestionSet.add(
          normalized
        );

        allQuestions.push(item);
      }

      console.log(
        `Batch ${
          batchIndex + 1
        } completed. Total questions: ${allQuestions.length}/${count}`
      );
    }

    // =================================================
    // FINAL EXACT COUNT
    // =================================================

    const finalQuestions =
      allQuestions.slice(0, count);

    if (
      finalQuestions.length !== count
    ) {
      console.error(
        `Final question count mismatch. Expected ${count}, received ${finalQuestions.length}`
      );

      return res.status(502).json({
        success: false,
        message:
          `AI generated ${finalQuestions.length} valid questions instead of ${count}. Please try again.`,
      });
    }

    // =================================================
    // FINAL VALIDATION
    // =================================================

    const finalNormalized =
      finalQuestions.map((item) =>
        normalizeQuestion(
          item.question
        )
      );

    const finalUniqueSet =
      new Set(finalNormalized);

    if (
      finalUniqueSet.size !==
      finalNormalized.length
    ) {
      return res.status(502).json({
        success: false,
        message:
          "AI generated duplicate questions. Please try again.",
      });
    }

    // =================================================
    // FINAL FORMAT
    // =================================================

    const questions =
      finalQuestions.map(
        (item, index) => ({
          id: index + 1,

          topic:
            item.topic?.trim() ||
            topic ||
            "General",

          question:
            item.question.trim(),

          options:
            item.options.map(
              (option) =>
                option.trim()
            ),

          answer:
            item.correctAnswer,

          explanation:
            item.explanation.trim(),
        })
      );

    // =================================================
    // SUCCESS
    // =================================================

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
    // =================================================
    // ERROR HANDLING
    // =================================================

    console.error(
      "Generate Mock Questions Error:",
      error
    );

    if (error?.status === 400) {
      return res.status(400).json({
        success: false,

        message:
          error?.error?.error?.message ||
          error?.error?.message ||
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
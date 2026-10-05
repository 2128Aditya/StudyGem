const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const generateRoadmap = async (req, res) => {
  try {
    const {
      learning,
      level,
      goal,
      dailyTime,
      targetDate,
      duration,
      focusAreas = [],
      preferences,
      currentSkills,
      weakAreas,
      resources,
    } = req.body;

    // ==========================================
    // VALIDATION
    // ==========================================

    if (
      !learning ||
      !level ||
      !goal ||
      !dailyTime ||
      !duration ||
      !Array.isArray(focusAreas) ||
      focusAreas.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Learning, level, goal, daily time, duration and focus areas are required.",
      });
    }

    // ==========================================
    // USER INFORMATION
    // ==========================================

    const userName =
      req.user?.name ||
      req.user?.fullName ||
      req.user?.username ||
      "Student";

    // ==========================================
    // AI PROMPT
    // ==========================================

    const systemPrompt = `
You are StudyGem AI Roadmap Generator.

Your job is to create a highly personalized, practical and realistic learning roadmap for a student.

You MUST return ONLY valid JSON.
Do not return Markdown.
Do not use code fences.
Do not add explanations outside JSON.

The roadmap will be directly rendered inside a React application.

IMPORTANT:
- Personalize the roadmap according to every detail provided by the student.
- Do not create a generic roadmap.
- Respect the student's current level.
- Respect the available daily study time.
- Respect the requested duration.
- Respect the student's goal.
- Give realistic weekly tasks.
- Include theory, practice and projects according to focus areas.
- Include revision.
- Include interview/exam preparation according to the goal.
- Consider weak areas.
- Consider current skills.
- Consider learning preferences.
- Recommend useful resources.
- Make the roadmap practical enough that a student can actually follow it.
- Do not overload the student beyond the stated daily study time.
- If duration is short, prioritize high-value topics.
- If duration is long, gradually increase difficulty.
- Do not repeat the same tasks unnecessarily.
- For government exams, emphasize exam-oriented preparation.
- For placement/job goals, emphasize DSA, projects, CS fundamentals, resume and interview preparation where relevant.
- For development goals, emphasize projects and hands-on implementation.
- For AI/ML goals, include mathematics, Python, ML fundamentals, projects and model evaluation where relevant.
- For DSA goals, include patterns, problem solving, complexity and progressive difficulty.
- If the user enters a custom learning topic, adapt completely to that topic.

Student name:
${userName}

Student input:

Learning:
${learning}

Current Level:
${level}

Main Goal:
${goal}

Daily Study Time:
${dailyTime}

Target Date:
${targetDate || "Not specified"}

Duration:
${duration}

Focus Areas:
${focusAreas.join(", ")}

Learning Preferences:
${preferences || "Not specified"}

Current Skills:
${currentSkills || "Not specified"}

Weak Areas:
${weakAreas || "Not specified"}

Preferred Resources:
${resources || "Mixed resources"}

Return exactly this JSON structure:

{
  "title": "string",
  "summary": "string",
  "duration": "string",
  "dailyTime": "string",
  "goal": "string",
  "level": "string",

  "objective": "string",
  "successMetric": "string",
  "strategy": "string",

  "phases": [
    {
      "title": "string",
      "duration": "string",
      "focus": "string",
      "description": "string",
      "topics": [
        "string",
        "string",
        "string",
        "string"
      ],
      "tasks": [
        "string",
        "string",
        "string",
        "string"
      ],
      "milestone": "string"
    }
  ],

  "weeklyPlan": [
    {
      "title": "string",
      "focus": "string",
      "hours": "string",
      "tasks": [
        "string",
        "string",
        "string",
        "string"
      ]
    }
  ],

  "dailyRoutine": [
    {
      "title": "string",
      "duration": "string",
      "description": "string"
    }
  ],

  "projects": [
    {
      "title": "string",
      "level": "string",
      "duration": "string",
      "description": "string",
      "skills": [
        "string",
        "string",
        "string",
        "string"
      ]
    }
  ],

  "resources": [
    {
      "name": "string",
      "description": "string",
      "url": "string"
    }
  ],

  "interviewPrep": [
    {
      "title": "string",
      "description": "string"
    }
  ],

  "milestones": [
    {
      "title": "string",
      "time": "string",
      "description": "string"
    }
  ],

  "finalTips": [
    "string",
    "string",
    "string",
    "string",
    "string",
    "string"
  ]
}

RULES FOR COUNTS:

- phases: 4 to 6
- weeklyPlan: 4 to 12 depending on duration
- dailyRoutine: exactly 4
- projects: 2 to 4
- resources: 4 to 6
- interviewPrep: 3 to 5
- milestones: 4 to 6
- finalTips: 5 to 7
- Each phase should contain 4 to 6 topics.
- Each phase should contain 4 to 6 tasks.
- Each weekly plan should contain 4 to 5 tasks.
`;

    // ==========================================
    // GROQ AI
    // ==========================================

    const completion =
      await groq.chat.completions.create({
        model: "openai/gpt-oss-120b",

        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content:
              "Create the personalized StudyGem roadmap from the student information above.",
          },
        ],

        temperature: 0.35,

        max_tokens: 12000,

        response_format: {
          type: "json_object",
        },
      });

    // ==========================================
    // GET AI RESPONSE
    // ==========================================

    const rawResponse =
      completion.choices?.[0]?.message?.content?.trim();

    if (!rawResponse) {
      return res.status(500).json({
        success: false,
        message: "AI returned an empty roadmap.",
      });
    }

    // ==========================================
    // PARSE JSON
    // ==========================================

    let roadmap;

    try {
      roadmap = JSON.parse(rawResponse);
    } catch (parseError) {
      console.error(
        "Roadmap JSON Parse Error:",
        parseError
      );

      console.error(
        "Raw AI Response:",
        rawResponse
      );

      return res.status(500).json({
        success: false,
        message:
          "AI generated an invalid roadmap format. Please try again.",
      });
    }

    // ==========================================
    // BASIC STRUCTURE SAFETY
    // ==========================================

    roadmap.phases = Array.isArray(roadmap.phases)
      ? roadmap.phases
      : [];

    roadmap.weeklyPlan = Array.isArray(
      roadmap.weeklyPlan
    )
      ? roadmap.weeklyPlan
      : [];

    roadmap.dailyRoutine = Array.isArray(
      roadmap.dailyRoutine
    )
      ? roadmap.dailyRoutine
      : [];

    roadmap.projects = Array.isArray(
      roadmap.projects
    )
      ? roadmap.projects
      : [];

    roadmap.resources = Array.isArray(
      roadmap.resources
    )
      ? roadmap.resources
      : [];

    roadmap.interviewPrep = Array.isArray(
      roadmap.interviewPrep
    )
      ? roadmap.interviewPrep
      : [];

    roadmap.milestones = Array.isArray(
      roadmap.milestones
    )
      ? roadmap.milestones
      : [];

    roadmap.finalTips = Array.isArray(
      roadmap.finalTips
    )
      ? roadmap.finalTips
      : [];

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,
      message: "Roadmap generated successfully.",
      roadmap,
    });
  } catch (error) {
    console.error(
      "StudyGem Roadmap AI Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to generate roadmap right now.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

module.exports = {
  generateRoadmap,
};
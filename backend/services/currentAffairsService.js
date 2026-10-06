const Parser = require("rss-parser");
const Groq = require("groq-sdk");
const CurrentAffair = require("../models/CurrentAffair");

const parser = new Parser({
  timeout: 15000,
  headers: {
    "User-Agent": "StudyGem-Current-Affairs/1.0",
  },
});

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/*
========================================================
GOOGLE NEWS RSS FEEDS
========================================================
*/

const RSS_FEEDS = [
  // NATIONAL
  {
    name: "Google News - India",
    categoryHint: "National",
    url: "https://news.google.com/rss/search?q=India%20when%3A1d&hl=en-IN&gl=IN&ceid=IN%3Aen",
  },

  {
    name: "Google News - Indian Government",
    categoryHint: "National",
    url: "https://news.google.com/rss/search?q=India%20government%20when%3A1d&hl=en-IN&gl=IN&ceid=IN%3Aen",
  },

  // INTERNATIONAL
  {
    name: "Google News - International",
    categoryHint: "International",
    url: "https://news.google.com/rss/search?q=world%20when%3A1d&hl=en-IN&gl=IN&ceid=IN%3Aen",
  },

  {
    name: "Google News - International Affairs",
    categoryHint: "International",
    url: "https://news.google.com/rss/search?q=international%20affairs%20India%20when%3A1d&hl=en-IN&gl=IN&ceid=IN%3Aen",
  },

  // ECONOMY
  {
    name: "Google News - Economy",
    categoryHint: "Economy",
    url: "https://news.google.com/rss/search?q=India%20economy%20when%3A1d&hl=en-IN&gl=IN&ceid=IN%3Aen",
  },

  {
    name: "Google News - Banking Finance",
    categoryHint: "Economy",
    url: "https://news.google.com/rss/search?q=India%20banking%20finance%20RBI%20when%3A1d&hl=en-IN&gl=IN&ceid=IN%3Aen",
  },

  // SCIENCE & TECHNOLOGY
  {
    name: "Google News - Science",
    categoryHint: "Science & Tech",
    url: "https://news.google.com/rss/search?q=India%20science%20technology%20when%3A1d&hl=en-IN&gl=IN&ceid=IN%3Aen",
  },

  {
    name: "Google News - Space",
    categoryHint: "Science & Tech",
    url: "https://news.google.com/rss/search?q=ISRO%20space%20technology%20when%3A1d&hl=en-IN&gl=IN&ceid=IN%3Aen",
  },

  // DEFENCE
  {
    name: "Google News - Defence",
    categoryHint: "Defence",
    url: "https://news.google.com/rss/search?q=India%20defence%20when%3A1d&hl=en-IN&gl=IN&ceid=IN%3Aen",
  },

  {
    name: "Google News - Defence Ministry",
    categoryHint: "Defence",
    url: "https://news.google.com/rss/search?q=India%20defence%20ministry%20when%3A1d&hl=en-IN&gl=IN&ceid=IN%3Aen",
  },

  // SPORTS
  {
    name: "Google News - Sports",
    categoryHint: "Sports",
    url: "https://news.google.com/rss/search?q=India%20sports%20when%3A1d&hl=en-IN&gl=IN&ceid=IN%3Aen",
  },

  {
    name: "Google News - Cricket",
    categoryHint: "Sports",
    url: "https://news.google.com/rss/search?q=India%20cricket%20when%3A1d&hl=en-IN&gl=IN&ceid=IN%3Aen",
  },

  // AWARDS
  {
    name: "Google News - Awards India",
    categoryHint: "Awards",
    url: "https://news.google.com/rss/search?q=India%20awards%20honours%20when%3A1d&hl=en-IN&gl=IN&ceid=IN%3Aen",
  },

  {
    name: "Google News - National Awards",
    categoryHint: "Awards",
    url: "https://news.google.com/rss/search?q=India%20national%20award%20winner%20when%3A1d&hl=en-IN&gl=IN&ceid=IN%3Aen",
  },

  // APPOINTMENTS
  {
    name: "Google News - Appointments India",
    categoryHint: "Appointments",
    url: "https://news.google.com/rss/search?q=India%20new%20appointment%20chairman%20CEO%20director%20when%3A1d&hl=en-IN&gl=IN&ceid=IN%3Aen",
  },

  {
    name: "Google News - Government Appointments",
    categoryHint: "Appointments",
    url: "https://news.google.com/rss/search?q=India%20government%20appointment%20new%20chief%20chairman%20when%3A1d&hl=en-IN&gl=IN&ceid=IN%3Aen",
  },

  {
    name: "Google News - Important Appointments",
    categoryHint: "Appointments",
    url: "https://news.google.com/rss/search?q=India%20appointed%20as%20new%20when%3A1d&hl=en-IN&gl=IN&ceid=IN%3Aen",
  },

  // GOVERNMENT SCHEMES
  {
    name: "Google News - Government Schemes",
    categoryHint: "Government Schemes",
    url: "https://news.google.com/rss/search?q=India%20government%20scheme%20when%3A1d&hl=en-IN&gl=IN&ceid=IN%3Aen",
  },

  {
    name: "Google News - Government Policies",
    categoryHint: "Government Schemes",
    url: "https://news.google.com/rss/search?q=India%20government%20policy%20initiative%20when%3A1d&hl=en-IN&gl=IN&ceid=IN%3Aen",
  },

  // ENVIRONMENT
  {
    name: "Google News - Environment",
    categoryHint: "Environment",
    url: "https://news.google.com/rss/search?q=India%20environment%20climate%20when%3A1d&hl=en-IN&gl=IN&ceid=IN%3Aen",
  },

  {
    name: "Google News - Climate",
    categoryHint: "Environment",
    url: "https://news.google.com/rss/search?q=India%20climate%20environment%20when%3A1d&hl=en-IN&gl=IN&ceid=IN%3Aen",
  },

  // REPORTS / INDEX / PLACES
  {
    name: "Google News - Reports and Index",
    categoryHint: "Important Places/Reports",
    url: "https://news.google.com/rss/search?q=India%20report%20index%20ranking%20when%3A1d&hl=en-IN&gl=IN&ceid=IN%3Aen",
  },

  {
    name: "Google News - Important Places",
    categoryHint: "Important Places/Reports",
    url: "https://news.google.com/rss/search?q=India%20important%20place%20UNESCO%20report%20when%3A1d&hl=en-IN&gl=IN&ceid=IN%3Aen",
  },

  // IMPORTANT FACTS
  {
    name: "Google News - Important Facts",
    categoryHint: "Important Facts",
    url: "https://news.google.com/rss/search?q=India%20record%20ranking%20milestone%20when%3A1d&hl=en-IN&gl=IN&ceid=IN%3Aen",
  },

  {
    name: "Google News - Facts and Figures",
    categoryHint: "Important Facts",
    url: "https://news.google.com/rss/search?q=India%20statistics%20figures%20achievement%20when%3A1d&hl=en-IN&gl=IN&ceid=IN%3Aen",
  },
];

/*
========================================================
ALLOWED CATEGORIES
========================================================
*/

const ALLOWED_CATEGORIES = [
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
];

/*
========================================================
HELPER FUNCTIONS
========================================================
*/

function getTodayDate() {
  const now = new Date();

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
  }).format(now);
}

function cleanText(text = "") {
  return String(text)
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function createSourceId(item) {
  const raw =
    item.guid ||
    item.id ||
    item.link ||
    `${item.title || ""}-${item.pubDate || ""}`;

  return raw
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .slice(0, 300);
}

function isValidDate(date) {
  if (!date) return false;

  const parsed = new Date(date);

  return !Number.isNaN(parsed.getTime());
}

/*
========================================================
FETCH RSS NEWS
========================================================
*/

async function fetchRSSNews() {
  const allNews = [];

  for (const feed of RSS_FEEDS) {
    try {
      console.log(`Fetching RSS: ${feed.name}`);

      const result = await parser.parseURL(feed.url);

      const items = Array.isArray(result.items)
        ? result.items.slice(0, 12)
        : [];

      console.log(
        `${feed.name}: ${items.length} items found`
      );

      for (const item of items) {
        if (!item.title) {
          continue;
        }

        const title = cleanText(item.title);

        const description = cleanText(
          item.contentSnippet ||
            item.content ||
            item.summary ||
            item.description ||
            ""
        );

        const sourceId = createSourceId(item);

        if (!sourceId) {
          continue;
        }

        let pubDate = null;

        if (isValidDate(item.pubDate)) {
          pubDate = new Date(item.pubDate);
        }

        allNews.push({
          title,
          description,
          link: item.link || "",
          pubDate,
          sourceName: feed.name,
          sourceId,
          categoryHint: feed.categoryHint,
        });
      }
    } catch (error) {
      console.error(
        `RSS fetch failed for ${feed.name}:`,
        error.message
      );
    }
  }

  const uniqueNews = [];
  const seen = new Set();

  for (const news of allNews) {
    if (!news.sourceId) {
      continue;
    }

    if (seen.has(news.sourceId)) {
      continue;
    }

    seen.add(news.sourceId);
    uniqueNews.push(news);
  }

  console.log(
    `Total unique RSS news: ${uniqueNews.length}`
  );

  return uniqueNews;
}

/*
========================================================
EXTRACT JSON FROM GROQ
========================================================
*/

function extractJSON(text) {
  if (!text) {
    throw new Error("Empty Groq response");
  }

  let cleaned = text.trim();

  cleaned = cleaned
    .replace(/^```json/i, "")
    .replace(/^```/i, "")
    .replace(/```$/i, "")
    .trim();

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.slice(
      firstBrace,
      lastBrace + 1
    );
  }

  return JSON.parse(cleaned);
}

/*
========================================================
NORMALIZE ARRAY
========================================================
*/

function normalizeArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => String(item).trim())
    .filter(Boolean);
}

/*
========================================================
PROCESS ONE NEWS WITH GROQ
========================================================
*/

async function processWithGroq(news) {
  const prompt = `
You are an expert Current Affairs editor for an Indian competitive-exam platform called StudyGem.

Analyze the following real news item and convert it into ONE concise exam-oriented current affairs entry.

NEWS TITLE:
${news.title}

NEWS DESCRIPTION:
${news.description}

RSS CATEGORY HINT:
${news.categoryHint || "National"}

SOURCE:
${news.sourceName}

IMPORTANT:
The RSS category hint is only a hint.
You must select the most appropriate category from the allowed categories.

Return ONLY valid JSON.

Use exactly this structure:

{
  "title": "",
  "category": "",
  "summary": "",
  "importantPoints": [],
  "examFocus": "",
  "tags": [],
  "english": {
    "title": "",
    "summary": "",
    "importantPoints": []
  },
  "hinglish": {
    "title": "",
    "summary": "",
    "importantPoints": []
  },
  "hindi": {
    "title": "",
    "summary": "",
    "importantPoints": []
  }
}

CATEGORY MUST BE ONE OF:

${ALLOWED_CATEGORIES.join(", ")}

RULES:

1. Do NOT invent facts.
2. Use only information supported by the supplied news.
3. Keep the summary concise and useful for UPSC, SSC, Banking, Railway, Defence and other government exams.
4. Important points should contain 2 to 5 short points.
5. examFocus should mention what an aspirant should remember.
6. English should be clear and formal.
7. Hinglish should naturally mix simple Hindi and English.
8. Hindi should be written in Devanagari.
9. Do not use markdown.
10. Do not add information that is not present in the news.
11. Pick the most appropriate category.
12. If RSS CATEGORY HINT is Appointments, prefer Appointments when the news actually concerns a person being appointed, elected, nominated or taking an important office.
13. If RSS CATEGORY HINT is Awards, prefer Awards when the news concerns a prize, honour, medal or recognition.
14. If RSS CATEGORY HINT is Important Places/Reports, prefer that category when the main topic is a report, index, ranking, survey, important location or publication.
15. If RSS CATEGORY HINT is Important Facts, use Important Facts only when the news contains an important number, record, ranking, milestone, statistic, achievement or exam-useful fact.
16. Never force a category if the news clearly belongs somewhere else.
`;

  const completion =
    await groq.chat.completions.create({
      model:
        process.env.GROQ_MODEL ||
        "openai/gpt-oss-120b",

      temperature: 0.2,

      messages: [
        {
          role: "system",
          content:
            "You are a factual current affairs editor. Always return valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

  const content =
    completion?.choices?.[0]?.message?.content || "";

  return extractJSON(content);
}

/*
========================================================
NORMALIZE AI DATA
========================================================
*/

function normalizeAIData(aiData) {
  let category = ALLOWED_CATEGORIES.includes(
    aiData.category
  )
    ? aiData.category
    : "Important Facts";

  const fallbackTitle =
    String(aiData.title || "").trim();

  const fallbackSummary =
    String(aiData.summary || "").trim();

  return {
    title: fallbackTitle,

    category,

    summary: fallbackSummary,

    importantPoints: normalizeArray(
      aiData.importantPoints
    ),

    examFocus:
      String(aiData.examFocus || "").trim(),

    tags: normalizeArray(aiData.tags),

    english: {
      title: String(
        aiData.english?.title ||
          aiData.title ||
          ""
      ).trim(),

      summary: String(
        aiData.english?.summary ||
          aiData.summary ||
          ""
      ).trim(),

      importantPoints: normalizeArray(
        aiData.english?.importantPoints ||
          aiData.importantPoints
      ),
    },

    hinglish: {
      title: String(
        aiData.hinglish?.title ||
          aiData.title ||
          ""
      ).trim(),

      summary: String(
        aiData.hinglish?.summary ||
          aiData.summary ||
          ""
      ).trim(),

      importantPoints: normalizeArray(
        aiData.hinglish?.importantPoints ||
          aiData.importantPoints
      ),
    },

    hindi: {
      title: String(
        aiData.hindi?.title ||
          aiData.title ||
          ""
      ).trim(),

      summary: String(
        aiData.hindi?.summary ||
          aiData.summary ||
          ""
      ).trim(),

      importantPoints: normalizeArray(
        aiData.hindi?.importantPoints ||
          aiData.importantPoints
      ),
    },
  };
}

/*
========================================================
SAVE CURRENT AFFAIR
========================================================
*/

async function saveCurrentAffair(news, aiData) {
  const normalized = normalizeAIData(aiData);

  if (
    !normalized.title ||
    !normalized.summary
  ) {
    throw new Error(
      "Groq returned incomplete current affair data"
    );
  }

  const today = getTodayDate();

  const currentAffair =
    await CurrentAffair.findOneAndUpdate(
      {
        sourceId: news.sourceId,
      },
      {
        $set: {
          date: today,

          title: normalized.title,

          category: normalized.category,

          summary: normalized.summary,

          importantPoints:
            normalized.importantPoints,

          examFocus: normalized.examFocus,

          source: {
            name: news.sourceName,
            url: news.link,
          },

          publishedAt: news.pubDate,

          language: {
            english: normalized.english,
            hinglish: normalized.hinglish,
            hindi: normalized.hindi,
          },

          tags: normalized.tags,

          generatedBy: "Groq AI",
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

  return currentAffair;
}

/*
========================================================
CREATE CATEGORY FALLBACK
========================================================

This function is used when some important categories
have no direct RSS article.

It DOES NOT invent random news.

It uses already fetched real news as the source
and asks Groq to extract exam-oriented information
for the missing category only when supported.
========================================================
*/

async function generateMissingCategory(
  category,
  availableNews
) {
  if (
    !Array.isArray(availableNews) ||
    availableNews.length === 0
  ) {
    return null;
  }

  const sourceNews = availableNews
    .slice(0, 15)
    .map(
      (item, index) =>
        `${index + 1}.
TITLE: ${item.title}
DESCRIPTION: ${item.description}
SOURCE: ${item.sourceName}`
    )
    .join("\n\n");

  let categoryInstruction = "";

  if (category === "Appointments") {
    categoryInstruction = `
Find only appointment-related information from the supplied news.
Look for people who were appointed, nominated, elected or assigned
to an important position.

If there is NO appointment information in the supplied news,
return:
{
  "available": false
}
`;
  }

  if (category === "Awards") {
    categoryInstruction = `
Find only award, honour, medal, recognition or prize information.
If there is NO supported award information,
return:
{
  "available": false
}
`;
  }

  if (category === "Important Places/Reports") {
    categoryInstruction = `
Find only important reports, indexes, rankings, surveys,
important places or locations mentioned in the supplied news.

If there is NO supported information,
return:
{
  "available": false
}
`;
  }

  if (category === "Important Facts") {
    categoryInstruction = `
Find only exam-useful facts such as:
- important numbers
- records
- rankings
- statistics
- milestones
- achievements
- dates
- figures
- percentages
- quantities

The facts MUST be directly supported by the supplied news.

If there is NO supported fact,
return:
{
  "available": false
}
`;
  }

  if (category === "Government Schemes") {
    categoryInstruction = `
Find only government schemes, policies, programmes
or government initiatives.

If there is NO supported scheme/policy information,
return:
{
  "available": false
}
`;
  }

  const prompt = `
You are creating a special ${category} current affairs entry
for StudyGem.

Today's date:
${getTodayDate()}

${categoryInstruction}

REAL NEWS SOURCES:

${sourceNews}

Return ONLY valid JSON.

If supported information exists, return:

{
  "available": true,
  "title": "",
  "category": "${category}",
  "summary": "",
  "importantPoints": [],
  "examFocus": "",
  "tags": [],
  "english": {
    "title": "",
    "summary": "",
    "importantPoints": []
  },
  "hinglish": {
    "title": "",
    "summary": "",
    "importantPoints": []
  },
  "hindi": {
    "title": "",
    "summary": "",
    "importantPoints": []
  }
}

Rules:

1. NEVER invent information.
2. NEVER use outside knowledge.
3. Use ONLY the supplied real news.
4. Keep it useful for competitive exams.
5. Important points should contain 2 to 5 points.
6. English should be formal.
7. Hinglish should naturally mix Hindi and English.
8. Hindi must be in Devanagari.
9. No markdown.
10. If there is no reliable information for this category, return:
{
  "available": false
}
`;

  try {
    const completion =
      await groq.chat.completions.create({
        model:
          process.env.GROQ_MODEL ||
          "openai/gpt-oss-120b",

        temperature: 0.1,

        messages: [
          {
            role: "system",
            content:
              "You are a factual current affairs editor. Never invent facts.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      });

    const content =
      completion?.choices?.[0]?.message
        ?.content || "";

    const result = extractJSON(content);

    if (!result.available) {
      return null;
    }

    return result;
  } catch (error) {
    console.error(
      `Fallback generation failed for ${category}:`,
      error.message
    );

    return null;
  }
}

/*
========================================================
SAVE FALLBACK CATEGORY
========================================================
*/

async function saveFallbackCategory(
  category,
  aiData,
  sourceNews
) {
  if (!aiData) {
    return null;
  }

  const normalized = normalizeAIData({
    ...aiData,
    category,
  });

  if (
    !normalized.title ||
    !normalized.summary
  ) {
    return null;
  }

  const today = getTodayDate();

  const source =
    sourceNews?.[0] || {};

  const sourceId =
    `ai-${category
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")}-${today}`;

  const saved =
    await CurrentAffair.findOneAndUpdate(
      {
        sourceId,
      },
      {
        $set: {
          date: today,

          title: normalized.title,

          category,

          summary: normalized.summary,

          importantPoints:
            normalized.importantPoints,

          examFocus: normalized.examFocus,

          source: {
            name:
              source.sourceName ||
              "StudyGem AI Current Affairs",
            url: source.link || "",
          },

          publishedAt:
            source.pubDate || new Date(),

          language: {
            english: normalized.english,
            hinglish: normalized.hinglish,
            hindi: normalized.hindi,
          },

          tags: normalized.tags,

          generatedBy: "Groq AI",
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

  return saved;
}

/*
========================================================
ENSURE IMPORTANT CATEGORIES
========================================================
*/

async function ensureImportantCategories(
  newsItems
) {
  const today = getTodayDate();

  const importantCategories = [
    "Appointments",
    "Awards",
    "Government Schemes",
    "Important Places/Reports",
    "Important Facts",
  ];

  const existingCategories =
    await CurrentAffair.find({
      date: today,
      category: {
        $in: importantCategories,
      },
    })
      .select("category")
      .lean();

  const existingSet = new Set(
    existingCategories.map(
      (item) => item.category
    )
  );

  let generated = 0;

  for (const category of importantCategories) {
    if (existingSet.has(category)) {
      continue;
    }

    console.log(
      `No ${category} found today. Trying AI fallback...`
    );

    const aiData =
      await generateMissingCategory(
        category,
        newsItems
      );

    if (!aiData) {
      console.log(
        `No reliable ${category} data available today.`
      );

      continue;
    }

    try {
      await saveFallbackCategory(
        category,
        aiData,
        newsItems
      );

      generated++;

      console.log(
        `Generated fallback category: ${category}`
      );
    } catch (error) {
      console.error(
        `Failed saving fallback ${category}:`,
        error.message
      );
    }
  }

  return generated;
}

/*
========================================================
MAIN UPDATE FUNCTION
========================================================
*/

async function updateCurrentAffairs() {
  console.log(
    "=============================================="
  );

  console.log(
    "Starting StudyGem Current Affairs Update..."
  );

  console.log(
    "=============================================="
  );

  if (!process.env.GROQ_API_KEY) {
    throw new Error(
      "GROQ_API_KEY is missing in environment variables"
    );
  }

  const newsItems = await fetchRSSNews();

  console.log(
    `Fetched ${newsItems.length} unique news items.`
  );

  if (newsItems.length === 0) {
    console.log(
      "No RSS news items found."
    );

    return {
      success: false,
      message: "No RSS news items found",
      processed: 0,
      saved: 0,
      failed: 0,
      generatedFallback: 0,
    };
  }

  let processed = 0;
  let saved = 0;
  let failed = 0;

  /*
  --------------------------------------------------------
  PROCESS REAL RSS NEWS
  --------------------------------------------------------
  */

  for (const news of newsItems) {
    try {
      const alreadyExists =
        await CurrentAffair.exists({
          sourceId: news.sourceId,
        });

      if (alreadyExists) {
        continue;
      }

      console.log(
        `Processing: ${news.title}`
      );

      const aiData =
        await processWithGroq(news);

      if (
        !aiData ||
        !aiData.title ||
        !aiData.summary
      ) {
        console.log(
          `Skipping incomplete AI result: ${news.title}`
        );

        continue;
      }

      await saveCurrentAffair(
        news,
        aiData
      );

      processed++;
      saved++;

      console.log(
        `Saved: ${aiData.title} | Category: ${aiData.category}`
      );
    } catch (error) {
      failed++;

      console.error(
        `Failed to process "${news.title}":`,
        error.message
      );
    }
  }

  /*
  --------------------------------------------------------
  ENSURE IMPORTANT CATEGORIES
  --------------------------------------------------------
  */

  let generatedFallback = 0;

  try {
    generatedFallback =
      await ensureImportantCategories(
        newsItems
      );
  } catch (error) {
    console.error(
      "Fallback category generation failed:",
      error.message
    );
  }

  /*
  --------------------------------------------------------
  FINAL LOGS
  --------------------------------------------------------
  */

  console.log(
    "=============================================="
  );

  console.log(
    "Current Affairs Update Complete"
  );

  console.log(
    `Processed: ${processed}`
  );

  console.log(
    `Saved: ${saved}`
  );

  console.log(
    `Failed: ${failed}`
  );

  console.log(
    `AI Fallback Categories: ${generatedFallback}`
  );

  console.log(
    "=============================================="
  );

  return {
    success: true,
    processed,
    saved,
    failed,
    generatedFallback,
  };
}

/*
========================================================
EXPORTS
========================================================
*/

module.exports = {
  fetchRSSNews,
  processWithGroq,
  saveCurrentAffair,
  updateCurrentAffairs,
  generateMissingCategory,
  ensureImportantCategories,
};
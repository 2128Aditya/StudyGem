import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const API_URL =
  import.meta.env.VITE_API_URL || "https://studygem-your-knowledge-your-growth.onrender.com/api";

const categories = [
  {
    id: "national",
    apiName: "National",
    icon: "🏛️",
    title: "National",
    subtitle: "India & National Affairs",
  },
  {
    id: "international",
    apiName: "International",
    icon: "🌎",
    title: "International",
    subtitle: "World Affairs & Global Events",
  },
  {
    id: "economy",
    apiName: "Economy",
    icon: "💰",
    title: "Economy",
    subtitle: "Business, Banking & Finance",
  },
  {
    id: "science",
    apiName: "Science & Tech",
    icon: "🔬",
    title: "Science & Tech",
    subtitle: "Science, Space & Technology",
  },
  {
    id: "defence",
    apiName: "Defence",
    icon: "🛡️",
    title: "Defence",
    subtitle: "Defence & Security",
  },
  {
    id: "sports",
    apiName: "Sports",
    icon: "🏆",
    title: "Sports",
    subtitle: "Sports, Tournaments & Records",
  },
  {
    id: "awards",
    apiName: "Awards",
    icon: "🏅",
    title: "Awards",
    subtitle: "Awards & Honours",
  },
  {
    id: "appointments",
    apiName: "Appointments",
    icon: "👤",
    title: "Appointments",
    subtitle: "Important Appointments",
  },
  {
    id: "schemes",
    apiName: "Government Schemes",
    icon: "📜",
    title: "Government Schemes",
    subtitle: "Schemes, Policies & Initiatives",
  },
  {
    id: "environment",
    apiName: "Environment",
    icon: "🌱",
    title: "Environment",
    subtitle: "Climate, Ecology & Environment",
  },
  {
    id: "reports",
    apiName: "Important Places/Reports",
    icon: "📍",
    title: "Important Places / Reports",
    subtitle: "Places, Reports & Indexes",
  },
  {
    id: "facts",
    apiName: "Important Facts",
    icon: "📊",
    title: "Important Facts",
    subtitle: "Quick Facts & Revision",
  },
];

function Notes({
  onLogout,
  onMockTests,
  onStartTest,
  onHome,
  onAI,
  onProfile,
  onRoadmaps,
  onTarget,
  onPYQ,
  onLeaderboard,
  onNotes,
}) {
  const [language, setLanguage] = useState("English");
  const [activeCategory, setActiveCategory] = useState("all");

  const [affairs, setAffairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const languageMap = {
    English: "english",
    Hinglish: "hinglish",
    "हिंदी": "hindi",
  };

  const selectedLanguage = languageMap[language] || "english";

  const fetchCurrentAffairs = async () => {
    try {
      setLoading(true);
      setError("");

      let url = `${API_URL}/current-affairs?language=${selectedLanguage}`;

      if (activeCategory !== "all") {
        const selectedCategory = categories.find(
          (item) => item.id === activeCategory
        );

        if (selectedCategory) {
          url += `&category=${encodeURIComponent(
            selectedCategory.apiName
          )}`;
        }
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Server error: ${response.status}`
        );
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(
          data.message || "Failed to load current affairs."
        );
      }

      setAffairs(data.affairs || []);
    } catch (err) {
      console.error(
        "Current Affairs Fetch Error:",
        err
      );

      setAffairs([]);
      setError(
        err.message ||
          "Unable to load current affairs."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentAffairs();
  }, [language, activeCategory]);

  const visibleCategories =
    activeCategory === "all"
      ? categories
      : categories.filter(
          (item) => item.id === activeCategory
        );

  const getCategoryAffairs = (category) => {
    return affairs.filter(
      (item) =>
        item.category === category.apiName
    );
  };

  const getTimeText = (date) => {
    if (!date) return "Today";

    try {
      return new Date(date).toLocaleTimeString(
        "en-IN",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      );
    } catch {
      return "Today";
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="notes-page">
      <Navbar
        onLogout={onLogout}
        onMockTests={onMockTests}
        onHome={onHome}
        onAI={onAI}
        onProfile={onProfile}
        onRoadmaps={onRoadmaps}
        onTarget={onTarget}
        onPYQ={onPYQ}
        onLeaderboard={onLeaderboard}
        onNotes={onNotes}
        activePage="mock"
      />

      <main className="current-affairs-container">

        {/* HERO */}
        <section className="current-hero">
          <div className="hero-left">
            <div className="hero-label">
              <span className="hero-dot"></span>
              DAILY CURRENT AFFAIRS
            </div>

            <h1>
              Current Affairs
              <span> 2026</span>
            </h1>

            <p>
              Stay updated with important daily events,
              news and facts specially organized for
              competitive examinations.
            </p>

            <div className="hero-info">
              <div className="info-item">
                <div className="info-icon">📅</div>

                <div>
                  <small>Today's Date</small>
                  <strong>{currentDate}</strong>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">↻</div>

                <div>
                  <small>Content</small>
                  <strong>Updated Daily</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-ring ring-one"></div>
            <div className="visual-ring ring-two"></div>

            <div className="news-paper">
              <div className="paper-header">
                <span></span>
                <span></span>
                <span></span>
              </div>

              <div className="paper-title"></div>
              <div className="paper-line"></div>
              <div className="paper-line small"></div>

              <div className="paper-image"></div>

              <div className="paper-line"></div>
              <div className="paper-line medium"></div>
              <div className="paper-line small"></div>
            </div>

            <div className="floating-icon icon-one">
              🌎
            </div>

            <div className="floating-icon icon-two">
              📰
            </div>

            <div className="floating-icon icon-three">
              📚
            </div>
          </div>
        </section>

        {/* LANGUAGE */}
        <section className="language-bar">
          <div className="language-info">
            <div className="language-globe">
              🌐
            </div>

            <div>
              <span>
                Choose your preferred language
              </span>

              <strong>
                Current Affairs Language
              </strong>
            </div>
          </div>

          <div className="language-buttons">
            {["English", "Hinglish", "हिंदी"].map(
              (item) => (
                <button
                  key={item}
                  className={
                    language === item
                      ? "selected"
                      : ""
                  }
                  onClick={() =>
                    setLanguage(item)
                  }
                >
                  {item}
                </button>
              )
            )}
          </div>
        </section>

        {/* CATEGORY NAVIGATION */}
        <section className="category-navigation">
          <div className="category-nav-header">
            <div>
              <span>EXPLORE</span>

              <h2>
                Current Affairs Sections
              </h2>
            </div>

            <p>
              Select a section to quickly jump
              to that category
            </p>
          </div>

          <div className="category-list">
            <button
              className={`category-button ${
                activeCategory === "all"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActiveCategory("all")
              }
            >
              <span className="category-button-icon">
                ✨
              </span>

              <div>
                <strong>All Affairs</strong>
                <small>
                  Today's complete update
                </small>
              </div>
            </button>

            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-button ${
                  activeCategory === category.id
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActiveCategory(category.id)
                }
              >
                <span className="category-button-icon">
                  {category.icon}
                </span>

                <div>
                  <strong>
                    {category.title}
                  </strong>

                  <small>
                    {category.subtitle}
                  </small>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* TODAY */}
        <section className="today-heading">
          <div>
            <span>TODAY'S UPDATE</span>

            <h2>
              {activeCategory === "all"
                ? "Today's Current Affairs"
                : categories.find(
                    (x) =>
                      x.id === activeCategory
                  )?.title}
            </h2>
          </div>

          <div className="today-date">
            <span>●</span>
            {currentDate}
          </div>
        </section>

        {/* LOADING */}
        {loading && (
          <div className="api-state loading-state">
            <div className="loading-spinner"></div>

            <h3>
              Loading Current Affairs...
            </h3>

            <p>
              Fetching today's latest
              exam-focused updates.
            </p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="api-state error-state">
            <div className="state-icon">
              ⚠️
            </div>

            <h3>
              Unable to load Current Affairs
            </h3>

            <p>{error}</p>

            <button
              onClick={fetchCurrentAffairs}
            >
              Try Again
            </button>
          </div>
        )}

        {/* CONTENT */}
        {!loading &&
          !error &&
          affairs.length === 0 && (
            <div className="api-state empty-state">
              <div className="state-icon">
                📰
              </div>

              <h3>
                No Current Affairs Available
              </h3>

              <p>
                Today's current affairs have not
                been added yet. Please check again
                later.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          affairs.length > 0 && (
            <div className="affairs-wrapper">
              {visibleCategories.map(
                (category) => {
                  const categoryAffairs =
                    getCategoryAffairs(
                      category
                    );

                  if (
                    activeCategory === "all" &&
                    categoryAffairs.length === 0
                  ) {
                    return null;
                  }

                  return (
                    <section
                      className="affair-section"
                      key={category.id}
                    >
                      <div className="affair-section-header">
                        <div className="section-title">
                          <div className="section-icon">
                            {category.icon}
                          </div>

                          <div>
                            <h3>
                              {category.title}
                            </h3>

                            <p>
                              {category.subtitle}
                            </p>
                          </div>
                        </div>

                        <button
                          className="section-top"
                          onClick={scrollToTop}
                        >
                          ↑ Top
                        </button>
                      </div>

                      <div className="news-cards">
                        {categoryAffairs.map(
                          (
                            item,
                            index
                          ) => (
                            <article
                              className="news-card"
                              key={
                                item._id ||
                                index
                              }
                            >
                              <div className="news-card-header">
                                <span className="news-number">
                                  {String(
                                    index + 1
                                  ).padStart(
                                    2,
                                    "0"
                                  )}
                                </span>

                                <span className="news-label">
                                  {
                                    category.title
                                  }
                                </span>

                                <span className="news-time">
                                  {getTimeText(
                                    item.publishedAt
                                  )}
                                </span>
                              </div>

                              <h4>
                                {item.title}
                              </h4>

                              <p>
                                {item.summary}
                              </p>

                              {item.importantPoints &&
                                item
                                  .importantPoints
                                  .length >
                                  0 && (
                                  <div className="important-points">
                                    <strong>
                                      Key Points
                                    </strong>

                                    <ul>
                                      {item.importantPoints
                                        .slice(
                                          0,
                                          3
                                        )
                                        .map(
                                          (
                                            point,
                                            pointIndex
                                          ) => (
                                            <li
                                              key={
                                                pointIndex
                                              }
                                            >
                                              {
                                                point
                                              }
                                            </li>
                                          )
                                        )}
                                    </ul>
                                  </div>
                                )}

                              {item.examFocus && (
                                <div className="exam-focus">
                                  <span>
                                    🎯
                                  </span>

                                  <div>
                                    <b>
                                      Exam Focus
                                    </b>

                                    <p>
                                      {
                                        item.examFocus
                                      }
                                    </p>
                                  </div>
                                </div>
                              )}

                              <div className="news-card-footer">
                                <span>
                                  <b>
                                    Source:
                                  </b>{" "}
                                  {item.source
                                    ?.name ||
                                    "News Source"}
                                </span>

                                {item.source
                                  ?.url && (
                                  <a
                                    href={
                                      item
                                        .source
                                        .url
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    Read More{" "}
                                    <span>
                                      →
                                    </span>
                                  </a>
                                )}
                              </div>
                            </article>
                          )
                        )}
                      </div>
                    </section>
                  );
                }
              )}

              {/* Selected category but no data */}
              {activeCategory !== "all" &&
                getCategoryAffairs(
                  categories.find(
                    (item) =>
                      item.id ===
                      activeCategory
                  )
                ).length === 0 && (
                  <div className="api-state empty-state">
                    <div className="state-icon">
                      📰
                    </div>

                    <h3>
                      No updates in this
                      category
                    </h3>

                    <p>
                      No current affairs are
                      available for this section
                      today.
                    </p>
                  </div>
                )}
            </div>
          )}

        {/* QUICK REVISION */}
        <section className="revision-card">
          <div className="revision-symbol">
            🧠
          </div>

          <div className="revision-text">
            <span>QUICK REVISION</span>

            <h3>
              Revise important facts in less
              time
            </h3>

            <p>
              Important exam points and
              one-line facts are generated
              automatically from today's
              current affairs.
            </p>
          </div>

          <button>
            Start Revision
            <span>→</span>
          </button>
        </section>
      </main>

      <style>{`

        .notes-page {
          min-height: 100vh;
          background: #faf7ff;
          color: #111827;
          font-family: Inter, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .current-affairs-container {
          width: min(1400px, calc(100% - 42px));
          margin: auto;
          padding: 30px 0 70px;
        }

        /* HERO */

        .current-hero {
          position: relative;
          min-height: 325px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 48px 58px;
          border-radius: 28px;
          background:
            radial-gradient(
              circle at 80% 15%,
              rgba(196, 181, 253, 0.24),
              transparent 28%
            ),
            linear-gradient(
              135deg,
              #4c1d95,
              #6d28d9 55%,
              #7c3aed
            );
          box-shadow:
            0 18px 45px rgba(76, 29, 149, 0.16);
        }

        .hero-left {
          position: relative;
          z-index: 3;
          max-width: 680px;
        }

        .hero-label {
          width: fit-content;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border: 1px solid rgba(255,255,255,.14);
          border-radius: 50px;
          background: rgba(255,255,255,.1);
          color: rgba(255,255,255,.88);
          font-size: 10px;
          letter-spacing: 1.2px;
          font-weight: 550;
        }

        .hero-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #86efac;
        }

        .hero-left h1 {
          margin: 18px 0 11px;
          color: white;
          font-size: clamp(36px,4vw,54px);
          line-height: 1.05;
          letter-spacing: -2px;
          font-weight: 600;
        }

        .hero-left h1 span {
          color: #ddd6fe;
        }

        .hero-left > p {
          max-width: 600px;
          margin: 0;
          color: rgba(255,255,255,.74);
          font-size: 14px;
          line-height: 1.7;
          font-weight: 400;
        }

        .hero-info {
          display: flex;
          gap: 12px;
          margin-top: 27px;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 190px;
          padding: 10px 13px;
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 12px;
          background: rgba(255,255,255,.1);
          backdrop-filter: blur(8px);
        }

        .info-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 33px;
          height: 33px;
          border-radius: 9px;
          background: rgba(255,255,255,.12);
          color: white;
          font-size: 15px;
        }

        .info-item small {
          display: block;
          margin-bottom: 2px;
          color: rgba(255,255,255,.55);
          font-size: 9px;
        }

        .info-item strong {
          display: block;
          color: white;
          font-size: 11px;
          font-weight: 500;
        }

        /* HERO VISUAL */

        .hero-visual {
          position: absolute;
          right: 35px;
          top: 0;
          width: 390px;
          height: 100%;
        }

        .visual-ring {
          position: absolute;
          border: 1px solid rgba(255,255,255,.09);
          border-radius: 50%;
        }

        .ring-one {
          width: 330px;
          height: 330px;
          right: -85px;
          top: -85px;
        }

        .ring-two {
          width: 200px;
          height: 200px;
          right: 30px;
          bottom: -70px;
        }

        .news-paper {
          position: absolute;
          right: 110px;
          top: 52px;
          width: 175px;
          height: 215px;
          padding: 17px;
          border-radius: 13px;
          background: rgba(255,255,255,.95);
          transform: rotate(5deg);
          box-shadow:
            0 25px 50px rgba(30,15,60,.25);
        }

        .paper-header {
          display: flex;
          gap: 5px;
          margin-bottom: 17px;
        }

        .paper-header span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #c4b5fd;
        }

        .paper-title {
          width: 82%;
          height: 11px;
          margin-bottom: 9px;
          border-radius: 5px;
          background: #a78bfa;
        }

        .paper-line {
          width: 100%;
          height: 6px;
          margin-bottom: 7px;
          border-radius: 5px;
          background: #e5e7eb;
        }

        .paper-line.small {
          width: 55%;
        }

        .paper-line.medium {
          width: 72%;
        }

        .paper-image {
          width: 100%;
          height: 58px;
          margin: 13px 0;
          border-radius: 7px;
          background:
            linear-gradient(
              135deg,
              #ede9fe,
              #ddd6fe
            );
        }

        .floating-icon {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: rgba(255,255,255,.12);
          border: 1px solid rgba(255,255,255,.14);
          backdrop-filter: blur(8px);
          font-size: 19px;
          box-shadow:
            0 10px 25px rgba(30,15,60,.15);
        }

        .icon-one {
          right: 35px;
          top: 65px;
        }

        .icon-two {
          right: 45px;
          bottom: 58px;
        }

        .icon-three {
          left: 65px;
          bottom: 42px;
        }

        /* LANGUAGE */

        .language-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-top: 23px;
          padding: 16px 19px;
          border: 1px solid #eee8f8;
          border-radius: 17px;
          background: white;
          box-shadow:
            0 7px 22px rgba(88,28,135,.04);
        }

        .language-info {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .language-globe {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 39px;
          height: 39px;
          border-radius: 10px;
          background: #f3e8ff;
          font-size: 17px;
        }

        .language-info span {
          display: block;
          margin-bottom: 2px;
          color: #a1a1aa;
          font-size: 9px;
        }

        .language-info strong {
          display: block;
          color: #374151;
          font-size: 12px;
          font-weight: 500;
        }

        .language-buttons {
          display: flex;
          padding: 3px;
          border-radius: 10px;
          background: #f5f3ff;
        }

        .language-buttons button {
          padding: 8px 17px;
          border: 0;
          border-radius: 8px;
          background: transparent;
          color: #71717a;
          cursor: pointer;
          font-size: 11px;
          font-weight: 450;
        }

        .language-buttons button.selected {
          color: #6d28d9;
          background: white;
          box-shadow:
            0 2px 8px rgba(76,29,149,.1);
        }

        /* CATEGORY */

        .category-navigation {
          margin-top: 27px;
        }

        .category-nav-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .category-nav-header span,
        .today-heading > div:first-child > span,
        .revision-text > span {
          display: block;
          margin-bottom: 4px;
          color: #8b5cf6;
          font-size: 9px;
          letter-spacing: 1.1px;
          font-weight: 600;
        }

        .category-nav-header h2,
        .today-heading h2 {
          margin: 0;
          color: #252525;
          font-size: 23px;
          font-weight: 550;
          letter-spacing: -.4px;
        }

        .category-nav-header p {
          margin: 0;
          color: #9ca3af;
          font-size: 10px;
        }

        .category-list {
          display: grid;
          grid-template-columns: repeat(4,1fr);
          gap: 10px;
        }

        .category-button {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          border: 1px solid #ece7f3;
          border-radius: 13px;
          background: white;
          text-align: left;
          cursor: pointer;
          transition: .2s ease;
        }

        .category-button:hover {
          border-color: #c4b5fd;
          transform: translateY(-1px);
        }

        .category-button.active {
          border-color: #8b5cf6;
          background: #faf5ff;
        }

        .category-button-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 35px;
          height: 35px;
          border-radius: 9px;
          background: #f5f3ff;
          font-size: 16px;
        }

        .category-button strong {
          display: block;
          margin-bottom: 2px;
          color: #333;
          font-size: 11px;
          font-weight: 520;
        }

        .category-button small {
          display: block;
          overflow: hidden;
          max-width: 190px;
          color: #a1a1aa;
          font-size: 8px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .category-button.active strong {
          color: #6d28d9;
        }

        /* TODAY */

        .today-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin: 37px 0 17px;
        }

        .today-date {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #a1a1aa;
          font-size: 10px;
        }

        .today-date span {
          margin: 0;
          color: #8b5cf6;
          font-size: 8px;
        }

        /* API STATES */

        .api-state {
          margin: 20px 0 25px;
          padding: 45px 20px;
          border: 1px solid #eee8f8;
          border-radius: 19px;
          background: white;
          text-align: center;
        }

        .api-state h3 {
          margin: 12px 0 6px;
          color: #292929;
          font-size: 16px;
          font-weight: 500;
        }

        .api-state p {
          margin: 0;
          color: #999;
          font-size: 11px;
          line-height: 1.6;
        }

        .state-icon {
          font-size: 32px;
        }

        .loading-spinner {
          width: 32px;
          height: 32px;
          margin: auto;
          border: 3px solid #ede9fe;
          border-top-color: #7c3aed;
          border-radius: 50%;
          animation: spin .8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .error-state button {
          margin-top: 15px;
          padding: 9px 16px;
          border: 0;
          border-radius: 8px;
          background: #7c3aed;
          color: white;
          cursor: pointer;
          font-size: 10px;
        }

        /* AFFAIRS */

        .affairs-wrapper {
          display: flex;
          flex-direction: column;
          gap: 23px;
        }

        .affair-section {
          padding: 21px;
          border: 1px solid #eee8f8;
          border-radius: 19px;
          background: white;
          box-shadow:
            0 7px 22px rgba(88,28,135,.035);
        }

        .affair-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 16px;
          border-bottom: 1px solid #f1edf6;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .section-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border-radius: 11px;
          background: #f5f3ff;
          font-size: 19px;
        }

        .section-title h3 {
          margin: 0 0 3px;
          color: #292929;
          font-size: 15px;
          font-weight: 550;
        }

        .section-title p {
          margin: 0;
          color: #a1a1aa;
          font-size: 9px;
        }

        .section-top {
          padding: 7px 10px;
          border: 1px solid #eee8f8;
          border-radius: 8px;
          background: white;
          color: #7c3aed;
          cursor: pointer;
          font-size: 9px;
        }

        .news-cards {
          display: grid;
          grid-template-columns: repeat(2,1fr);
          gap: 12px;
          padding-top: 16px;
        }

        .news-card {
          padding: 16px;
          border: 1px solid #f0ebf5;
          border-radius: 13px;
          background: #fcfbfe;
          transition: .2s ease;
        }

        .news-card:hover {
          border-color: #ddd0f4;
          box-shadow:
            0 8px 20px rgba(88,28,135,.05);
        }

        .news-card-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 11px;
        }

        .news-number {
          color: #8b5cf6;
          font-size: 10px;
          font-weight: 600;
        }

        .news-label {
          padding: 4px 7px;
          border-radius: 5px;
          background: #f3e8ff;
          color: #7c3aed;
          font-size: 8px;
        }

        .news-time {
          margin-left: auto;
          color: #aaa;
          font-size: 8px;
        }

        .news-card h4 {
          margin: 0 0 7px;
          color: #292929;
          font-size: 13px;
          line-height: 1.45;
          font-weight: 520;
        }

        .news-card > p {
          min-height: 39px;
          margin: 0;
          color: #777;
          font-size: 10px;
          line-height: 1.65;
        }

        /* IMPORTANT POINTS */

        .important-points {
          margin-top: 12px;
          padding: 10px 11px;
          border-radius: 9px;
          background: #faf5ff;
        }

        .important-points strong {
          display: block;
          margin-bottom: 5px;
          color: #6d28d9;
          font-size: 9px;
          font-weight: 600;
        }

        .important-points ul {
          margin: 0;
          padding-left: 15px;
        }

        .important-points li {
          margin-bottom: 3px;
          color: #777;
          font-size: 9px;
          line-height: 1.5;
        }

        .important-points li:last-child {
          margin-bottom: 0;
        }

        /* EXAM FOCUS */

        .exam-focus {
          display: flex;
          gap: 8px;
          margin-top: 11px;
          padding: 9px 10px;
          border-left: 2px solid #8b5cf6;
          border-radius: 5px;
          background: #f8f5ff;
        }

        .exam-focus > span {
          font-size: 13px;
        }

        .exam-focus b {
          display: block;
          margin-bottom: 2px;
          color: #6d28d9;
          font-size: 8px;
          font-weight: 600;
        }

        .exam-focus p {
          margin: 0;
          color: #777;
          font-size: 9px;
          line-height: 1.45;
        }

        .news-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-top: 14px;
          padding-top: 11px;
          border-top: 1px solid #eeeaf3;
        }

        .news-card-footer > span {
          color: #a1a1aa;
          font-size: 8px;
        }

        .news-card-footer b {
          font-weight: 500;
        }

        .news-card-footer a {
          display: flex;
          align-items: center;
          gap: 5px;
          border: 0;
          background: transparent;
          color: #7c3aed;
          cursor: pointer;
          font-size: 9px;
          font-weight: 500;
          text-decoration: none;
        }

        .news-card-footer a span {
          color: #7c3aed;
          font-size: 13px;
        }

        /* REVISION */

        .revision-card {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-top: 25px;
          padding: 20px 22px;
          border: 1px solid #e9d5ff;
          border-radius: 18px;
          background:
            linear-gradient(
              100deg,
              #faf5ff,
              #f5f3ff
            );
        }

        .revision-symbol {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 47px;
          height: 47px;
          border-radius: 12px;
          background: white;
          font-size: 21px;
        }

        .revision-text {
          flex: 1;
        }

        .revision-text h3 {
          margin: 2px 0 3px;
          color: #292929;
          font-size: 14px;
          font-weight: 550;
        }

        .revision-text p {
          margin: 0;
          color: #999;
          font-size: 9px;
        }

        .revision-card > button {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 10px 14px;
          border: 0;
          border-radius: 9px;
          background: #7c3aed;
          color: white;
          cursor: pointer;
          font-size: 10px;
          font-weight: 500;
        }

        .revision-card > button span {
          font-size: 14px;
        }

        /* TABLET */

        @media (max-width:1050px) {
          .current-affairs-container {
            width: calc(100% - 30px);
          }

          .current-hero {
            padding: 42px;
          }

          .hero-visual {
            right: -45px;
            opacity: .5;
          }

          .category-list {
            grid-template-columns: repeat(3,1fr);
          }
        }

        /* MOBILE */

        @media (max-width:750px) {
          .current-affairs-container {
            width: calc(100% - 20px);
            padding-top: 17px;
          }

          .current-hero {
            min-height: 420px;
            padding: 28px 23px;
            border-radius: 21px;
            align-items: flex-start;
          }

          .hero-left h1 {
            font-size: 35px;
            letter-spacing: -1.2px;
          }

          .hero-left > p {
            font-size: 12px;
          }

          .hero-info {
            flex-direction: column;
            width: 100%;
          }

          .info-item {
            width: 100%;
          }

          .hero-visual {
            right: -90px;
            top: auto;
            bottom: -30px;
            width: 330px;
            height: 230px;
            opacity: .48;
          }

          .news-paper {
            top: 15px;
            right: 80px;
            width: 145px;
            height: 180px;
          }

          .language-bar {
            align-items: flex-start;
            flex-direction: column;
            padding: 14px;
          }

          .language-buttons {
            width: 100%;
          }

          .language-buttons button {
            flex: 1;
          }

          .category-nav-header {
            align-items: flex-start;
            flex-direction: column;
            gap: 7px;
          }

          .category-list {
            grid-template-columns: repeat(2,1fr);
          }

          .category-button {
            padding: 10px;
          }

          .category-button small {
            max-width: 120px;
          }

          .today-heading {
            align-items: flex-start;
            flex-direction: column;
            gap: 7px;
          }

          .news-cards {
            grid-template-columns: 1fr;
          }

          .affair-section {
            padding: 15px;
          }

          .revision-card {
            align-items: flex-start;
            flex-wrap: wrap;
          }

          .revision-card > button {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width:430px) {
          .category-list {
            grid-template-columns: 1fr;
          }

          .category-button {
            width: 100%;
          }

          .category-button small {
            max-width: none;
          }

          .affair-section-header {
            align-items: flex-start;
          }

          .section-top {
            display: none;
          }

          .hero-label {
            font-size: 8px;
          }
        }

      `}</style>
    </div>
  );
}

export default Notes;
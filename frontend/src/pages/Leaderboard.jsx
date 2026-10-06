import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import aadiBg from "../assets/aadi.png";

function Leaderboard({
  onLogout,
  onHome,
  onMockTests,
  onAI,
  onProfile,
  onRoadmaps,
  onTarget,
  onPYQ,
  onLeaderboard,
}) {
  const [activeFilter, setActiveFilter] = useState("All Time");
  const [search, setSearch] = useState("");

  const [leaderboardData, setLeaderboardData] = useState([]);
  const [currentUserRank, setCurrentUserRank] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError("");

        const token =
          localStorage.getItem("studyGemToken") ||
          localStorage.getItem("token") ||
          localStorage.getItem("authToken");

        if (!token) {
          throw new Error("Please login first.");
        }

        let period = "all";

        if (activeFilter === "This Week") {
          period = "week";
        }

        if (activeFilter === "This Month") {
          period = "month";
        }

        const response = await fetch(
          `${API_BASE_URL}/leaderboard?period=${period}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to load leaderboard."
          );
        }

        const users = Array.isArray(data.leaderboard)
          ? data.leaderboard
          : [];

        setLeaderboardData(users);
        setCurrentUserRank(data.currentUserRank || null);
      } catch (err) {
        console.error("Leaderboard Error:", err);

        setError(
          err.message || "Unable to load leaderboard."
        );

        setLeaderboardData([]);
        setCurrentUserRank(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [activeFilter, API_BASE_URL]);

  const filteredUsers = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) {
      return leaderboardData;
    }

    return leaderboardData.filter((user) => {
      const name = String(user.name || "").toLowerCase();
      const username = String(user.username || "").toLowerCase();

      return (
        name.includes(value) ||
        username.includes(value)
      );
    });
  }, [search, leaderboardData]);

  const topThree = leaderboardData.slice(0, 3);

  const remainingUsers = filteredUsers.filter(
    (user) => Number(user.rank) > 3
  );

  const currentUser =
    leaderboardData.find(
      (user) =>
        Number(user.rank) === Number(currentUserRank)
    ) || null;

  const totalLearners = leaderboardData.length;

  const totalTests = leaderboardData.reduce(
    (total, user) =>
      total + Number(user.tests || 0),
    0
  );

  const totalPoints = leaderboardData.reduce(
    (total, user) =>
      total + Number(user.points || 0),
    0
  );

  const formatNumber = (value) => {
    return Number(value || 0).toLocaleString();
  };

  return (
    <div className="leaderboard-page">
      <Navbar
        onLogout={onLogout}
        onHome={onHome}
        onMockTests={onMockTests}
        onAI={onAI}
        onProfile={onProfile}
        onRoadmaps={onRoadmaps}
        onTarget={onTarget}
        onPYQ={onPYQ}
        onLeaderboard={onLeaderboard}
        activePage="leaderboard"
      />

      <main
        className="leaderboard-main"
        style={{
          backgroundImage: `url(${aadiBg})`,
        }}
      >
        <div className="page-overlay" />

        <section className="leaderboard-content">

          {/* HEADER */}
          <div className="leaderboard-header">
            <div className="header-left">
              <span className="small-label">
                STUDYGEM · LEARNING COMMUNITY
              </span>

              <h1>Leaderboard</h1>

              <p>
                Track your progress, see where you stand,
                and keep moving higher.
              </p>
            </div>

            <div className="header-stats">
              <div className="mini-stat">
                <strong>{formatNumber(totalLearners)}</strong>
                <span>Students</span>
              </div>

              <div className="stat-line" />

              <div className="mini-stat">
                <strong>{formatNumber(totalTests)}</strong>
                <span>Tests Taken</span>
              </div>

              <div className="stat-line" />

              <div className="mini-stat">
                <strong>{formatNumber(totalPoints)}</strong>
                <span>Total Points</span>
              </div>
            </div>
          </div>

          {/* MAIN BOARD */}
          <section className="board-section">

            {/* BOARD TOP */}
            <div className="board-top">
              <div>
                <span className="section-kicker">
                  TOP LEARNERS
                </span>

                <h2>See who's leading</h2>

                <p>
                  Consistency, practice and progress shape
                  your position here.
                </p>
              </div>

              <div className="filter-buttons">
                {[
                  "All Time",
                  "This Month",
                  "This Week",
                ].map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    className={
                      activeFilter === filter
                        ? "filter-btn active"
                        : "filter-btn"
                    }
                    onClick={() => setActiveFilter(filter)}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* SEARCH */}
            <div className="search-row">
              <div className="search-box">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-4-4" />
                </svg>

                <input
                  type="text"
                  placeholder="Search learner..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

                {search && (
                  <button
                    type="button"
                    className="clear-search"
                    onClick={() => setSearch("")}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* LOADING */}
            {loading && (
              <div className="state-box">
                <div className="loader" />
                <h3>Loading leaderboard</h3>
                <p>
                  Real learner rankings load ho rahe hain.
                </p>
              </div>
            )}

            {/* ERROR */}
            {!loading && error && (
              <div className="state-box error-box">
                <div className="state-icon">!</div>

                <h3>Unable to load leaderboard</h3>

                <p>{error}</p>
              </div>
            )}

            {/* DATA */}
            {!loading && !error && (
              <>
                {/* PODIUM */}
                {topThree.length > 0 ? (
                  <div className="podium">

                    {/* SECOND */}
                    {topThree[1] && (
                      <div className="podium-card second">
                        <span className="position">
                          02
                        </span>

                        <div className="avatar silver">
                          <img
                            src={
                              topThree[1].avatar ||
                              aadiBg
                            }
                            alt={
                              topThree[1].name ||
                              "Learner"
                            }
                          />
                        </div>

                        <div className="place">
                          2ND
                        </div>

                        <h3>
                          {topThree[1].name ||
                            "StudyGem Student"}
                        </h3>

                        <span className="username">
                          {topThree[1].username || ""}
                        </span>

                        <div className="podium-points">
                          {formatNumber(
                            topThree[1].points
                          )}
                          <small> XP</small>
                        </div>

                        <div className="podium-footer">
                          SECOND PLACE
                        </div>
                      </div>
                    )}

                    {/* FIRST */}
                    {topThree[0] && (
                      <div className="podium-card first">
                        <span className="winner-tag">
                          #1 LEARNER
                        </span>

                        <div className="position first-position">
                          01
                        </div>

                        <div className="avatar gold">
                          <img
                            src={
                              topThree[0].avatar ||
                              aadiBg
                            }
                            alt={
                              topThree[0].name ||
                              "Learner"
                            }
                          />
                        </div>

                        <div className="place">
                          1ST
                        </div>

                        <h3>
                          {topThree[0].name ||
                            "StudyGem Student"}
                        </h3>

                        <span className="username">
                          {topThree[0].username || ""}
                        </span>

                        <div className="podium-points">
                          {formatNumber(
                            topThree[0].points
                          )}
                          <small> XP</small>
                        </div>

                        <div className="podium-footer first-footer">
                          CURRENT LEADER
                        </div>
                      </div>
                    )}

                    {/* THIRD */}
                    {topThree[2] && (
                      <div className="podium-card third">
                        <span className="position">
                          03
                        </span>

                        <div className="avatar bronze">
                          <img
                            src={
                              topThree[2].avatar ||
                              aadiBg
                            }
                            alt={
                              topThree[2].name ||
                              "Learner"
                            }
                          />
                        </div>

                        <div className="place">
                          3RD
                        </div>

                        <h3>
                          {topThree[2].name ||
                            "StudyGem Student"}
                        </h3>

                        <span className="username">
                          {topThree[2].username || ""}
                        </span>

                        <div className="podium-points">
                          {formatNumber(
                            topThree[2].points
                          )}
                          <small> XP</small>
                        </div>

                        <div className="podium-footer">
                          THIRD PLACE
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="state-box">
                    <div className="state-icon">—</div>

                    <h3>No leaderboard data</h3>

                    <p>
                      Abhi kisi learner ne test attempt
                      nahi kiya hai.
                    </p>
                  </div>
                )}

                {/* TABLE */}
                {topThree.length > 0 && (
                  <div className="ranking-card">

                    <div className="ranking-card-header">
                      <div>
                        <span>FULL RANKING</span>
                        <h3>All learners</h3>
                      </div>

                      <div className="total-result">
                        {filteredUsers.length} learners
                      </div>
                    </div>

                    <div className="table-wrapper">
                      <div className="table-heading">
                        <span>Rank</span>
                        <span>Learner</span>
                        <span>Points</span>
                        <span>Tests</span>
                        <span>Accuracy</span>
                        <span>Streak</span>
                      </div>

                      <div className="table-body">
                        {remainingUsers.length > 0 ? (
                          remainingUsers.map((user) => {
                            const isCurrentUser =
                              String(user.userId) ===
                              String(
                                currentUser?.userId
                              );

                            return (
                              <div
                                className={
                                  isCurrentUser
                                    ? "leader-row current-user"
                                    : "leader-row"
                                }
                                key={
                                  user.userId ||
                                  user.rank
                                }
                              >
                                <div className="rank-cell">
                                  <span>
                                    #{user.rank}
                                  </span>
                                </div>

                                <div className="learner-cell">
                                  <div className="small-avatar">
                                    <img
                                      src={
                                        user.avatar ||
                                        aadiBg
                                      }
                                      alt={
                                        user.name ||
                                        "Learner"
                                      }
                                    />
                                  </div>

                                  <div className="learner-info">
                                    <strong>
                                      {user.name ||
                                        "StudyGem Student"}
                                    </strong>

                                    <span>
                                      {user.username ||
                                        ""}
                                    </span>
                                  </div>

                                  {isCurrentUser && (
                                    <span className="you-badge">
                                      YOU
                                    </span>
                                  )}
                                </div>

                                <div className="points-cell">
                                  {formatNumber(
                                    user.points
                                  )}
                                  <small> XP</small>
                                </div>

                                <div className="tests-cell">
                                  {Number(
                                    user.tests || 0
                                  )}
                                </div>

                                <div className="accuracy-cell">
                                  <div className="accuracy-top">
                                    <span>
                                      {Number(
                                        user.accuracy ||
                                          0
                                      )}
                                      %
                                    </span>
                                  </div>

                                  <div className="progress-track">
                                    <div
                                      className="progress-fill"
                                      style={{
                                        width: `${Math.min(
                                          100,
                                          Math.max(
                                            0,
                                            Number(
                                              user.accuracy ||
                                                0
                                            )
                                          )
                                        )}%`,
                                      }}
                                    />
                                  </div>
                                </div>

                                <div className="streak-cell">
                                  <span>🔥</span>
                                  {Number(
                                    user.streak || 0
                                  )}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="state-box small">
                            <div className="state-icon">
                              ⌕
                            </div>

                            <h3>
                              {search
                                ? "No learner found"
                                : "No learners below top 3"}
                            </h3>

                            <p>
                              {search
                                ? "Try searching with another name or username."
                                : "Keep attempting tests to appear here."}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* CURRENT USER */}
                <div className="your-rank-card">
                  <div className="your-rank-left">
                    <div className="rank-circle">
                      #{currentUserRank || "-"}
                    </div>

                    <div className="your-rank-info">
                      <span>
                        YOUR CURRENT RANK
                      </span>

                      <h3>
                        {currentUser?.name ||
                          "No ranking yet"}
                      </h3>

                      <p>
                        {currentUser
                          ? "Keep going — you're doing great!"
                          : "Attempt a mock test to join the leaderboard."}
                      </p>
                    </div>
                  </div>

                  <div className="your-rank-stats">
                    <div>
                      <strong>
                        {formatNumber(
                          currentUser?.points
                        )}
                      </strong>
                      <span>XP Points</span>
                    </div>

                    <div>
                      <strong>
                        {Number(
                          currentUser?.tests || 0
                        )}
                      </strong>
                      <span>Tests</span>
                    </div>

                    <div>
                      <strong>
                        {Number(
                          currentUser?.accuracy || 0
                        )}
                        %
                      </strong>
                      <span>Accuracy</span>
                    </div>

                    <div>
                      <strong>
                        {Number(
                          currentUser?.streak || 0
                        )}{" "}
                        🔥
                      </strong>
                      <span>Day Streak</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </section>
        </section>
      </main>

      <style>{`
        * {
          box-sizing: border-box;
        }

        .leaderboard-page {
          width: 100%;
          min-height: 100vh;
          background: #f8f5fc;
          color: #17121f;
          overflow-x: hidden;
        }

        .leaderboard-main {
          position: relative;
          min-height: calc(100vh - 70px);
          width: 100%;
          background-position: center;
          background-size: cover;
          background-repeat: no-repeat;
          background-attachment: fixed;
          padding: 55px 0 80px;
        }

        .page-overlay {
          position: absolute;
          inset: 0;
          background: rgba(250, 247, 255, 0.42);
          pointer-events: none;
        }

        .leaderboard-content {
          position: relative;
          z-index: 2;
          width: min(1180px, calc(100% - 40px));
          margin: 0 auto;
        }

        /* HEADER */

        .leaderboard-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 35px;
          margin-bottom: 28px;
        }

        .header-left {
          max-width: 600px;
        }

        .small-label {
          display: block;
          margin-bottom: 10px;
          color: #7c3aed;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 1.8px;
        }

        .header-left h1 {
          margin: 0;
          color: #21182a;
          font-size: clamp(38px, 5vw, 56px);
          line-height: 1;
          font-weight: 500;
          letter-spacing: -2px;
        }

        .header-left p {
          margin: 14px 0 0;
          color: #706678;
          font-size: 13px;
          line-height: 1.7;
        }

        .header-stats {
          display: flex;
          align-items: center;
          padding: 15px 20px;
          border: 1px solid rgba(124, 58, 237, 0.13);
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.66);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow: 0 10px 30px rgba(62, 38, 80, 0.06);
        }

        .mini-stat {
          min-width: 82px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .mini-stat strong {
          color: #2b2032;
          font-size: 17px;
          font-weight: 500;
        }

        .mini-stat span {
          color: #9a90a0;
          font-size: 8px;
        }

        .stat-line {
          width: 1px;
          height: 32px;
          margin: 0 16px;
          background: #e7deed;
        }

        /* BOARD */

        .board-section {
          padding: 30px;
          border: 1px solid rgba(124, 58, 237, 0.13);
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.56);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 20px 60px rgba(56, 35, 74, 0.08);
        }

        .board-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 25px;
        }

        .section-kicker {
          color: #7c3aed;
          font-size: 8px;
          font-weight: 600;
          letter-spacing: 1.6px;
        }

        .board-top h2 {
          margin: 6px 0 0;
          color: #21182a;
          font-size: 26px;
          font-weight: 500;
          letter-spacing: -0.6px;
        }

        .board-top p {
          margin: 7px 0 0;
          color: #8c8192;
          font-size: 11px;
        }

        .filter-buttons {
          display: flex;
          gap: 4px;
          padding: 4px;
          border: 1px solid #e8dff0;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.75);
        }

        .filter-btn {
          border: 0;
          border-radius: 7px;
          padding: 9px 13px;
          background: transparent;
          color: #817686;
          font-family: inherit;
          font-size: 10px;
          font-weight: 500;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .filter-btn:hover {
          color: #6d28d9;
        }

        .filter-btn.active {
          background: #7c3aed;
          color: #fff;
          box-shadow: 0 5px 13px rgba(124, 58, 237, 0.2);
        }

        /* SEARCH */

        .search-row {
          display: flex;
          justify-content: flex-end;
          margin-top: 22px;
        }

        .search-box {
          width: 250px;
          height: 40px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 11px;
          border: 1px solid #e5dceb;
          border-radius: 9px;
          background: rgba(255, 255, 255, 0.78);
          transition: 0.2s ease;
        }

        .search-box:focus-within {
          border-color: #a78bfa;
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.07);
        }

        .search-box svg {
          width: 15px;
          height: 15px;
          color: #9b91a2;
          flex: 0 0 auto;
        }

        .search-box input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: #312638;
          font-family: inherit;
          font-size: 11px;
        }

        .search-box input::placeholder {
          color: #aaa1b0;
        }

        .clear-search {
          width: 20px;
          height: 20px;
          border: 0;
          border-radius: 50%;
          background: #f0eaf5;
          color: #766b7e;
          cursor: pointer;
          font-size: 14px;
          line-height: 18px;
        }

        /* PODIUM */

        .podium {
          display: grid;
          grid-template-columns: 1fr 1.08fr 1fr;
          align-items: end;
          gap: 14px;
          margin-top: 24px;
        }

        .podium-card {
          position: relative;
          min-height: 310px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding: 31px 20px 0;
          border: 1px solid rgba(124, 58, 237, 0.12);
          border-radius: 16px 16px 8px 8px;
          background: rgba(255, 255, 255, 0.76);
          box-shadow: 0 12px 30px rgba(57, 35, 73, 0.06);
        }

        .podium-card.first {
          min-height: 350px;
          background: rgba(255, 255, 255, 0.86);
          border-color: rgba(124, 58, 237, 0.2);
          box-shadow: 0 18px 40px rgba(91, 33, 182, 0.1);
        }

        .position {
          position: absolute;
          top: 13px;
          left: 15px;
          color: #aaa0b0;
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.8px;
        }

        .first-position {
          color: #7c3aed;
        }

        .winner-tag {
          position: absolute;
          top: 12px;
          left: 50%;
          transform: translateX(-50%);
          padding: 4px 8px;
          border-radius: 4px;
          background: #f1e9ff;
          color: #6d28d9;
          font-size: 7px;
          font-weight: 600;
          letter-spacing: 0.8px;
        }

        .avatar {
          width: 78px;
          height: 78px;
          padding: 4px;
          border-radius: 50%;
        }

        .first .avatar {
          width: 92px;
          height: 92px;
        }

        .avatar img {
          width: 100%;
          height: 100%;
          display: block;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #fff;
          background: #eee8f5;
        }

        .avatar.gold {
          background: linear-gradient(
            135deg,
            #d99a22,
            #f5d36a,
            #b77913
          );
          box-shadow: 0 0 0 5px #fff5d5;
        }

        .avatar.silver {
          background: linear-gradient(
            135deg,
            #8e969e,
            #e1e4e7,
            #6c747c
          );
          box-shadow: 0 0 0 5px #f0f1f3;
        }

        .avatar.bronze {
          background: linear-gradient(
            135deg,
            #9e511e,
            #d99351,
            #783912
          );
          box-shadow: 0 0 0 5px #fae9da;
        }

        .place {
          margin-top: 13px;
          padding: 4px 9px;
          border-radius: 4px;
          background: #f3eff7;
          color: #796d83;
          font-size: 7px;
          font-weight: 600;
          letter-spacing: 0.8px;
        }

        .first .place {
          background: #f2eaff;
          color: #6d28d9;
        }

        .podium-card h3 {
          max-width: 190px;
          overflow: hidden;
          margin: 10px 0 2px;
          color: #29202f;
          font-size: 15px;
          font-weight: 500;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .first h3 {
          font-size: 18px;
        }

        .username {
          color: #a197a7;
          font-size: 9px;
        }

        .podium-points {
          margin-top: 13px;
          color: #5b21b6;
          font-size: 19px;
          font-weight: 600;
        }

        .podium-points small {
          color: #a18bbd;
          font-size: 8px;
          font-weight: 400;
        }

        .podium-footer {
          width: calc(100% + 40px);
          margin-top: auto;
          padding: 11px;
          background: #f5f0fa;
          color: #887b91;
          text-align: center;
          font-size: 7px;
          font-weight: 600;
          letter-spacing: 1px;
        }

        .first-footer {
          background: #eee5ff;
          color: #6d28d9;
        }

        /* STATE */

        .state-box {
          padding: 65px 20px;
          text-align: center;
        }

        .state-box.small {
          padding: 45px 20px;
        }

        .state-icon {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 11px;
          border-radius: 50%;
          background: #f0eafa;
          color: #7c3aed;
          font-size: 17px;
        }

        .state-box h3 {
          margin: 0 0 5px;
          color: #33283a;
          font-size: 15px;
          font-weight: 500;
        }

        .state-box p {
          margin: 0;
          color: #9a909f;
          font-size: 10px;
        }

        .error-box .state-icon {
          background: #fef2f2;
          color: #b91c1c;
        }

        .error-box h3 {
          color: #991b1b;
        }

        .loader {
          width: 28px;
          height: 28px;
          margin: 0 auto 14px;
          border: 2px solid #e6ddf0;
          border-top-color: #7c3aed;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* RANKING */

        .ranking-card {
          margin-top: 30px;
          overflow: hidden;
          border: 1px solid rgba(124, 58, 237, 0.13);
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.78);
          box-shadow: 0 12px 30px rgba(57, 35, 73, 0.055);
        }

        .ranking-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 22px;
          border-bottom: 1px solid #eee8f3;
        }

        .ranking-card-header > div:first-child span {
          color: #8d8196;
          font-size: 8px;
          font-weight: 600;
          letter-spacing: 1.3px;
        }

        .ranking-card-header h3 {
          margin: 4px 0 0;
          color: #2b2131;
          font-size: 17px;
          font-weight: 500;
        }

        .total-result {
          padding: 6px 9px;
          border-radius: 5px;
          background: #f5effa;
          color: #81748a;
          font-size: 8px;
        }

        .table-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        .table-heading,
        .leader-row {
          display: grid;
          grid-template-columns:
            70px
            minmax(220px, 1.5fr)
            100px
            70px
            minmax(140px, 1fr)
            80px;
          align-items: center;
          gap: 15px;
          padding: 0 22px;
        }

        .table-heading {
          min-height: 45px;
          background: #fbf9fd;
          border-bottom: 1px solid #eee8f3;
          color: #9a909f;
          font-size: 8px;
          font-weight: 600;
          letter-spacing: 0.8px;
          text-transform: uppercase;
        }

        .leader-row {
          min-height: 70px;
          border-bottom: 1px solid #f0edf2;
          transition: 0.2s ease;
        }

        .leader-row:last-child {
          border-bottom: 0;
        }

        .leader-row:hover {
          background: rgba(250, 247, 255, 0.8);
        }

        .leader-row.current-user {
          background: #faf5ff;
          box-shadow: inset 3px 0 #7c3aed;
        }

        .rank-cell {
          color: #807586;
          font-size: 11px;
          font-weight: 500;
        }

        .learner-cell {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .small-avatar {
          width: 37px;
          height: 37px;
          flex: 0 0 auto;
          overflow: hidden;
          border-radius: 50%;
          background: #eee8f5;
        }

        .small-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .learner-info {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .learner-info strong {
          overflow: hidden;
          color: #302532;
          font-size: 11px;
          font-weight: 500;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .learner-info span {
          overflow: hidden;
          color: #a098a5;
          font-size: 8px;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .you-badge {
          padding: 3px 6px;
          border-radius: 4px;
          background: #eee5ff;
          color: #6d28d9;
          font-size: 7px;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .points-cell {
          color: #5b21b6;
          font-size: 11px;
          font-weight: 600;
        }

        .points-cell small {
          color: #9f8bb4;
          font-size: 7px;
          font-weight: 400;
        }

        .tests-cell {
          color: #665c6d;
          font-size: 11px;
        }

        .accuracy-cell {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .accuracy-top span {
          color: #625869;
          font-size: 10px;
          font-weight: 500;
        }

        .progress-track {
          width: 100%;
          height: 4px;
          overflow: hidden;
          border-radius: 20px;
          background: #ece4f4;
        }

        .progress-fill {
          height: 100%;
          border-radius: inherit;
          background: #7c3aed;
        }

        .streak-cell {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #665c6d;
          font-size: 10px;
        }

        /* YOUR RANK */

        .your-rank-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
          margin-top: 18px;
          padding: 20px 22px;
          border: 1px solid rgba(124, 58, 237, 0.15);
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.7);
        }

        .your-rank-left {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .rank-circle {
          width: 52px;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 auto;
          border-radius: 13px;
          background: #7c3aed;
          color: #fff;
          font-size: 13px;
          font-weight: 500;
          box-shadow: 0 7px 18px rgba(124, 58, 237, 0.18);
        }

        .your-rank-info > span {
          color: #7c3aed;
          font-size: 7px;
          font-weight: 600;
          letter-spacing: 1px;
        }

        .your-rank-info h3 {
          margin: 3px 0;
          color: #302532;
          font-size: 15px;
          font-weight: 500;
        }

        .your-rank-info p {
          margin: 0;
          color: #9a909f;
          font-size: 9px;
        }

        .your-rank-stats {
          display: flex;
          align-items: center;
          gap: 27px;
        }

        .your-rank-stats > div {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .your-rank-stats strong {
          color: #302532;
          font-size: 13px;
          font-weight: 500;
        }

        .your-rank-stats span {
          color: #9c929f;
          font-size: 7px;
        }

        /* TABLET */

        @media (max-width: 900px) {
          .leaderboard-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .header-stats {
            width: 100%;
            justify-content: space-around;
          }

          .mini-stat {
            text-align: center;
          }

          .board-top {
            align-items: flex-start;
            flex-direction: column;
          }

          .filter-buttons {
            width: 100%;
          }

          .filter-btn {
            flex: 1;
          }

          .podium {
            gap: 10px;
          }

          .table-heading,
          .leader-row {
            grid-template-columns:
              55px
              minmax(180px, 1fr)
              90px
              70px;
          }

          .table-heading span:nth-child(5),
          .table-heading span:nth-child(6),
          .leader-row .accuracy-cell,
          .leader-row .streak-cell {
            display: none;
          }

          .your-rank-card {
            align-items: flex-start;
            flex-direction: column;
          }

          .your-rank-stats {
            width: 100%;
            justify-content: space-between;
          }
        }

        /* MOBILE */

        @media (max-width: 768px) {
          .leaderboard-main {
            padding: 68px 0 55px;
            background-attachment: scroll;
          }

          .leaderboard-content {
            width: calc(100% - 24px);
          }

          .leaderboard-header {
            gap: 20px;
          }

          .header-left h1 {
            font-size: 40px;
          }

          .header-left p {
            font-size: 11px;
          }

          .header-stats {
            padding: 13px 8px;
          }

          .mini-stat {
            min-width: 65px;
          }

          .mini-stat strong {
            font-size: 14px;
          }

          .mini-stat span {
            font-size: 7px;
          }

          .stat-line {
            margin: 0 7px;
          }

          .board-section {
            padding: 17px;
            border-radius: 17px;
          }

          .board-top h2 {
            font-size: 22px;
          }

          .filter-buttons {
            overflow-x: auto;
          }

          .filter-btn {
            flex: 0 0 auto;
            white-space: nowrap;
          }

          .search-box {
            width: 100%;
          }

          .search-row {
            justify-content: stretch;
          }

          .podium {
            grid-template-columns: 1fr 1fr;
          }

          .podium-card.first {
            grid-column: 1 / -1;
            grid-row: 1;
            min-height: 325px;
          }

          .podium-card.second {
            grid-column: 1;
            grid-row: 2;
          }

          .podium-card.third {
            grid-column: 2;
            grid-row: 2;
          }

          .podium-card {
            min-height: 270px;
            padding-left: 10px;
            padding-right: 10px;
          }

          .avatar {
            width: 65px;
            height: 65px;
          }

          .first .avatar {
            width: 80px;
            height: 80px;
          }

          .podium-card h3,
          .first h3 {
            max-width: 130px;
            font-size: 13px;
          }

          .podium-points {
            font-size: 15px;
          }

          .podium-footer {
            width: calc(100% + 20px);
          }

          .ranking-card {
            margin-top: 20px;
          }

          .ranking-card-header {
            padding: 16px;
          }

          .table-wrapper {
            overflow-x: auto;
          }

          .table-heading,
          .leader-row {
            min-width: 570px;
          }

          .your-rank-card {
            padding: 17px;
          }

          .your-rank-stats {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 17px;
          }
        }

        @media (max-width: 420px) {
          .header-left h1 {
            font-size: 35px;
          }

          .header-stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
          }

          .stat-line {
            display: none;
          }

          .mini-stat {
            min-width: 0;
          }

          .mini-stat strong {
            font-size: 13px;
          }

          .podium {
            gap: 7px;
          }

          .podium-card {
            padding-left: 7px;
            padding-right: 7px;
          }

          .podium-card h3,
          .first h3 {
            max-width: 105px;
            font-size: 11px;
          }

          .username {
            font-size: 8px;
          }

          .podium-points {
            font-size: 14px;
          }

          .podium-footer {
            font-size: 6px;
          }
        }
      `}</style>
    </div>
  );
}

export default Leaderboard;
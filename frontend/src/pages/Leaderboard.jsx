import React, { useMemo, useState } from "react";
import Navbar from "../components/Navbar";

const leaderboardData = [
  {
    rank: 1,
    name: "Aadi Singh",
    username: "@aadi",
    points: 9850,
    tests: 48,
    accuracy: 96,
    streak: 28,
    avatar: "/aadi.png",
  },
  {
    rank: 2,
    name: "Rahul Kumar",
    username: "@rahul",
    points: 9420,
    tests: 45,
    accuracy: 93,
    streak: 24,
    avatar: "/aadi.png",
  },
  {
    rank: 3,
    name: "Priya Sharma",
    username: "@priya",
    points: 9180,
    tests: 43,
    accuracy: 91,
    streak: 21,
    avatar: "/aadi.png",
  },
  {
    rank: 4,
    name: "Ankit Verma",
    username: "@ankit",
    points: 8740,
    tests: 41,
    accuracy: 89,
    streak: 19,
    avatar: "/aadi.png",
  },
  {
    rank: 5,
    name: "Sneha Gupta",
    username: "@sneha",
    points: 8420,
    tests: 39,
    accuracy: 88,
    streak: 17,
    avatar: "/aadi.png",
  },
  {
    rank: 6,
    name: "Arjun Singh",
    username: "@arjun",
    points: 8150,
    tests: 37,
    accuracy: 86,
    streak: 15,
    avatar: "/aadi.png",
  },
  {
    rank: 7,
    name: "Neha Yadav",
    username: "@neha",
    points: 7920,
    tests: 35,
    accuracy: 85,
    streak: 14,
    avatar: "/aadi.png",
  },
  {
    rank: 8,
    name: "Rohit Mishra",
    username: "@rohit",
    points: 7640,
    tests: 34,
    accuracy: 83,
    streak: 12,
    avatar: "/aadi.png",
  },
  {
    rank: 9,
    name: "Simran Kaur",
    username: "@simran",
    points: 7380,
    tests: 32,
    accuracy: 82,
    streak: 11,
    avatar: "/aadi.png",
  },
  {
    rank: 10,
    name: "Vivek Singh",
    username: "@vivek",
    points: 7140,
    tests: 30,
    accuracy: 80,
    streak: 9,
    avatar: "/aadi.png",
  },
];

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

  const filteredUsers = useMemo(() => {
    return leaderboardData.filter((user) => {
      const value = search.toLowerCase().trim();

      if (!value) return true;

      return (
        user.name.toLowerCase().includes(value) ||
        user.username.toLowerCase().includes(value)
      );
    });
  }, [search]);

  const topThree = leaderboardData.slice(0, 3);
  const remainingUsers = filteredUsers.filter((user) => user.rank > 3);

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
        activePage="leaderboard"
      />

      <main className="leaderboard-main">
        <section className="leaderboard-hero">
          <div className="hero-background">
            <img src="/aadi.png" alt="" />
          </div>

          <div className="hero-overlay" />

          <div className="hero-content">
            <div className="hero-badge">
              <span>🏆</span>
              <span>StudyGem Leaderboard</span>
            </div>

            <h1>
              Compete.
              <br />
              <span>Learn. Rise.</span>
            </h1>

            <p>
              See where you stand among the top learners and keep pushing
              yourself higher.
            </p>

            <div className="hero-stats">
              <div className="hero-stat">
                <strong>10K+</strong>
                <span>Students</span>
              </div>

              <div className="hero-divider" />

              <div className="hero-stat">
                <strong>50K+</strong>
                <span>Tests Taken</span>
              </div>

              <div className="hero-divider" />

              <div className="hero-stat">
                <strong>1M+</strong>
                <span>Points Earned</span>
              </div>
            </div>
          </div>
        </section>

        <section className="leaderboard-section">
          <div className="section-header">
            <div>
              <div className="section-label">
                <span />
                TOP LEARNERS
              </div>

              <h2>Leaderboard</h2>

              <p>
                Your consistency decides your position. Keep learning and
                climb the rankings.
              </p>
            </div>

            <div className="filter-buttons">
              {["All Time", "This Month", "This Week"].map((filter) => (
                <button
                  key={filter}
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

          <div className="search-row">
            <div className="search-box">
              <span className="search-icon">⌕</span>

              <input
                type="text"
                placeholder="Search learner..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              {search && (
                <button
                  className="clear-search"
                  onClick={() => setSearch("")}
                >
                  ×
                </button>
              )}
            </div>
          </div>

          <div className="podium-wrapper">
            <div className="podium-card second">
              <div className="rank-number">2</div>

              <div className="avatar-wrap silver">
                <img
                  src={topThree[1]?.avatar || "/aadi.png"}
                  alt={topThree[1]?.name}
                />
              </div>

              <div className="podium-medal">🥈</div>

              <h3>{topThree[1]?.name}</h3>
              <span className="username">{topThree[1]?.username}</span>

              <div className="points">
                {topThree[1]?.points.toLocaleString()}{" "}
                <small>XP</small>
              </div>

              <div className="podium-base">
                <span>2</span>
              </div>
            </div>

            <div className="podium-card first">
              <div className="crown">👑</div>

              <div className="rank-number">1</div>

              <div className="avatar-wrap gold">
                <img
                  src={topThree[0]?.avatar || "/aadi.png"}
                  alt={topThree[0]?.name}
                />
              </div>

              <div className="podium-medal">🥇</div>

              <h3>{topThree[0]?.name}</h3>
              <span className="username">{topThree[0]?.username}</span>

              <div className="points">
                {topThree[0]?.points.toLocaleString()}{" "}
                <small>XP</small>
              </div>

              <div className="podium-base">
                <span>1</span>
              </div>
            </div>

            <div className="podium-card third">
              <div className="rank-number">3</div>

              <div className="avatar-wrap bronze">
                <img
                  src={topThree[2]?.avatar || "/aadi.png"}
                  alt={topThree[2]?.name}
                />
              </div>

              <div className="podium-medal">🥉</div>

              <h3>{topThree[2]?.name}</h3>
              <span className="username">{topThree[2]?.username}</span>

              <div className="points">
                {topThree[2]?.points.toLocaleString()}{" "}
                <small>XP</small>
              </div>

              <div className="podium-base">
                <span>3</span>
              </div>
            </div>
          </div>

          <div className="leaderboard-table-card">
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
                remainingUsers.map((user) => (
                  <div
                    className={
                      user.name === "Aadi Singh"
                        ? "leader-row current-user"
                        : "leader-row"
                    }
                    key={user.rank}
                  >
                    <div className="rank-cell">
                      <span>#{user.rank}</span>
                    </div>

                    <div className="learner-cell">
                      <div className="small-avatar">
                        <img
                          src={user.avatar || "/aadi.png"}
                          alt={user.name}
                        />
                      </div>

                      <div>
                        <strong>{user.name}</strong>
                        <span>{user.username}</span>
                      </div>

                      {user.name === "Aadi Singh" && (
                        <span className="you-badge">YOU</span>
                      )}
                    </div>

                    <div className="points-cell">
                      {user.points.toLocaleString()}
                      <small> XP</small>
                    </div>

                    <div className="tests-cell">{user.tests}</div>

                    <div className="accuracy-cell">
                      <div className="accuracy-value">
                        <span>{user.accuracy}%</span>
                      </div>

                      <div className="progress-track">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${user.accuracy}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="streak-cell">
                      <span>🔥</span>
                      {user.streak}
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <div>🔎</div>
                  <h3>No learner found</h3>
                  <p>Try searching with another name or username.</p>
                </div>
              )}
            </div>
          </div>

          <div className="your-rank-card">
            <div className="your-rank-left">
              <div className="rank-circle">#1</div>

              <div>
                <span className="your-label">YOUR CURRENT RANK</span>
                <h3>Aadi Singh</h3>
                <p>Keep going — you're doing great!</p>
              </div>
            </div>

            <div className="your-rank-stats">
              <div>
                <strong>9,850</strong>
                <span>XP Points</span>
              </div>

              <div>
                <strong>48</strong>
                <span>Tests</span>
              </div>

              <div>
                <strong>96%</strong>
                <span>Accuracy</span>
              </div>

              <div>
                <strong>28 🔥</strong>
                <span>Day Streak</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <style>{`
        * {
          box-sizing: border-box;
        }

        .leaderboard-page {
          min-height: 100vh;
          width: 100%;
          background: #faf7ff;
          color: #111827;
          overflow-x: hidden;
        }

        .leaderboard-main {
          width: 100%;
        }

        .leaderboard-hero {
          min-height: 500px;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          isolation: isolate;
          background: #17102d;
        }

        .hero-background {
          position: absolute;
          inset: 0;
          z-index: -2;
        }

        .hero-background img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          opacity: 0.48;
          filter: saturate(0.9);
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          z-index: -1;
          background:
            linear-gradient(
              90deg,
              rgba(12, 7, 29, 0.96) 0%,
              rgba(24, 13, 53, 0.88) 38%,
              rgba(53, 25, 93, 0.58) 72%,
              rgba(13, 7, 28, 0.82) 100%
            );
        }

        .hero-content {
          width: min(1180px, calc(100% - 48px));
          margin: 0 auto;
          padding: 75px 0;
          color: white;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 9px 15px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.09);
          backdrop-filter: blur(12px);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.3px;
          margin-bottom: 22px;
        }

        .hero-badge span:first-child {
          font-size: 16px;
        }

        .hero-content h1 {
          margin: 0;
          font-size: clamp(44px, 6vw, 76px);
          line-height: 0.98;
          letter-spacing: -3px;
          font-weight: 800;
          max-width: 650px;
        }

        .hero-content h1 span {
          color: #c4b5fd;
        }

        .hero-content > p {
          max-width: 570px;
          margin: 24px 0 35px;
          color: rgba(255, 255, 255, 0.78);
          font-size: 17px;
          line-height: 1.7;
        }

        .hero-stats {
          display: flex;
          align-items: center;
          gap: 30px;
        }

        .hero-stat {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .hero-stat strong {
          font-size: 23px;
          font-weight: 800;
        }

        .hero-stat span {
          color: rgba(255, 255, 255, 0.6);
          font-size: 12px;
        }

        .hero-divider {
          height: 38px;
          width: 1px;
          background: rgba(255, 255, 255, 0.2);
        }

        .leaderboard-section {
          width: min(1180px, calc(100% - 48px));
          margin: 0 auto;
          padding: 75px 0 90px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 30px;
        }

        .section-label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #7c3aed;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.5px;
          margin-bottom: 10px;
        }

        .section-label span {
          width: 24px;
          height: 2px;
          background: #7c3aed;
          border-radius: 10px;
        }

        .section-header h2 {
          margin: 0;
          font-size: 42px;
          line-height: 1.1;
          letter-spacing: -1.5px;
          color: #111827;
        }

        .section-header p {
          margin: 10px 0 0;
          color: #6b7280;
          font-size: 14px;
          line-height: 1.6;
        }

        .filter-buttons {
          display: flex;
          gap: 7px;
          padding: 5px;
          background: white;
          border: 1px solid #e9d5ff;
          border-radius: 13px;
          box-shadow: 0 8px 25px rgba(76, 29, 149, 0.06);
        }

        .filter-btn {
          border: 0;
          background: transparent;
          padding: 10px 14px;
          border-radius: 9px;
          color: #6b7280;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .filter-btn:hover {
          color: #5b21b6;
        }

        .filter-btn.active {
          background: #7c3aed;
          color: white;
          box-shadow: 0 5px 12px rgba(124, 58, 237, 0.25);
        }

        .search-row {
          display: flex;
          justify-content: flex-end;
          margin-top: 30px;
        }

        .search-box {
          width: 280px;
          height: 44px;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 0 13px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 11px;
          transition: 0.2s ease;
        }

        .search-box:focus-within {
          border-color: #a78bfa;
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.08);
        }

        .search-icon {
          color: #9ca3af;
          font-size: 22px;
          transform: rotate(-20deg);
        }

        .search-box input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: #111827;
          font-size: 13px;
        }

        .search-box input::placeholder {
          color: #9ca3af;
        }

        .clear-search {
          border: 0;
          background: #f3f4f6;
          color: #6b7280;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          cursor: pointer;
          line-height: 20px;
        }

        .podium-wrapper {
          display: flex;
          justify-content: center;
          align-items: flex-end;
          gap: 22px;
          margin-top: 55px;
          min-height: 460px;
        }

        .podium-card {
          width: 31%;
          max-width: 310px;
          min-height: 340px;
          position: relative;
          padding: 38px 25px 0;
          text-align: center;
          background: white;
          border: 1px solid #ede9fe;
          border-radius: 22px 22px 0 0;
          box-shadow: 0 18px 45px rgba(76, 29, 149, 0.09);
        }

        .podium-card.first {
          min-height: 410px;
          padding-top: 52px;
          border-color: #ddd6fe;
          box-shadow: 0 22px 60px rgba(124, 58, 237, 0.16);
        }

        .podium-card.second {
          min-height: 365px;
        }

        .podium-card.third {
          min-height: 335px;
        }

        .rank-number {
          position: absolute;
          top: 16px;
          left: 18px;
          width: 30px;
          height: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 50%;
          background: #f5f3ff;
          color: #6d28d9;
          font-size: 12px;
          font-weight: 800;
        }

        .crown {
          position: absolute;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 38px;
          filter: drop-shadow(0 5px 7px rgba(0, 0, 0, 0.12));
        }

        .avatar-wrap {
          width: 92px;
          height: 92px;
          padding: 4px;
          margin: 0 auto;
          border-radius: 50%;
          background: #e5e7eb;
        }

        .first .avatar-wrap {
          width: 108px;
          height: 108px;
        }

        .avatar-wrap.gold {
          background: linear-gradient(135deg, #f59e0b, #fbbf24, #f97316);
          box-shadow: 0 0 0 6px #fef3c7;
        }

        .avatar-wrap.silver {
          background: linear-gradient(135deg, #9ca3af, #e5e7eb, #6b7280);
          box-shadow: 0 0 0 6px #f3f4f6;
        }

        .avatar-wrap.bronze {
          background: linear-gradient(135deg, #b45309, #d97706, #92400e);
          box-shadow: 0 0 0 6px #ffedd5;
        }

        .avatar-wrap img {
          width: 100%;
          height: 100%;
          display: block;
          border-radius: 50%;
          object-fit: cover;
          background: #f5f3ff;
        }

        .podium-medal {
          margin-top: 10px;
          font-size: 22px;
        }

        .podium-card h3 {
          margin: 8px 0 2px;
          color: #111827;
          font-size: 17px;
          font-weight: 800;
        }

        .first h3 {
          font-size: 20px;
        }

        .username {
          color: #9ca3af;
          font-size: 11px;
        }

        .points {
          margin-top: 13px;
          color: #5b21b6;
          font-size: 21px;
          font-weight: 800;
        }

        .points small {
          font-size: 10px;
          color: #8b5cf6;
        }

        .podium-base {
          height: 44px;
          margin: 20px -25px 0;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #f5f3ff;
          color: #7c3aed;
          font-size: 16px;
          font-weight: 800;
        }

        .first .podium-base {
          background: #ede9fe;
          color: #6d28d9;
        }

        .leaderboard-table-card {
          margin-top: 45px;
          background: white;
          border: 1px solid #e9d5ff;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 12px 35px rgba(76, 29, 149, 0.06);
        }

        .table-heading,
        .leader-row {
          display: grid;
          grid-template-columns: 80px minmax(230px, 1.5fr) 110px 80px minmax(150px, 1fr) 90px;
          align-items: center;
          gap: 15px;
          padding: 0 25px;
        }

        .table-heading {
          min-height: 52px;
          background: #faf7ff;
          border-bottom: 1px solid #eee7f8;
          color: #9ca3af;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.8px;
          text-transform: uppercase;
        }

        .leader-row {
          min-height: 78px;
          border-bottom: 1px solid #f1f1f4;
          transition: 0.2s ease;
        }

        .leader-row:last-child {
          border-bottom: 0;
        }

        .leader-row:hover {
          background: #fcfaff;
        }

        .leader-row.current-user {
          background: #faf5ff;
          box-shadow: inset 3px 0 0 #7c3aed;
        }

        .rank-cell {
          color: #6b7280;
          font-size: 13px;
          font-weight: 800;
        }

        .learner-cell {
          display: flex;
          align-items: center;
          gap: 11px;
          min-width: 0;
        }

        .small-avatar {
          flex: 0 0 auto;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          background: #ede9fe;
        }

        .small-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .learner-cell > div:last-of-type {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .learner-cell strong {
          color: #111827;
          font-size: 13px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .learner-cell span {
          color: #9ca3af;
          font-size: 10px;
        }

        .you-badge {
          margin-left: 4px;
          padding: 4px 7px;
          border-radius: 5px;
          background: #ede9fe;
          color: #6d28d9 !important;
          font-size: 8px !important;
          font-weight: 800;
        }

        .points-cell {
          color: #5b21b6;
          font-size: 13px;
          font-weight: 800;
        }

        .points-cell small {
          color: #9ca3af;
          font-size: 9px;
        }

        .tests-cell {
          color: #4b5563;
          font-size: 13px;
          font-weight: 700;
        }

        .accuracy-cell {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .accuracy-value span {
          color: #374151;
          font-size: 12px;
          font-weight: 700;
        }

        .progress-track {
          width: 100%;
          height: 5px;
          overflow: hidden;
          border-radius: 999px;
          background: #ede9fe;
        }

        .progress-fill {
          height: 100%;
          border-radius: inherit;
          background: #7c3aed;
        }

        .streak-cell {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #4b5563;
          font-size: 12px;
          font-weight: 800;
        }

        .empty-state {
          padding: 70px 20px;
          text-align: center;
        }

        .empty-state > div {
          font-size: 34px;
          margin-bottom: 10px;
        }

        .empty-state h3 {
          margin: 0 0 5px;
          font-size: 17px;
        }

        .empty-state p {
          margin: 0;
          color: #9ca3af;
          font-size: 12px;
        }

        .your-rank-card {
          margin-top: 22px;
          padding: 22px 25px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 30px;
          border: 1px solid #ddd6fe;
          border-radius: 18px;
          background: linear-gradient(
            100deg,
            #f5f3ff,
            #ffffff
          );
        }

        .your-rank-left {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .rank-circle {
          width: 58px;
          height: 58px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 50%;
          background: #7c3aed;
          color: white;
          font-size: 15px;
          font-weight: 800;
          box-shadow: 0 8px 18px rgba(124, 58, 237, 0.25);
        }

        .your-label {
          color: #7c3aed;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .your-rank-left h3 {
          margin: 3px 0;
          color: #111827;
          font-size: 17px;
        }

        .your-rank-left p {
          margin: 0;
          color: #9ca3af;
          font-size: 11px;
        }

        .your-rank-stats {
          display: flex;
          align-items: center;
          gap: 35px;
        }

        .your-rank-stats > div {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .your-rank-stats strong {
          color: #111827;
          font-size: 16px;
        }

        .your-rank-stats span {
          color: #9ca3af;
          font-size: 9px;
        }

        @media (max-width: 900px) {
          .section-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .filter-buttons {
            width: 100%;
          }

          .filter-btn {
            flex: 1;
          }

          .podium-wrapper {
            gap: 12px;
          }

          .podium-card {
            padding-left: 15px;
            padding-right: 15px;
          }

          .podium-base {
            margin-left: -15px;
            margin-right: -15px;
          }

          .table-heading,
          .leader-row {
            grid-template-columns: 55px minmax(180px, 1fr) 95px 70px;
          }

          .table-heading span:nth-child(5),
          .table-heading span:nth-child(6),
          .leader-row > .accuracy-cell,
          .leader-row > .streak-cell {
            display: none;
          }

          .your-rank-card {
            flex-direction: column;
            align-items: flex-start;
          }

          .your-rank-stats {
            width: 100%;
            justify-content: space-between;
          }
        }

        @media (max-width: 650px) {
          .hero-content,
          .leaderboard-section {
            width: min(100% - 28px, 1180px);
          }

          .leaderboard-hero {
            min-height: 540px;
          }

          .hero-content {
            padding: 55px 0;
          }

          .hero-content h1 {
            font-size: 48px;
            letter-spacing: -2px;
          }

          .hero-content > p {
            font-size: 14px;
            max-width: 420px;
          }

          .hero-stats {
            gap: 17px;
          }

          .hero-stat strong {
            font-size: 17px;
          }

          .hero-stat span {
            font-size: 9px;
          }

          .section-header h2 {
            font-size: 34px;
          }

          .filter-buttons {
            overflow-x: auto;
          }

          .filter-btn {
            white-space: nowrap;
            flex: 0 0 auto;
          }

          .search-row {
            justify-content: stretch;
          }

          .search-box {
            width: 100%;
          }

          .podium-wrapper {
            display: grid;
            grid-template-columns: 1fr 1fr;
            align-items: end;
            gap: 10px;
            min-height: auto;
          }

          .podium-card {
            width: 100%;
            max-width: none;
            min-height: 280px !important;
            padding-top: 35px;
          }

          .podium-card.first {
            grid-column: 1 / -1;
            grid-row: 1;
            min-height: 340px !important;
          }

          .podium-card.second {
            grid-column: 1;
            grid-row: 2;
          }

          .podium-card.third {
            grid-column: 2;
            grid-row: 2;
          }

          .first .avatar-wrap {
            width: 90px;
            height: 90px;
          }

          .avatar-wrap {
            width: 72px;
            height: 72px;
          }

          .podium-card h3,
          .first h3 {
            font-size: 15px;
          }

          .points {
            font-size: 17px;
          }

          .leaderboard-table-card {
            overflow-x: auto;
          }

          .table-heading,
          .leader-row {
            min-width: 580px;
          }

          .your-rank-card {
            padding: 18px;
          }

          .your-rank-stats {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 18px;
          }
        }

        @media (max-width: 420px) {
          .hero-content h1 {
            font-size: 41px;
          }

          .hero-stats {
            flex-wrap: wrap;
          }

          .hero-divider {
            display: none;
          }

          .podium-wrapper {
            gap: 8px;
          }

          .podium-card {
            padding-left: 10px;
            padding-right: 10px;
          }

          .podium-base {
            margin-left: -10px;
            margin-right: -10px;
          }

          .podium-medal {
            font-size: 18px;
          }

          .points {
            font-size: 15px;
          }

          .username {
            font-size: 9px;
          }
        }
      `}</style>
    </div>
  );
}

export default Leaderboard;
import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";

import {
  ArrowLeft,
  Award,
  BarChart3,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  Flame,
  GraduationCap,
  Mail,
  Medal,
  Pencil,
  Target,
  TrendingUp,
  Trophy,
  User,
  X,
  XCircle,
  Zap,
} from "lucide-react";

function Profile({ onBack, onLogout }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [showEdit, setShowEdit] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState("");

  const user = useMemo(() => {
    try {
      const saved = localStorage.getItem("studyGemUser");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  }, []);

  const studentName =
    user?.name ||
    user?.fullName ||
    user?.username ||
    "StudyGem Student";

  const email = user?.email || "student@studygem.com";

  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    const loadProfileStats = async () => {
      const token = localStorage.getItem("studyGemToken");

      if (!token) {
        setProfileError("Authentication required.");
        setProfileLoading(false);
        return;
      }

      try {
        setProfileLoading(true);
        setProfileError("");

        const response = await fetch(`${API_BASE_URL}/profile/stats`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load profile data.");
        }

        setProfileData(data.stats);
      } catch (error) {
        console.error("Profile Stats Error:", error);
        setProfileError(
          error.message || "Unable to load profile data."
        );
      } finally {
        setProfileLoading(false);
      }
    };

    loadProfileStats();
  }, [API_BASE_URL]);

  const stats = profileData || {};
  const totalQuestions = Number(stats.totalQuestions) || 0;
  const correct = Number(stats.correct) || 0;
  const wrong = Number(stats.wrong) || 0;
  const skipped = Number(stats.skipped) || 0;
  const accuracy = Number(stats.accuracy) || 0;
  const mockTests = Number(stats.totalTests) || 0;

  const weeklyActivity = Array.isArray(stats.weeklyActivity)
    ? stats.weeklyActivity
    : [0, 0, 0, 0, 0, 0, 0];

  const weeklyAccuracy = Array.isArray(stats.weeklyAccuracy)
    ? stats.weeklyAccuracy
    : [0, 0, 0, 0, 0, 0, 0];

  const subjectData = Array.isArray(stats.subjectPerformance)
    ? stats.subjectPerformance
    : [];

  const mockHistory = Array.isArray(stats.recentTests)
    ? stats.recentTests
    : [];

  const streak = Number(stats.streak) || 0;
  const leaderboardRank = stats.leaderboardRank
    ? `#${stats.leaderboardRank}`
    : "—";
  const badges = Number(stats.badges) || 0;

  return (
    <div
      className="min-h-screen w-full overflow-x-hidden bg-[#f6f5ff] text-[#11183b]"
      style={{ fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" }}
    >
      <Navbar />

      <main className="mx-auto w-full max-w-[1500px] px-3 pb-12 pt-5 sm:px-5 lg:px-8">
        {profileError && (
          <div className="mb-4 rounded-2xl border border-[#ffd9e2] bg-[#fff5f7] px-4 py-3 text-xs font-medium text-[#c43b59]">
            {profileError}
          </div>
        )}

        {/* PAGE TITLE ROW */}
        <div className="mb-5 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-medium text-[#202744] shadow-[0_5px_18px_rgba(83,52,180,0.07)] transition hover:bg-[#faf9ff]"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#eee9ff] text-[#6425ed]">
              <ArrowLeft size={16} />
            </span>
            Back
          </button>

          <div className="absolute left-1/2 hidden -translate-x-1/2 text-center sm:block">
            <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#777fa0]">
              Student Dashboard
            </p>
            <h1 className="mt-0.5 text-[22px] font-semibold tracking-[-0.03em] text-[#10163b]">
              My Profile
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setShowEdit(true)}
            className="ml-auto flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#7428f2] to-[#5a27e9] px-3.5 py-2.5 text-xs font-medium text-white shadow-[0_8px_22px_rgba(101,38,237,0.18)] transition hover:-translate-y-0.5"
          >
            <Pencil size={15} />
            <span className="hidden sm:block">Edit Profile</span>
          </button>
        </div>

        {/* PROFILE HERO */}
        <section className="relative overflow-hidden rounded-[22px] border border-white bg-white shadow-[0_14px_45px_rgba(83,52,180,0.08)]">
          <div className="absolute inset-0 bg-gradient-to-r from-[#f0ebff] via-white to-[#eef0ff]" />
          <div className="absolute -right-24 -top-32 h-80 w-80 rounded-full bg-[#9c7cff]/10 blur-3xl" />
          <div className="absolute -bottom-36 left-16 h-80 w-80 rounded-full bg-[#6e55f4]/10 blur-3xl" />

          <div className="relative flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between lg:px-7 lg:py-5">
            <div className="flex min-w-0 items-center gap-4 sm:gap-5">
              <div className="relative shrink-0">
                <div className="flex h-[82px] w-[82px] items-center justify-center rounded-full border-[2px] border-white bg-gradient-to-br from-[#e5e0ff] to-[#c9c3fb] text-[35px] font-medium text-[#11183b] shadow-[0_0_0_2px_#d8d1ff,0_8px_22px_rgba(83,52,180,0.12)] sm:h-[96px] sm:w-[96px] sm:text-[40px]">
                  {studentName.charAt(0).toUpperCase()}
                </div>
                <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-[3px] border-white bg-[#10163b] text-white shadow-sm">
                  <Pencil size={13} />
                </span>
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-[23px] font-semibold tracking-[-0.035em] text-[#10163b] sm:text-[27px]">
                    {studentName}
                  </h2>
                  <span className="rounded-full bg-[#e7dcff] px-2.5 py-1 text-[9px] font-medium text-[#6425ed]">
                    STUDENT
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] font-normal text-[#697399]">
                  <span className="inline-flex items-center gap-1.5">
                    <Mail size={13} />
                    {email}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <GraduationCap size={13} />
                    B.Tech CSE (AI)
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Target size={13} />
                    MNC Placement
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-normal text-[#626b88] shadow-sm">
                    <CalendarDays size={11} className="mr-1 inline" />
                    Learning since 2023
                  </span>
                  <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-normal text-[#626b88] shadow-sm">
                    <Target size={11} className="mr-1 inline" />
                    Target: MNC Placement
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5 sm:min-w-[390px]">
              <MiniHeroStat
                icon={<Flame size={16} />}
                value={profileLoading ? "—" : streak}
                label="Day Streak"
              />
              <MiniHeroStat
                icon={<Trophy size={16} />}
                value={profileLoading ? "—" : leaderboardRank}
                label="Leaderboard"
              />
              <MiniHeroStat
                icon={<Award size={16} />}
                value={profileLoading ? "—" : badges}
                label="Badges"
              />
            </div>
          </div>
        </section>

        {/* TABS */}
        <div className="mt-4 flex overflow-x-auto rounded-2xl border border-white bg-white p-1.5 shadow-[0_8px_28px_rgba(83,52,180,0.06)]">
          {[
            ["overview", "Overview"],
            ["analytics", "Analytics"],
            ["history", "Test History"],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`min-w-[110px] flex-1 rounded-xl px-4 py-2.5 text-xs font-medium transition sm:text-sm ${
                activeTab === id
                  ? "bg-[#ddd0ff] text-[#6425ed]"
                  : "text-[#697399] hover:bg-[#faf9ff]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <>
            {/* KPI CARDS */}
            <section className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
              <StatCard
                icon={<BookOpen size={20} />}
                label="Questions Attempted"
                value={totalQuestions.toLocaleString()}
                sub="Across all practice"
                iconClass="bg-[#eee7ff] text-[#6425ed]"
                trend="↑ 12%"
                trendClass="text-[#12a66e]"
              />
              <StatCard
                icon={<CheckCircle2 size={20} />}
                label="Correct Answers"
                value={correct.toLocaleString()}
                sub={`${accuracy}% accuracy`}
                iconClass="bg-[#ddf7eb] text-[#159765]"
                trend="↑ 10%"
                trendClass="text-[#12a66e]"
              />
              <StatCard
                icon={<XCircle size={20} />}
                label="Wrong Answers"
                value={wrong.toLocaleString()}
                sub="Areas to improve"
                iconClass="bg-[#ffe7ed] text-[#df4d6a]"
                trend="↓ 5%"
                trendClass="text-[#df4d6a]"
              />
              <StatCard
                icon={<Trophy size={20} />}
                label="Mock Tests"
                value={mockTests.toLocaleString()}
                sub="Completed tests"
                iconClass="bg-[#e7edff] text-[#4f46e5]"
                trend="↑ 22%"
                trendClass="text-[#12a66e]"
              />
            </section>

            {/* MAIN GRID */}
            <section className="mt-4 grid gap-4 xl:grid-cols-[1.55fr_1fr]">
              {/* ACTIVITY */}
              <div className="rounded-[22px] border border-white bg-white p-5 shadow-[0_10px_32px_rgba(83,52,180,0.06)] sm:p-6">
                <SectionHeader
                  icon={<BarChart3 size={18} />}
                  title="Learning Activity"
                  subtitle="Questions solved during the last 7 days"
                  action={
                    <button
                      type="button"
                      className="rounded-lg border border-[#e6e2f5] px-3 py-1.5 text-[10px] font-medium text-[#202744]"
                    >
                      Last 7 Days <ChevronDown size={12} className="ml-1 inline" />
                    </button>
                  }
                />

                <div className="mt-6">
                  <div className="flex h-[205px] items-end gap-2 sm:gap-4">
                    {weeklyActivity.map((value, index) => (
                      <div
                        key={index}
                        className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                      >
                        <span className="text-[10px] font-normal text-[#697399]">
                          {value}
                        </span>
                        <div className="flex h-[160px] w-full items-end rounded-lg bg-[#f4f1ff] p-1">
                          <div
                            className="w-full rounded-md bg-gradient-to-t from-[#6d28d9] to-[#a78bfa]"
                            style={{
                              height: `${Math.min(Math.max(value, 10), 100)}%`,
                            }}
                          />
                        </div>
                        <span className="text-[10px] font-normal text-[#858da6]">
                          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* PERFORMANCE */}
              <div className="rounded-[22px] border border-white bg-white p-5 shadow-[0_10px_32px_rgba(83,52,180,0.06)] sm:p-6">
                <SectionHeader
                  icon={<Target size={18} />}
                  title="Overall Performance"
                  subtitle="Your current learning health"
                  action={
                    <button
                      type="button"
                      className="text-[10px] font-medium text-[#6425ed]"
                    >
                      View Detailed Report <ChevronRight size={13} className="inline" />
                    </button>
                  }
                />

                <div className="mt-5 flex flex-col items-center gap-5 sm:flex-row sm:justify-center">
                  <div
                    className="relative flex h-[155px] w-[155px] shrink-0 items-center justify-center rounded-full"
                    style={{
                      background: `conic-gradient(#7c3aed 0 ${accuracy}%, #eee9f8 ${accuracy}% 100%)`,
                    }}
                  >
                    <div className="flex h-[119px] w-[119px] flex-col items-center justify-center rounded-full bg-white">
                      <span className="text-[31px] font-semibold tracking-[-0.04em] text-[#10163b]">
                        {accuracy}%
                      </span>
                      <span className="mt-0.5 text-[9px] font-normal text-[#8189a3]">
                        Overall Accuracy
                      </span>
                    </div>
                  </div>

                  <div className="w-full max-w-[270px] overflow-hidden rounded-xl border border-[#ece9f6]">
                    <MetricRow dot="bg-[#19ae79]" label="Correct" value={correct.toLocaleString()} />
                    <MetricRow dot="bg-[#ef5c78]" label="Wrong" value={wrong.toLocaleString()} />
                    <MetricRow dot="bg-[#dfe1ee]" label="Skipped" value={skipped.toLocaleString()} />
                    <div className="flex items-center justify-between bg-[#f8f6ff] px-3 py-2.5">
                      <span className="text-[10px] font-medium text-[#202744]">
                        <BookOpen size={13} className="mr-1 inline text-[#6425ed]" />
                        Total Attempts
                      </span>
                      <span className="text-xs font-semibold text-[#10163b]">
                        {totalQuestions.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SUBJECT PERFORMANCE */}
            <section className="mt-4 rounded-[22px] border border-white bg-white p-5 shadow-[0_10px_32px_rgba(83,52,180,0.06)] sm:p-6">
              <SectionHeader
                icon={<BookOpen size={18} />}
                title="Subject Performance"
                subtitle="See where you are strongest and where you need more practice"
                action={
                  <button
                    type="button"
                    className="text-[10px] font-medium text-[#6425ed]"
                  >
                    View All Subjects <ChevronRight size={13} className="inline" />
                  </button>
                }
              />

              <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {subjectData.map((subject) => (
                  <SubjectCard key={subject.name} subject={subject} />
                ))}
              </div>
            </section>

            {/* STRENGTHS + IMPROVEMENT */}
            <section className="mt-4 grid gap-4 lg:grid-cols-2">
              <PerformanceList
                title="Your Strengths"
                subtitle="Subjects where you're performing well"
                icon={<Trophy size={18} />}
                positive
                items={subjectData
                  .filter((item) => item.accuracy >= 80)
                  .sort((a, b) => b.accuracy - a.accuracy)
                  .slice(0, 4)}
              />

              <PerformanceList
                title="Needs Improvement"
                subtitle="Focus more practice here"
                icon={<TrendingUp size={18} />}
                items={subjectData
                  .filter((item) => item.accuracy < 80)
                  .sort((a, b) => a.accuracy - b.accuracy)
                  .slice(0, 4)}
              />
            </section>

            {/* RECENT TESTS */}
            <section className="mt-4 rounded-[22px] border border-white bg-white p-5 shadow-[0_10px_32px_rgba(83,52,180,0.06)] sm:p-6">
              <SectionHeader
                icon={<Clock3 size={18} />}
                title="Recent Mock Tests"
                subtitle="Your latest completed tests"
                action={
                  <button
                    type="button"
                    onClick={() => setActiveTab("history")}
                    className="inline-flex items-center gap-1 text-[10px] font-medium text-[#6425ed]"
                  >
                    View All <ChevronRight size={13} />
                  </button>
                }
              />

              <div className="mt-4 space-y-3">
                {mockHistory.slice(0, 3).map((test, index) => (
                  <HistoryRow
                    key={`${test.title}-${test.date}-${index}`}
                    test={test}
                  />
                ))}
              </div>
            </section>
          </>
        )}

        {activeTab === "analytics" && (
          <AnalyticsPanel
            accuracy={accuracy}
            weeklyActivity={weeklyActivity}
            weeklyAccuracy={weeklyAccuracy}
          />
        )}

        {activeTab === "history" && (
          <section className="mt-4 rounded-[22px] border border-white bg-white p-5 shadow-[0_10px_32px_rgba(83,52,180,0.06)] sm:p-6">
            <SectionHeader
              icon={<Clock3 size={18} />}
              title="Complete Test History"
              subtitle="Every mock test completed by you"
            />

            <div className="mt-4 space-y-3">
              {mockHistory.map((test, index) => (
                <HistoryRow
                  key={`${test.title}-${test.date}-${index}`}
                  test={test}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      {showEdit && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEdit(false)}
        />
      )}
    </div>
  );
}

function MiniHeroStat({ icon, value, label }) {
  return (
    <div className="rounded-xl border border-white/80 bg-white/75 p-2.5 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eee7ff] text-[#6425ed]">
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#151c3c]">{value}</p>
          <p className="text-[8px] font-normal text-[#8088a3]">{label}</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  iconClass,
  trend,
  trendClass,
}) {
  return (
    <div className="rounded-[18px] border border-white bg-white p-4 shadow-[0_8px_26px_rgba(83,52,180,0.05)] sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-[10px] font-medium ${trendClass}`}>
            {trend}
          </span>
        )}
      </div>
      <p className="mt-3 text-[10px] font-normal text-[#7b839f] sm:text-xs">
        {label}
      </p>
      <p className="mt-0.5 text-[24px] font-semibold tracking-[-0.04em] text-[#10163b] sm:text-[27px]">
        {value}
      </p>
      <p className="mt-0.5 text-[9px] font-normal text-[#969cb2]">{sub}</p>
    </div>
  );
}

function SectionHeader({ icon, title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#eee7ff] text-[#6425ed]">
          {icon}
        </span>
        <div className="min-w-0">
          <h2 className="text-[15px] font-semibold text-[#10163b] sm:text-[17px]">
            {title}
          </h2>
          <p className="mt-0.5 text-[9px] font-normal leading-4 text-[#8189a3] sm:text-[11px]">
            {subtitle}
          </p>
        </div>
      </div>
      {action}
    </div>
  );
}

function MetricRow({ dot, label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-[#eeeaf7] px-3 py-2.5 last:border-b-0">
      <span className="flex items-center gap-2 text-[10px] font-normal text-[#697399]">
        <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
        {label}
      </span>
      <span className="text-[11px] font-semibold text-[#202744]">{value}</span>
    </div>
  );
}

function SubjectCard({ subject }) {
  return (
    <div className="rounded-2xl border border-[#eeeaf7] bg-[#fcfbff] p-3.5 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-[12px] font-medium text-[#252b47]">
            {subject.name}
          </h3>
          <p className="mt-1 text-[9px] font-normal text-[#858da6]">
            {subject.questions} questions
          </p>
        </div>
        <span className="text-[17px] font-semibold text-[#6425ed]">
          {subject.accuracy}%
        </span>
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#ece9f6]">
        <div
          className={`h-full rounded-full ${subject.color}`}
          style={{ width: `${subject.accuracy}%` }}
        />
      </div>

      <div className="mt-1.5 flex justify-between text-[8px] font-normal text-[#8b92aa]">
        <span>Performance</span>
        <span>
          {subject.accuracy >= 80
            ? "Strong"
            : subject.accuracy >= 70
              ? "Good"
              : "Needs Work"}
        </span>
      </div>
    </div>
  );
}

function PerformanceList({
  title,
  subtitle,
  icon,
  items,
  positive = false,
}) {
  return (
    <div className="rounded-[22px] border border-white bg-white p-5 shadow-[0_10px_32px_rgba(83,52,180,0.06)] sm:p-6">
      <SectionHeader icon={icon} title={title} subtitle={subtitle} />

      <div className="mt-4 space-y-2.5">
        {items.map((item, index) => (
          <div
            key={item.name}
            className="flex items-center gap-3 rounded-xl border border-[#eeeaf7] bg-[#fcfbff] p-3"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#f0ebff] text-[10px] font-semibold text-[#6425ed]">
              {index + 1}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex justify-between gap-2">
                <span className="truncate text-[10px] font-medium text-[#303751]">
                  {item.name}
                </span>
                <span
                  className={`text-[10px] font-semibold ${
                    positive ? "text-[#159765]" : "text-[#df4d6a]"
                  }`}
                >
                  {item.accuracy}%
                </span>
              </div>

              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#ece9f6]">
                <div
                  className={`h-full rounded-full ${
                    positive ? "bg-[#20b77a]" : "bg-[#e36a83]"
                  }`}
                  style={{ width: `${item.accuracy}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HistoryRow({ test }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#eeeaf7] bg-[#fcfbff] p-3.5 transition hover:border-[#ded4ff] sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eee7ff] text-[#6425ed]">
          <BookOpen size={19} />
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-xs font-medium text-[#252b47]">
            {test.title}
          </h3>
          <p className="mt-1 text-[9px] font-normal text-[#858da6]">
            {test.date} · {test.questions} Questions
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:min-w-[280px]">
        <HistoryMetric
          label="Correct"
          value={test.correct}
          className="text-[#159765]"
        />
        <HistoryMetric
          label="Wrong"
          value={test.wrong}
          className="text-[#df4d6a]"
        />
        <HistoryMetric
          label="Accuracy"
          value={`${test.accuracy}%`}
          className="text-[#6425ed]"
        />
      </div>

      <div className="flex items-center justify-between gap-4 sm:min-w-[120px] sm:justify-end">
        <div className="text-left sm:text-right">
          <p className="text-[8px] font-normal text-[#8a91aa]">Score</p>
          <p className="text-sm font-semibold text-[#202744]">
            {test.score}/{test.maxScore}
          </p>
        </div>
        <ChevronRight size={16} className="text-[#a0a6ba]" />
      </div>
    </div>
  );
}

function HistoryMetric({ label, value, className }) {
  return (
    <div className="text-center sm:text-right">
      <p className="text-[8px] font-normal text-[#8b92aa]">{label}</p>
      <p className={`mt-0.5 text-xs font-semibold ${className}`}>{value}</p>
    </div>
  );
}

function AnalyticsPanel({ accuracy, weeklyActivity, weeklyAccuracy }) {
  return (
    <div className="mt-4 space-y-4">
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[22px] border border-white bg-white p-5 shadow-[0_10px_32px_rgba(83,52,180,0.06)] sm:p-6">
          <SectionHeader
            icon={<TrendingUp size={18} />}
            title="Accuracy Trend"
            subtitle="Your accuracy during the last 7 practice days"
          />

          <div className="mt-6 flex h-[205px] items-end gap-2 sm:gap-4">
            {weeklyAccuracy.map((value, index) => (
              <div
                key={index}
                className="flex h-full flex-1 flex-col items-center justify-end gap-2"
              >
                <span className="text-[9px] font-normal text-[#7c84a0]">
                  {value}%
                </span>
                <div className="relative flex h-[160px] w-full items-end rounded-xl bg-[#f7f4ff] p-1">
                  <div
                    className="w-full rounded-lg bg-gradient-to-t from-[#4f46e5] to-[#8b5cf6]"
                    style={{ height: `${Math.min(Math.max(value, 10), 100)}%` }}
                  />
                </div>
                <span className="text-[9px] font-normal text-[#858da6]">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[22px] border border-white bg-white p-5 shadow-[0_10px_32px_rgba(83,52,180,0.06)] sm:p-6">
          <SectionHeader
            icon={<CalendarDays size={18} />}
            title="Daily Activity"
            subtitle="Question-solving activity over the week"
          />

          <div className="mt-6 grid grid-cols-7 gap-2">
            {weeklyActivity.map((value, index) => {
              const level =
                value > 80
                  ? "bg-[#6425ed]"
                  : value > 60
                    ? "bg-[#8b5cf6]"
                    : value > 40
                      ? "bg-[#c4b5fd]"
                      : "bg-[#ede9fe]";

              return (
                <div key={index} className="text-center">
                  <div className={`mx-auto h-28 rounded-xl ${level}`} />
                  <p className="mt-2 text-[9px] font-normal text-[#858da6]">
                    {["M", "T", "W", "T", "F", "S", "S"][index]}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-5 flex items-center justify-between rounded-2xl bg-[#faf9ff] p-4">
            <div>
              <p className="text-[9px] font-normal text-[#8189a3]">
                Current Accuracy
              </p>
              <p className="mt-1 text-xl font-semibold text-[#6425ed]">
                {accuracy}%
              </p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-normal text-[#8189a3]">
                Weekly Goal
              </p>
              <p className="mt-1 text-xs font-semibold text-[#202744]">
                500 Questions
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[22px] border border-white bg-white p-5 shadow-[0_10px_32px_rgba(83,52,180,0.06)] sm:p-6">
        <SectionHeader
          icon={<Medal size={18} />}
          title="Achievements"
          subtitle="Milestones you've unlocked"
        />

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Achievement
            icon={<Flame size={20} />}
            title="7 Day Streak"
            text="Practiced for 7 days"
          />
          <Achievement
            icon={<Trophy size={20} />}
            title="First Test"
            text="Completed your first mock test"
          />
          <Achievement
            icon={<Target size={20} />}
            title="80% Club"
            text="Crossed 80% accuracy"
          />
          <Achievement
            icon={<Zap size={20} />}
            title="100 Questions"
            text="Solved 100 questions"
          />
        </div>
      </section>
    </div>
  );
}

function Achievement({ icon, title, text }) {
  return (
    <div className="rounded-2xl border border-[#eeeaf7] bg-[#fcfbff] p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eee7ff] text-[#6425ed]">
        {icon}
      </div>
      <h3 className="mt-3 text-xs font-semibold text-[#252b47]">{title}</h3>
      <p className="mt-1 text-[9px] font-normal leading-4 text-[#858da6]">
        {text}
      </p>
    </div>
  );
}

function EditProfileModal({ user, onClose }) {
  const [name, setName] = useState(
    user?.name || user?.fullName || user?.username || ""
  );
  const [college, setCollege] = useState(user?.college || "");
  const [course, setCourse] = useState(
    user?.course || "B.Tech / Computer Science"
  );
  const [target, setTarget] = useState(
    user?.target || "MNC Placement"
  );

  const saveProfile = () => {
    try {
      const existing = JSON.parse(
        localStorage.getItem("studyGemUser") || "{}"
      );

      localStorage.setItem(
        "studyGemUser",
        JSON.stringify({
          ...existing,
          name: name.trim() || existing.name,
          college: college.trim(),
          course: course.trim(),
          target: target.trim(),
        })
      );
    } catch {
      // Keep the UI usable even if localStorage contains invalid data.
    }

    onClose();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#11152f]/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-[520px] rounded-[24px] bg-white p-5 shadow-2xl sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-[#10163b]">
              Edit Profile
            </h2>
            <p className="mt-1 text-xs font-normal text-[#7c84a0]">
              Update your student information.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f3f1f8] text-[#697399]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <InputField label="Full Name" value={name} onChange={setName} />
          <InputField label="College" value={college} onChange={setCollege} />
          <InputField label="Course" value={course} onChange={setCourse} />
          <InputField label="Target" value={target} onChange={setTarget} />
        </div>

        <button
          type="button"
          onClick={saveProfile}
          className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#7625f5] to-[#5424e8] text-sm font-medium text-white shadow-[0_10px_25px_rgba(101,38,237,0.2)]"
        >
          <CheckCircle2 size={17} />
          Save Changes
        </button>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-wide text-[#747d98]">
        {label}
      </span>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border border-[#e4e0ef] bg-[#fcfbff] px-3 text-sm font-normal text-[#252b47] outline-none transition focus:border-[#b9a4ff] focus:ring-4 focus:ring-[#eee7ff]"
      />
    </label>
  );
}

export default Profile;

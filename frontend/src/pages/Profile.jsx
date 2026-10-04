import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Award,
  BarChart3,
  BookOpen,
  CalendarDays,
  CheckCircle2,
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
  XCircle,
  Zap,
} from "lucide-react";

const weeklyActivity = [42, 58, 35, 76, 91, 64, 48];
const weeklyAccuracy = [68, 72, 70, 78, 81, 84, 82];

const subjectData = [
  { name: "DSA", questions: 420, accuracy: 86, color: "bg-[#7c3aed]" },
  { name: "DBMS", questions: 315, accuracy: 78, color: "bg-[#4f46e5]" },
  { name: "Operating System", questions: 260, accuracy: 69, color: "bg-[#8b5cf6]" },
  { name: "Computer Networks", questions: 230, accuracy: 88, color: "bg-[#6366f1]" },
  { name: "Aptitude", questions: 380, accuracy: 81, color: "bg-[#a855f7]" },
  { name: "Web Development", questions: 295, accuracy: 84, color: "bg-[#6d28d9]" },
];

const mockHistory = [
  {
    title: "UPSC General Studies",
    date: "04 Oct 2026",
    questions: 50,
    correct: 39,
    wrong: 8,
    skipped: 3,
    score: 148,
    maxScore: 200,
    accuracy: 83,
  },
  {
    title: "Computer Science Mock Test",
    date: "02 Oct 2026",
    questions: 40,
    correct: 31,
    wrong: 6,
    skipped: 3,
    score: 118,
    maxScore: 160,
    accuracy: 84,
  },
  {
    title: "DBMS & SQL Practice",
    date: "30 Sep 2026",
    questions: 30,
    correct: 23,
    wrong: 5,
    skipped: 2,
    score: 87,
    maxScore: 120,
    accuracy: 82,
  },
  {
    title: "Aptitude Speed Test",
    date: "28 Sep 2026",
    questions: 25,
    correct: 21,
    wrong: 3,
    skipped: 1,
    score: 81,
    maxScore: 100,
    accuracy: 84,
  },
];

function Profile({ onBack, onLogout }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [showEdit, setShowEdit] = useState(false);

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

  const totalQuestions = 1900;
  const correct = 1580;
  const wrong = 260;
  const skipped = 60;
  const accuracy = Math.round((correct / (correct + wrong)) * 100);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#f7f5ff] text-[#11183b]">
      {/* TOP BAR */}
      <header className="sticky top-0 z-50 border-b border-white/80 bg-white/90 px-3 py-3 shadow-[0_8px_30px_rgba(80,45,160,0.08)] backdrop-blur-xl sm:px-5 lg:px-7">
        <div className="mx-auto flex h-[62px] w-full max-w-[1450px] items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 rounded-xl px-2 py-2 transition hover:bg-[#f4f0ff]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eee8ff] text-[#6425ed]">
              <ArrowLeft size={19} />
            </span>
            <span className="hidden text-sm font-extrabold text-[#202744] sm:block">
              Back
            </span>
          </button>

          <div className="text-center">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#8a91aa]">
              Student Dashboard
            </p>
            <h1 className="text-lg font-black text-[#10163b] sm:text-xl">
              My Profile
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setShowEdit(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#7625f5] to-[#5424e8] px-3.5 py-2.5 text-xs font-bold text-white shadow-[0_8px_20px_rgba(101,38,237,0.2)] transition hover:-translate-y-0.5"
          >
            <Pencil size={15} />
            <span className="hidden sm:block">Edit Profile</span>
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1450px] px-3 pb-12 pt-6 sm:px-5 lg:px-7">
        {/* PROFILE HERO */}
        <section className="relative overflow-hidden rounded-[28px] border border-white bg-white shadow-[0_18px_55px_rgba(83,52,180,0.09)]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#f1eaff] via-white to-[#eef1ff]" />
          <div className="absolute -right-24 -top-28 h-72 w-72 rounded-full bg-[#8b5cf6]/10 blur-3xl" />
          <div className="absolute -bottom-28 left-20 h-72 w-72 rounded-full bg-[#4f46e5]/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between lg:p-8">
            <div className="flex min-w-0 items-center gap-4 sm:gap-5">
              <div className="flex h-[82px] w-[82px] shrink-0 items-center justify-center rounded-[25px] bg-gradient-to-br from-[#7c3aed] to-[#4f46e5] text-white shadow-[0_14px_30px_rgba(109,40,240,0.24)] sm:h-[96px] sm:w-[96px]">
                <User size={43} strokeWidth={1.8} />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-2xl font-black tracking-[-0.04em] text-[#10163b] sm:text-3xl">
                    {studentName}
                  </h2>
                  <span className="rounded-full bg-[#e7dcff] px-2.5 py-1 text-[9px] font-extrabold text-[#6425ed]">
                    STUDENT
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-[#697399]">
                  <span className="inline-flex items-center gap-1.5">
                    <Mail size={14} />
                    {email}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <GraduationCap size={14} />
                    B.Tech / Computer Science
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Target size={14} />
                    MNC Placement
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-bold text-[#626b88] shadow-sm">
                    Learning since 2026
                  </span>
                  <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-bold text-[#626b88] shadow-sm">
                    Target: Placement
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[500px]">
              <MiniHeroStat icon={<Flame size={17} />} value="12" label="Day Streak" />
              <MiniHeroStat icon={<Trophy size={17} />} value="#18" label="Leaderboard" />
              <MiniHeroStat icon={<Award size={17} />} value="7" label="Badges" />
              <MiniHeroStat icon={<Zap size={17} />} value="86%" label="Accuracy" />
            </div>
          </div>
        </section>

        {/* TABS */}
        <div className="mt-5 flex overflow-x-auto rounded-2xl border border-white bg-white p-1.5 shadow-[0_10px_35px_rgba(83,52,180,0.06)]">
          {[
            ["overview", "Overview"],
            ["analytics", "Analytics"],
            ["history", "Test History"],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`min-w-[110px] flex-1 rounded-xl px-4 py-2.5 text-xs font-extrabold transition sm:text-sm ${
                activeTab === id
                  ? "bg-[#eee7ff] text-[#6425ed]"
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
            <section className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <StatCard
                icon={<BookOpen size={20} />}
                label="Questions Attempted"
                value={totalQuestions.toLocaleString()}
                sub="Across all practice"
                iconClass="bg-[#eee7ff] text-[#6425ed]"
              />
              <StatCard
                icon={<CheckCircle2 size={20} />}
                label="Correct Answers"
                value={correct.toLocaleString()}
                sub={`${accuracy}% accuracy`}
                iconClass="bg-[#def8eb] text-[#159765]"
              />
              <StatCard
                icon={<XCircle size={20} />}
                label="Wrong Answers"
                value={wrong.toLocaleString()}
                sub="Areas to improve"
                iconClass="bg-[#ffe7ed] text-[#df4d6a]"
              />
              <StatCard
                icon={<Trophy size={20} />}
                label="Mock Tests"
                value="38"
                sub="Completed tests"
                iconClass="bg-[#e7edff] text-[#4f46e5]"
              />
            </section>

            {/* MAIN GRID */}
            <section className="mt-5 grid gap-5 xl:grid-cols-[1.55fr_1fr]">
              {/* ACTIVITY */}
              <div className="rounded-[26px] border border-white bg-white p-5 shadow-[0_12px_40px_rgba(83,52,180,0.07)] sm:p-6">
                <SectionHeader
                  icon={<BarChart3 size={19} />}
                  title="Learning Activity"
                  subtitle="Questions solved during the last 7 days"
                />

                <div className="mt-7">
                  <div className="flex h-[220px] items-end gap-2 sm:gap-4">
                    {weeklyActivity.map((value, index) => (
                      <div key={index} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                        <span className="text-[10px] font-bold text-[#7c84a0]">{value}</span>
                        <div className="flex h-[175px] w-full items-end rounded-xl bg-[#f5f2ff] p-1.5">
                          <div
                            className="w-full rounded-lg bg-gradient-to-t from-[#6d28d9] to-[#a78bfa] transition-all"
                            style={{ height: `${Math.max(value, 10)}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-[#858da6]">
                          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* PERFORMANCE RING */}
              <div className="rounded-[26px] border border-white bg-white p-5 shadow-[0_12px_40px_rgba(83,52,180,0.07)] sm:p-6">
                <SectionHeader
                  icon={<Target size={19} />}
                  title="Overall Performance"
                  subtitle="Your current learning health"
                />

                <div className="mt-7 flex items-center justify-center">
                  <div className="relative flex h-[190px] w-[190px] items-center justify-center rounded-full bg-[conic-gradient(#7c3aed_0_86%,#eee9f8_86%_100%)]">
                    <div className="flex h-[146px] w-[146px] flex-col items-center justify-center rounded-full bg-white shadow-inner">
                      <span className="text-4xl font-black text-[#10163b]">86%</span>
                      <span className="mt-1 text-[10px] font-bold text-[#8189a3]">
                        Overall Accuracy
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-7 grid grid-cols-3 gap-2">
                  <SmallMetric label="Correct" value="1,580" />
                  <SmallMetric label="Wrong" value="260" />
                  <SmallMetric label="Skipped" value={skipped.toString()} />
                </div>
              </div>
            </section>

            {/* SUBJECT PERFORMANCE */}
            <section className="mt-5 rounded-[26px] border border-white bg-white p-5 shadow-[0_12px_40px_rgba(83,52,180,0.07)] sm:p-6">
              <SectionHeader
                icon={<BookOpen size={19} />}
                title="Subject Performance"
                subtitle="See where you are strongest and where you need more practice"
              />

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {subjectData.map((subject) => (
                  <SubjectCard key={subject.name} subject={subject} />
                ))}
              </div>
            </section>

            {/* WEAK + STRONG */}
            <section className="mt-5 grid gap-5 lg:grid-cols-2">
              <PerformanceList
                title="Your Strengths"
                subtitle="Subjects where you're performing well"
                icon={<Trophy size={19} />}
                positive
                items={subjectData
                  .filter((item) => item.accuracy >= 80)
                  .sort((a, b) => b.accuracy - a.accuracy)
                  .slice(0, 4)}
              />

              <PerformanceList
                title="Needs Improvement"
                subtitle="Focus more practice here"
                icon={<TrendingUp size={19} />}
                items={subjectData
                  .filter((item) => item.accuracy < 80)
                  .sort((a, b) => a.accuracy - b.accuracy)
                  .slice(0, 4)}
              />
            </section>

            {/* RECENT TESTS */}
            <section className="mt-5 rounded-[26px] border border-white bg-white p-5 shadow-[0_12px_40px_rgba(83,52,180,0.07)] sm:p-6">
              <SectionHeader
                icon={<Clock3 size={19} />}
                title="Recent Mock Tests"
                subtitle="Your latest completed tests"
                action={
                  <button
                    type="button"
                    onClick={() => setActiveTab("history")}
                    className="inline-flex items-center gap-1 text-xs font-extrabold text-[#6425ed]"
                  >
                    View All <ChevronRight size={15} />
                  </button>
                }
              />

              <div className="mt-5 space-y-3">
                {mockHistory.slice(0, 3).map((test) => (
                  <HistoryRow key={test.title} test={test} />
                ))}
              </div>
            </section>
          </>
        )}

        {activeTab === "analytics" && (
          <AnalyticsPanel accuracy={accuracy} />
        )}

        {activeTab === "history" && (
          <section className="mt-5 rounded-[26px] border border-white bg-white p-5 shadow-[0_12px_40px_rgba(83,52,180,0.07)] sm:p-6">
            <SectionHeader
              icon={<Clock3 size={19} />}
              title="Complete Test History"
              subtitle="Every mock test completed by you"
            />

            <div className="mt-5 space-y-3">
              {mockHistory.map((test) => (
                <HistoryRow key={`${test.title}-${test.date}`} test={test} />
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
    <div className="rounded-2xl border border-white/80 bg-white/75 p-3 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eee7ff] text-[#6425ed]">
          {icon}
        </span>
        <div>
          <p className="text-base font-black text-[#151c3c]">{value}</p>
          <p className="text-[9px] font-bold text-[#8088a3]">{label}</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub, iconClass }) {
  return (
    <div className="rounded-[22px] border border-white bg-white p-4 shadow-[0_10px_30px_rgba(83,52,180,0.06)] sm:p-5">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}>
        {icon}
      </div>
      <p className="mt-4 text-[10px] font-bold text-[#7b839f] sm:text-xs">{label}</p>
      <p className="mt-1 text-2xl font-black tracking-[-0.03em] text-[#10163b] sm:text-3xl">{value}</p>
      <p className="mt-1 text-[9px] font-semibold text-[#969cb2]">{sub}</p>
    </div>
  );
}

function SectionHeader({ icon, title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eee7ff] text-[#6425ed]">
          {icon}
        </span>
        <div>
          <h2 className="text-base font-black text-[#10163b] sm:text-lg">{title}</h2>
          <p className="mt-1 text-[10px] font-medium leading-4 text-[#8189a3] sm:text-xs">
            {subtitle}
          </p>
        </div>
      </div>
      {action}
    </div>
  );
}

function SmallMetric({ label, value }) {
  return (
    <div className="rounded-xl bg-[#faf9ff] p-3 text-center">
      <p className="text-[9px] font-bold text-[#858da6]">{label}</p>
      <p className="mt-1 text-sm font-black text-[#202744]">{value}</p>
    </div>
  );
}

function SubjectCard({ subject }) {
  return (
    <div className="rounded-2xl border border-[#eeeaf7] bg-[#fcfbff] p-4 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-extrabold text-[#252b47]">{subject.name}</h3>
          <p className="mt-1 text-[10px] font-semibold text-[#858da6]">
            {subject.questions} questions
          </p>
        </div>
        <span className="text-lg font-black text-[#6425ed]">{subject.accuracy}%</span>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#ece9f6]">
        <div
          className={`h-full rounded-full ${subject.color}`}
          style={{ width: `${subject.accuracy}%` }}
        />
      </div>

      <div className="mt-2 flex justify-between text-[9px] font-bold text-[#8b92aa]">
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
    <div className="rounded-[26px] border border-white bg-white p-5 shadow-[0_12px_40px_rgba(83,52,180,0.07)] sm:p-6">
      <SectionHeader icon={icon} title={title} subtitle={subtitle} />

      <div className="mt-5 space-y-3">
        {items.map((item, index) => (
          <div
            key={item.name}
            className="flex items-center gap-3 rounded-2xl border border-[#eeeaf7] bg-[#fcfbff] p-3"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f0ebff] text-xs font-black text-[#6425ed]">
              {index + 1}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex justify-between gap-2">
                <span className="truncate text-xs font-extrabold text-[#303751]">
                  {item.name}
                </span>
                <span
                  className={`text-xs font-black ${
                    positive ? "text-[#159765]" : "text-[#df4d6a]"
                  }`}
                >
                  {item.accuracy}%
                </span>
              </div>

              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#ece9f6]">
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
    <div className="flex flex-col gap-4 rounded-2xl border border-[#eeeaf7] bg-[#fcfbff] p-4 transition hover:border-[#ded4ff] sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eee7ff] text-[#6425ed]">
          <ClipboardIcon />
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-sm font-extrabold text-[#252b47]">
            {test.title}
          </h3>
          <p className="mt-1 text-[10px] font-semibold text-[#858da6]">
            {test.date} · {test.questions} Questions
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:min-w-[290px]">
        <HistoryMetric label="Correct" value={test.correct} className="text-[#159765]" />
        <HistoryMetric label="Wrong" value={test.wrong} className="text-[#df4d6a]" />
        <HistoryMetric label="Accuracy" value={`${test.accuracy}%`} className="text-[#6425ed]" />
      </div>

      <div className="flex items-center justify-between gap-4 sm:min-w-[130px] sm:justify-end">
        <div className="text-left sm:text-right">
          <p className="text-[9px] font-bold text-[#8a91aa]">Score</p>
          <p className="text-base font-black text-[#202744]">
            {test.score}/{test.maxScore}
          </p>
        </div>

        <ChevronRight size={17} className="text-[#a0a6ba]" />
      </div>
    </div>
  );
}

function HistoryMetric({ label, value, className }) {
  return (
    <div className="text-center sm:text-right">
      <p className="text-[9px] font-bold text-[#8b92aa]">{label}</p>
      <p className={`mt-1 text-sm font-black ${className}`}>{value}</p>
    </div>
  );
}

function ClipboardIcon() {
  return <BookOpen size={20} />;
}

function AnalyticsPanel({ accuracy }) {
  return (
    <div className="mt-5 space-y-5">
      <section className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-[26px] border border-white bg-white p-5 shadow-[0_12px_40px_rgba(83,52,180,0.07)] sm:p-6">
          <SectionHeader
            icon={<TrendingUp size={19} />}
            title="Accuracy Trend"
            subtitle="Your accuracy during the last 7 practice days"
          />

          <div className="mt-7 flex h-[220px] items-end gap-2 sm:gap-4">
            {weeklyAccuracy.map((value, index) => (
              <div key={index} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <span className="text-[9px] font-bold text-[#7c84a0]">{value}%</span>

                <div className="relative flex h-[175px] w-full items-end rounded-xl bg-[#f7f4ff] p-1.5">
                  <div
                    className="w-full rounded-lg bg-gradient-to-t from-[#4f46e5] to-[#8b5cf6]"
                    style={{ height: `${value}%` }}
                  />
                </div>

                <span className="text-[10px] font-bold text-[#858da6]">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[26px] border border-white bg-white p-5 shadow-[0_12px_40px_rgba(83,52,180,0.07)] sm:p-6">
          <SectionHeader
            icon={<CalendarDays size={19} />}
            title="Daily Activity"
            subtitle="Question-solving activity over the week"
          />

          <div className="mt-7 grid grid-cols-7 gap-2">
            {weeklyActivity.map((value, index) => {
              const level = value > 80 ? "bg-[#6425ed]" : value > 60 ? "bg-[#8b5cf6]" : value > 40 ? "bg-[#c4b5fd]" : "bg-[#ede9fe]";

              return (
                <div key={index} className="text-center">
                  <div className={`mx-auto h-28 rounded-xl ${level}`} />
                  <p className="mt-2 text-[9px] font-bold text-[#858da6]">
                    {["M", "T", "W", "T", "F", "S", "S"][index]}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-5 flex items-center justify-between rounded-2xl bg-[#faf9ff] p-4">
            <div>
              <p className="text-[10px] font-bold text-[#8189a3]">Current Accuracy</p>
              <p className="mt-1 text-2xl font-black text-[#6425ed]">{accuracy}%</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-[#8189a3]">Weekly Goal</p>
              <p className="mt-1 text-sm font-black text-[#202744]">500 Questions</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[26px] border border-white bg-white p-5 shadow-[0_12px_40px_rgba(83,52,180,0.07)] sm:p-6">
        <SectionHeader
          icon={<Medal size={19} />}
          title="Achievements"
          subtitle="Milestones you've unlocked"
        />

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Achievement icon={<Flame size={21} />} title="7 Day Streak" text="Practiced for 7 days" />
          <Achievement icon={<Trophy size={21} />} title="First Test" text="Completed your first mock test" />
          <Achievement icon={<Target size={21} />} title="80% Club" text="Crossed 80% accuracy" />
          <Achievement icon={<Zap size={21} />} title="100 Questions" text="Solved 100 questions" />
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
      <h3 className="mt-3 text-sm font-black text-[#252b47]">{title}</h3>
      <p className="mt-1 text-[10px] font-semibold leading-4 text-[#858da6]">{text}</p>
    </div>
  );
}

function EditProfileModal({ user, onClose }) {
  const [name, setName] = useState(
    user?.name || user?.fullName || user?.username || ""
  );
  const [college, setCollege] = useState(user?.college || "");
  const [course, setCourse] = useState(user?.course || "B.Tech / Computer Science");
  const [target, setTarget] = useState(user?.target || "MNC Placement");

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
      <div className="w-full max-w-[520px] rounded-[28px] bg-white p-5 shadow-2xl sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-[#10163b]">Edit Profile</h2>
            <p className="mt-1 text-xs font-medium text-[#7c84a0]">
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
          className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#7625f5] to-[#5424e8] text-sm font-extrabold text-white shadow-[0_10px_25px_rgba(101,38,237,0.2)]"
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
      <span className="mb-1.5 block text-[10px] font-extrabold uppercase tracking-wide text-[#747d98]">
        {label}
      </span>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border border-[#e4e0ef] bg-[#fcfbff] px-3 text-sm font-semibold text-[#252b47] outline-none transition focus:border-[#b9a4ff] focus:ring-4 focus:ring-[#eee7ff]"
      />
    </label>
  );
}

export default Profile;

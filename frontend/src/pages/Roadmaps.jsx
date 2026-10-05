import { useEffect, useMemo, useState } from "react";

import {
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  Bot,
  Calendar,
  Check,
  ChevronDown,
  Clock3,
  Code2,
  Download,
  FileText,
  GraduationCap,
  Lightbulb,
  Link2,
  ListChecks,
  Map,
  MessageCircle,
  Play,
  Plus,
  Sparkles,
  Target,
  Timer,
  Trophy,
  User,
  X,
  Zap,
} from "lucide-react";

import rrImage from "../assets/rr.png";

import Navbar from "../components/Navbar";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/* =========================================================
   OPTIONS
========================================================= */

const LEARNING_OPTIONS = [
  "Full Stack Development",
  "Data Science",
  "Artificial Intelligence",
  "Machine Learning",
  "DSA",
  "Web Development",
  "Cloud Computing",
];

const LEVEL_OPTIONS = [
  "Beginner",
  "Beginner to Intermediate",
  "Intermediate",
  "Intermediate to Advanced",
  "Advanced",
  "Expert",
];

const GOAL_OPTIONS = [
  "Placement",
  "Job",
  "Internship",
  "Government Exam",
  "UPSC",
  "Skill Development",
  "Career Switch",
];

const TIME_OPTIONS = [
  "1-2 hours",
  "2-3 hours",
  "3-4 hours",
  "4-5 hours",
  "5-6 hours",
  "6-8 hours",
  "8+ hours",
];

const DURATION_OPTIONS = [
  "30 Days",
  "60 Days",
  "90 Days",
  "120 Days",
  "180 Days",
  "6 Months",
  "1 Year",
];

const FOCUS_OPTIONS = [
  "Theory",
  "Practice",
  "Projects",
  "Interview Prep",
  "Aptitude",
  "Revision",
  "Mock Tests",
];

const RESOURCE_OPTIONS = [
  "Free Resources",
  "YouTube",
  "Documentation",
  "Books",
  "Courses",
  "Practice Platforms",
  "Mixed Resources",
];

/* =========================================================
   HELPER COMPONENTS
========================================================= */

function EditableSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
  icon: Icon,
  required = false,
}) {
  const [open, setOpen] = useState(false);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <div className="relative">
      <label className="mb-2 flex items-center gap-2 text-[12px] font-bold text-[#17204b]">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f1eaff] text-[#6525ef]">
          <Icon size={14} />
        </span>

        {label}

        {required && (
          <span className="text-[10px] font-bold text-[#ef4444]">
            *
          </span>
        )}
      </label>

      <div className="relative">
        <input
          type="text"
          value={value}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onBlur={() => {
            setTimeout(() => setOpen(false), 150);
          }}
          placeholder={placeholder}
          className="
            h-[45px] w-full rounded-xl
            border border-[#dfe2f5] bg-white
            px-4 pr-10 text-[12px] font-medium
            text-[#252d57] outline-none
            placeholder:text-[#a0a6c0]
            focus:border-[#8b5cf6]
            focus:ring-4 focus:ring-[#8b5cf6]/10
          "
        />

        <ChevronDown
          size={17}
          className={`
            pointer-events-none absolute right-4 top-1/2
            -translate-y-1/2 text-[#8d94ae]
            transition-transform
            ${open ? "rotate-180" : ""}
          `}
        />

        {open && filteredOptions.length > 0 && (
          <div className="absolute left-0 right-0 top-[51px] z-50 max-h-[210px] overflow-y-auto rounded-xl border border-[#e4e0f2] bg-white p-1.5 shadow-[0_15px_40px_rgba(75,50,130,0.15)]">
            {filteredOptions.map((option) => (
              <button
                key={option}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(option);
                  setOpen(false);
                }}
                className="
                  flex w-full items-center justify-between
                  rounded-lg px-3 py-2.5
                  text-left text-[11px] font-semibold
                  text-[#4e5677]
                  transition hover:bg-[#f3edff]
                  hover:text-[#6825e9]
                "
              >
                <span>{option}</span>

                {value === option && (
                  <Check
                    size={14}
                    className="text-[#6825e9]"
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FocusChip({
  label,
  active,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        rounded-xl border px-3 py-2
        text-[10px] font-bold transition-all
        ${
          active
            ? "border-[#cbb6ff] bg-[#eee5ff] text-[#6525ef] shadow-sm"
            : "border-[#e2e4f1] bg-white text-[#737b98] hover:border-[#cdbaff] hover:bg-[#f7f3ff] hover:text-[#6525ef]"
        }
      `}
    >
      {label}
    </button>
  );
}

function SectionTitle({
  icon: Icon,
  title,
  subtitle,
}) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#eee6ff] text-[#6d28d9]">
        <Icon size={16} />
      </div>

      <div>
        <h3 className="text-[14px] font-extrabold text-[#17204b]">
          {title}
        </h3>

        {subtitle && (
          <p className="mt-1 text-[10px] font-medium leading-5 text-[#8a90a9]">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

function RoadmapStat({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-[#e9e4f7] bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f0e9ff] text-[#6d28d9]">
          <Icon size={17} />
        </div>

        <div className="min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-wide text-[#969cb3]">
            {label}
          </p>

          <p className="mt-1 truncate text-[13px] font-extrabold text-[#1c2550]">
            {value || "-"}
          </p>
        </div>
      </div>
    </div>
  );
}

function RoadmapCard({
  children,
  className = "",
}) {
  return (
    <div
      className={`
        rounded-[20px]
        border border-[#e8e3f4]
        bg-white
        shadow-[0_10px_35px_rgba(80,55,150,0.07)]
        ${className}
      `}
    >
      {children}
    </div>
  );
}

function PhaseCard({
  phase,
  index,
}) {
  return (
    <RoadmapCard className="overflow-hidden">
      <div className="border-b border-[#eeeaf7] bg-gradient-to-r from-[#faf8ff] to-white p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eee6ff] text-[13px] font-black text-[#6825e9]">
              {String(index + 1).padStart(2, "0")}
            </div>

            <div>
              <h3 className="text-[15px] font-extrabold text-[#17204b] sm:text-[17px]">
                {phase?.title || `Phase ${index + 1}`}
              </h3>

              <p className="mt-1 text-[10px] font-bold text-[#7952d8]">
                {phase?.duration || ""}
              </p>
            </div>
          </div>

          {phase?.focus && (
            <span className="w-fit rounded-full bg-[#f0e9ff] px-3 py-1.5 text-[9px] font-extrabold text-[#6825e9]">
              {phase.focus}
            </span>
          )}
        </div>

        {phase?.description && (
          <p className="mt-4 text-[11px] font-medium leading-6 text-[#68708f]">
            {phase.description}
          </p>
        )}
      </div>

      <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-2">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <BookOpen
              size={15}
              className="text-[#6d28d9]"
            />

            <h4 className="text-[11px] font-extrabold text-[#25305c]">
              Topics
            </h4>
          </div>

          <div className="space-y-2">
            {(Array.isArray(phase?.topics)
              ? phase.topics
              : []
            ).map((topic, topicIndex) => (
              <div
                key={`${topic}-${topicIndex}`}
                className="flex items-start gap-2 rounded-xl bg-[#faf9ff] px-3 py-2.5"
              >
                <Check
                  size={13}
                  className="mt-0.5 shrink-0 text-[#7c3aed]"
                />

                <span className="text-[10px] font-semibold leading-5 text-[#5f6784]">
                  {topic}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2">
            <ListChecks
              size={15}
              className="text-[#6d28d9]"
            />

            <h4 className="text-[11px] font-extrabold text-[#25305c]">
              Tasks
            </h4>
          </div>

          <div className="space-y-2">
            {(Array.isArray(phase?.tasks)
              ? phase.tasks
              : []
            ).map((task, taskIndex) => (
              <div
                key={`${task}-${taskIndex}`}
                className="flex items-start gap-2 rounded-xl bg-[#faf9ff] px-3 py-2.5"
              >
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#eee6ff] text-[8px] font-black text-[#6825e9]">
                  {taskIndex + 1}
                </span>

                <span className="text-[10px] font-semibold leading-5 text-[#5f6784]">
                  {task}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {phase?.milestone && (
        <div className="mx-5 mb-5 rounded-2xl border border-[#e5d8ff] bg-[#f8f4ff] p-4 sm:mx-6 sm:mb-6">
          <div className="flex items-start gap-2">
            <Trophy
              size={15}
              className="mt-0.5 shrink-0 text-[#7c3aed]"
            />

            <div>
              <p className="text-[9px] font-extrabold uppercase tracking-wide text-[#7c3aed]">
                Phase Milestone
              </p>

              <p className="mt-1 text-[10px] font-semibold leading-5 text-[#5f6784]">
                {phase.milestone}
              </p>
            </div>
          </div>
        </div>
      )}
    </RoadmapCard>
  );
}

function WeeklyPlanCard({
  week,
  index,
}) {
  return (
    <div className="rounded-2xl border border-[#e9e4f7] bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[12px] font-extrabold text-[#1d2753]">
            {week?.title || `Week ${index + 1}`}
          </p>

          {week?.focus && (
            <p className="mt-1 text-[9px] font-bold text-[#7b50d9]">
              {week.focus}
            </p>
          )}
        </div>

        {week?.hours && (
          <span className="shrink-0 rounded-lg bg-[#f1eaff] px-2 py-1 text-[8px] font-extrabold text-[#6825e9]">
            {week.hours}
          </span>
        )}
      </div>

      <div className="mt-3 space-y-2">
        {(Array.isArray(week?.tasks)
          ? week.tasks
          : []
        ).map((task, taskIndex) => (
          <div
            key={`${task}-${taskIndex}`}
            className="flex items-start gap-2"
          >
            <Check
              size={12}
              className="mt-0.5 shrink-0 text-[#7c3aed]"
            />

            <span className="text-[9px] font-medium leading-5 text-[#68708f]">
              {task}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RoutineCard({
  item,
  index,
}) {
  const icons = [
    BookOpen,
    ListChecks,
    Code2,
    Target,
  ];

  const Icon = icons[index] || Target;

  return (
    <div className="rounded-2xl border border-[#e9e4f7] bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f0e9ff] text-[#6d28d9]">
            <Icon size={15} />
          </div>

          <div>
            <p className="text-[11px] font-extrabold text-[#25305c]">
              {item?.title || "Study"}
            </p>

            <p className="mt-0.5 text-[8px] font-bold text-[#8e95ad]">
              {item?.duration || ""}
            </p>
          </div>
        </div>
      </div>

      {item?.description && (
        <p className="mt-3 text-[9px] font-medium leading-5 text-[#6c7491]">
          {item.description}
        </p>
      )}
    </div>
  );
}

function ProjectCard({
  project,
}) {
  return (
    <div className="rounded-2xl border border-[#e9e4f7] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-[12px] font-extrabold text-[#202953]">
            {project?.title || "Project"}
          </h4>

          <p className="mt-1 text-[9px] font-bold text-[#7952d8]">
            {project?.level || ""}
            {project?.duration
              ? ` • ${project.duration}`
              : ""}
          </p>
        </div>

        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f1eaff] text-[#6d28d9]">
          <Code2 size={14} />
        </div>
      </div>

      {project?.description && (
        <p className="mt-3 text-[9px] font-medium leading-5 text-[#69718d]">
          {project.description}
        </p>
      )}

      {Array.isArray(project?.skills) &&
        project.skills.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.skills.map(
              (skill, skillIndex) => (
                <span
                  key={`${skill}-${skillIndex}`}
                  className="rounded-lg bg-[#f7f4ff] px-2 py-1 text-[8px] font-bold text-[#6b4bb4]"
                >
                  {skill}
                </span>
              )
            )}
          </div>
        )}
    </div>
  );
}

function ResourceCard({
  resource,
}) {
  const hasUrl =
    typeof resource?.url === "string" &&
    resource.url.trim().length > 0;

  return (
    <div className="rounded-2xl border border-[#e9e4f7] bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f0e9ff] text-[#6d28d9]">
          <Link2 size={15} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-extrabold text-[#25305c]">
            {resource?.name || "Resource"}
          </p>

          {resource?.description && (
            <p className="mt-1 text-[9px] font-medium leading-5 text-[#6c7491]">
              {resource.description}
            </p>
          )}

          {hasUrl && (
            <a
              href={resource.url}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-[9px] font-extrabold text-[#6d28d9] hover:underline"
            >
              Open Resource
              <ArrowRight size={11} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function InterviewCard({
  item,
}) {
  return (
    <div className="rounded-2xl border border-[#e9e4f7] bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f0e9ff] text-[#6d28d9]">
          <MessageCircle size={15} />
        </div>

        <div>
          <p className="text-[11px] font-extrabold text-[#25305c]">
            {item?.title || "Preparation"}
          </p>

          {item?.description && (
            <p className="mt-1 text-[9px] font-medium leading-5 text-[#6c7491]">
              {item.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function MilestoneCard({
  milestone,
  index,
}) {
  return (
    <div className="relative flex gap-3">
      <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eee6ff] text-[10px] font-black text-[#6825e9]">
        {index + 1}
      </div>

      <div className="min-w-0 flex-1 rounded-2xl border border-[#e9e4f7] bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[11px] font-extrabold text-[#25305c]">
            {milestone?.title || "Milestone"}
          </p>

          {milestone?.time && (
            <span className="rounded-lg bg-[#f1eaff] px-2 py-1 text-[8px] font-extrabold text-[#6825e9]">
              {milestone.time}
            </span>
          )}
        </div>

        {milestone?.description && (
          <p className="mt-2 text-[9px] font-medium leading-5 text-[#6c7491]">
            {milestone.description}
          </p>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

function Roadmaps({
  onBack,
  onLogout,
  profileRefreshKey,
  onHome,
  onMockTests,
  onAI,
  onProfile,
  onRoadmaps,
  onTarget,
  onPYQ,
}) {
  const [form, setForm] = useState({
    learning: "",
    level: "",
    goal: "",
    dailyTime: "",
    targetDate: "",
    duration: "",
    focusAreas: [],
    preferences: "",
    currentSkills: "",
    weakAreas: "",
    resources: "",
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRoadmap, setGeneratedRoadmap] =
    useState(null);
  const [error, setError] = useState("");

  const user = useMemo(() => {
    try {
      const storedUser =
        localStorage.getItem("studyGemUser");

      return storedUser
        ? JSON.parse(storedUser)
        : null;
    } catch {
      return null;
    }
  }, []);

  const userName =
    user?.name ||
    user?.fullName ||
    user?.username ||
    "Student";

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setError("");
  };

  const toggleFocus = (focus) => {
    setForm((current) => {
      const alreadySelected =
        current.focusAreas.includes(focus);

      return {
        ...current,
        focusAreas: alreadySelected
          ? current.focusAreas.filter(
              (item) => item !== focus
            )
          : [...current.focusAreas, focus],
      };
    });

    setError("");
  };

  const validateForm = () => {
    if (!form.learning.trim()) {
      return "Please enter what you want to learn.";
    }

    if (!form.level.trim()) {
      return "Please select or type your current level.";
    }

    if (!form.goal.trim()) {
      return "Please select or type your main goal.";
    }

    if (!form.dailyTime.trim()) {
      return "Please select how much time you can study per day.";
    }

    if (!form.duration.trim()) {
      return "Please select your roadmap duration.";
    }

    if (form.focusAreas.length === 0) {
      return "Please select at least one focus area.";
    }

    return "";
  };

  const generateRoadmap = async (e) => {
    e.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setIsGenerating(true);

    try {
      const token =
        localStorage.getItem("studyGemToken");

      const response = await fetch(
        `${API_BASE_URL}/roadmap/generate`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },

          body: JSON.stringify({
            learning: form.learning.trim(),

            level: form.level.trim(),

            goal: form.goal.trim(),

            dailyTime:
              form.dailyTime.trim(),

            targetDate:
              form.targetDate?.trim() || "",

            duration:
              form.duration.trim(),

            focusAreas:
              form.focusAreas,

            preferences:
              form.preferences?.trim() || "",

            currentSkills:
              form.currentSkills?.trim() || "",

            weakAreas:
              form.weakAreas?.trim() || "",

            resources:
              form.resources?.trim() || "",
          }),
        }
      );

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "Server returned an invalid response. Please try again."
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to generate roadmap."
        );
      }

      if (
        !data?.success ||
        !data?.roadmap
      ) {
        throw new Error(
          "AI did not return a valid roadmap."
        );
      }

      setGeneratedRoadmap(
        data.roadmap
      );
    } catch (generationError) {
      console.error(
        "Roadmap Generation Error:",
        generationError
      );

      setGeneratedRoadmap(null);

      setError(
        generationError?.message ||
          "Something went wrong while creating your roadmap. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const closeRoadmap = () => {
    setGeneratedRoadmap(null);
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f8f7ff]">
      {/* =====================================================
          NAVBAR
      ===================================================== */}

<Navbar
  onLogout={onLogout}
  onHome={onHome}
  onMockTests={onMockTests}
  onAI={onAI}
  onProfile={onProfile}
  onRoadmaps={onRoadmaps}
  onTarget={onTarget}
  onPYQ={onPYQ}
        activePage="roadmaps"
      />

      {/* =====================================================
          MAIN ROADMAP DESIGN
      ===================================================== */}

      <main className="relative min-h-screen overflow-hidden pt-[82px] lg:pt-[90px]">
        {/* BACKGROUND IMAGE */}

        <div
          className="
            pointer-events-none absolute left-0 top-0
            h-[1050px] w-full
            bg-no-repeat
          "
          style={{
            backgroundImage: `url(${rrImage})`,
            backgroundSize: "100% auto",
            backgroundPosition: "center -66px",
          }}
        />

        {/* SOFT OVERLAY */}

        <div className="pointer-events-none absolute inset-0 bg-white/5" />

        {/* =================================================
            HERO CONTENT
        ================================================= */}

        <section className="relative mx-auto w-full max-w-[1536px] px-5 sm:px-8 lg:px-10">
          <div className="min-h-[300px] lg:min-h-[310px]">
            <div className="max-w-[700px] pt-8 sm:pt-10 lg:pt-9">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#e9ddff] px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-wider text-[#6825e9] shadow-sm">
                <Sparkles size={12} />
                AI Powered
              </div>

              <h1 className="max-w-[650px] text-[35px] font-black leading-[1.08] tracking-[-1.5px] text-[#111a48] sm:text-[43px] lg:text-[46px]">
                Generate Your
                <br />
                Personalized{" "}
                <span className="bg-gradient-to-r from-[#6d28d9] via-[#7c3aed] to-[#a855f7] bg-clip-text text-transparent">
                  Roadmap
                </span>
              </h1>

              <p className="mt-4 max-w-[590px] text-[12px] font-medium leading-6 text-[#56618b] sm:text-[14px]">
                Tell us your goals, current level and interests.
                Our AI will create a step-by-step personalized
                learning roadmap just for you.
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5">
                <div className="flex items-center gap-2 rounded-xl bg-white/75 px-3 py-2 text-[9px] font-bold text-[#343c67] shadow-sm backdrop-blur-sm">
                  <Sparkles
                    size={14}
                    className="text-[#6d28d9]"
                  />
                  Personalized Plan
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-white/75 px-3 py-2 text-[9px] font-bold text-[#343c67] shadow-sm backdrop-blur-sm">
                  <ListChecks
                    size={14}
                    className="text-[#6d28d9]"
                  />
                  Step-by-Step Learning
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-white/75 px-3 py-2 text-[9px] font-bold text-[#343c67] shadow-sm backdrop-blur-sm">
                  <Clock3
                    size={14}
                    className="text-[#6d28d9]"
                  />
                  Time Estimates
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-white/75 px-3 py-2 text-[9px] font-bold text-[#343c67] shadow-sm backdrop-blur-sm">
                  <Link2
                    size={14}
                    className="text-[#6d28d9]"
                  />
                  Resource Suggestions
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              FORM + PREVIEW
          ================================================= */}

          <section className="relative z-10 -mt-[4px] mb-10 rounded-[25px] border border-white/90 bg-white/92 p-3 shadow-[0_15px_55px_rgba(80,55,150,0.12)] backdrop-blur-md sm:p-4 lg:p-4">
            <div className="grid gap-3 lg:grid-cols-[1fr_1.2fr]">
              {/* =================================================
                  LEFT FORM
              ================================================= */}

              <div className="rounded-[20px] border border-[#e7e3f5] bg-white p-5 sm:p-6">
                <div className="mb-5 flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#eee6ff] text-[#6d28d9]">
                    <span className="text-[12px] font-black">
                      1
                    </span>
                  </div>

                  <div>
                    <h2 className="text-[14px] font-extrabold text-[#17204b]">
                      Tell us about your goal
                    </h2>

                    <p className="mt-1 text-[10px] font-medium text-[#8a90a9]">
                      Fill in the details below to get a personalized roadmap
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={generateRoadmap}
                  className="space-y-4"
                >
                  {/* LEARNING */}

                  <EditableSelect
                    label="What do you want to learn?"
                    value={form.learning}
                    onChange={(value) =>
                      updateField(
                        "learning",
                        value
                      )
                    }
                    options={LEARNING_OPTIONS}
                    placeholder="e.g. Full Stack Development, Data Science, DSA..."
                    icon={Target}
                    required
                  />

                  {/* LEVEL + GOAL */}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <EditableSelect
                      label="Your current level"
                      value={form.level}
                      onChange={(value) =>
                        updateField(
                          "level",
                          value
                        )
                      }
                      options={LEVEL_OPTIONS}
                      placeholder="Select or type"
                      icon={BarChart3}
                      required
                    />

                    <EditableSelect
                      label="Your goal"
                      value={form.goal}
                      onChange={(value) =>
                        updateField(
                          "goal",
                          value
                        )
                      }
                      options={GOAL_OPTIONS}
                      placeholder="Select or type"
                      icon={Trophy}
                      required
                    />
                  </div>

                  {/* TIME + DEADLINE */}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <EditableSelect
                      label="Time available per day"
                      value={form.dailyTime}
                      onChange={(value) =>
                        updateField(
                          "dailyTime",
                          value
                        )
                      }
                      options={TIME_OPTIONS}
                      placeholder="Select or type"
                      icon={Clock3}
                      required
                    />

                    <div>
                      <label className="mb-2 flex items-center gap-2 text-[12px] font-bold text-[#17204b]">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f1eaff] text-[#6525ef]">
                          <Calendar size={14} />
                        </span>

                        Target deadline

                        <span className="text-[9px] font-medium text-[#9ba1b7]">
                          optional
                        </span>
                      </label>

                      <input
                        type="text"
                        value={form.targetDate}
                        onChange={(e) =>
                          updateField(
                            "targetDate",
                            e.target.value
                          )
                        }
                        placeholder="e.g. Dec 2026"
                        className="
                          h-[45px] w-full rounded-xl
                          border border-[#dfe2f5] bg-white
                          px-4 text-[12px] font-medium
                          text-[#252d57] outline-none
                          placeholder:text-[#a0a6c0]
                          focus:border-[#8b5cf6]
                          focus:ring-4 focus:ring-[#8b5cf6]/10
                        "
                      />
                    </div>
                  </div>

                  {/* DURATION */}

                  <EditableSelect
                    label="Roadmap duration"
                    value={form.duration}
                    onChange={(value) =>
                      updateField(
                        "duration",
                        value
                      )
                    }
                    options={DURATION_OPTIONS}
                    placeholder="e.g. 90 Days"
                    icon={Timer}
                    required
                  />

                  {/* FOCUS AREAS */}

                  <div>
                    <label className="mb-2 flex items-center gap-2 text-[12px] font-bold text-[#17204b]">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f1eaff] text-[#6525ef]">
                        <BookOpen size={14} />
                      </span>

                      Focus areas

                      <span className="text-[9px] font-medium text-[#9ba1b7]">
                        select multiple
                      </span>
                    </label>

                    <div className="flex flex-wrap gap-2">
                      {FOCUS_OPTIONS.map(
                        (focus) => (
                          <FocusChip
                            key={focus}
                            label={focus}
                            active={form.focusAreas.includes(
                              focus
                            )}
                            onClick={() =>
                              toggleFocus(
                                focus
                              )
                            }
                          />
                        )
                      )}
                    </div>
                  </div>

                  {/* CURRENT SKILLS */}

                  <div>
                    <label className="mb-2 flex items-center gap-2 text-[12px] font-bold text-[#17204b]">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f1eaff] text-[#6525ef]">
                        <Code2 size={14} />
                      </span>

                      What do you already know?

                      <span className="text-[9px] font-medium text-[#9ba1b7]">
                        optional
                      </span>
                    </label>

                    <textarea
                      value={form.currentSkills}
                      onChange={(e) =>
                        updateField(
                          "currentSkills",
                          e.target.value
                        )
                      }
                      rows={2}
                      placeholder="e.g. HTML, CSS, JavaScript basics, Python..."
                      className="
                        w-full resize-none rounded-xl
                        border border-[#dfe2f5] bg-white
                        px-4 py-3 text-[11px] font-medium
                        leading-5 text-[#252d57]
                        outline-none placeholder:text-[#a0a6c0]
                        focus:border-[#8b5cf6]
                        focus:ring-4 focus:ring-[#8b5cf6]/10
                      "
                    />
                  </div>

                  {/* WEAK AREAS */}

                  <div>
                    <label className="mb-2 flex items-center gap-2 text-[12px] font-bold text-[#17204b]">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f1eaff] text-[#6525ef]">
                        <Zap size={14} />
                      </span>

                      Weak areas

                      <span className="text-[9px] font-medium text-[#9ba1b7]">
                        optional
                      </span>
                    </label>

                    <textarea
                      value={form.weakAreas}
                      onChange={(e) =>
                        updateField(
                          "weakAreas",
                          e.target.value
                        )
                      }
                      rows={2}
                      placeholder="e.g. DSA, English speaking, consistency, hard concepts..."
                      className="
                        w-full resize-none rounded-xl
                        border border-[#dfe2f5] bg-white
                        px-4 py-3 text-[11px] font-medium
                        leading-5 text-[#252d57]
                        outline-none placeholder:text-[#a0a6c0]
                        focus:border-[#8b5cf6]
                        focus:ring-4 focus:ring-[#8b5cf6]/10
                      "
                    />
                  </div>

                  {/* PREFERENCES */}

                  <div>
                    <label className="mb-2 flex items-center gap-2 text-[12px] font-bold text-[#17204b]">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f1eaff] text-[#6525ef]">
                        <FileText size={14} />
                      </span>

                      Learning preferences

                      <span className="text-[9px] font-medium text-[#9ba1b7]">
                        optional
                      </span>
                    </label>

                    <textarea
                      value={form.preferences}
                      onChange={(e) =>
                        updateField(
                          "preferences",
                          e.target.value
                        )
                      }
                      rows={2}
                      placeholder="e.g. I prefer practical learning, short notes, projects..."
                      className="
                        w-full resize-none rounded-xl
                        border border-[#dfe2f5] bg-white
                        px-4 py-3 text-[11px] font-medium
                        leading-5 text-[#252d57]
                        outline-none placeholder:text-[#a0a6c0]
                        focus:border-[#8b5cf6]
                        focus:ring-4 focus:ring-[#8b5cf6]/10
                      "
                    />
                  </div>

                  {/* RESOURCES */}

                  <div>
                    <label className="mb-2 flex items-center gap-2 text-[12px] font-bold text-[#17204b]">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f1eaff] text-[#6525ef]">
                        <Link2 size={14} />
                      </span>

                      Preferred resources

                      <span className="text-[9px] font-medium text-[#9ba1b7]">
                        optional
                      </span>
                    </label>

                    <div className="flex flex-wrap gap-2">
                      {RESOURCE_OPTIONS.map(
                        (resource) => {
                          const selected =
                            form.resources ===
                            resource;

                          return (
                            <button
                              key={resource}
                              type="button"
                              onClick={() =>
                                updateField(
                                  "resources",
                                  selected
                                    ? ""
                                    : resource
                                )
                              }
                              className={`
                                rounded-xl border px-3 py-2
                                text-[9px] font-bold
                                transition-all
                                ${
                                  selected
                                    ? "border-[#cbb6ff] bg-[#eee5ff] text-[#6525ef]"
                                    : "border-[#e2e4f1] bg-white text-[#737b98] hover:border-[#cdbaff] hover:bg-[#f7f3ff] hover:text-[#6525ef]"
                                }
                              `}
                            >
                              {resource}
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>

                  {/* ERROR */}

                  {error && (
                    <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-[10px] font-semibold leading-5 text-red-600">
                      {error}
                    </div>
                  )}

                  {/* GENERATE */}

                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="
                      group flex h-[48px] w-full
                      items-center justify-center gap-2
                      rounded-xl
                      bg-gradient-to-r
                      from-[#7630ff] to-[#5420ee]
                      text-[12px] font-extrabold text-white
                      shadow-[0_10px_25px_rgba(109,40,217,0.22)]
                      transition-all
                      hover:-translate-y-[1px]
                      hover:shadow-[0_14px_30px_rgba(109,40,217,0.28)]
                      disabled:cursor-not-allowed
                      disabled:opacity-70
                    "
                  >
                    {isGenerating ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Creating your roadmap...
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        Generate My Roadmap
                        <ArrowRight
                          size={16}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* =================================================
                  RIGHT PREVIEW / ILLUSTRATION
              ================================================= */}

              <div className="relative min-h-[560px] overflow-hidden rounded-[20px] bg-gradient-to-br from-[#f8f4ff] via-[#f5f1ff] to-[#eee8ff]">
                <div className="absolute right-0 top-0 h-[260px] w-[260px] rounded-full bg-[#d8c4ff]/40 blur-3xl" />

                <div className="absolute bottom-0 left-0 h-[220px] w-[220px] rounded-full bg-[#d7c5ff]/30 blur-3xl" />

                <div className="relative flex h-full flex-col items-center justify-center px-6 py-10 text-center sm:px-10">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-[20px] bg-white shadow-[0_12px_35px_rgba(80,55,150,0.12)]">
                    <Map
                      size={30}
                      className="text-[#6d28d9]"
                    />
                  </div>

                  <p className="text-[9px] font-extrabold uppercase tracking-[2px] text-[#7c54c9]">
                    StudyGem AI
                  </p>

                  <h2 className="mt-3 max-w-[430px] text-[25px] font-black leading-tight tracking-[-0.8px] text-[#1b2551] sm:text-[31px]">
                    Your learning journey,
                    <br />
                    planned by AI.
                  </h2>

                  <p className="mt-4 max-w-[420px] text-[11px] font-medium leading-6 text-[#68708f] sm:text-[12px]">
                    Get a personalized roadmap with phases,
                    weekly targets, daily routines, projects,
                    resources and milestones based on your
                    exact goals.
                  </p>

                  <div className="mt-7 grid w-full max-w-[450px] grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white bg-white/80 p-4 shadow-sm backdrop-blur-sm">
                      <Sparkles
                        size={17}
                        className="mx-auto text-[#6d28d9]"
                      />

                      <p className="mt-2 text-[10px] font-extrabold text-[#27305a]">
                        Personalized
                      </p>

                      <p className="mt-1 text-[8px] font-medium leading-4 text-[#8a90a9]">
                        Based on your level & goals
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white bg-white/80 p-4 shadow-sm backdrop-blur-sm">
                      <ListChecks
                        size={17}
                        className="mx-auto text-[#6d28d9]"
                      />

                      <p className="mt-2 text-[10px] font-extrabold text-[#27305a]">
                        Actionable
                      </p>

                      <p className="mt-1 text-[8px] font-medium leading-4 text-[#8a90a9]">
                        Clear tasks to follow
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white bg-white/80 p-4 shadow-sm backdrop-blur-sm">
                      <Clock3
                        size={17}
                        className="mx-auto text-[#6d28d9]"
                      />

                      <p className="mt-2 text-[10px] font-extrabold text-[#27305a]">
                        Time-Based
                      </p>

                      <p className="mt-1 text-[8px] font-medium leading-4 text-[#8a90a9]">
                        Fits your daily schedule
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white bg-white/80 p-4 shadow-sm backdrop-blur-sm">
                      <Trophy
                        size={17}
                        className="mx-auto text-[#6d28d9]"
                      />

                      <p className="mt-2 text-[10px] font-extrabold text-[#27305a]">
                        Goal Focused
                      </p>

                      <p className="mt-1 text-[8px] font-medium leading-4 text-[#8a90a9]">
                        Built around your target
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =================================================
              SMALL INFO SECTION
          ================================================= */}

          <section className="relative z-10 mb-12">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white bg-white/80 p-4 shadow-sm backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f0e9ff] text-[#6d28d9]">
                    <GraduationCap size={17} />
                  </div>

                  <div>
                    <p className="text-[10px] font-extrabold text-[#27305a]">
                      Learn Smart
                    </p>

                    <p className="mt-0.5 text-[8px] font-medium text-[#8b91a9]">
                      Focus on what matters
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white bg-white/80 p-4 shadow-sm backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f0e9ff] text-[#6d28d9]">
                    <Target size={17} />
                  </div>

                  <div>
                    <p className="text-[10px] font-extrabold text-[#27305a]">
                      Stay Focused
                    </p>

                    <p className="mt-0.5 text-[8px] font-medium text-[#8b91a9]">
                      Follow your milestones
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white bg-white/80 p-4 shadow-sm backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f0e9ff] text-[#6d28d9]">
                    <Award size={17} />
                  </div>

                  <div>
                    <p className="text-[10px] font-extrabold text-[#27305a]">
                      Achieve More
                    </p>

                    <p className="mt-0.5 text-[8px] font-medium text-[#8b91a9]">
                      Turn consistency into results
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </section>
      </main>

      {/* =====================================================
          GENERATED ROADMAP MODAL
      ===================================================== */}

      {generatedRoadmap && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#11152b]/55 p-3 backdrop-blur-sm sm:p-5 lg:p-8">
          <div className="mx-auto w-full max-w-[1180px] overflow-hidden rounded-[25px] bg-[#f8f7ff] shadow-[0_30px_100px_rgba(20,15,60,0.3)]">
            {/* MODAL HEADER */}

            <div className="sticky top-0 z-30 border-b border-[#e9e4f7] bg-white/95 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#7630ff] to-[#5420ee] text-white shadow-md">
                    <Map size={19} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[9px] font-extrabold uppercase tracking-wider text-[#7c54c9]">
                      StudyGem AI
                    </p>

                    <h2 className="truncate text-[15px] font-black text-[#17204b] sm:text-[18px]">
                      {generatedRoadmap.title ||
                        "Your Personalized Roadmap"}
                    </h2>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadPDF}
                    className="flex h-10 items-center gap-2 rounded-xl bg-[#f0e9ff] px-3 text-[10px] font-extrabold text-[#6825e9] transition hover:bg-[#e8ddff] sm:px-4"
                  >
                    <Download size={15} />
                    <span className="hidden sm:block">
                      Download
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={closeRoadmap}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f1eff7] text-[#5e6682] transition hover:bg-[#e9e5f2]"
                  >
                    <X size={19} />
                  </button>
                </div>
              </div>
            </div>

            {/* MODAL CONTENT */}

            <div className="p-4 sm:p-6 lg:p-8">
              {/* INTRO */}

              <section className="rounded-[22px] bg-gradient-to-br from-[#f0e9ff] via-[#f7f3ff] to-white p-5 sm:p-7">
                <div className="max-w-[900px]">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-[9px] font-extrabold text-[#6825e9] shadow-sm">
                    <Sparkles size={12} />
                    AI Generated for {userName}
                  </div>

                  {generatedRoadmap.summary && (
                    <p className="mt-4 text-[11px] font-medium leading-6 text-[#626b8b] sm:text-[12px]">
                      {generatedRoadmap.summary}
                    </p>
                  )}

                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <RoadmapStat
                      icon={Timer}
                      label="Duration"
                      value={
                        generatedRoadmap.duration
                      }
                    />

                    <RoadmapStat
                      icon={Clock3}
                      label="Daily Time"
                      value={
                        generatedRoadmap.dailyTime
                      }
                    />

                    <RoadmapStat
                      icon={Target}
                      label="Goal"
                      value={
                        generatedRoadmap.goal
                      }
                    />

                    <RoadmapStat
                      icon={BarChart3}
                      label="Level"
                      value={
                        generatedRoadmap.level
                      }
                    />
                  </div>
                </div>
              </section>

              {/* OBJECTIVE */}

              {(generatedRoadmap.objective ||
                generatedRoadmap.successMetric ||
                generatedRoadmap.strategy) && (
                <section className="mt-5 grid gap-3 lg:grid-cols-3">
                  {generatedRoadmap.objective && (
                    <RoadmapCard className="p-5">
                      <div className="flex items-center gap-2">
                        <Target
                          size={16}
                          className="text-[#6d28d9]"
                        />

                        <h3 className="text-[11px] font-extrabold text-[#25305c]">
                          Objective
                        </h3>
                      </div>

                      <p className="mt-3 text-[9px] font-medium leading-5 text-[#6c7491]">
                        {generatedRoadmap.objective}
                      </p>
                    </RoadmapCard>
                  )}

                  {generatedRoadmap.successMetric && (
                    <RoadmapCard className="p-5">
                      <div className="flex items-center gap-2">
                        <Check
                          size={16}
                          className="text-[#6d28d9]"
                        />

                        <h3 className="text-[11px] font-extrabold text-[#25305c]">
                          Success Metric
                        </h3>
                      </div>

                      <p className="mt-3 text-[9px] font-medium leading-5 text-[#6c7491]">
                        {generatedRoadmap.successMetric}
                      </p>
                    </RoadmapCard>
                  )}

                  {generatedRoadmap.strategy && (
                    <RoadmapCard className="p-5">
                      <div className="flex items-center gap-2">
                        <Lightbulb
                          size={16}
                          className="text-[#6d28d9]"
                        />

                        <h3 className="text-[11px] font-extrabold text-[#25305c]">
                          Strategy
                        </h3>
                      </div>

                      <p className="mt-3 text-[9px] font-medium leading-5 text-[#6c7491]">
                        {generatedRoadmap.strategy}
                      </p>
                    </RoadmapCard>
                  )}
                </section>
              )}

              {/* PHASES */}

              {Array.isArray(
                generatedRoadmap.phases
              ) &&
                generatedRoadmap.phases.length > 0 && (
                  <section className="mt-7">
                    <SectionTitle
                      icon={Map}
                      title="Learning Phases"
                      subtitle="Your roadmap is divided into focused stages so you can progress step by step."
                    />

                    <div className="space-y-4">
                      {generatedRoadmap.phases.map(
                        (phase, index) => (
                          <PhaseCard
                            key={`${phase?.title || "phase"}-${index}`}
                            phase={phase}
                            index={index}
                          />
                        )
                      )}
                    </div>
                  </section>
                )}

              {/* WEEKLY PLAN */}

              {Array.isArray(
                generatedRoadmap.weeklyPlan
              ) &&
                generatedRoadmap.weeklyPlan.length > 0 && (
                  <section className="mt-8">
                    <SectionTitle
                      icon={Calendar}
                      title="Weekly Plan"
                      subtitle="Follow these weekly targets to stay consistent and track your progress."
                    />

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {generatedRoadmap.weeklyPlan.map(
                        (week, index) => (
                          <WeeklyPlanCard
                            key={`${week?.title || "week"}-${index}`}
                            week={week}
                            index={index}
                          />
                        )
                      )}
                    </div>
                  </section>
                )}

              {/* DAILY ROUTINE */}

              {Array.isArray(
                generatedRoadmap.dailyRoutine
              ) &&
                generatedRoadmap.dailyRoutine.length > 0 && (
                  <section className="mt-8">
                    <SectionTitle
                      icon={Clock3}
                      title="Daily Routine"
                      subtitle="A simple repeatable routine designed around your available study time."
                    />

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {generatedRoadmap.dailyRoutine.map(
                        (item, index) => (
                          <RoutineCard
                            key={`${item?.title || "routine"}-${index}`}
                            item={item}
                            index={index}
                          />
                        )
                      )}
                    </div>
                  </section>
                )}

              {/* PROJECTS */}

              {Array.isArray(
                generatedRoadmap.projects
              ) &&
                generatedRoadmap.projects.length > 0 && (
                  <section className="mt-8">
                    <SectionTitle
                      icon={Code2}
                      title="Projects"
                      subtitle="Build practical projects to turn your learning into demonstrable skills."
                    />

                    <div className="grid gap-3 lg:grid-cols-2">
                      {generatedRoadmap.projects.map(
                        (project, index) => (
                          <ProjectCard
                            key={`${project?.title || "project"}-${index}`}
                            project={project}
                          />
                        )
                      )}
                    </div>
                  </section>
                )}

              {/* RESOURCES */}

              {Array.isArray(
                generatedRoadmap.resources
              ) &&
                generatedRoadmap.resources.length > 0 && (
                  <section className="mt-8">
                    <SectionTitle
                      icon={Link2}
                      title="Recommended Resources"
                      subtitle="Use these resources to learn concepts, practice and go deeper."
                    />

                    <div className="grid gap-3 sm:grid-cols-2">
                      {generatedRoadmap.resources.map(
                        (resource, index) => (
                          <ResourceCard
                            key={`${resource?.name || "resource"}-${index}`}
                            resource={resource}
                          />
                        )
                      )}
                    </div>
                  </section>
                )}

              {/* INTERVIEW PREP */}

              {Array.isArray(
                generatedRoadmap.interviewPrep
              ) &&
                generatedRoadmap.interviewPrep.length > 0 && (
                  <section className="mt-8">
                    <SectionTitle
                      icon={MessageCircle}
                      title="Interview / Exam Preparation"
                      subtitle="Prepare specifically for the final target you selected."
                    />

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {generatedRoadmap.interviewPrep.map(
                        (item, index) => (
                          <InterviewCard
                            key={`${item?.title || "prep"}-${index}`}
                            item={item}
                          />
                        )
                      )}
                    </div>
                  </section>
                )}

              {/* MILESTONES */}

              {Array.isArray(
                generatedRoadmap.milestones
              ) &&
                generatedRoadmap.milestones.length > 0 && (
                  <section className="mt-8">
                    <SectionTitle
                      icon={Trophy}
                      title="Milestones"
                      subtitle="Use these checkpoints to know whether you are progressing on schedule."
                    />

                    <div className="space-y-3">
                      {generatedRoadmap.milestones.map(
                        (milestone, index) => (
                          <MilestoneCard
                            key={`${milestone?.title || "milestone"}-${index}`}
                            milestone={milestone}
                            index={index}
                          />
                        )
                      )}
                    </div>
                  </section>
                )}

              {/* FINAL TIPS */}

              {Array.isArray(
                generatedRoadmap.finalTips
              ) &&
                generatedRoadmap.finalTips.length > 0 && (
                  <section className="mt-8">
                    <RoadmapCard className="overflow-hidden">
                      <div className="bg-gradient-to-r from-[#7630ff] to-[#5420ee] p-5 sm:p-6">
                        <div className="flex items-center gap-2">
                          <Lightbulb
                            size={17}
                            className="text-white"
                          />

                          <h3 className="text-[13px] font-extrabold text-white">
                            Final Tips
                          </h3>
                        </div>
                      </div>

                      <div className="grid gap-2 p-5 sm:grid-cols-2 sm:p-6">
                        {generatedRoadmap.finalTips.map(
                          (tip, index) => (
                            <div
                              key={`${tip}-${index}`}
                              className="flex items-start gap-3 rounded-xl bg-[#faf9ff] p-3"
                            >
                              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#eee6ff] text-[8px] font-black text-[#6825e9]">
                                {index + 1}
                              </span>

                              <p className="text-[9px] font-semibold leading-5 text-[#626b88]">
                                {tip}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </RoadmapCard>
                  </section>
                )}

              {/* DOWNLOAD */}

              <div className="mt-8 flex flex-col items-center justify-center gap-3 rounded-[22px] border border-[#e7ddfa] bg-gradient-to-br from-[#f5f0ff] to-white p-6 text-center sm:p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eee6ff] text-[#6825e9]">
                  <Download size={21} />
                </div>

                <div>
                  <h3 className="text-[14px] font-extrabold text-[#202953]">
                    Keep your roadmap with you
                  </h3>

                  <p className="mt-1 text-[9px] font-medium text-[#7e859f]">
                    Download or print your personalized roadmap and start today.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  className="mt-1 flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#7630ff] to-[#5420ee] px-5 py-3 text-[10px] font-extrabold text-white shadow-md shadow-purple-200 transition hover:-translate-y-[1px]"
                >
                  <Download size={15} />
                  Download Roadmap as PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          PRINT STYLES
      ===================================================== */}

      <style>
        {`
          @media print {
            body {
              background: white !important;
            }

            body * {
              visibility: hidden !important;
            }

            .fixed.inset-0.z-\\[100\\],
            .fixed.inset-0.z-\\[100\\] * {
              visibility: visible !important;
            }

            .fixed.inset-0.z-\\[100\\] {
              position: absolute !important;
              inset: 0 !important;
              overflow: visible !important;
              background: white !important;
              padding: 0 !important;
            }

            .fixed.inset-0.z-\\[100\\] > div {
              width: 100% !important;
              max-width: none !important;
              border-radius: 0 !important;
              box-shadow: none !important;
            }

            .fixed.inset-0.z-\\[100\\] button {
              display: none !important;
            }

            @page {
              size: A4;
              margin: 10mm;
            }
          }
        `}
      </style>
    </div>
  );
}

export default Roadmaps;
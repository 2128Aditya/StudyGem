import { useEffect, useMemo, useRef, useState } from "react";

import {
  Activity,
  BarChart3,
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Edit3,
  Expand,
  Flame,
  ListChecks,
  MoreVertical,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Square,
  Target as TargetIcon,
  Timer,
  Trophy,
  X,
  Zap,
} from "lucide-react";

import rrImage from "../assets/rr.png";
import Navbar from "../components/Navbar";

/* =========================================================
   STORAGE KEYS
========================================================= */

const STUDY_SESSIONS_KEY = "studyGemStudySessions";
const STUDY_TARGET_KEY = "studyGemTargetData";
const STUDY_TASKS_KEY = "studyGemTargetTasks";

/* =========================================================
   DEFAULT DATA
========================================================= */

const DEFAULT_TARGET = {
  targetHours: 2,
  targetMinutes: 0,
  subjectsPlanned: 4,
};

const DEFAULT_TASKS = [
  {
    id: 1,
    title: "Read Environment Notes",
    duration: 60,
    completed: true,
  },
  {
    id: 2,
    title: "Solve 20 MCQs",
    duration: 40,
    completed: true,
  },
  {
    id: 3,
    title: "Revise Important Topics",
    duration: 60,
    completed: false,
  },
  {
    id: 4,
    title: "Take a Mock Test",
    duration: 60,
    completed: false,
  },
];

const SUBJECTS = [
  {
    id: "general-studies",
    name: "General Studies",
    shortName: "GS",
    icon: "📖",
    type: "blue",
  },
  {
    id: "current-affairs",
    name: "Current Affairs",
    shortName: "CA",
    icon: "📋",
    type: "blue",
  },
  {
    id: "csat",
    name: "CSAT",
    shortName: "CS",
    icon: "🧠",
    type: "blue",
  },
  {
    id: "optional-subject",
    name: "Optional Subject",
    shortName: "OP",
    icon: "⊕",
    type: "purple",
  },
  {
    id: "essay",
    name: "Essay",
    shortName: "ES",
    icon: "📄",
    type: "blue",
  },
  {
    id: "previous-year",
    name: "Previous Year Questions",
    shortName: "PYQ",
    icon: "▦",
    type: "green",
  },
];

/* =========================================================
   HELPERS
========================================================= */

const pad = (number) =>
  String(number).padStart(2, "0");

const formatTimer = (totalSeconds) => {
  const safeSeconds = Math.max(
    0,
    Math.floor(totalSeconds || 0)
  );

  const hours = Math.floor(
    safeSeconds / 3600
  );

  const minutes = Math.floor(
    (safeSeconds % 3600) / 60
  );

  const seconds = safeSeconds % 60;

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

const formatShortTime = (totalSeconds) => {
  const safeSeconds = Math.max(
    0,
    Math.floor(totalSeconds || 0)
  );

  const hours = Math.floor(
    safeSeconds / 3600
  );

  const minutes = Math.floor(
    (safeSeconds % 3600) / 60
  );

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
};

const formatDateKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());

  return `${year}-${month}-${day}`;
};

const formatDisplayDate = (date = new Date()) => {
  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      weekday: "short",
    }
  ).format(date);
};

const loadLocalStorage = (
  key,
  fallback
) => {
  try {
    const value =
      localStorage.getItem(key);

    if (!value) {
      return fallback;
    }

    return JSON.parse(value);
  } catch (error) {
    console.error(
      `Failed to load ${key}:`,
      error
    );

    return fallback;
  }
};

const saveLocalStorage = (
  key,
  value
) => {
  try {
    localStorage.setItem(
      key,
      JSON.stringify(value)
    );
  } catch (error) {
    console.error(
      `Failed to save ${key}:`,
      error
    );
  }
};

/* =========================================================
   SUBJECT ICON
========================================================= */

function SubjectIcon({
  subject,
  large = false,
}) {
  if (!subject) {
    return (
      <div
        className={`
          flex items-center justify-center
          rounded-xl bg-[#eee7ff]
          text-[#6825e9]
          ${
            large
              ? "h-12 w-12 text-[23px]"
              : "h-9 w-9 text-[18px]"
          }
        `}
      >
        <BookOpen
          size={large ? 24 : 18}
        />
      </div>
    );
  }

  return (
    <div
      className={`
        flex items-center justify-center
        rounded-xl
        ${
          subject.type === "green"
            ? "bg-[#dcf8ee]"
            : subject.type === "purple"
            ? "bg-[#eee6ff]"
            : "bg-[#e8f0ff]"
        }
        ${
          large
            ? "h-12 w-12 text-[23px]"
            : "h-9 w-9 text-[18px]"
        }
      `}
    >
      {subject.icon}
    </div>
  );
}

/* =========================================================
   TARGET EDIT MODAL
========================================================= */

function TargetEditModal({
  targetHours,
  targetMinutes,
  onSave,
  onClose,
}) {
  const [hours, setHours] =
    useState(String(targetHours));

  const [minutes, setMinutes] =
    useState(String(targetMinutes));

  const handleSave = () => {
    let safeHours =
      Number.parseInt(hours, 10);

    let safeMinutes =
      Number.parseInt(minutes, 10);

    if (Number.isNaN(safeHours)) {
      safeHours = 0;
    }

    if (Number.isNaN(safeMinutes)) {
      safeMinutes = 0;
    }

    safeHours = Math.max(
      0,
      Math.min(24, safeHours)
    );

    safeMinutes = Math.max(
      0,
      Math.min(59, safeMinutes)
    );

    if (
      safeHours === 0 &&
      safeMinutes === 0
    ) {
      safeHours = 1;
    }

    onSave(
      safeHours,
      safeMinutes
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#11152b]/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[410px] rounded-[24px] border border-white bg-white p-6 shadow-[0_30px_90px_rgba(35,20,80,0.22)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-[#eee6ff] text-[#6825e9]">
              <TargetIcon size={19} />
            </div>

            <h2 className="text-[18px] font-black text-[#161d48]">
              Edit Today's Target
            </h2>

            <p className="mt-1 text-[10px] font-medium leading-5 text-[#858ca5]">
              Set how much focused study time you want
              to complete today.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5f3fa] text-[#6e748c] transition hover:bg-[#eeeaf7]"
          >
            <X size={17} />
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div>
            <label className="mb-2 block text-[10px] font-extrabold text-[#4d5679]">
              Hours
            </label>

            <input
              type="number"
              min="0"
              max="24"
              value={hours}
              onChange={(e) =>
                setHours(e.target.value)
              }
              className="h-[48px] w-full rounded-xl border border-[#e0e2ef] bg-white px-4 text-[13px] font-bold text-[#202852] outline-none transition focus:border-[#7c3aed] focus:ring-4 focus:ring-[#7c3aed]/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-extrabold text-[#4d5679]">
              Minutes
            </label>

            <input
              type="number"
              min="0"
              max="59"
              value={minutes}
              onChange={(e) =>
                setMinutes(e.target.value)
              }
              className="h-[48px] w-full rounded-xl border border-[#e0e2ef] bg-white px-4 text-[13px] font-bold text-[#202852] outline-none transition focus:border-[#7c3aed] focus:ring-4 focus:ring-[#7c3aed]/10"
            />
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-[46px] flex-1 rounded-xl border border-[#e2e3ee] bg-white text-[11px] font-extrabold text-[#68708d] transition hover:bg-[#f8f7fc]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="h-[46px] flex-1 rounded-xl bg-gradient-to-r from-[#7430ff] to-[#5420ee] text-[11px] font-extrabold text-white shadow-md shadow-purple-200 transition hover:-translate-y-[1px]"
          >
            Save Target
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   ADD TASK MODAL
========================================================= */

function AddTaskModal({
  onAdd,
  onClose,
}) {
  const [title, setTitle] =
    useState("");

  const [duration, setDuration] =
    useState("30");

  const handleAdd = () => {
    const cleanTitle =
      title.trim();

    if (!cleanTitle) {
      return;
    }

    let safeDuration =
      Number.parseInt(duration, 10);

    if (
      Number.isNaN(safeDuration) ||
      safeDuration <= 0
    ) {
      safeDuration = 30;
    }

    onAdd({
      title: cleanTitle,
      duration: safeDuration,
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#11152b]/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[420px] rounded-[24px] border border-white bg-white p-6 shadow-[0_30px_90px_rgba(35,20,80,0.22)]">
        <div className="flex items-start justify-between">
          <div>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-[#eee6ff] text-[#6825e9]">
              <ListChecks size={19} />
            </div>

            <h2 className="text-[18px] font-black text-[#161d48]">
              Add Task
            </h2>

            <p className="mt-1 text-[10px] font-medium text-[#858ca5]">
              Add a study task for today.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5f3fa] text-[#6e748c]"
          >
            <X size={17} />
          </button>
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-[10px] font-extrabold text-[#4d5679]">
            Task name
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            placeholder="e.g. Revise DBMS Normalization"
            className="h-[48px] w-full rounded-xl border border-[#e0e2ef] px-4 text-[11px] font-semibold text-[#202852] outline-none placeholder:text-[#a2a7bb] focus:border-[#7c3aed] focus:ring-4 focus:ring-[#7c3aed]/10"
          />
        </div>

        <div className="mt-4">
          <label className="mb-2 block text-[10px] font-extrabold text-[#4d5679]">
            Estimated time
          </label>

          <div className="relative">
            <input
              type="number"
              min="1"
              value={duration}
              onChange={(e) =>
                setDuration(
                  e.target.value
                )
              }
              className="h-[48px] w-full rounded-xl border border-[#e0e2ef] px-4 pr-16 text-[11px] font-semibold text-[#202852] outline-none focus:border-[#7c3aed] focus:ring-4 focus:ring-[#7c3aed]/10"
            />

            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#8a90a7]">
              minutes
            </span>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-[46px] flex-1 rounded-xl border border-[#e2e3ee] bg-white text-[11px] font-extrabold text-[#68708d]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleAdd}
            className="h-[46px] flex-1 rounded-xl bg-gradient-to-r from-[#7430ff] to-[#5420ee] text-[11px] font-extrabold text-white shadow-md shadow-purple-200"
          >
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   STUDY TIMER CARD
========================================================= */

function StudyTimerCard({
  timerSeconds,
  timerRunning,
  timerPaused,
  selectedSubject,
  onStart,
  onPause,
  onReset,
  onStop,
}) {
  const targetSeconds =
    2 * 60 * 60;

  const progress = Math.min(
    100,
    (timerSeconds /
      targetSeconds) *
      100
  );

  const radius = 116;
  const circumference =
    2 * Math.PI * radius;

  const dashOffset =
    circumference -
    (progress / 100) *
      circumference;

  return (
    <div className="rounded-[22px] border border-white/90 bg-white/90 p-5 shadow-[0_10px_40px_rgba(72,48,145,0.08)] backdrop-blur-xl sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eee6ff] text-[#6825e9]">
            <Clock3 size={19} />
          </div>

          <h2 className="text-[15px] font-extrabold text-[#171d45]">
            Study Timer
          </h2>
        </div>

        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6f7897] transition hover:bg-[#f1edfa]"
          title="Fullscreen"
        >
          <Expand size={16} />
        </button>
      </div>

      <div className="mt-4 flex justify-center">
        <div className="relative h-[270px] w-[270px]">
          <svg
            viewBox="0 0 270 270"
            className="h-full w-full -rotate-90"
          >
            <circle
              cx="135"
              cy="135"
              r={radius}
              fill="none"
              stroke="#e7e0f9"
              strokeWidth="13"
            />

            <circle
              cx="135"
              cy="135"
              r={radius}
              fill="none"
              stroke="url(#timerGradient)"
              strokeWidth="13"
              strokeLinecap="round"
              strokeDasharray={
                circumference
              }
              strokeDashoffset={
                dashOffset
              }
            />

            <defs>
              <linearGradient
                id="timerGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  stopColor="#7c3aed"
                />

                <stop
                  offset="100%"
                  stopColor="#4f12ee"
                />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-[34px] font-black tracking-[-1.5px] text-[#11183e] sm:text-[37px]">
              {formatTimer(
                timerSeconds
              )}
            </p>

            <p className="mt-1 text-[11px] font-semibold text-[#697292]">
              Focused Study Time
            </p>

            <div className="mt-3 rounded-full bg-[#eee9fb] px-4 py-2 text-[10px] font-bold text-[#4f5790]">
              {selectedSubject
                ? selectedSubject.name
                : "Select a subject"}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-center gap-3">
        {!timerRunning ? (
          <button
            type="button"
            onClick={onStart}
            className="flex h-[52px] min-w-[150px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#742dff] to-[#5315ee] px-6 text-[12px] font-extrabold text-white shadow-[0_10px_25px_rgba(99,37,220,0.25)] transition hover:-translate-y-[1px]"
          >
            <Play
              size={17}
              fill="currentColor"
            />
            Start
          </button>
        ) : timerPaused ? (
          <button
            type="button"
            onClick={onStart}
            className="flex h-[52px] min-w-[150px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#742dff] to-[#5315ee] px-6 text-[12px] font-extrabold text-white shadow-[0_10px_25px_rgba(99,37,220,0.25)]"
          >
            <Play
              size={17}
              fill="currentColor"
            />
            Resume
          </button>
        ) : (
          <button
            type="button"
            onClick={onPause}
            className="flex h-[52px] min-w-[150px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#742dff] to-[#5315ee] px-6 text-[12px] font-extrabold text-white shadow-[0_10px_25px_rgba(99,37,220,0.25)]"
          >
            <Pause
              size={17}
              fill="currentColor"
            />
            Pause
          </button>
        )}

        <button
          type="button"
          onClick={onReset}
          className="flex h-[52px] w-[70px] flex-col items-center justify-center rounded-full border border-[#e1dff0] bg-white text-[#2b3158] transition hover:bg-[#f8f6fc]"
        >
          <RotateCcw size={17} />
          <span className="mt-0.5 text-[8px] font-bold text-[#737a97]">
            Reset
          </span>
        </button>

        <button
          type="button"
          onClick={onStop}
          className="flex h-[52px] w-[70px] flex-col items-center justify-center rounded-full border border-[#e1dff0] bg-white text-[#2b3158] transition hover:bg-[#f8f6fc]"
        >
          <Square
            size={15}
            fill="currentColor"
          />
          <span className="mt-0.5 text-[8px] font-bold text-[#737a97]">
            Stop
          </span>
        </button>
      </div>

      <div className="mt-5 flex items-center justify-center gap-2 text-[9px] font-semibold text-[#8a91aa]">
        <Activity
          size={13}
          className={
            timerRunning
              ? "text-[#6d28d9]"
              : ""
          }
        />

        {timerRunning
          ? timerPaused
            ? "Timer paused"
            : "Focus session running"
          : "Ready for your next focus session"}
      </div>
    </div>
  );
}

/* =========================================================
   TODAY TARGET CARD
========================================================= */

function TodayTargetCard({
  targetSeconds,
  studiedSeconds,
  tasksCompleted,
  totalTasks,
  subjectsPlanned,
  onEdit,
}) {
  const percentage =
    targetSeconds > 0
      ? Math.min(
          100,
          Math.round(
            (studiedSeconds /
              targetSeconds) *
              100
          )
        )
      : 0;

  const circumference =
    2 * Math.PI * 47;

  const dashOffset =
    circumference -
    (percentage / 100) *
      circumference;

  const onTrack =
    studiedSeconds >=
    targetSeconds;

  return (
    <div className="rounded-[22px] border border-white/90 bg-white/90 p-5 shadow-[0_10px_40px_rgba(72,48,145,0.08)] backdrop-blur-xl sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eee6ff] text-[#6825e9]">
            <TargetIcon size={19} />
          </div>

          <h2 className="text-[15px] font-extrabold text-[#171d45]">
            Today's Target
          </h2>
        </div>

        <button
          type="button"
          onClick={onEdit}
          className="flex items-center gap-1.5 rounded-xl border border-[#dfd6fa] bg-[#f5f0ff] px-3 py-2 text-[9px] font-extrabold text-[#6425ed] transition hover:bg-[#eee6ff]"
        >
          <Edit3 size={13} />
          Edit
        </button>
      </div>

      <div className="mt-5 flex items-center gap-4">
        <div className="relative h-[100px] w-[100px] shrink-0">
          <svg
            viewBox="0 0 110 110"
            className="h-full w-full -rotate-90"
          >
            <circle
              cx="55"
              cy="55"
              r="47"
              fill="none"
              stroke="#e8e7f1"
              strokeWidth="11"
            />

            <circle
              cx="55"
              cy="55"
              r="47"
              fill="none"
              stroke="url(#targetGradient)"
              strokeWidth="11"
              strokeLinecap="round"
              strokeDasharray={
                circumference
              }
              strokeDashoffset={
                dashOffset
              }
            />

            <defs>
              <linearGradient
                id="targetGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  stopColor="#8b5cf6"
                />

                <stop
                  offset="100%"
                  stopColor="#4f12ee"
                />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[17px] font-black text-[#11183e]">
              {percentage}%
            </span>
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex items-baseline gap-1">
            <span className="text-[24px] font-black text-[#11183e]">
              {formatShortTime(
                studiedSeconds
              )}
            </span>

            <span className="text-[11px] font-semibold text-[#707895]">
              /{" "}
              {formatShortTime(
                targetSeconds
              )}
            </span>
          </div>

          <p className="mt-1 text-[10px] font-semibold text-[#59628b]">
            {onTrack
              ? "Amazing! Daily target completed."
              : "Keep going! You're doing great."}
          </p>

          <div className="mt-3 h-[7px] w-full min-w-[150px] overflow-hidden rounded-full bg-[#e8e4f3]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#7c3aed] to-[#5420ee] transition-all duration-500"
              style={{
                width: `${percentage}%`,
              }}
            />
          </div>
        </div>
      </div>

      <div className="mt-5 divide-y divide-[#eceaf3]">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-2.5">
            <BookOpen
              size={17}
              className="text-[#66708f]"
            />

            <span className="text-[10px] font-semibold text-[#566080]">
              Subjects Planned
            </span>
          </div>

          <span className="text-[11px] font-extrabold text-[#22294e]">
            {subjectsPlanned}
          </span>
        </div>

        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-2.5">
            <ListChecks
              size={17}
              className="text-[#66708f]"
            />

            <span className="text-[10px] font-semibold text-[#566080]">
              Tasks Completed
            </span>
          </div>

          <span className="text-[11px] font-extrabold text-[#22294e]">
            {tasksCompleted} /{" "}
            {totalTasks}
          </span>
        </div>

        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-2.5">
            <Clock3
              size={17}
              className="text-[#66708f]"
            />

            <span className="text-[10px] font-semibold text-[#566080]">
              Total Study Time
            </span>
          </div>

          <span className="text-[11px] font-extrabold text-[#22294e]">
            {formatShortTime(
              studiedSeconds
            )}
          </span>
        </div>

        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-2.5">
            <CheckCircle2
              size={17}
              className={
                onTrack
                  ? "text-[#20b486]"
                  : "text-[#66708f]"
              }
            />

            <span className="text-[10px] font-semibold text-[#566080]">
              Target Status
            </span>
          </div>

          <span
            className={`
              rounded-full px-3 py-1.5
              text-[9px] font-extrabold
              ${
                onTrack
                  ? "bg-[#dcf8ee] text-[#13966e]"
                  : "bg-[#eee9ff] text-[#6825e9]"
              }
            `}
          >
            {onTrack
              ? "Completed"
              : "On Track"}
          </span>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   QUICK ACTIONS
========================================================= */

function QuickActions({
  onStartTimer,
  onSetTarget,
  onViewReports,
  onStudyPlan,
}) {
  return (
    <div className="rounded-[22px] border border-white/90 bg-white/90 p-5 shadow-[0_10px_40px_rgba(72,48,145,0.08)] backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <Zap
          size={18}
          className="text-[#6d28d9]"
          fill="currentColor"
        />

        <h2 className="text-[14px] font-extrabold text-[#171d45]">
          Quick Actions
        </h2>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={onStartTimer}
          className="flex h-[62px] items-center gap-2 rounded-xl bg-[#eee6ff] px-3 text-left transition hover:bg-[#e5dcff]"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#6425ed]">
            <Play
              size={15}
              fill="currentColor"
            />
          </div>

          <span className="text-[10px] font-extrabold text-[#5221c8]">
            Start Timer
          </span>
        </button>

        <button
          type="button"
          onClick={onSetTarget}
          className="flex h-[62px] items-center gap-2 rounded-xl bg-[#ffe8f2] px-3 text-left transition hover:bg-[#ffdfec]"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#ef3d88]">
            <TargetIcon size={16} />
          </div>

          <span className="text-[10px] font-extrabold text-[#c52d70]">
            Set Target
          </span>
        </button>

        <button
          type="button"
          onClick={onViewReports}
          className="flex h-[62px] items-center gap-2 rounded-xl bg-[#e7f0ff] px-3 text-left transition hover:bg-[#dceaff]"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#2466d8]">
            <BarChart3 size={17} />
          </div>

          <span className="text-[10px] font-extrabold text-[#2456b0]">
            View Reports
          </span>
        </button>

        <button
          type="button"
          onClick={onStudyPlan}
          className="flex h-[62px] items-center gap-2 rounded-xl bg-[#e3f8f1] px-3 text-left transition hover:bg-[#d9f5eb]"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#16a47b]">
            <Calendar size={17} />
          </div>

          <span className="text-[10px] font-extrabold text-[#168667]">
            Study Plan
          </span>
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   TODAY TASKS
========================================================= */

function TodayTasks({
  tasks,
  onToggleTask,
  onDeleteTask,
  onAddTask,
}) {
  return (
    <div className="rounded-[22px] border border-white/90 bg-white/90 p-5 shadow-[0_10px_40px_rgba(72,48,145,0.08)] backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ListChecks
            size={18}
            className="text-[#6825e9]"
          />

          <h2 className="text-[14px] font-extrabold text-[#171d45]">
            Today's Tasks
          </h2>
        </div>

        <button
          type="button"
          onClick={onAddTask}
          className="flex items-center gap-1.5 rounded-xl border border-[#e0d6fb] bg-[#f7f3ff] px-3 py-2 text-[9px] font-extrabold text-[#6825e9] transition hover:bg-[#eee7ff]"
        >
          <Plus size={14} />
          Add Task
        </button>
      </div>

      <div className="mt-3 divide-y divide-[#eceaf3]">
        {tasks.length === 0 ? (
          <div className="py-8 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f0ebfa] text-[#7d849e]">
              <ListChecks size={19} />
            </div>

            <p className="mt-3 text-[10px] font-bold text-[#626a86]">
              No tasks for today
            </p>

            <button
              type="button"
              onClick={onAddTask}
              className="mt-2 text-[9px] font-extrabold text-[#6825e9]"
            >
              + Add your first task
            </button>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="group flex items-center gap-2 py-3"
            >
              <button
                type="button"
                onClick={() =>
                  onToggleTask(task.id)
                }
                className={`
                  flex h-[23px] w-[23px] shrink-0
                  items-center justify-center
                  rounded-md border
                  transition
                  ${
                    task.completed
                      ? "border-[#6425ed] bg-[#6425ed] text-white"
                      : "border-[#9ea4b8] bg-white text-transparent"
                  }
                `}
              >
                <Check size={14} />
              </button>

              <div className="min-w-0 flex-1">
                <p
                  className={`
                    truncate text-[10px] font-semibold
                    ${
                      task.completed
                        ? "text-[#8b8fa3] line-through"
                        : "text-[#2c3356]"
                    }
                  `}
                >
                  {task.title}
                </p>
              </div>

              <span className="shrink-0 text-[9px] font-semibold text-[#7d849e]">
                {task.duration >= 60
                  ? `${Math.floor(
                      task.duration / 60
                    )}h ${
                      task.duration % 60
                        ? `${task.duration % 60}m`
                        : ""
                    }`
                  : `${task.duration}m`}
              </span>

              <button
                type="button"
                onClick={() =>
                  onDeleteTask(task.id)
                }
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[#7f869f] opacity-60 transition hover:bg-[#f4f1fa] hover:text-[#ef4444] group-hover:opacity-100"
                title="Delete task"
              >
                <MoreVertical size={15} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* =========================================================
   SUBJECT SELECTOR
========================================================= */

function SubjectSelector({
  subjects,
  selectedSubjectId,
  onSelect,
}) {
  return (
    <div className="rounded-[22px] border border-white/90 bg-white/90 p-5 shadow-[0_10px_40px_rgba(72,48,145,0.08)] backdrop-blur-xl sm:p-6">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eee6ff] text-[#6825e9]">
          <BookOpen size={18} />
        </div>

        <h2 className="text-[15px] font-extrabold text-[#171d45]">
          Select Subject for Session
        </h2>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {subjects.map((subject) => {
          const selected =
            selectedSubjectId ===
            subject.id;

          return (
            <button
              key={subject.id}
              type="button"
              onClick={() =>
                onSelect(subject.id)
              }
              className={`
                relative flex min-h-[112px]
                flex-col items-center
                justify-center rounded-xl
                border p-3 text-center
                transition-all
                ${
                  selected
                    ? "border-[#6825e9] bg-[#faf8ff] shadow-[0_5px_18px_rgba(103,37,233,0.10)]"
                    : "border-[#e5e5f1] bg-white hover:border-[#d0c0f8] hover:bg-[#fbfaff]"
                }
              `}
            >
              {selected && (
                <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#6425ed] text-white">
                  <Check size={13} />
                </span>
              )}

              <SubjectIcon
                subject={subject}
                large
              />

              <span className="mt-3 text-[10px] font-extrabold leading-4 text-[#22294f]">
                {subject.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================
   TOP INFO CARDS
========================================================= */

function TopInfoCards({
  studiedSeconds,
  streak,
}) {
  const today = new Date();

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <div className="rounded-[20px] border border-white/90 bg-white/85 p-4 shadow-[0_8px_30px_rgba(72,48,145,0.06)] backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eee6ff] text-[#6825e9]">
            <Calendar size={18} />
          </div>

          <div>
            <p className="text-[11px] font-extrabold text-[#20264b]">
              Today
            </p>

            <p className="mt-1 text-[10px] font-semibold text-[#59618a]">
              {formatDisplayDate(
                today
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-[20px] border border-white/90 bg-white/85 p-4 shadow-[0_8px_30px_rgba(72,48,145,0.06)] backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <span className="text-[34px] font-black leading-none text-[#6d28d9]">
            “
          </span>

          <p className="text-[11px] font-semibold leading-5 text-[#59618a]">
            A focused mind can achieve
            anything.
          </p>
        </div>
      </div>

      <div className="rounded-[20px] border border-white/90 bg-gradient-to-br from-[#fff1eb] to-[#fff7f4] p-4 shadow-[0_8px_30px_rgba(72,48,145,0.06)] backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="text-[29px]">
            🔥
          </div>

          <div>
            <p className="text-[21px] font-black leading-none text-[#22294f]">
              {streak}
            </p>

            <p className="mt-1 text-[10px] font-semibold text-[#6a6280]">
              Day Streak
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN TARGET PAGE
========================================================= */

function Target({
  onLogout,
  onHome,
  onMockTests,
  onAI,
  onProfile,
  onRoadmaps,
}) {
  /* =======================================================
     TARGET
  ======================================================= */

  const [targetData, setTargetData] =
    useState(() =>
      loadLocalStorage(
        STUDY_TARGET_KEY,
        DEFAULT_TARGET
      )
    );

  /* =======================================================
     TASKS
  ======================================================= */

  const [tasks, setTasks] =
    useState(() =>
      loadLocalStorage(
        STUDY_TASKS_KEY,
        DEFAULT_TASKS
      )
    );

  /* =======================================================
     SESSIONS
  ======================================================= */

  const [sessions, setSessions] =
    useState(() =>
      loadLocalStorage(
        STUDY_SESSIONS_KEY,
        []
      )
    );

  /* =======================================================
     SELECTED SUBJECT
  ======================================================= */

  const [selectedSubjectId, setSelectedSubjectId] =
    useState(() => {
      try {
        return (
          localStorage.getItem(
            "studyGemSelectedSubject"
          ) ||
          SUBJECTS[0].id
        );
      } catch {
        return SUBJECTS[0].id;
      }
    });

  /* =======================================================
     TIMER
  ======================================================= */

  const [timerSeconds, setTimerSeconds] =
    useState(0);

  const [timerRunning, setTimerRunning] =
    useState(false);

  const [timerPaused, setTimerPaused] =
    useState(false);

  const timerRef = useRef(null);

  const timerStartRef = useRef(null);

  const timerSavedRef = useRef(false);

  /* =======================================================
     MODALS
  ======================================================= */

  const [showTargetModal, setShowTargetModal] =
    useState(false);

  const [showTaskModal, setShowTaskModal] =
    useState(false);

  /* =======================================================
     NOTIFICATION
  ======================================================= */

  const [notification, setNotification] =
    useState("");

  /* =======================================================
     REPORT SECTION
  ======================================================= */

  const [showReports, setShowReports] =
    useState(false);

  /* =======================================================
     SAVE TARGET
  ======================================================= */

  useEffect(() => {
    saveLocalStorage(
      STUDY_TARGET_KEY,
      targetData
    );
  }, [targetData]);

  /* =======================================================
     SAVE TASKS
  ======================================================= */

  useEffect(() => {
    saveLocalStorage(
      STUDY_TASKS_KEY,
      tasks
    );
  }, [tasks]);

  /* =======================================================
     SAVE SESSIONS
  ======================================================= */

  useEffect(() => {
    saveLocalStorage(
      STUDY_SESSIONS_KEY,
      sessions
    );
  }, [sessions]);

  /* =======================================================
     SAVE SUBJECT
  ======================================================= */

  useEffect(() => {
    try {
      localStorage.setItem(
        "studyGemSelectedSubject",
        selectedSubjectId
      );
    } catch {
      // Ignore localStorage errors.
    }
  }, [selectedSubjectId]);

  /* =======================================================
     TIMER EFFECT
  ======================================================= */

  useEffect(() => {
    if (
      timerRunning &&
      !timerPaused
    ) {
      timerRef.current =
        window.setInterval(() => {
          setTimerSeconds(
            (current) =>
              current + 1
          );
        }, 1000);
    }

    return () => {
      if (timerRef.current) {
        window.clearInterval(
          timerRef.current
        );

        timerRef.current = null;
      }
    };
  }, [
    timerRunning,
    timerPaused,
  ]);

  /* =======================================================
     CLEAN NOTIFICATION
  ======================================================= */

  useEffect(() => {
    if (!notification) {
      return;
    }

    const timeout =
      window.setTimeout(() => {
        setNotification("");
      }, 2500);

    return () =>
      window.clearTimeout(
        timeout
      );
  }, [notification]);

  /* =======================================================
     TODAY KEY
  ======================================================= */

  const todayKey =
    formatDateKey();

  /* =======================================================
     SELECTED SUBJECT OBJECT
  ======================================================= */

  const selectedSubject =
    SUBJECTS.find(
      (subject) =>
        subject.id ===
        selectedSubjectId
    ) || SUBJECTS[0];

  /* =======================================================
     TODAY SESSIONS
  ======================================================= */

  const todaySessions = useMemo(() => {
    return sessions.filter(
      (session) =>
        session.date === todayKey
    );
  }, [
    sessions,
    todayKey,
  ]);

  /* =======================================================
     TODAY STUDIED SECONDS
  ======================================================= */

  const studiedSeconds = useMemo(() => {
    return todaySessions.reduce(
      (total, session) =>
        total +
        Number(
          session.durationSeconds || 0
        ),
      0
    );
  }, [todaySessions]);

  /* =======================================================
     TARGET SECONDS
  ======================================================= */

  const targetSeconds =
    Number(
      targetData.targetHours || 0
    ) *
      60 *
      60 +
    Number(
      targetData.targetMinutes || 0
    ) *
      60;

  /* =======================================================
     TASK STATS
  ======================================================= */

  const completedTasks =
    tasks.filter(
      (task) => task.completed
    ).length;

  const totalTasks =
    tasks.length;

  /* =======================================================
     STREAK
  ======================================================= */

  const streak = useMemo(() => {
    const uniqueDates =
      new Set(
        sessions
          .filter(
            (session) =>
              Number(
                session.durationSeconds ||
                  0
              ) > 0
          )
          .map(
            (session) =>
              session.date
          )
      );

    let currentStreak = 0;

    const date = new Date();

    while (true) {
      const key =
        formatDateKey(date);

      if (!uniqueDates.has(key)) {
        break;
      }

      currentStreak += 1;

      date.setDate(
        date.getDate() - 1
      );
    }

    return currentStreak;
  }, [sessions]);

  /* =======================================================
     SUBJECT STUDY TOTALS
  ======================================================= */

  const subjectTotals = useMemo(() => {
    const totals = {};

    SUBJECTS.forEach(
      (subject) => {
        totals[subject.id] = 0;
      }
    );

    sessions.forEach(
      (session) => {
        if (
          totals[
            session.subjectId
          ] === undefined
        ) {
          totals[
            session.subjectId
          ] = 0;
        }

        totals[
          session.subjectId
        ] += Number(
          session.durationSeconds ||
            0
        );
      }
    );

    return totals;
  }, [sessions]);

  /* =======================================================
     START TIMER
  ======================================================= */

  const startTimer = () => {
    if (!selectedSubject) {
      setNotification(
        "Please select a subject first."
      );

      return;
    }

    if (!timerRunning) {
      timerStartRef.current =
        new Date().toISOString();

      timerSavedRef.current =
        false;
    }

    setTimerRunning(true);
    setTimerPaused(false);

    setNotification(
      timerSeconds > 0
        ? "Study session resumed."
        : `Studying ${selectedSubject.name}`
    );
  };

  /* =======================================================
     PAUSE TIMER
  ======================================================= */

  const pauseTimer = () => {
    setTimerPaused(true);

    setNotification(
      "Timer paused."
    );
  };

  /* =======================================================
     RESET TIMER
  ======================================================= */

  const resetTimer = () => {
    if (
      timerSeconds > 0 &&
      timerRunning
    ) {
      const shouldReset =
        window.confirm(
          "Reset this session? The current study time will not be saved."
        );

      if (!shouldReset) {
        return;
      }
    }

    setTimerRunning(false);
    setTimerPaused(false);
    setTimerSeconds(0);

    timerStartRef.current =
      null;

    timerSavedRef.current =
      false;

    setNotification(
      "Timer reset."
    );
  };

  /* =======================================================
     SAVE STUDY SESSION
  ======================================================= */

  const saveCurrentSession = () => {
    if (
      timerSeconds <= 0 ||
      !selectedSubject ||
      timerSavedRef.current
    ) {
      return;
    }

    const startedAt =
      timerStartRef.current ||
      new Date().toISOString();

    const endedAt =
      new Date().toISOString();

    const session = {
      id: `session-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 9)}`,

      userId:
        (() => {
          try {
            const user =
              JSON.parse(
                localStorage.getItem(
                  "studyGemUser"
                ) || "null"
              );

            return (
              user?._id ||
              user?.id ||
              user?.email ||
              null
            );
          } catch {
            return null;
          }
        })(),

      subjectId:
        selectedSubject.id,

      subject:
        selectedSubject.name,

      durationSeconds:
        timerSeconds,

      date:
        formatDateKey(),

      startTime:
        startedAt,

      endTime:
        endedAt,

      createdAt:
        endedAt,
    };

    setSessions(
      (current) => [
        ...current,
        session,
      ]
    );

    timerSavedRef.current =
      true;

    return session;
  };

  /* =======================================================
     STOP TIMER
  ======================================================= */

  const stopTimer = () => {
    if (timerSeconds <= 0) {
      setTimerRunning(false);
      setTimerPaused(false);
      return;
    }

    const session =
      saveCurrentSession();

    setTimerRunning(false);
    setTimerPaused(false);
    setTimerSeconds(0);

    timerStartRef.current =
      null;

    if (session) {
      setNotification(
        `${selectedSubject.name}: ${formatShortTime(
          session.durationSeconds
        )} saved successfully.`
      );
    }
  };

  /* =======================================================
     SELECT SUBJECT
  ======================================================= */

  const handleSelectSubject = (
    subjectId
  ) => {
    if (
      timerRunning &&
      !timerPaused &&
      timerSeconds > 0
    ) {
      const shouldChange =
        window.confirm(
          "A timer is currently running. Changing the subject will reset this session. Continue?"
        );

      if (!shouldChange) {
        return;
      }

      setTimerRunning(false);
      setTimerPaused(false);
      setTimerSeconds(0);

      timerStartRef.current =
        null;

      timerSavedRef.current =
        false;
    }

    setSelectedSubjectId(
      subjectId
    );
  };

  /* =======================================================
     TARGET SAVE
  ======================================================= */

  const saveTarget = (
    hours,
    minutes
  ) => {
    setTargetData({
      targetHours: hours,
      targetMinutes: minutes,
      subjectsPlanned:
        targetData.subjectsPlanned,
    });

    setShowTargetModal(false);

    setNotification(
      "Today's study target updated."
    );
  };

  /* =======================================================
     TASK TOGGLE
  ======================================================= */

  const toggleTask = (taskId) => {
    setTasks(
      (current) =>
        current.map(
          (task) =>
            task.id === taskId
              ? {
                  ...task,
                  completed:
                    !task.completed,
                }
              : task
        )
    );
  };

  /* =======================================================
     DELETE TASK
  ======================================================= */

  const deleteTask = (taskId) => {
    setTasks(
      (current) =>
        current.filter(
          (task) =>
            task.id !== taskId
        )
    );

    setNotification(
      "Task removed."
    );
  };

  /* =======================================================
     ADD TASK
  ======================================================= */

  const addTask = ({
    title,
    duration,
  }) => {
    setTasks(
      (current) => [
        ...current,
        {
          id:
            Date.now(),
          title,
          duration,
          completed: false,
        },
      ]
    );

    setShowTaskModal(false);

    setNotification(
      "Task added successfully."
    );
  };

  /* =======================================================
     QUICK ACTIONS
  ======================================================= */

  const handleQuickStart = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    startTimer();
  };

  const handleStudyPlan = () => {
    document
      .getElementById(
        "subject-section"
      )
      ?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
  };

  /* =======================================================
     REPORT TOGGLE
  ======================================================= */

  const handleReports = () => {
    setShowReports(
      (current) => !current
    );
  };

  /* =======================================================
     SUBJECT REPORT
  ======================================================= */

  const maxSubjectSeconds =
    Math.max(
      ...Object.values(
        subjectTotals
      ),
      1
    );

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7f8ff]">
      {/* ===================================================
          NAVBAR
      =================================================== */}

      <Navbar
        onLogout={onLogout}
        onHome={onHome}
        onMockTests={onMockTests}
        onAI={onAI}
        onProfile={onProfile}
        onRoadmaps={onRoadmaps}
        activePage="target"
      />

      {/* ===================================================
          MAIN
      =================================================== */}

      <main className="relative min-h-screen overflow-hidden pt-[86px] lg:pt-[94px]">
        {/* =================================================
            RR.PNG BACKGROUND
        ================================================= */}

        <div
          className="pointer-events-none absolute left-0 top-0 h-[620px] w-full bg-no-repeat"
          style={{
            backgroundImage: `url(${rrImage})`,
            backgroundPosition:
              "center top",
            backgroundSize:
              "100% auto",
          }}
        />

        {/* SOFT BACKGROUND */}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#f7f8ff]/30 to-[#f7f8ff]" />

        {/* =================================================
            CONTENT
        ================================================= */}

        <section className="relative z-10 mx-auto w-full max-w-[1500px] px-4 pb-12 sm:px-6 lg:px-8">
          {/* =================================================
              HERO
          ================================================= */}

          <div className="min-h-[225px] pt-7 sm:min-h-[245px] sm:pt-9 lg:min-h-[265px] lg:pt-10">
            <div className="max-w-[680px]">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/75 px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-wider text-[#6825e9] shadow-sm backdrop-blur-md">
                <TargetIcon size={12} />
                Daily Focus
              </div>

              <h1 className="mt-3 text-[35px] font-black leading-[1.05] tracking-[-1.4px] text-[#10173d] sm:text-[44px] lg:text-[48px]">
                Set Your
                <br />
                <span className="bg-gradient-to-r from-[#6825e9] via-[#6d28d9] to-[#2563eb] bg-clip-text text-transparent">
                  Study Target
                </span>
              </h1>

              <p className="mt-3 max-w-[560px] text-[11px] font-medium leading-6 text-[#56618a] sm:text-[13px]">
                Stay focused, track your time and achieve
                your goals one step at a time.
              </p>
            </div>
          </div>

          {/* =================================================
              TOP INFO
          ================================================= */}

          <TopInfoCards
            studiedSeconds={
              studiedSeconds
            }
            streak={streak}
          />

          {/* =================================================
              MAIN GRID
          ================================================= */}

          <div className="mt-3 grid gap-3 lg:grid-cols-[1.1fr_1.1fr_0.8fr]">
            {/* ===============================================
                TIMER
            =============================================== */}

            <StudyTimerCard
              timerSeconds={
                timerSeconds
              }
              timerRunning={
                timerRunning
              }
              timerPaused={
                timerPaused
              }
              selectedSubject={
                selectedSubject
              }
              onStart={startTimer}
              onPause={pauseTimer}
              onReset={resetTimer}
              onStop={stopTimer}
            />

            {/* ===============================================
                TODAY TARGET
            =============================================== */}

            <TodayTargetCard
              targetSeconds={
                targetSeconds
              }
              studiedSeconds={
                studiedSeconds
              }
              tasksCompleted={
                completedTasks
              }
              totalTasks={
                totalTasks
              }
              subjectsPlanned={
                targetData.subjectsPlanned
              }
              onEdit={() =>
                setShowTargetModal(
                  true
                )
              }
            />

            {/* ===============================================
                RIGHT COLUMN
            =============================================== */}

            <div className="space-y-3">
              {/* QUOTE */}

              <div className="relative min-h-[210px] overflow-hidden rounded-[22px] border border-white/90 bg-gradient-to-br from-[#f6f3ff] via-[#faf8ff] to-[#eee8ff] p-6 shadow-[0_10px_40px_rgba(72,48,145,0.08)]">
                <div className="absolute -right-10 -top-10 h-[150px] w-[150px] rounded-full bg-[#d8c7ff]/40 blur-3xl" />

                <div className="relative flex h-full flex-col items-center justify-center text-center">
                  <span className="absolute left-4 top-4 text-[46px] font-black leading-none text-[#8350f2]">
                    “
                  </span>

                  <p className="max-w-[210px] font-serif text-[28px] font-black leading-[1.05] text-[#161d59]">
                    Discipline
                    <br />
                    Today
                    <br />
                    Success
                    <br />
                    Tomorrow
                  </p>

                  <div className="mt-2 h-[3px] w-[110px] rotate-[-3deg] rounded-full bg-gradient-to-r from-[#7c3aed] to-[#c084fc]" />

                  <span className="absolute bottom-5 right-8 text-[24px] text-[#ec4899]">
                    ♥
                  </span>
                </div>
              </div>

              {/* QUICK ACTIONS */}

              <QuickActions
                onStartTimer={
                  handleQuickStart
                }
                onSetTarget={() =>
                  setShowTargetModal(
                    true
                  )
                }
                onViewReports={
                  handleReports
                }
                onStudyPlan={
                  handleStudyPlan
                }
              />

              {/* TASKS */}

              <TodayTasks
                tasks={tasks}
                onToggleTask={
                  toggleTask
                }
                onDeleteTask={
                  deleteTask
                }
                onAddTask={() =>
                  setShowTaskModal(
                    true
                  )
                }
              />
            </div>
          </div>

          {/* =================================================
              SUBJECT SECTION
          ================================================= */}

          <section
            id="subject-section"
            className="mt-3"
          >
            <SubjectSelector
              subjects={SUBJECTS}
              selectedSubjectId={
                selectedSubjectId
              }
              onSelect={
                handleSelectSubject
              }
            />
          </section>

          {/* =================================================
              REPORT SECTION
          ================================================= */}

          {showReports && (
            <section className="mt-3 rounded-[22px] border border-white/90 bg-white/90 p-5 shadow-[0_10px_40px_rgba(72,48,145,0.08)] backdrop-blur-xl sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eee6ff] text-[#6825e9]">
                      <BarChart3 size={18} />
                    </div>

                    <h2 className="text-[15px] font-extrabold text-[#171d45]">
                      Study Reports
                    </h2>
                  </div>

                  <p className="mt-2 text-[10px] font-medium text-[#858ca5]">
                    Your subject-wise study time is automatically
                    collected from completed timer sessions.
                  </p>
                </div>

                <div className="rounded-xl bg-[#f2edff] px-4 py-2 text-center">
                  <p className="text-[8px] font-bold uppercase tracking-wide text-[#8063b9]">
                    Total Study Time
                  </p>

                  <p className="mt-1 text-[16px] font-black text-[#5820cf]">
                    {formatShortTime(
                      sessions.reduce(
                        (
                          total,
                          session
                        ) =>
                          total +
                          Number(
                            session.durationSeconds ||
                              0
                          ),
                        0
                      )
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {SUBJECTS.map(
                  (subject) => {
                    const seconds =
                      subjectTotals[
                        subject.id
                      ] || 0;

                    const width =
                      Math.min(
                        100,
                        (seconds /
                          maxSubjectSeconds) *
                          100
                      );

                    return (
                      <div
                        key={
                          subject.id
                        }
                        className="rounded-2xl border border-[#e9e5f3] bg-[#fcfbff] p-4"
                      >
                        <div className="flex items-center gap-3">
                          <SubjectIcon
                            subject={
                              subject
                            }
                          />

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[10px] font-extrabold text-[#252c51]">
                              {
                                subject.name
                              }
                            </p>

                            <p className="mt-1 text-[9px] font-semibold text-[#8a91aa]">
                              {formatShortTime(
                                seconds
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 h-[7px] overflow-hidden rounded-full bg-[#e9e5f2]">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#7c3aed] to-[#5420ee] transition-all"
                            style={{
                              width: `${width}%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  }
                )}
              </div>

              {todaySessions.length >
                0 && (
                <div className="mt-6">
                  <div className="mb-3 flex items-center gap-2">
                    <Clock3
                      size={15}
                      className="text-[#6825e9]"
                    />

                    <h3 className="text-[11px] font-extrabold text-[#252c51]">
                      Today's Sessions
                    </h3>
                  </div>

                  <div className="space-y-2">
                    {todaySessions
                      .slice()
                      .reverse()
                      .map(
                        (
                          session
                        ) => (
                          <div
                            key={
                              session.id
                            }
                            className="flex items-center justify-between gap-3 rounded-xl border border-[#ece9f4] bg-white px-4 py-3"
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#eee6ff] text-[#6825e9]">
                                <BookOpen
                                  size={
                                    14
                                  }
                                />
                              </div>

                              <div className="min-w-0">
                                <p className="truncate text-[10px] font-extrabold text-[#2a3155]">
                                  {
                                    session.subject
                                  }
                                </p>

                                <p className="mt-0.5 text-[8px] font-medium text-[#8b91a8]">
                                  {new Date(
                                    session.startTime
                                  ).toLocaleTimeString(
                                    [],
                                    {
                                      hour: "2-digit",
                                      minute:
                                        "2-digit",
                                    }
                                  )}
                                </p>
                              </div>
                            </div>

                            <span className="shrink-0 rounded-lg bg-[#f0eaff] px-2.5 py-1.5 text-[9px] font-extrabold text-[#6825e9]">
                              {formatShortTime(
                                session.durationSeconds
                              )}
                            </span>
                          </div>
                        )
                      )}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* =================================================
              BOTTOM SUMMARY
          ================================================= */}

          <section className="mt-3 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[20px] border border-white/90 bg-white/80 p-4 shadow-sm backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eee6ff] text-[#6825e9]">
                  <Timer size={18} />
                </div>

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wide text-[#9298ae]">
                    Today's Study
                  </p>

                  <p className="mt-1 text-[14px] font-black text-[#242b52]">
                    {formatShortTime(
                      studiedSeconds
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[20px] border border-white/90 bg-white/80 p-4 shadow-sm backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff0e9] text-[#f97316]">
                  <Flame size={18} />
                </div>

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wide text-[#9298ae]">
                    Current Streak
                  </p>

                  <p className="mt-1 text-[14px] font-black text-[#242b52]">
                    {streak}{" "}
                    {streak === 1
                      ? "Day"
                      : "Days"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[20px] border border-white/90 bg-white/80 p-4 shadow-sm backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e3f8f1] text-[#16a47b]">
                  <Trophy size={18} />
                </div>

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wide text-[#9298ae]">
                    Tasks
                  </p>

                  <p className="mt-1 text-[14px] font-black text-[#242b52]">
                    {completedTasks}/
                    {totalTasks}{" "}
                    Completed
                  </p>
                </div>
              </div>
            </div>
          </section>
        </section>
      </main>

      {/* =====================================================
          TARGET MODAL
      ===================================================== */}

      {showTargetModal && (
        <TargetEditModal
          targetHours={
            targetData.targetHours
          }
          targetMinutes={
            targetData.targetMinutes
          }
          onSave={saveTarget}
          onClose={() =>
            setShowTargetModal(
              false
            )
          }
        />
      )}

      {/* =====================================================
          TASK MODAL
      ===================================================== */}

      {showTaskModal && (
        <AddTaskModal
          onAdd={addTask}
          onClose={() =>
            setShowTaskModal(
              false
            )
          }
        />
      )}

      {/* =====================================================
          NOTIFICATION
      ===================================================== */}

      {notification && (
        <div className="fixed bottom-5 left-1/2 z-[120] -translate-x-1/2">
          <div className="flex items-center gap-2 rounded-xl border border-white bg-[#171b40] px-4 py-3 text-[10px] font-bold text-white shadow-[0_15px_40px_rgba(20,15,60,0.25)]">
            <CheckCircle2
              size={15}
              className="text-[#a78bfa]"
            />

            {notification}
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

            header {
              display: none !important;
            }

            main {
              padding-top: 0 !important;
            }
          }

          @media (max-width: 640px) {
            .study-target-page {
              overflow-x: hidden;
            }
          }
        `}
      </style>
    </div>
  );
}

export default Target;
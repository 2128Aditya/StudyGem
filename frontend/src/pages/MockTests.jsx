import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Bot,
  Check,
  ChevronDown,
  ChevronRight,
  FileText,
  Flame,
  Grid2X2,
  Lightbulb,
  Map,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Target,
  Trophy,
  Users,
  X,
  BarChart3,
  CircleHelp,
  ClipboardCheck,
  Award,
  BriefcaseBusiness,
  Building2,
  Calculator,
  CheckCircle2,
  Clock3,
  GraduationCap,
  HeartPulse,
  Laptop,
  SearchCheck,
  ShieldCheck,
  Stethoscope,
  Users2,
  XCircle,
} from "lucide-react";
import Navbar from "../components/Navbar";

const exams = [
  {
    id: "upsc",
    title: "UPSC",
    subtitle: "Civil Services",
    icon: Trophy,
    logo: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Union_Public_Service_Commission_Logo.png",
  },
  {
    id: "ssc",
    title: "SSC",
    subtitle: "CGL, CHSL, etc.",
    icon: FileText,
    logo: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Staff_Selection_Commission_Logo.jpg",
  },
  {
    id: "banking",
    title: "Banking",
    subtitle: "IBPS, SBI, etc.",
    icon: BookOpen,
    logo: "https://commons.wikimedia.org/wiki/Special:Redirect/file/SBI-logo.svg",
  },
  {
    id: "railway",
    title: "Railway",
    subtitle: "RRB Exams",
    icon: Target,
    logo: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Indian_Railways_Tricolour_Logo.svg",
  },
  {
    id: "state",
    title: "State Exams",
    subtitle: "UPPCS, BPSC, etc.",
    icon: Map,
    logo: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Emblem_of_India.svg",
  },
  {
    id: "other",
    title: "Other Exams",
    subtitle: "More options",
    icon: Grid2X2,
    logo: null,
  },
];


const baseExams = exams.filter((item) => item.id !== "other");

const otherExamCatalog = [
  { id: "jee-main", title: "JEE Main", subtitle: "Engineering Entrance", category: "Engineering", icon: GraduationCap, logo: "https://commons.wikimedia.org/wiki/Special:Redirect/file/NTA_logo.png" },
  { id: "jee-advanced", title: "JEE Advanced", subtitle: "IIT Entrance", category: "Engineering", icon: GraduationCap, logo: "https://commons.wikimedia.org/wiki/Special:Redirect/file/JEE_(Advanced)_2026_Logo.png" },
  { id: "neet", title: "NEET", subtitle: "Medical Entrance", category: "Medical", icon: Stethoscope, logo: "https://commons.wikimedia.org/wiki/Special:Redirect/file/NTA_logo.png" },
  { id: "gate", title: "GATE", subtitle: "PG Engineering", category: "Engineering", icon: Laptop, logo: "https://commons.wikimedia.org/wiki/Special:Redirect/file/India_Institute_of_Science_logo.svg" },
  { id: "cat", title: "CAT", subtitle: "MBA Entrance", category: "Management", icon: BriefcaseBusiness, logo: null },
  { id: "ctet", title: "CTET", subtitle: "Teacher Eligibility", category: "Teaching", icon: BookOpen, logo: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Logo_of_the_Central_Board_of_Secondary_Education.png" },
  { id: "ugc-net", title: "UGC NET", subtitle: "Assistant Professor", category: "Teaching", icon: Award, logo: "https://commons.wikimedia.org/wiki/Special:Redirect/file/NTA_logo.png" },
  { id: "cuet", title: "CUET", subtitle: "University Entrance", category: "Entrance", icon: GraduationCap, logo: "https://commons.wikimedia.org/wiki/Special:Redirect/file/NTA_logo.png" },
  { id: "clat", title: "CLAT", subtitle: "Law Entrance", category: "Law", icon: FileText, logo: null },
  { id: "nift", title: "NIFT", subtitle: "Fashion Entrance", category: "Design", icon: Pencil, logo: null },
  { id: "ca", title: "CA Exams", subtitle: "Chartered Accountancy", category: "Commerce", icon: Calculator, logo: null },
  { id: "cma", title: "CMA", subtitle: "Cost Management", category: "Commerce", icon: Calculator, logo: null },
  { id: "cs", title: "CS Executive", subtitle: "Company Secretary", category: "Commerce", icon: Building2, logo: null },
  { id: "lic-aao", title: "LIC AAO", subtitle: "Insurance Officer", category: "Banking", icon: HeartPulse, logo: null },
  { id: "nabard", title: "NABARD", subtitle: "Development Banking", category: "Banking", icon: Building2, logo: null },
  { id: "rbi-grade-b", title: "RBI Grade B", subtitle: "Reserve Bank Exam", category: "Banking", icon: Building2, logo: null },
  { id: "ibps-po", title: "IBPS PO", subtitle: "Probationary Officer", category: "Banking", icon: BookOpen, logo: null },
  { id: "ibps-clerk", title: "IBPS Clerk", subtitle: "Clerical Exam", category: "Banking", icon: FileText, logo: null },
  { id: "rrb-ntpc", title: "RRB NTPC", subtitle: "Railway Recruitment", category: "Railway", icon: Target, logo: null },
  { id: "rrb-group-d", title: "RRB Group D", subtitle: "Railway Recruitment", category: "Railway", icon: Target, logo: null },
  { id: "police", title: "Police Exams", subtitle: "State Police", category: "Defence & Police", icon: ShieldCheck, logo: null },
  { id: "nda", title: "NDA", subtitle: "Defence Academy", category: "Defence & Police", icon: Trophy, logo: null },
  { id: "cds", title: "CDS", subtitle: "Combined Defence", category: "Defence & Police", icon: Trophy, logo: null },
  { id: "afcat", title: "AFCAT", subtitle: "Air Force Entrance", category: "Defence & Police", icon: Trophy, logo: null },
  { id: "ugc", title: "UGC Exams", subtitle: "Higher Education", category: "Teaching", icon: BookOpen, logo: null },
  { id: "state-tet", title: "State TET", subtitle: "Teacher Eligibility", category: "Teaching", icon: BookOpen, logo: null },
  { id: "other-govt", title: "Other Govt Exams", subtitle: "Explore More", category: "Government", icon: Grid2X2, logo: null },
  { id: "ugc-cuet", title: "CUET PG", subtitle: "Postgraduate Entrance", category: "Entrance", icon: GraduationCap, logo: "https://commons.wikimedia.org/wiki/Special:Redirect/file/NTA_logo.png" },
  { id: "aiims", title: "AIIMS", subtitle: "Medical Entrance", category: "Medical", icon: Stethoscope, logo: "https://commons.wikimedia.org/wiki/Special:Redirect/file/NTA_logo.png" },
  { id: "jam", title: "IIT JAM", subtitle: "Science PG Entrance", category: "Engineering", icon: GraduationCap, logo: null },
  { id: "icar", title: "ICAR", subtitle: "Agriculture Entrance", category: "Entrance", icon: BookOpen, logo: null },
  { id: "ugc-set", title: "SET Exams", subtitle: "Assistant Professor", category: "Teaching", icon: Award, logo: null },
  { id: "bank-so", title: "Bank SO", subtitle: "Specialist Officer", category: "Banking", icon: Building2, logo: null },
  { id: "sbi-po", title: "SBI PO", subtitle: "Probationary Officer", category: "Banking", icon: Building2, logo: null },
  { id: "sbi-clerk", title: "SBI Clerk", subtitle: "Junior Associate", category: "Banking", icon: Building2, logo: null },
  { id: "rrb-alp", title: "RRB ALP", subtitle: "Assistant Loco Pilot", category: "Railway", icon: Target, logo: null },
  { id: "rrb-je", title: "RRB JE", subtitle: "Junior Engineer", category: "Railway", icon: Laptop, logo: null },
  { id: "ssc-mts", title: "SSC MTS", subtitle: "Multi Tasking Staff", category: "Government", icon: FileText, logo: null },
  { id: "ssc-gd", title: "SSC GD", subtitle: "General Duty", category: "Defence & Police", icon: ShieldCheck, logo: null },
  { id: "upsc-cds", title: "UPSC CDS", subtitle: "Defence Services", category: "Defence & Police", icon: Trophy, logo: null },
  { id: "upsc-nda", title: "UPSC NDA", subtitle: "National Defence Academy", category: "Defence & Police", icon: Trophy, logo: null },
  {
    id: "esic",
    title: "ESIC",
    subtitle: "Insurance Recruitment",
    category: "Government",
    icon: Building2,
    logo: null,
  },
  {
    id: "epfo",
    title: "EPFO",
    subtitle: "Provident Fund Exam",
    category: "Government",
    icon: Building2,
    logo: null,
  },
  {
    id: "fci",
    title: "FCI",
    subtitle: "Food Corporation Exam",
    category: "Government",
    icon: Building2,
    logo: null,
  },
  {
    id: "lic-aao-2",
    title: "LIC AAO",
    subtitle: "Assistant Administrative Officer",
    category: "Banking",
    icon: HeartPulse,
    logo: null,
  },
  {
    id: "lic-aao-3",
    title: "LIC ADO",
    subtitle: "Apprentice Development Officer",
    category: "Banking",
    icon: HeartPulse,
    logo: null,
  },
  {
    id: "rpsc",
    title: "RPSC",
    subtitle: "Rajasthan Public Service",
    category: "Government",
    icon: Map,
    logo: null,
  },
  {
    id: "bpsc",
    title: "BPSC",
    subtitle: "Bihar Public Service",
    category: "Government",
    icon: Map,
    logo: null,
  },
  {
    id: "mpsc",
    title: "MPSC",
    subtitle: "Maharashtra Public Service",
    category: "Government",
    icon: Map,
    logo: null,
  },
  {
    id: "uppsc",
    title: "UPPSC",
    subtitle: "Uttar Pradesh Public Service",
    category: "Government",
    icon: Map,
    logo: null,
  },
];

const customSubjectCatalog = [
  { id: "history", title: "History", subtitle: "Ancient, Medieval & Modern", icon: BookOpen, category: "Humanities" },
  { id: "geography", title: "Geography", subtitle: "Physical & Human Geography", icon: Map, category: "Humanities" },
  { id: "polity", title: "Indian Polity", subtitle: "Constitution & Governance", icon: Target, category: "Humanities" },
  { id: "economics", title: "Economics", subtitle: "Macro & Micro Economics", icon: BarChart3, category: "Commerce" },
  { id: "environment", title: "Environment", subtitle: "Ecology & Climate", icon: Lightbulb, category: "Science" },
  { id: "physics", title: "Physics", subtitle: "Mechanics & Modern Physics", icon: Sparkles, category: "Science" },
  { id: "chemistry", title: "Chemistry", subtitle: "Organic & Inorganic", icon: Sparkles, category: "Science" },
  { id: "biology", title: "Biology", subtitle: "Life Science & Human Biology", icon: HeartPulse, category: "Science" },
  { id: "mathematics", title: "Mathematics", subtitle: "Arithmetic & Advanced Maths", icon: Calculator, category: "Quantitative" },
  { id: "reasoning", title: "Reasoning", subtitle: "Logical & Analytical Reasoning", icon: SearchCheck, category: "Aptitude" },
  { id: "quantitative", title: "Quantitative Aptitude", subtitle: "Numbers & Data", icon: Calculator, category: "Aptitude" },
  { id: "english", title: "English", subtitle: "Grammar & Vocabulary", icon: FileText, category: "Language" },
  { id: "computer", title: "Computer Science", subtitle: "Programming & Fundamentals", icon: Laptop, category: "Technology" },
  { id: "dbms", title: "DBMS", subtitle: "Database Management", icon: BookOpen, category: "Technology" },
  { id: "os", title: "Operating System", subtitle: "OS Concepts", icon: Laptop, category: "Technology" },
  { id: "cn", title: "Computer Networks", subtitle: "Networking Fundamentals", icon: Users2, category: "Technology" },
  { id: "dsa", title: "Data Structures", subtitle: "DSA & Algorithms", icon: Grid2X2, category: "Technology" },
  { id: "javascript", title: "JavaScript", subtitle: "Web Programming", icon: Laptop, category: "Technology" },
  { id: "react", title: "React", subtitle: "Frontend Development", icon: Laptop, category: "Technology" },
  { id: "node", title: "Node.js", subtitle: "Backend Development", icon: Laptop, category: "Technology" },
  { id: "sql", title: "SQL", subtitle: "Query & Database", icon: BookOpen, category: "Technology" },
  { id: "ai", title: "Artificial Intelligence", subtitle: "AI Fundamentals", icon: Bot, category: "Technology" },
  { id: "ml", title: "Machine Learning", subtitle: "ML Algorithms", icon: Bot, category: "Technology" },
  { id: "aptitude", title: "Aptitude", subtitle: "Placement Aptitude", icon: Calculator, category: "Placement" },
  { id: "hr", title: "HR Interview", subtitle: "Interview Preparation", icon: Users2, category: "Placement" },
  { id: "verbal", title: "Verbal Ability", subtitle: "Communication Skills", icon: FileText, category: "Placement" },
  { id: "current-affairs", title: "Current Affairs", subtitle: "Latest Events", icon: Clock3, category: "General" },
  { id: "general-knowledge", title: "General Knowledge", subtitle: "Static GK", icon: Trophy, category: "General" },
  { id: "science", title: "General Science", subtitle: "Physics, Chemistry & Biology", icon: Sparkles, category: "General" },
  { id: "custom", title: "Create Your Own", subtitle: "Add a custom subject", icon: Plus, category: "Custom" },
  { id: "java", title: "Java", subtitle: "Core Java & OOP", icon: Laptop, category: "Technology" },
  { id: "python", title: "Python", subtitle: "Programming & Automation", icon: Laptop, category: "Technology" },
  { id: "cpp", title: "C / C++", subtitle: "Programming Fundamentals", icon: Laptop, category: "Technology" },
  { id: "flutter", title: "Flutter", subtitle: "Cross Platform Apps", icon: Laptop, category: "Technology" },
  { id: "firebase", title: "Firebase", subtitle: "Backend & Cloud", icon: Laptop, category: "Technology" },
  { id: "cloud", title: "Cloud Computing", subtitle: "Cloud & DevOps Basics", icon: Building2, category: "Technology" },
  { id: "software-engineering", title: "Software Engineering", subtitle: "SDLC & Design", icon: Laptop, category: "Technology" },
  { id: "system-design", title: "System Design", subtitle: "HLD & LLD", icon: Grid2X2, category: "Technology" },
  { id: "data-science", title: "Data Science", subtitle: "Statistics & Analytics", icon: BarChart3, category: "Technology" },
  { id: "deep-learning", title: "Deep Learning", subtitle: "Neural Networks", icon: Bot, category: "Technology" },
  { id: "statistics", title: "Statistics", subtitle: "Probability & Data", icon: BarChart3, category: "Quantitative" },
  { id: "logical-reasoning", title: "Logical Reasoning", subtitle: "Puzzles & Logic", icon: SearchCheck, category: "Aptitude" },
  { id: "communication", title: "Communication", subtitle: "English Speaking", icon: Users2, category: "Language" },
  { id: "soft-skills", title: "Soft Skills", subtitle: "Placement Readiness", icon: Users2, category: "Placement" },
  { id: "interview", title: "Interview Prep", subtitle: "Technical + HR", icon: Users2, category: "Placement" },
  {
    id: "kotlin",
    title: "Kotlin",
    subtitle: "Android Development",
    icon: Laptop,
    category: "Technology",
  },
  {
    id: "android",
    title: "Android",
    subtitle: "App Development",
    icon: Laptop,
    category: "Technology",
  },
  {
    id: "mongodb",
    title: "MongoDB",
    subtitle: "NoSQL Database",
    icon: BookOpen,
    category: "Technology",
  },
  {
    id: "express",
    title: "Express.js",
    subtitle: "Node Backend",
    icon: Laptop,
    category: "Technology",
  },
  {
    id: "tailwind",
    title: "Tailwind CSS",
    subtitle: "Utility First CSS",
    icon: Laptop,
    category: "Technology",
  },
  {
    id: "html-css",
    title: "HTML & CSS",
    subtitle: "Web Fundamentals",
    icon: Laptop,
    category: "Technology",
  },
  {
    id: "git",
    title: "Git & GitHub",
    subtitle: "Version Control",
    icon: Users2,
    category: "Technology",
  },
  {
    id: "aptitude-advanced",
    title: "Advanced Aptitude",
    subtitle: "Placement Practice",
    icon: Calculator,
    category: "Aptitude",
  },
  {
    id: "data-interpretation",
    title: "Data Interpretation",
    subtitle: "Charts & Tables",
    icon: BarChart3,
    category: "Quantitative",
  },
];

const examCategories = ["All", "Engineering", "Medical", "Management", "Teaching", "Banking", "Railway", "Law", "Commerce", "Defence & Police", "Entrance", "Government"];
const subjectCategories = ["All", "Humanities", "Science", "Commerce", "Quantitative", "Aptitude", "Language", "Technology", "Placement", "General", "Custom"];

const subjects = [
  { id: "general", title: "General Studies", icon: BookOpen },
  { id: "current", title: "Current Affairs", icon: FileText },
  { id: "csat", title: "CSAT", icon: Bot },
  { id: "optional", title: "Optional Subject", icon: Plus },
  { id: "essay", title: "Essay", icon: FileText },
  { id: "subject-wise", title: "Subject Wise", icon: Grid2X2 },
];

const topics = [
  "Environment & Ecology",
  "Polity & Governance",
  "Indian Economy",
  "History & Culture",
  "Geography",
  "Science & Technology",
];

const questionCounts = [10, 20, 50, 100];
const difficulties = [
  { id: "easy", label: "Easy", emoji: "☺", tone: "text-emerald-500 bg-emerald-50" },
  { id: "medium", label: "Medium", emoji: "●", tone: "text-amber-500 bg-amber-50" },
  { id: "hard", label: "Hard", emoji: "☹", tone: "text-red-500 bg-red-50" },
];
const languages = [
  { id: "english", label: "English", icon: "A" },
  { id: "hindi", label: "Hindi", icon: "अ" },
  { id: "hinglish", label: "Hinglish", icon: "AB" },
];

function ExamLogo({ exam }) {
  const [imageError, setImageError] = useState(false);
  const Icon = exam.icon;

  if (!exam.logo || imageError) {
    return (
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f0ecff] text-[#6425ed]">
        <Icon size={19} strokeWidth={2.1} />
      </span>
    );
  }

  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-1 shadow-sm">
      <img
        src={exam.logo}
        alt={`${exam.title} logo`}
        className="h-full w-full object-contain"
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setImageError(true)}
      />
    </span>
  );
}

function SelectionCard({ selected, onClick, children, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative text-left transition-all duration-200 ${
        selected
          ? "border-[#6d28f0] bg-[#faf7ff] shadow-[0_6px_20px_rgba(109,40,240,0.08)]"
          : "border-[#e7e8f5] bg-white/70 hover:border-[#cfc2ff] hover:bg-white"
      } ${className}`}
    >
      {children}
      {selected && (
        <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#6d28f0] text-white shadow-sm">
          <Check size={12} strokeWidth={3} />
        </span>
      )}
    </button>
  );
}

function NumberedHeading({ number, title, subtitle, action }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eee7ff] text-lg font-extrabold text-[#6425ed]">
          {number}
        </span>
        <div className="min-w-0">
          <h2 className="text-[17px] font-extrabold tracking-tight text-[#10183d] sm:text-[18px]">
            {title}
          </h2>
          <p className="mt-0.5 text-[11px] leading-5 text-[#707999] sm:text-[12px]">
            {subtitle}
          </p>
        </div>
      </div>
      {action}
    </div>
  );
}


function ModalShell({ open, onClose, title, subtitle, children, maxWidth = "max-w-4xl" }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5">
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-[#17122d]/45 backdrop-blur-[3px]"
      />

      <div className={`relative z-10 flex max-h-[92vh] w-full ${maxWidth} flex-col overflow-hidden rounded-[28px] border border-white/90 bg-white shadow-[0_30px_100px_rgba(31,20,77,0.28)]`}>
        <div className="flex shrink-0 items-start justify-between border-b border-[#eeeaff] bg-white px-5 py-4 sm:px-7 sm:py-5">
          <div className="min-w-0 pr-4">
            <h2 className="text-xl font-black tracking-tight text-[#171b3e] sm:text-2xl">{title}</h2>
            {subtitle && <p className="mt-1 text-xs font-medium leading-5 text-[#727a99] sm:text-sm">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f5f1ff] text-[#6425ed] transition hover:bg-[#eee7ff]"
          >
            <X size={20} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

function ModalSearch({ value, onChange, placeholder }) {
  return (
    <div className="relative">
      <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#777e9c]" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-2xl border border-[#e1ddf2] bg-[#faf9ff] pl-11 pr-4 text-sm font-semibold text-[#252b48] outline-none transition placeholder:text-[#9aa0b8] focus:border-[#7651f1] focus:bg-white"
      />
    </div>
  );
}

function CategoryPills({ items, value, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {items.map((item) => (
        <button
          type="button"
          key={item}
          onClick={() => onChange(item)}
          className={`shrink-0 rounded-full px-3.5 py-2 text-[11px] font-bold transition ${value === item ? "bg-[#6d28f0] text-white shadow-md shadow-purple-200" : "bg-[#f4f1ff] text-[#626987] hover:bg-[#ece6ff] hover:text-[#6425ed]"}`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

function CatalogLogo({ item, large = false }) {
  const [failed, setFailed] = useState(false);
  const Icon = item.icon || Grid2X2;

  if (!item.logo || failed) {
    return (
      <span className={`flex shrink-0 items-center justify-center rounded-2xl bg-[#f0ecff] text-[#6425ed] ${large ? "h-12 w-12" : "h-10 w-10"}`}>
        <Icon size={large ? 23 : 19} strokeWidth={2} />
      </span>
    );
  }

  return (
    <span className={`flex shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white p-1 shadow-sm ${large ? "h-12 w-12" : "h-10 w-10"}`}>
      <img
        src={item.logo}
        alt={`${item.title} logo`}
        className="h-full w-full object-contain"
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
      />
    </span>
  );
}

function OtherExamModal({ open, onClose, exams, categories, search, setSearch, category, setCategory, onSelect, customName, setCustomName, customSubtitle, setCustomSubtitle, onCreate }) {
  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Add / Select Other Exam"
      subtitle="Choose from more competitive exams or create your own exam profile."
      maxWidth="max-w-5xl"
    >
      <div className="space-y-5 p-5 sm:p-7">
        <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
          <ModalSearch value={search} onChange={setSearch} placeholder="Search exam, category or exam type..." />
          <button
            type="button"
            onClick={() => document.getElementById("custom-exam-name")?.focus()}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#7630ff] to-[#5420ee] px-5 text-xs font-extrabold text-white shadow-lg shadow-purple-200"
          >
            <Plus size={17} /> Create Exam
          </button>
        </div>

        <CategoryPills items={categories} value={category} onChange={setCategory} />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {exams.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => onSelect(item)}
              className="group flex items-center gap-3 rounded-2xl border border-[#e7e4f3] bg-white p-3.5 text-left transition hover:-translate-y-0.5 hover:border-[#cfc0ff] hover:bg-[#faf8ff] hover:shadow-[0_10px_28px_rgba(88,51,185,0.10)]"
            >
              <CatalogLogo item={item} large />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-extrabold text-[#202643]">{item.title}</span>
                <span className="mt-0.5 block truncate text-[10px] font-medium text-[#7a829f]">{item.subtitle}</span>
                <span className="mt-2 inline-flex rounded-full bg-[#f2edff] px-2 py-1 text-[9px] font-bold text-[#6b3ae7]">{item.category}</span>
              </span>
              <ChevronRight size={17} className="shrink-0 text-[#aaa2c4] transition group-hover:translate-x-0.5 group-hover:text-[#6425ed]" />
            </button>
          ))}
        </div>

        {exams.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#dcd6ee] bg-[#faf9ff] px-5 py-10 text-center">
            <SearchCheck size={28} className="mx-auto text-[#8c7bd2]" />
            <p className="mt-2 text-sm font-extrabold text-[#343b5b]">No exam found</p>
            <p className="mt-1 text-xs text-[#7d849d]">Try another search or create your own exam below.</p>
          </div>
        )}

        <div className="rounded-[22px] border border-[#e8e1ff] bg-gradient-to-br from-[#fbf9ff] to-[#f5f0ff] p-4 sm:p-5">
          <div className="mb-4 flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eee7ff] text-[#6425ed]"><Plus size={20} /></span>
            <div>
              <h3 className="text-sm font-extrabold text-[#262b49]">Create your own exam</h3>
              <p className="mt-0.5 text-[11px] leading-5 text-[#737b99]">Useful when you want an exam, college test or placement assessment that is not listed above.</p>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <input
              id="custom-exam-name"
              value={customName}
              onChange={(event) => setCustomName(event.target.value)}
              placeholder="Exam name e.g. BBDU Semester Exam"
              className="h-11 rounded-xl border border-[#ded9ef] bg-white px-3 text-sm font-semibold outline-none focus:border-[#7651f1]"
            />
            <input
              value={customSubtitle}
              onChange={(event) => setCustomSubtitle(event.target.value)}
              placeholder="Subtitle e.g. CSE 5th Semester"
              className="h-11 rounded-xl border border-[#ded9ef] bg-white px-3 text-sm font-semibold outline-none focus:border-[#7651f1]"
            />
          </div>
          <button
            type="button"
            disabled={!customName.trim()}
            onClick={onCreate}
            className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#171a3e] px-4 text-xs font-extrabold text-white transition hover:bg-[#252955] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <CheckCircle2 size={17} /> Add Custom Exam
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

function CustomSubjectModal({ open, onClose, subjects: catalog, categories, search, setSearch, category, setCategory, onSelect, customName, setCustomName, customDescription, setCustomDescription, onCreate }) {
  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Add / Select Subject"
      subtitle="Pick an existing subject or create a custom subject for your mock test."
      maxWidth="max-w-5xl"
    >
      <div className="space-y-5 p-5 sm:p-7">
        <ModalSearch value={search} onChange={setSearch} placeholder="Search subject, topic or category..." />
        <CategoryPills items={categories} value={category} onChange={setCategory} />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {catalog.map((item) => {
            const Icon = item.icon || BookOpen;
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => onSelect(item)}
                className="group flex items-center gap-3 rounded-2xl border border-[#e7e4f3] bg-white p-3.5 text-left transition hover:-translate-y-0.5 hover:border-[#cfc0ff] hover:bg-[#faf8ff] hover:shadow-[0_10px_28px_rgba(88,51,185,0.10)]"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f0ecff] text-[#6425ed]">
                  <Icon size={20} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-extrabold text-[#202643]">{item.title}</span>
                  <span className="mt-0.5 block truncate text-[10px] font-medium text-[#7a829f]">{item.subtitle}</span>
                  <span className="mt-2 inline-flex rounded-full bg-[#f2edff] px-2 py-1 text-[9px] font-bold text-[#6b3ae7]">{item.category}</span>
                </span>
                <Plus size={16} className="shrink-0 text-[#aaa2c4] group-hover:text-[#6425ed]" />
              </button>
            );
          })}
        </div>

        {catalog.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#dcd6ee] bg-[#faf9ff] px-5 py-10 text-center">
            <SearchCheck size={28} className="mx-auto text-[#8c7bd2]" />
            <p className="mt-2 text-sm font-extrabold text-[#343b5b]">No subject found</p>
            <p className="mt-1 text-xs text-[#7d849d]">Create your own subject below.</p>
          </div>
        )}

        <div className="rounded-[22px] border border-[#e8e1ff] bg-gradient-to-br from-[#fbf9ff] to-[#f5f0ff] p-4 sm:p-5">
          <div className="mb-4 flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eee7ff] text-[#6425ed]"><Plus size={20} /></span>
            <div>
              <h3 className="text-sm font-extrabold text-[#262b49]">Create your own subject</h3>
              <p className="mt-0.5 text-[11px] leading-5 text-[#737b99]">Add a subject for college, placement, certification or your personal preparation.</p>
            </div>
          </div>
          <input
            value={customName}
            onChange={(event) => setCustomName(event.target.value)}
            placeholder="Subject name e.g. Flutter Development"
            className="h-11 w-full rounded-xl border border-[#ded9ef] bg-white px-3 text-sm font-semibold outline-none focus:border-[#7651f1]"
          />
          <textarea
            value={customDescription}
            onChange={(event) => setCustomDescription(event.target.value)}
            placeholder="Short description e.g. Widgets, state management and Firebase"
            rows={3}
            className="mt-3 w-full resize-none rounded-xl border border-[#ded9ef] bg-white px-3 py-3 text-sm font-semibold outline-none focus:border-[#7651f1]"
          />
          <button
            type="button"
            disabled={!customName.trim()}
            onClick={onCreate}
            className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#171a3e] px-4 text-xs font-extrabold text-white transition hover:bg-[#252955] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <CheckCircle2 size={17} /> Add Custom Subject
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

function PopularExamsModal({ open, onClose, exams, onSelect }) {
  const popular = exams.filter((item) => ["upsc", "ssc", "banking", "railway", "state"].includes(item.id));

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Popular Exams"
      subtitle="Quickly choose one of the most practiced exam categories on StudyGem."
      maxWidth="max-w-3xl"
    >
      <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-7">
        {popular.map((item) => (
          <button
            type="button"
            key={item.id}
            onClick={() => onSelect(item)}
            className="flex items-center gap-3 rounded-2xl border border-[#e7e4f3] bg-white p-4 text-left transition hover:border-[#cfc0ff] hover:bg-[#faf8ff] hover:shadow-lg"
          >
            <CatalogLogo item={item} large />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-extrabold text-[#202643]">{item.title}</span>
              <span className="mt-1 block text-[10px] font-medium text-[#7a829f]">{item.subtitle}</span>
            </span>
            <ChevronRight size={18} className="text-[#aaa2c4]" />
          </button>
        ))}
      </div>
    </ModalShell>
  );
}

function EditSummaryModal({ open, onClose, exam, subjects, topic, questionCount, difficulty, language, onSave }) {
  const [localTopic, setLocalTopic] = useState(topic);
  const [localCount, setLocalCount] = useState(String(questionCount));
  const [localDifficulty, setLocalDifficulty] = useState(difficulty);
  const [localLanguage, setLocalLanguage] = useState(language);

  useEffect(() => {
    if (open) {
      setLocalTopic(topic);
      setLocalCount(String(questionCount));
      setLocalDifficulty(difficulty);
      setLocalLanguage(language);
    }
  }, [open, topic, questionCount, difficulty, language]);

  if (!open) return null;

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Edit Test Summary"
      subtitle="Quickly adjust the key settings before generating your mock test."
      maxWidth="max-w-xl"
    >
      <div className="space-y-5 p-5 sm:p-7">
        <div className="rounded-2xl bg-[#faf8ff] p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#8a83a9]">Current Selection</p>
          <p className="mt-1 text-sm font-extrabold text-[#252b48]">{exam.title} · {subjects.join(", ")}</p>
        </div>

        <label className="block">
          <span className="mb-2 block text-xs font-extrabold text-[#3b4160]">Topic</span>
          <input value={localTopic} onChange={(event) => setLocalTopic(event.target.value)} className="h-11 w-full rounded-xl border border-[#ddd9ef] bg-white px-3 text-sm font-semibold outline-none focus:border-[#7651f1]" />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-extrabold text-[#3b4160]">Questions</span>
          <input type="number" min="1" max="200" value={localCount} onChange={(event) => setLocalCount(event.target.value)} className="h-11 w-full rounded-xl border border-[#ddd9ef] bg-white px-3 text-sm font-semibold outline-none focus:border-[#7651f1]" />
        </label>

        <div>
          <span className="mb-2 block text-xs font-extrabold text-[#3b4160]">Difficulty</span>
          <div className="grid grid-cols-3 gap-2">
            {difficulties.map((item) => (
              <button type="button" key={item.id} onClick={() => setLocalDifficulty(item.label)} className={`rounded-xl border px-2 py-3 text-xs font-extrabold ${localDifficulty === item.label ? "border-[#6d28f0] bg-[#f1ebff] text-[#6425ed]" : "border-[#e4e1ee] bg-white text-[#656d8a]"}`}>{item.label}</button>
            ))}
          </div>
        </div>

        <div>
          <span className="mb-2 block text-xs font-extrabold text-[#3b4160]">Language</span>
          <div className="grid grid-cols-3 gap-2">
            {languages.map((item) => (
              <button type="button" key={item.id} onClick={() => setLocalLanguage(item.label)} className={`rounded-xl border px-2 py-3 text-xs font-extrabold ${localLanguage === item.label ? "border-[#6d28f0] bg-[#f1ebff] text-[#6425ed]" : "border-[#e4e1ee] bg-white text-[#656d8a]"}`}>{item.label}</button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onSave({ topic: localTopic, count: localCount, difficulty: localDifficulty, language: localLanguage })}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#7630ff] to-[#5420ee] text-sm font-extrabold text-white shadow-lg shadow-purple-200"
        >
          <CheckCircle2 size={18} /> Save Changes
        </button>
      </div>
    </ModalShell>
  );
}

function MockTests({ onLogout, onMockTests, onStartTest, onHome }) {
  const [exam, setExam] = useState("upsc");
  const [selectedSubjects, setSelectedSubjects] = useState(["general"]);
  const [topic, setTopic] = useState("Environment & Ecology");
  const [topicOpen, setTopicOpen] = useState(false);
  const [customTopicName, setCustomTopicName] = useState("");
  const [customTopics, setCustomTopics] = useState([]);
  const [questionCount, setQuestionCount] = useState(50);
  const [customCount, setCustomCount] = useState(50);
  const [difficulty, setDifficulty] = useState("medium");
  const [language, setLanguage] = useState("english");
  const [showOtherExamModal, setShowOtherExamModal] = useState(false);
  const [showCustomSubjectModal, setShowCustomSubjectModal] = useState(false);
  const [showPopularModal, setShowPopularModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [otherExamSearch, setOtherExamSearch] = useState("");
  const [otherExamCategory, setOtherExamCategory] = useState("All");
  const [subjectSearch, setSubjectSearch] = useState("");
  const [subjectCategory, setSubjectCategory] = useState("All");
  const [customSubjectName, setCustomSubjectName] = useState("");
  const [customSubjectDescription, setCustomSubjectDescription] = useState("");
  const [customExamName, setCustomExamName] = useState("");
  const [customExamSubtitle, setCustomExamSubtitle] = useState("");
  const [customExams, setCustomExams] = useState([]);
  const [customSubjects, setCustomSubjects] = useState([]);

  const allExams = useMemo(
    () => [...baseExams, ...customExams, exams.find((item) => item.id === "other")],
    [customExams]
  );

  const displayExams = useMemo(
    () => [...baseExams, ...customExams, exams.find((item) => item.id === "other")],
    [customExams]
  );

  const selectedExam = useMemo(
    () => allExams.find((item) => item.id === exam) || baseExams[0],
    [allExams, exam]
  );
  const allSubjects = useMemo(
    () => [...subjects, ...customSubjects],
    [customSubjects]
  );

  const selectedSubjectObjects = useMemo(
    () => allSubjects.filter((item) => selectedSubjects.includes(item.id)),
    [allSubjects, selectedSubjects]
  );

  const filteredOtherExams = useMemo(() => {
    const query = otherExamSearch.trim().toLowerCase();
    return otherExamCatalog.filter((item) => {
      const matchesCategory = otherExamCategory === "All" || item.category === otherExamCategory;
      const matchesSearch = !query || `${item.title} ${item.subtitle} ${item.category}`.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [otherExamSearch, otherExamCategory]);

  const filteredSubjects = useMemo(() => {
    const query = subjectSearch.trim().toLowerCase();
    return [...customSubjectCatalog, ...customSubjects].filter((item) => {
      const matchesCategory = subjectCategory === "All" || item.category === subjectCategory;
      const matchesSearch = !query || `${item.title} ${item.subtitle} ${item.category}`.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [subjectSearch, subjectCategory, customSubjects]);
  const selectedDifficulty = difficulties.find((item) => item.id === difficulty);
  const selectedLanguage = languages.find((item) => item.id === language);
  const finalQuestionCount = questionCount === "custom" ? customCount : questionCount;
  const topicOptions = useMemo(() => [...topics, ...customTopics], [customTopics]);

  const toggleSubject = (id) => {
    setSelectedSubjects((current) => {
      if (current.includes(id)) {
        if (current.length === 1) return current;
        return current.filter((item) => item !== id);
      }
      return [...current, id];
    });
  };


  const handleOtherExamSelect = (item) => {
    setCustomExams((current) => current.some((value) => value.id === item.id) ? current : [...current, item]);
    setExam(item.id);
    setShowOtherExamModal(false);
    setOtherExamSearch("");
    setOtherExamCategory("All");
  };

  const handleCreateExam = () => {
    const name = customExamName.trim();
    if (!name) return;

    const id = `custom-exam-${Date.now()}`;
    const newExam = {
      id,
      title: name,
      subtitle: customExamSubtitle.trim() || "Custom Exam",
      category: "Custom",
      icon: GraduationCap,
      logo: null,
      custom: true,
    };

    setCustomExams((current) => [...current, newExam]);
    setExam(id);
    setCustomExamName("");
    setCustomExamSubtitle("");
    setShowOtherExamModal(false);
    setOtherExamSearch("");
    setOtherExamCategory("All");
  };

  const handleSubjectSelect = (item) => {
    if (item.id === "custom") {
      setShowCustomSubjectModal(true);
      return;
    }

    if (!subjects.some((subject) => subject.id === item.id)) {
      setCustomSubjects((current) => current.some((value) => value.id === item.id) ? current : [...current, item]);
    }

    setSelectedSubjects((current) => {
      if (current.includes(item.id)) {
        if (current.length === 1) return current;
        return current.filter((value) => value !== item.id);
      }
      return [...current, item.id];
    });
  };

  const handleCreateSubject = () => {
    const name = customSubjectName.trim();
    if (!name) return;

    const id = `custom-subject-${Date.now()}`;
    const newSubject = {
      id,
      title: name,
      subtitle: customSubjectDescription.trim() || "Custom Subject",
      icon: BookOpen,
      category: "Custom",
      custom: true,
    };

    setCustomSubjects((current) => [...current, newSubject]);
    setSelectedSubjects((current) => [...current, id]);
    setCustomSubjectName("");
    setCustomSubjectDescription("");
    setShowCustomSubjectModal(false);
    setSubjectSearch("");
    setSubjectCategory("All");
  };

  const resetOtherExamModal = () => {
    setShowOtherExamModal(false);
    setOtherExamSearch("");
    setOtherExamCategory("All");
    setCustomExamName("");
    setCustomExamSubtitle("");
  };

  const resetSubjectModal = () => {
    setShowCustomSubjectModal(false);
    setSubjectSearch("");
    setSubjectCategory("All");
    setCustomSubjectName("");
    setCustomSubjectDescription("");
  };

  const handleCreateTopic = () => {
    const name = customTopicName.trim();
    if (!name) return;

    setCustomTopics((current) =>
      current.includes(name) ? current : [...current, name]
    );
    setTopic(name);
    setCustomTopicName("");
    setTopicOpen(false);
  };

  const handleGenerate = () => {
    onStartTest?.({
      exam: selectedExam.title,
      examSubtitle: selectedExam.subtitle,
      subjects: selectedSubjectObjects.map((item) => item.title),
      topic: topic || "Full Subject",
      questionCount: Number(finalQuestionCount) || 50,
      difficulty: selectedDifficulty?.label || "Medium",
      language: selectedLanguage?.label || "English",
    });
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#f7f5ff] text-[#11183b]">
      <Navbar
        onLogout={onLogout}
        onMockTests={onMockTests}
        onHome={onHome}
        activeItem="Mock Tests"
      />

      <main
        className="relative min-h-screen bg-cover bg-center bg-no-repeat px-4 pb-10 pt-[92px] sm:px-6 lg:px-8 lg:pb-12 lg:pt-[102px]"
        style={{ backgroundImage: "url('/mock.png')" }}
      >
        <div className="pointer-events-none absolute inset-0 bg-white/15" />

        <div className="relative z-10 mx-auto max-w-[1450px]">
          <button
            type="button"
            onClick={onHome}
            className="mb-4 inline-flex items-center gap-2 text-[13px] font-semibold text-[#5f5b9c] transition hover:text-[#6425ed]"
          >
            <ArrowLeft size={17} />
            Back to Mock Tests
          </button>

          <div className="mb-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <h1 className="text-4xl font-black tracking-[-0.04em] text-[#10163b] sm:text-5xl lg:text-[42px]">
                Create Your <span className="bg-gradient-to-r from-[#7625f5] to-[#263cff] bg-clip-text text-transparent">Mock Test</span>
              </h1>
              <p className="mt-2 max-w-[760px] text-sm font-medium text-[#697399] sm:text-[15px]">
                Customize your test with the options below and get a test tailored to your needs.
              </p>
            </div>

            <div className="hidden items-center gap-4 lg:flex">
              <div className="text-right text-[#3924a6]">
                <div className="text-[17px] font-bold italic leading-tight">Practice</div>
                <div className="text-[17px] font-bold italic leading-tight">Smart</div>
                <div className="text-[17px] font-bold italic leading-tight">Score Higher</div>
              </div>
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/60 shadow-sm">
                <Sparkles className="text-[#7a31f5]" size={34} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(330px,0.8fr)]">
            <section className="rounded-[26px] border border-white/80 bg-white/90 p-5 shadow-[0_18px_60px_rgba(83,52,180,0.10)] backdrop-blur-xl sm:p-7">
              <div className="space-y-7">
                <div>
                  <NumberedHeading
                    number="1"
                    title="Select Exam"
                    subtitle="Choose the exam for which you want to practice."
                    action={
                      <button type="button" onClick={() => setShowPopularModal(true)} className="hidden items-center gap-2 rounded-xl border border-[#e2dcff] bg-white px-4 py-2 text-xs font-bold text-[#4037a3] sm:flex">
                        <Flame size={16} className="text-[#ff496e]" />
                        Popular Exams
                      </button>
                    }
                  />
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
                    {displayExams.map((item) => {
                      return (
                        <SelectionCard
                          key={item.id}
                          selected={exam === item.id}
                          onClick={() => {
                            if (item.id === "other") {
                              setShowOtherExamModal(true);
                            } else {
                              setExam(item.id);
                            }
                          }}
                          className="min-h-[74px] rounded-2xl border p-3"
                        >
                          <div className="flex h-full items-center gap-2.5">
                            <ExamLogo exam={item} />
                            <span className="min-w-0">
                              <span className="block truncate text-[12px] font-extrabold text-[#202643]">{item.title}</span>
                              <span className="mt-0.5 block truncate text-[9px] font-medium text-[#7d849d]">{item.subtitle}</span>
                            </span>
                          </div>
                        </SelectionCard>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <NumberedHeading
                    number="2"
                    title="Select Subject(s)"
                    subtitle="Choose one or more subjects for your test."
                    action={
                      <button
                        type="button"
                        onClick={() => setShowCustomSubjectModal(true)}
                        className="flex items-center gap-1.5 rounded-xl border border-[#ded6ff] bg-white px-3.5 py-2 text-xs font-bold text-[#6425ed] transition hover:border-[#c9baff] hover:bg-[#faf8ff]"
                      >
                        <Plus size={16} /> Custom Subject
                      </button>
                    }
                  />
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
                    {allSubjects.map((item) => {
                      const Icon = item.icon;
                      const selected = selectedSubjects.includes(item.id);
                      return (
                        <SelectionCard
                          key={item.id}
                          selected={selected}
                          onClick={() => handleSubjectSelect(item)}
                          className="min-h-[62px] rounded-2xl border p-3"
                        >
                          <div className="flex items-center gap-2">
                            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${selected ? "bg-[#eee7ff] text-[#6425ed]" : "bg-[#f1f5ff] text-[#3c65dc]"}`}>
                              <Icon size={17} />
                            </span>
                            <span className="text-[11px] font-bold leading-4 text-[#242b49]">{item.title}</span>
                          </div>
                        </SelectionCard>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <NumberedHeading number="3" title="Select Topic (Optional)" subtitle="Choose a specific topic or keep it full subject." />
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setTopicOpen((value) => !value)}
                      className="flex h-[52px] w-full items-center gap-3 rounded-2xl border border-[#ddd9f2] bg-white px-4 text-left shadow-sm"
                    >
                      <Search size={19} className="text-[#687092]" />
                      <span className="flex-1 text-sm font-semibold text-[#252b47]">{topic || "Select a topic"}</span>
                      {topic && <X size={17} className="text-[#6e7590]" onClick={(event) => { event.stopPropagation(); setTopic(""); }} />}
                      <ChevronDown size={19} className={`text-[#505979] transition ${topicOpen ? "rotate-180" : ""}`} />
                    </button>
                    {topicOpen && (
                      <div className="absolute left-0 right-0 top-[58px] z-[60] rounded-2xl border border-[#e6e1f7] bg-white p-3 shadow-[0_15px_45px_rgba(60,42,130,0.18)]">
                        <div className="mb-2 flex items-center gap-2 rounded-xl border border-[#e6e1f7] bg-[#faf9ff] px-3">
                          <Search size={16} className="shrink-0 text-[#777e9c]" />
                          <input
                            type="text"
                            value={customTopicName}
                            onChange={(event) => setCustomTopicName(event.target.value)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter") handleCreateTopic();
                            }}
                            placeholder="Search or type a custom topic..."
                            className="h-10 min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#252b47] outline-none placeholder:text-[#9aa0b8]"
                          />
                          {customTopicName && (
                            <button
                              type="button"
                              onClick={() => setCustomTopicName("")}
                              className="text-[#7b829d] hover:text-[#6425ed]"
                            >
                              <X size={15} />
                            </button>
                          )}
                        </div>

                        <div className="max-h-56 overflow-y-auto">
                          {topicOptions
                            .filter((item) =>
                              item.toLowerCase().includes(customTopicName.trim().toLowerCase())
                            )
                            .map((item) => (
                              <button
                                type="button"
                                key={item}
                                onClick={() => {
                                  setTopic(item);
                                  setCustomTopicName("");
                                  setTopicOpen(false);
                                }}
                                className={`w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition hover:bg-[#f5f1ff] ${topic === item ? "bg-[#f1ebff] text-[#6425ed]" : "text-[#343b5b]"}`}
                              >
                                {item}
                              </button>
                            ))}
                        </div>

                        {customTopicName.trim() &&
                          !topicOptions.some(
                            (item) => item.toLowerCase() === customTopicName.trim().toLowerCase()
                          ) && (
                            <button
                              type="button"
                              onClick={handleCreateTopic}
                              className="mt-2 flex w-full items-center gap-2 rounded-xl bg-[#f1ebff] px-3 py-3 text-left text-sm font-extrabold text-[#6425ed] transition hover:bg-[#e9e0ff]"
                            >
                              <Plus size={17} />
                              Add “{customTopicName.trim()}” as custom topic
                            </button>
                          )}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <NumberedHeading number="4" title="Number of Questions" subtitle="Select how many questions you want." />
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                    {questionCounts.map((count) => (
                      <button
                        type="button"
                        key={count}
                        onClick={() => setQuestionCount(count)}
                        className={`h-[46px] rounded-xl border text-sm font-bold transition ${questionCount === count ? "border-[#6d28f0] bg-gradient-to-r from-[#6f23f3] to-[#5527ec] text-white shadow-[0_8px_20px_rgba(101,38,237,0.20)]" : "border-[#e4e4f1] bg-white text-[#515a7c] hover:border-[#cfc3ff]"}`}
                      >
                        {count}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setQuestionCount("custom")}
                      className={`h-[46px] rounded-xl border text-sm font-bold transition sm:col-span-1 ${questionCount === "custom" ? "border-[#6d28f0] bg-gradient-to-r from-[#6f23f3] to-[#5527ec] text-white" : "border-[#e4e4f1] bg-white text-[#515a7c] hover:border-[#cfc3ff]"}`}
                    >
                      Custom
                    </button>
                  </div>
                  {questionCount === "custom" && (
                    <div className="mt-3 flex items-center gap-3">
                      <input
                        type="number"
                        min="1"
                        max="200"
                        value={customCount}
                        onChange={(event) => setCustomCount(event.target.value)}
                        className="h-11 w-full max-w-[180px] rounded-xl border border-[#ddd9f2] bg-white px-3 text-sm font-semibold outline-none focus:border-[#6d28f0]"
                      />
                      <span className="text-xs font-medium text-[#7a819b]">Choose 1–200 questions</span>
                    </div>
                  )}
                </div>

                <div>
                  <NumberedHeading number="5" title="Difficulty Level" subtitle="Choose the level of questions." />
                  <div className="grid grid-cols-3 gap-3">
                    {difficulties.map((item) => {
                      const selected = difficulty === item.id;
                      return (
                        <SelectionCard
                          key={item.id}
                          selected={selected}
                          onClick={() => setDifficulty(item.id)}
                          className={`flex h-[54px] items-center justify-center rounded-xl border px-3 ${selected ? "" : ""}`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`flex h-8 w-8 items-center justify-center rounded-full text-lg ${item.tone}`}>{item.emoji}</span>
                            <span className="text-sm font-bold text-[#232943]">{item.label}</span>
                          </div>
                        </SelectionCard>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <NumberedHeading number="6" title="Language" subtitle="Select the language for the test." />
                  <div className="grid grid-cols-3 gap-3">
                    {languages.map((item) => {
                      const selected = language === item.id;
                      return (
                        <SelectionCard
                          key={item.id}
                          selected={selected}
                          onClick={() => setLanguage(item.id)}
                          className="flex h-[54px] items-center justify-center rounded-xl border px-3"
                        >
                          <div className="flex items-center gap-2">
                            <span className={`flex h-8 min-w-8 items-center justify-center rounded-full px-1 text-xs font-extrabold ${selected ? "bg-[#6d28f0] text-white" : "bg-[#f1f3fb] text-[#4d587a]"}`}>{item.icon}</span>
                            <span className="text-sm font-bold text-[#232943]">{item.label}</span>
                          </div>
                        </SelectionCard>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGenerate}
                  className="mx-auto flex h-[56px] w-full max-w-[360px] items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#6e22f5] via-[#6323f0] to-[#5424e8] px-6 text-base font-extrabold text-white shadow-[0_12px_30px_rgba(101,38,237,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_35px_rgba(101,38,237,0.32)]"
                >
                  <Sparkles size={19} />
                  Generate Mock Test
                  <ArrowRight size={20} />
                </button>
              </div>
            </section>

            <aside className="space-y-5 xl:sticky xl:top-[94px] xl:self-start">
              <div className="rounded-[24px] border border-white/80 bg-white/90 p-5 shadow-[0_16px_50px_rgba(83,52,180,0.10)] backdrop-blur-xl sm:p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eee7ff] text-[#6425ed]"><ClipboardCheck size={21} /></span>
                    <h2 className="text-[18px] font-extrabold text-[#11183b]">Test Summary</h2>
                  </div>
                  <button type="button" className="flex items-center gap-1.5 rounded-xl border border-[#e1d9ff] bg-[#faf8ff] px-3 py-2 text-xs font-bold text-[#6425ed]">
                    <Pencil size={14} /> Edit
                  </button>
                </div>
                <div className="space-y-3.5">
                  {[
                    ["Exam", `${selectedExam.title} ${selectedExam.subtitle}`],
                    ["Subject", selectedSubjectObjects.map((item) => item.title).join(", ")],
                    ["Topic", topic || "Full Subject"],
                    ["Questions", `${finalQuestionCount} Questions`],
                    ["Difficulty", selectedDifficulty?.label],
                    ["Language", selectedLanguage?.label],
                  ].map(([label, value]) => (
                    <div key={label} className="grid grid-cols-[88px_14px_minmax(0,1fr)] gap-2 text-sm">
                      <span className="font-semibold text-[#717a9c]">{label}</span>
                      <span className="font-bold text-[#8a8fa6]">:</span>
                      <span className="font-semibold text-[#252b48]">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[24px] border border-white/80 bg-[#faf8ff]/95 p-5 shadow-[0_16px_50px_rgba(83,52,180,0.08)] sm:p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eee7ff] text-[#6425ed]"><CircleHelp size={21} /></span>
                    <h2 className="text-[16px] font-extrabold text-[#32275d]">Preview (Sample Question)</h2>
                  </div>
                  <span className="rounded-full bg-[#fff0dc] px-3 py-1 text-[11px] font-bold text-[#f07a1c]">{selectedDifficulty?.label}</span>
                </div>
                <p className="text-[13px] font-semibold leading-5 text-[#27304e]">
                  Which of the following is/are the major cause(s) of groundwater depletion in India?
                </p>
                <div className="mt-4 space-y-2.5">
                  {["Over-extraction for agriculture", "Rapid urbanization", "Poor water management", "All of the above"].map((option, index) => (
                    <div key={option} className="flex items-center gap-2.5 text-[12px] font-medium text-[#454d6b]">
                      <span className="h-4 w-4 rounded-full border-2 border-[#a9afc5]" />
                      {index + 1}. {option}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[24px] border border-white/80 bg-white/90 p-5 shadow-[0_16px_50px_rgba(83,52,180,0.08)] sm:p-6">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff1cf] text-[#ff9c13]"><Sparkles size={21} /></span>
                  <h2 className="text-[17px] font-extrabold text-[#11183b]">Benefits</h2>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    [Target, "Personalized", "Practice", "bg-[#f3eaff] text-[#6d28f0]"],
                    [FileText, "Exam-like", "Experience", "bg-[#eaf4ff] text-[#3180e7]"],
                    [BarChart3, "Instant", "Results", "bg-[#e9faf4] text-[#10b981]"],
                    [Lightbulb, "Detailed", "Solutions", "bg-[#fff4e8] text-[#ff9417]"],
                  ].map(([Icon, line1, line2, tone]) => (
                    <div key={line1} className="flex flex-col items-center rounded-2xl bg-[#fafaff] px-2 py-3 text-center">
                      <span className={`mb-2 flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}><Icon size={20} /></span>
                      <span className="text-[11px] font-bold text-[#4c5475]">{line1}</span>
                      <span className="text-[11px] font-bold text-[#4c5475]">{line2}</span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <OtherExamModal
        open={showOtherExamModal}
        onClose={resetOtherExamModal}
        exams={filteredOtherExams}
        categories={examCategories}
        search={otherExamSearch}
        setSearch={setOtherExamSearch}
        category={otherExamCategory}
        setCategory={setOtherExamCategory}
        onSelect={handleOtherExamSelect}
        customName={customExamName}
        setCustomName={setCustomExamName}
        customSubtitle={customExamSubtitle}
        setCustomSubtitle={setCustomExamSubtitle}
        onCreate={handleCreateExam}
      />

      <CustomSubjectModal
        open={showCustomSubjectModal}
        onClose={resetSubjectModal}
        subjects={filteredSubjects}
        categories={subjectCategories}
        search={subjectSearch}
        setSearch={setSubjectSearch}
        category={subjectCategory}
        setCategory={setSubjectCategory}
        onSelect={handleSubjectSelect}
        customName={customSubjectName}
        setCustomName={setCustomSubjectName}
        customDescription={customSubjectDescription}
        setCustomDescription={setCustomSubjectDescription}
        onCreate={handleCreateSubject}
      />

      <PopularExamsModal
        open={showPopularModal}
        onClose={() => setShowPopularModal(false)}
        exams={baseExams}
        onSelect={(item) => {
          setExam(item.id);
          setShowPopularModal(false);
        }}
      />

      <EditSummaryModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        exam={selectedExam}
        subjects={selectedSubjectObjects.map((item) => item.title)}
        topic={topic || "Full Subject"}
        questionCount={finalQuestionCount}
        difficulty={selectedDifficulty?.label || "Medium"}
        language={selectedLanguage?.label || "English"}
        onSave={(values) => {
          setTopic(values.topic || "");
          setQuestionCount(Number(values.count) || 50);
          setDifficulty(difficulties.find((item) => item.label === values.difficulty)?.id || "medium");
          setLanguage(languages.find((item) => item.label === values.language)?.id || "english");
          setShowEditModal(false);
        }}
      />
    </div>
  );
}

export default MockTests;

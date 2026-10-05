import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";

import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  Download,
  Eye,
  MoreVertical,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  CalendarDays,
  Clock3,
  Building2,
  Atom,
  Stethoscope,
  Landmark,
  BookOpen,
  GraduationCap,
  X,
  Sparkles,
  CheckCircle2,
  FileQuestion,
  Layers3,
  TrendingUp,
  Target,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const PYQ = ({
  onLogout,
  onHome,
  onMockTests,
  onAI,
  onProfile,
  onRoadmaps,
  onTarget,
  onPYQ,
}) => {
  const [activeCategory, setActiveCategory] = useState("All");

  const [filters, setFilters] = useState({
    examCategory: "All Categories",
    exam: "All Exams",
    subject: "All Subjects",
    year: "All Years",
    paper: "All Papers",
  });

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Newest");
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  const [papers, setPapers] = useState([]);
  const [loadingPapers, setLoadingPapers] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [downloadingId, setDownloadingId] = useState(null);

  // =========================
  // FETCH REAL PYQs
  // =========================

  useEffect(() => {
    const fetchPYQs = async () => {
      try {
        setLoadingPapers(true);
        setFetchError("");

        const response = await fetch(`${API_BASE_URL}/pyq`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load PYQs");
        }

        const backendPapers = Array.isArray(data)
          ? data
          : Array.isArray(data.pyqs)
          ? data.pyqs
          : Array.isArray(data.data)
          ? data.data
          : [];

        setPapers(backendPapers);
      } catch (error) {
        console.error("Fetch PYQs Error:", error);
        setPapers([]);
        setFetchError(error.message || "Unable to load PYQs");
      } finally {
        setLoadingPapers(false);
      }
    };

    fetchPYQs();
  }, []);

  // =========================
  // FORMAT PAPER
  // =========================

  const formatPaper = (paper) => {
    const size =
      paper.fileSize && Number(paper.fileSize) > 0
        ? `${(Number(paper.fileSize) / (1024 * 1024)).toFixed(1)} MB`
        : "PDF";

    return {
      ...paper,
      id: paper._id,

      title: paper.title || paper.fileName || "PYQ Paper",

      /*
       * Backend me agar future me separate `exam`
       * field aata hai to wahi use hoga.
       * Abhi existing backend me category available hai,
       * isliye category fallback rahega.
       */
      exam: paper.exam || paper.category || "Other",

      category: paper.category || "Other",

      stage: paper.stage || paper.classLevel || "General",

      subject: paper.subject || "General",

      year:
        paper.year !== undefined && paper.year !== null
          ? String(paper.year)
          : "N/A",

      questions:
        paper.questions ||
        paper.questionCount ||
        "PDF",

      size,

      fileUrl: paper.fileUrl || "",

      fileName:
        paper.fileName ||
        `${paper.title || "PYQ"}.pdf`,
    };
  };

  const formattedPapers = useMemo(
    () => papers.map(formatPaper),
    [papers]
  );

  // =========================
  // DYNAMIC FILTER OPTIONS
  // =========================

  const getUniqueValues = (values) => {
    return [
      ...new Set(
        values
          .filter(
            (value) =>
              value !== undefined &&
              value !== null &&
              String(value).trim() !== ""
          )
          .map((value) => String(value).trim())
      ),
    ].sort((a, b) =>
      a.localeCompare(b, undefined, {
        numeric: true,
        sensitivity: "base",
      })
    );
  };

  const availableFilters = useMemo(() => {
    return {
      categories: getUniqueValues(
        formattedPapers.map((paper) => paper.category)
      ),

      exams: getUniqueValues(
        formattedPapers.map(
          (paper) => paper.exam || paper.category
        )
      ),

      subjects: getUniqueValues(
        formattedPapers.map((paper) => paper.subject)
      ),

      years: getUniqueValues(
        formattedPapers.map((paper) => paper.year)
      ),

      stages: getUniqueValues(
        formattedPapers.map((paper) => paper.stage)
      ),

      papers: getUniqueValues(
        formattedPapers.map((paper) => paper.title)
      ),
    };
  }, [formattedPapers]);

  const examCategoryOptions = [
    "All Categories",
    ...availableFilters.categories,
  ];

  const examOptions = [
    "All Exams",
    ...availableFilters.exams,
  ];

  const subjectOptions = [
    "All Subjects",
    ...availableFilters.subjects,
  ];

  const yearOptions = [
    "All Years",
    ...availableFilters.years,
  ];

  const paperOptions = [
    "All Papers",
    ...availableFilters.papers,
  ];

  // =========================
  // DYNAMIC CATEGORY TABS
  // =========================

  const categoryTabs = useMemo(() => {
    const names = getUniqueValues(
      formattedPapers.map(
        (paper) => paper.exam || paper.category
      )
    );

    return [
      { name: "All", icon: BookOpen },
      ...names.map((name) => ({
        name,
        icon: getCategoryIcon(name),
      })),
    ];
  }, [formattedPapers]);

  // =========================
  // FILTER
  // =========================

  const filteredPapers = useMemo(() => {
    let result = [...formattedPapers];

    // Category tab
    if (activeCategory !== "All") {
      result = result.filter((paper) => {
        const paperExam = String(
          paper.exam || paper.category || ""
        ).toLowerCase();

        return (
          paperExam === activeCategory.toLowerCase()
        );
      });
    }

    // Exam Category
    if (
      filters.examCategory &&
      filters.examCategory !== "All Categories"
    ) {
      result = result.filter((paper) => {
        return (
          String(paper.category || "")
            .toLowerCase()
            .trim() ===
          filters.examCategory.toLowerCase().trim()
        );
      });
    }

    // Exam
    if (
      filters.exam &&
      filters.exam !== "All Exams"
    ) {
      result = result.filter((paper) => {
        return String(
          paper.exam || paper.category || ""
        )
          .toLowerCase()
          .trim() ===
          filters.exam.toLowerCase().trim();
      });
    }

    // Subject
    if (
      filters.subject &&
      filters.subject !== "All Subjects"
    ) {
      result = result.filter((paper) => {
        return String(paper.subject || "")
          .toLowerCase()
          .trim() ===
          filters.subject.toLowerCase().trim();
      });
    }

    // Year
    if (
      filters.year &&
      filters.year !== "All Years"
    ) {
      result = result.filter(
        (paper) =>
          String(paper.year) === String(filters.year)
      );
    }

    // Paper / Set
    if (
      filters.paper &&
      filters.paper !== "All Papers"
    ) {
      result = result.filter(
        (paper) =>
          String(paper.title || "")
            .toLowerCase()
            .trim() ===
          filters.paper.toLowerCase().trim()
      );
    }

    // Search
    if (search.trim()) {
      const value = search.toLowerCase();

      result = result.filter((paper) => {
        return (
          String(paper.title || "")
            .toLowerCase()
            .includes(value) ||
          String(paper.exam || "")
            .toLowerCase()
            .includes(value) ||
          String(paper.category || "")
            .toLowerCase()
            .includes(value) ||
          String(paper.subject || "")
            .toLowerCase()
            .includes(value) ||
          String(paper.year || "")
            .toLowerCase()
            .includes(value)
        );
      });
    }

    // Sort
    if (sort === "Newest") {
      result.sort(
        (a, b) =>
          Number(b.year || 0) -
          Number(a.year || 0)
      );
    }

    if (sort === "Oldest") {
      result.sort(
        (a, b) =>
          Number(a.year || 0) -
          Number(b.year || 0)
      );
    }

    if (sort === "A-Z") {
      result.sort((a, b) =>
        String(a.title || "").localeCompare(
          String(b.title || "")
        )
      );
    }

    return result;
  }, [
    formattedPapers,
    activeCategory,
    filters,
    search,
    sort,
  ]);

  // =========================
  // FILTER UPDATE
  // =========================

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // =========================
  // RESET
  // =========================

  const resetFilters = () => {
    setFilters({
      examCategory: "All Categories",
      exam: "All Exams",
      subject: "All Subjects",
      year: "All Years",
      paper: "All Papers",
    });

    setActiveCategory("All");
    setSearch("");
    setSort("Newest");
  };

  const applyFilters = () => {
    setShowFiltersMobile(false);
  };

  // =========================
  // VIEW PDF
  // =========================

  const handleView = async (paper) => {
    try {
      if (!paper?._id) {
        alert("PDF not found.");
        return;
      }

      const url =
        `${API_BASE_URL}/pyq/${paper._id}/view`;

      window.open(
        url,
        "_blank",
        "noopener,noreferrer"
      );
    } catch (error) {
      console.error("View PDF Error:", error);

      if (paper.fileUrl) {
        window.open(
          paper.fileUrl,
          "_blank",
          "noopener,noreferrer"
        );
      } else {
        alert("Unable to open PDF.");
      }
    }
  };

  // =========================
  // FORCE PDF DOWNLOAD
  // =========================

  const handleDownload = async (paper) => {
    if (!paper?._id) {
      alert("PDF not found.");
      return;
    }

    try {
      setDownloadingId(paper._id);

      const response = await fetch(
        `${API_BASE_URL}/pyq/${paper._id}/download`
      );

      if (!response.ok) {
        let message = "PDF download failed.";

        try {
          const data = await response.json();

          if (data?.message) {
            message = data.message;
          }
        } catch {
          // Ignore JSON parse error
        }

        throw new Error(message);
      }

      const blob = await response.blob();

      if (!blob || blob.size === 0) {
        throw new Error(
          "Downloaded PDF is empty."
        );
      }

      const blobUrl =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = blobUrl;

      let fileName =
        paper.fileName ||
        paper.title ||
        "PYQ";

      fileName = fileName
        .replace(/[<>:"/\\|?*]+/g, "_")
        .replace(/\.pdf$/i, "");

      link.download = `${fileName}.pdf`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 1000);
    } catch (error) {
      console.error(
        "Download PDF Error:",
        error
      );

      alert(
        error.message ||
          "PDF download nahi ho paaya."
      );
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div
      className="min-h-screen w-full overflow-x-hidden bg-[#f8f7ff] text-[#101d4d]"
      style={{
        fontFamily:
          "'Poppins', 'Inter', 'Segoe UI', sans-serif",
      }}
    >
      <Navbar
        onLogout={onLogout}
        onHome={onHome}
        onMockTests={onMockTests}
        onAI={onAI}
        onProfile={onProfile}
        onRoadmaps={onRoadmaps}
        onTarget={onTarget}
        onPYQ={onPYQ}
        activePage="pyq"
      />

      {/* HERO */}
      <section className="relative overflow-hidden px-4 pb-10 pt-8 sm:px-6 lg:px-8 lg:pb-12 lg:pt-10">
        <div className="pointer-events-none absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-[#8b5cf6]/10 blur-3xl" />

        <div className="pointer-events-none absolute right-[-100px] top-[40px] h-[350px] w-[350px] rounded-full bg-[#a78bfa]/15 blur-3xl" />

        <div className="pointer-events-none absolute bottom-[-150px] left-[35%] h-[300px] w-[300px] rounded-full bg-[#c4b5fd]/15 blur-3xl" />

        <div className="relative mx-auto max-w-[1450px]">
          <div className="grid overflow-hidden rounded-[32px] border border-[#e8e2ff] bg-white shadow-[0_20px_60px_rgba(91,33,182,0.09)] lg:grid-cols-[1.1fr_0.9fr]">
            {/* LEFT */}
            <div className="relative flex min-h-[430px] flex-col justify-center overflow-hidden px-6 py-12 sm:px-10 lg:px-14 lg:py-14">
              <div className="absolute left-[-70px] top-[-70px] h-[220px] w-[220px] rounded-full bg-[#ede9fe]" />

              <div className="relative z-10">
                <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-[#ddd3ff] bg-[#f5f1ff] px-4 py-2 text-sm font-medium text-[#6734ef]">
                  <Sparkles size={16} />
                  Previous Year Questions
                </div>

                <h1 className="max-w-[680px] text-4xl font-semibold leading-[1.08] tracking-[-1px] text-[#101d4d] sm:text-5xl lg:text-[56px]">
                  Practice.
                  <span className="block bg-gradient-to-r from-[#6331f2] via-[#7c3aed] to-[#9b5cf6] bg-clip-text font-semibold text-transparent">
                    Analyze. Improve.
                  </span>
                </h1>

                <p className="mt-5 max-w-[650px] text-[15px] font-normal leading-7 text-[#64709a] sm:text-[17px]">
                  Prepare smarter with real previous year
                  question papers from competitive exams,
                  school exams and university examinations.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <HeroFeature
                    icon={FileQuestion}
                    text="Real Exam Papers"
                  />

                  <HeroFeature
                    icon={CheckCircle2}
                    text="Practice Anytime"
                  />

                  <HeroFeature
                    icon={Download}
                    text="Free Downloads"
                  />
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="relative flex min-h-[390px] items-center justify-center overflow-hidden bg-gradient-to-br from-[#f1edff] via-[#faf9ff] to-[#eee8ff] px-5 py-10">
              <div className="absolute right-[-80px] top-[-80px] h-[260px] w-[260px] rounded-full bg-[#c4b5fd]/30 blur-2xl" />

              <div className="absolute bottom-[-80px] left-[-60px] h-[240px] w-[240px] rounded-full bg-[#ddd6fe]/50 blur-2xl" />

              <div className="relative z-10 w-full max-w-[390px]">
                <div className="absolute -right-2 top-2 h-[270px] w-[270px] rounded-full bg-[#8b5cf6]/10 blur-2xl" />

                <div className="relative rotate-[-3deg] rounded-[25px] border border-[#ddd6fe] bg-white p-5 shadow-[0_25px_55px_rgba(76,29,149,0.15)]">
                  <div className="flex items-center justify-between border-b border-[#eeeafd] pb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eee9ff] text-[#6734ef]">
                        <FileText size={22} />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-[#172354]">
                          PYQ Paper
                        </p>

                        <p className="text-xs font-normal text-[#818bad]">
                          Previous Year Questions
                        </p>
                      </div>
                    </div>

                    <span className="rounded-full bg-[#dcfce7] px-3 py-1 text-[11px] font-medium text-[#15803d]">
                      PDF
                    </span>
                  </div>

                  <div className="space-y-3 py-5">
                    <QuestionLine width="92%" />
                    <QuestionLine width="78%" />
                    <QuestionLine width="86%" />
                    <QuestionLine width="66%" />
                    <QuestionLine width="90%" />
                  </div>

                  <div className="grid grid-cols-3 gap-2 border-t border-[#eeeafd] pt-4">
                    <MiniStat
                      icon={FileQuestion}
                      value="PDF"
                      label="Questions"
                    />

                    <MiniStat
                      icon={Clock3}
                      value="PYQ"
                      label="Practice"
                    />

                    <MiniStat
                      icon={Target}
                      value="100%"
                      label="Useful"
                    />
                  </div>
                </div>

                <div className="absolute -left-5 top-10 rounded-2xl border border-white bg-white px-4 py-3 shadow-[0_12px_30px_rgba(76,29,149,0.12)] sm:-left-10">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ede9fe] text-[#6734ef]">
                      <TrendingUp size={18} />
                    </div>

                    <div>
                      <p className="text-xs font-medium text-[#172354]">
                        Improve
                      </p>

                      <p className="text-[10px] font-normal text-[#7c86a7]">
                        Every practice
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute -right-3 bottom-8 rounded-2xl border border-white bg-white px-4 py-3 shadow-[0_12px_30px_rgba(76,29,149,0.12)] sm:-right-8">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#dcfce7] text-[#16a34a]">
                      <CheckCircle2 size={18} />
                    </div>

                    <div>
                      <p className="text-xs font-medium text-[#172354]">
                        Practice
                      </p>

                      <p className="text-[10px] font-normal text-[#7c86a7]">
                        Real questions
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STATS */}
          <div className="relative z-10 mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
            <StatCard
              icon={FileQuestion}
              value={`${papers.length}`}
              label="Question Papers"
            />

            <StatCard
              icon={Layers3}
              value={`${
                new Set(
                  papers.map(
                    (paper) =>
                      paper.category ||
                      paper.exam ||
                      "Other"
                  )
                ).size
              }`}
              label="Exam Categories"
            />

            <StatCard
              icon={CalendarDays}
              value={`${
                new Set(
                  papers.map(
                    (paper) => paper.year
                  )
                ).size
              }`}
              label="Years Covered"
            />

            <StatCard
              icon={Download}
              value="PDF"
              label="Downloadable"
            />
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <main className="relative px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1450px]">
          {/* CATEGORY TABS */}
          <div className="rounded-[24px] border border-[#e8e2ff] bg-white p-3 shadow-[0_12px_40px_rgba(91,33,182,0.07)]">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <button
                type="button"
                className="flex h-11 w-10 shrink-0 items-center justify-center rounded-xl border border-[#e5e0f8] bg-[#faf9ff] text-[#59658c] transition hover:bg-[#f1edff]"
              >
                <ChevronLeft size={18} />
              </button>

              {categoryTabs.map((category) => {
                const Icon = category.icon;

                const active =
                  activeCategory === category.name;

                return (
                  <button
                    key={category.name}
                    type="button"
                    onClick={() =>
                      setActiveCategory(
                        category.name
                      )
                    }
                    className={`flex h-11 shrink-0 items-center gap-2 rounded-xl border px-5 text-sm font-medium transition-all ${
                      active
                        ? "border-[#6734f4] bg-gradient-to-r from-[#6530f2] to-[#7c3aed] text-white shadow-[0_7px_18px_rgba(103,52,244,0.24)]"
                        : "border-[#e3defa] bg-white text-[#19265a] hover:border-[#c9bdf9] hover:bg-[#faf8ff]"
                    }`}
                  >
                    <Icon
                      size={17}
                      strokeWidth={2}
                    />

                    {category.name}
                  </button>
                );
              })}

              <button
                type="button"
                className="flex h-11 w-10 shrink-0 items-center justify-center rounded-xl border border-[#e6e0ff] bg-[#faf9ff] text-[#59658c] transition hover:bg-[#f1edff]"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* MAIN GRID */}
          <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[270px_minmax(0,1fr)]">
            {/* FILTER */}
            <aside
              className={`${
                showFiltersMobile
                  ? "block"
                  : "hidden"
              } lg:block`}
            >
              <div className="sticky top-24 rounded-[24px] border border-[#e8e2ff] bg-white p-5 shadow-[0_12px_40px_rgba(91,33,182,0.07)]">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eee9ff] text-[#6633ef]">
                      <SlidersHorizontal size={21} />
                    </div>

                    <h2 className="text-[20px] font-medium text-[#101d4d]">
                      Filters
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowFiltersMobile(false)
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-[#69749a] hover:bg-[#f5f2ff] lg:hidden"
                  >
                    <X size={18} />
                  </button>
                </div>

                <FilterSelect
                  label="Exam Category"
                  value={filters.examCategory}
                  onChange={(value) =>
                    updateFilter(
                      "examCategory",
                      value
                    )
                  }
                  options={examCategoryOptions}
                />

                <FilterSelect
                  label="Exam"
                  value={filters.exam}
                  onChange={(value) =>
                    updateFilter(
                      "exam",
                      value
                    )
                  }
                  options={examOptions}
                />

                <FilterSelect
                  label="Subject"
                  value={filters.subject}
                  onChange={(value) =>
                    updateFilter(
                      "subject",
                      value
                    )
                  }
                  options={subjectOptions}
                />

                <FilterSelect
                  label="Year"
                  value={filters.year}
                  onChange={(value) =>
                    updateFilter(
                      "year",
                      value
                    )
                  }
                  options={yearOptions}
                />

                <FilterSelect
                  label="Paper / Set"
                  value={filters.paper}
                  onChange={(value) =>
                    updateFilter(
                      "paper",
                      value
                    )
                  }
                  options={paperOptions}
                />

                <button
                  type="button"
                  onClick={applyFilters}
                  className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6230f1] to-[#7a35ed] text-sm font-medium text-white shadow-[0_8px_18px_rgba(99,48,241,0.25)] transition hover:-translate-y-[1px]"
                >
                  <Search size={17} />
                  Apply Filters
                </button>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#f5f3ff] text-sm font-medium text-[#263267] transition hover:bg-[#ece8ff]"
                >
                  <RotateCcw size={17} />
                  Reset Filters
                </button>
              </div>
            </aside>

            {/* PAPERS */}
            <section className="min-w-0 rounded-[24px] border border-[#e8e2ff] bg-white p-4 shadow-[0_12px_40px_rgba(91,33,182,0.07)] sm:p-5">
              <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eee9ff] text-[#6633ef]">
                      <Landmark size={21} />
                    </div>

                    <div>
                      <h2 className="text-[20px] font-medium text-[#101d4d] sm:text-[22px]">
                        Previous Year Questions
                      </h2>

                      <p className="mt-1 text-sm font-normal text-[#52618f]">
                        Download and practice real exam
                        papers to boost your preparation.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex w-full flex-col gap-2 sm:flex-row xl:w-auto">
                  <button
                    type="button"
                    onClick={() =>
                      setShowFiltersMobile(true)
                    }
                    className="flex h-11 items-center justify-center gap-2 rounded-xl border border-[#ded8f8] bg-white px-4 text-sm font-medium text-[#273466] lg:hidden"
                  >
                    <SlidersHorizontal size={17} />
                    Filters
                  </button>

                  <div className="relative min-w-0 sm:w-[250px]">
                    <Search
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#63709b]"
                    />

                    <input
                      type="text"
                      value={search}
                      onChange={(e) =>
                        setSearch(
                          e.target.value
                        )
                      }
                      placeholder="Search papers..."
                      className="h-11 w-full rounded-xl border border-[#dcd7f2] bg-white pl-10 pr-4 text-sm font-normal text-[#18265b] outline-none transition placeholder:text-[#7a84a7] focus:border-[#7040f4] focus:ring-4 focus:ring-[#7040f4]/10"
                    />
                  </div>

                  <div className="relative">
                    <select
                      value={sort}
                      onChange={(e) =>
                        setSort(
                          e.target.value
                        )
                      }
                      className="h-11 w-full appearance-none rounded-xl border border-[#dcd7f2] bg-white px-4 pr-10 text-sm font-medium text-[#263267] outline-none focus:border-[#7040f4] sm:w-[170px]"
                    >
                      <option value="Newest">
                        Sort by: Newest
                      </option>

                      <option value="Oldest">
                        Sort by: Oldest
                      </option>

                      <option value="A-Z">
                        Sort by: A-Z
                      </option>
                    </select>

                    <ChevronDown
                      size={17}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#63709b]"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-[#ece9f8]">
                {loadingPapers ? (
                  <div className="flex min-h-[280px] flex-col items-center justify-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#e8e2ff] border-t-[#6734ef]" />

                    <p className="mt-4 text-sm text-[#69749a]">
                      Loading PYQs...
                    </p>
                  </div>
                ) : fetchError ? (
                  <div className="flex min-h-[280px] flex-col items-center justify-center px-5 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff0f0] text-red-500">
                      <FileText size={28} />
                    </div>

                    <h3 className="mt-4 text-lg font-medium text-[#172354]">
                      Unable to load PYQs
                    </h3>

                    <p className="mt-1 max-w-md text-sm text-[#69749a]">
                      {fetchError}
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        window.location.reload()
                      }
                      className="mt-5 rounded-xl bg-[#6734f2] px-5 py-2.5 text-sm font-medium text-white"
                    >
                      Retry
                    </button>
                  </div>
                ) : filteredPapers.length > 0 ? (
                  filteredPapers.map(
                    (paper, index) => (
                      <PaperRow
                        key={paper._id}
                        paper={paper}
                        last={
                          index ===
                          filteredPapers.length - 1
                        }
                        onView={handleView}
                        onDownload={
                          handleDownload
                        }
                        downloading={
                          downloadingId ===
                          paper._id
                        }
                      />
                    )
                  )
                ) : (
                  <div className="flex min-h-[280px] flex-col items-center justify-center px-5 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f0edff] text-[#6835f3]">
                      <FileText size={28} />
                    </div>

                    <h3 className="mt-4 text-lg font-medium text-[#172354]">
                      No papers found
                    </h3>

                    <p className="mt-1 max-w-md text-sm font-normal text-[#69749a]">
                      No PYQ has been uploaded for
                      the selected filters yet.
                    </p>

                    <button
                      type="button"
                      onClick={resetFilters}
                      className="mt-5 rounded-xl bg-[#6734f2] px-5 py-2.5 text-sm font-medium text-white"
                    >
                      Reset Filters
                    </button>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

/* =========================
   CATEGORY ICON
========================= */

const getCategoryIcon = (name) => {
  const value = String(name || "").toLowerCase();

  if (value.includes("upsc")) {
    return Landmark;
  }

  if (
    value.includes("jee") ||
    value.includes("engineering")
  ) {
    return Atom;
  }

  if (value.includes("neet")) {
    return Stethoscope;
  }

  if (value.includes("bank")) {
    return Building2;
  }

  if (value.includes("class")) {
    return GraduationCap;
  }

  if (value.includes("school")) {
    return GraduationCap;
  }

  return FileText;
};

/* =========================
   HERO FEATURE
========================= */

const HeroFeature = ({ icon: Icon, text }) => {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-[#e6e0fa] bg-white px-3.5 py-2.5 shadow-sm">
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#eee9ff] text-[#6734ef]">
        <Icon size={15} />
      </div>

      <span className="text-xs font-medium text-[#34406b] sm:text-sm">
        {text}
      </span>
    </div>
  );
};

/* =========================
   STAT CARD
========================= */

const StatCard = ({
  icon: Icon,
  value,
  label,
}) => {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[#e8e2ff] bg-white px-4 py-4 shadow-[0_8px_25px_rgba(91,33,182,0.05)]">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eee9ff] text-[#6734ef]">
        <Icon size={20} />
      </div>

      <div>
        <p className="text-lg font-medium text-[#172354]">
          {value}
        </p>

        <p className="text-xs font-normal text-[#737da0]">
          {label}
        </p>
      </div>
    </div>
  );
};

/* =========================
   MINI STAT
========================= */

const MiniStat = ({
  icon: Icon,
  value,
  label,
}) => {
  return (
    <div className="rounded-xl bg-[#faf9ff] px-2 py-2 text-center">
      <div className="mx-auto flex w-fit items-center gap-1 text-[#6734ef]">
        <Icon size={12} />

        <span className="text-xs font-medium">
          {value}
        </span>
      </div>

      <p className="mt-1 text-[9px] font-normal text-[#818bad]">
        {label}
      </p>
    </div>
  );
};

/* =========================
   QUESTION LINE
========================= */

const QuestionLine = ({ width }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="h-7 w-7 shrink-0 rounded-lg bg-[#eee9ff]" />

      <div className="flex-1">
        <div
          className="h-2 rounded-full bg-[#e9e4fb]"
          style={{ width }}
        />

        <div className="mt-2 h-1.5 w-[45%] rounded-full bg-[#f1eefb]" />
      </div>
    </div>
  );
};

/* =========================
   FILTER SELECT
========================= */

const FilterSelect = ({
  label,
  value,
  onChange,
  options,
}) => {
  return (
    <div className="mb-5">
      <label className="mb-2 block text-[13px] font-medium text-[#1a2757]">
        {label}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          className="h-11 w-full appearance-none rounded-xl border border-[#d9d4ee] bg-white px-3.5 pr-10 text-sm font-normal text-[#172354] outline-none transition focus:border-[#7040f4] focus:ring-4 focus:ring-[#7040f4]/10"
        >
          {options.length > 0 ? (
            options.map((option) => (
              <option
                key={option}
                value={option}
              >
                {option}
              </option>
            ))
          ) : (
            <option value={value}>
              {value}
            </option>
          )}
        </select>

        <ChevronDown
          size={17}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#59658c]"
        />
      </div>
    </div>
  );
};

/* =========================
   PAPER ROW
========================= */

const PaperRow = ({
  paper,
  last,
  onView,
  onDownload,
  downloading,
}) => {
  return (
    <div
      className={`group flex flex-col gap-4 bg-white p-4 transition hover:bg-[#fcfbff] sm:p-5 lg:flex-row lg:items-center lg:justify-between ${
        !last
          ? "border-b border-[#eeeaf8]"
          : ""
      }`}
    >
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#fff0f4] text-[#f02f61]">
          <FileText
            size={23}
            strokeWidth={2}
          />
        </div>

        <div className="min-w-0">
          <h3 className="text-[14px] font-medium text-[#111e4d] sm:text-[15px]">
            {paper.title}
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Tag type="purple">
              {paper.exam}
            </Tag>

            <Tag type="blue">
              {paper.stage}
            </Tag>

            <Tag type="green">
              {paper.subject}
            </Tag>

            <span className="flex items-center gap-1 text-[12px] font-normal text-[#65719a]">
              <CalendarDays size={14} />
              {paper.year}
            </span>

            <span className="flex items-center gap-1 text-[12px] font-normal text-[#65719a]">
              <Clock3 size={14} />
              {paper.questions}
            </span>

            <span className="flex items-center gap-1 text-[12px] font-normal text-[#65719a]">
              <FileText size={14} />
              PDF · {paper.size}
            </span>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 pl-[60px] lg:pl-0">
        <button
          type="button"
          onClick={() =>
            onView(paper)
          }
          className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[#f4f2ff] px-4 text-sm font-medium text-[#6734ef] transition hover:bg-[#eae6ff]"
        >
          <Eye size={17} />
          <span>View</span>
        </button>

        <button
          type="button"
          onClick={() =>
            onDownload(paper)
          }
          disabled={downloading}
          className="flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6431f1] to-[#7b35ed] px-4 text-sm font-medium text-white shadow-[0_6px_15px_rgba(100,49,241,0.2)] transition hover:-translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {downloading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              <span>Downloading...</span>
            </>
          ) : (
            <>
              <Download size={17} />
              <span>Download</span>
            </>
          )}
        </button>

        <button
          type="button"
          className="flex h-10 w-9 items-center justify-center rounded-xl text-[#59658c] transition hover:bg-[#f3f0ff] hover:text-[#6734ef]"
        >
          <MoreVertical size={19} />
        </button>
      </div>
    </div>
  );
};

/* =========================
   TAG
========================= */

const Tag = ({
  children,
  type,
}) => {
  const styles = {
    purple:
      "bg-[#eee9ff] text-[#6734ef]",

    blue:
      "bg-[#e8f1ff] text-[#2563eb]",

    green:
      "bg-[#dcf8e9] text-[#159447]",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
        styles[type] || styles.purple
      }`}
    >
      {children}
    </span>
  );
};

export default PYQ;
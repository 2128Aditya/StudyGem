import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  Clock3,
  FileText,
  Flag,
  RotateCcw,
  Square,
  X,
} from "lucide-react";
import Navbar from "../components/Navbar";

const formatTime = (seconds) => {
  const safe = Math.max(0, seconds);

  const hours = Math.floor(safe / 3600)
    .toString()
    .padStart(2, "0");

  const minutes = Math.floor((safe % 3600) / 60)
    .toString()
    .padStart(2, "0");

  const secs = (safe % 60).toString().padStart(2, "0");

  return {
    hours,
    minutes,
    secs,
  };
};

function MockTestInterface({
  testConfig,
  onLogout,
  onMockTests,
  onHome,
  onBack,
  onFinishTest,
}) {
  const count = Array.isArray(testConfig?.questions)
    ? testConfig.questions.length
    : Number(testConfig?.questionCount) || 0;

  // 1 Question = 1 Minute
  const totalTime = count * 60;

  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [marked, setMarked] = useState(new Set());
  const [visited, setVisited] = useState(() => new Set([0]));
  const [showEnd, setShowEnd] = useState(false);

  // Prevent multiple automatic submissions
  const submittedRef = useRef(false);

  const questions = useMemo(() => {
    if (!Array.isArray(testConfig?.questions)) {
      return [];
    }

    return testConfig.questions.map((item, index) => ({
      ...item,
      id: item.id || index + 1,
      topic: item.topic || testConfig?.topic || "General",
      options: Array.isArray(item.options) ? item.options : [],
      answer: Number.isInteger(item.answer)
        ? item.answer
        : Number.isInteger(item.correctAnswer)
          ? item.correctAnswer
          : -1,
    }));
  }, [testConfig]);

  const question = questions[current];

  const answeredCount = Object.keys(answers).length;

  const progress =
    count > 0 ? Math.round((answeredCount / count) * 100) : 0;

  const timer = formatTime(timeLeft);

  // Submit test
  const finishTest = () => {
    if (submittedRef.current) {
      return;
    }

    submittedRef.current = true;

    setShowEnd(false);

    onFinishTest?.({
      answers,
      marked: Array.from(marked),
      timeLeft: Math.max(0, timeLeft),
      questions,
      autoSubmitted: timeLeft <= 0,
    });
  };

  // Countdown Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      finishTest();
      return undefined;
    }

    const timerId = window.setInterval(() => {
      setTimeLeft((value) => {
        if (value <= 1) {
          window.clearInterval(timerId);
          return 0;
        }

        return value - 1;
      });
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [timeLeft]);

  // Automatically submit when timer reaches zero
  useEffect(() => {
    if (timeLeft === 0 && !submittedRef.current) {
      finishTest();
    }
  }, [timeLeft]);

  // Track visited questions
  useEffect(() => {
    setVisited((old) => new Set([...old, current]));
  }, [current]);

  const selectAnswer = (optionIndex) => {
    if (submittedRef.current || timeLeft <= 0) {
      return;
    }

    setAnswers((old) => ({
      ...old,
      [current]: optionIndex,
    }));
  };

  const goTo = (index) => {
    if (index < 0 || index >= count || submittedRef.current) {
      return;
    }

    setCurrent(index);
  };

  const clearAnswer = () => {
    if (submittedRef.current || timeLeft <= 0) {
      return;
    }

    setAnswers((old) => {
      const next = { ...old };
      delete next[current];
      return next;
    });
  };

  const toggleMark = () => {
    if (submittedRef.current || timeLeft <= 0) {
      return;
    }

    setMarked((old) => {
      const next = new Set(old);

      if (next.has(current)) {
        next.delete(current);
      } else {
        next.add(current);
      }

      return next;
    });
  };

  if (!question) {
    return (
      <div className="min-h-screen bg-slate-50 font-[Verdana,sans-serif] text-slate-900">
        <Navbar
          onLogout={onLogout}
          onMockTests={onMockTests}
          onHome={onHome}
        />

        <main className="mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-7xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-[0_10px_35px_rgba(15,23,42,0.06)] sm:p-10">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
              <FileText className="h-7 w-7" />
            </div>

            <h1 className="text-2xl font-normal tracking-tight text-slate-900 sm:text-3xl">
              No Questions Available
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm font-normal leading-6 text-slate-500">
              There are no questions available for this mock test right now.
            </p>

            <button
              type="button"
              onClick={onBack}
              className="mt-7 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-normal text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fc] font-[Verdana,sans-serif] text-slate-900">
      <Navbar
        onLogout={onLogout}
        onMockTests={onMockTests}
        onHome={onHome}
      />

      <main className="mx-auto w-full max-w-[1500px] px-4 pt-20 pb-5 sm:px-6 lg:px-8 lg:pt-20 lg:pb-6">
        <div className="mb-5 rounded-2xl border border-slate-200/90 bg-white px-5 py-4 shadow-[0_8px_30px_rgba(15,23,42,0.045)] sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-normal text-slate-500">
                <span className="rounded-lg bg-slate-100 px-2.5 py-1">
                  {testConfig.exam || "Mock Test"}
                </span>

                <span className="text-slate-300">/</span>

                <span>
                  {testConfig.subject || testConfig.topic || "General"}
                </span>
              </div>

              <h1 className="text-xl font-normal tracking-tight text-slate-900 sm:text-2xl">
                {testConfig.title ||
                  testConfig.name ||
                  `${testConfig.exam} Mock Test`}
              </h1>

              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-normal text-slate-500">
                <InfoChip icon={<FileText className="h-4 w-4" />}>
                  {count} Questions
                </InfoChip>

                <InfoChip icon={<Clock3 className="h-4 w-4" />}>
                  {count} min
                </InfoChip>

                <InfoChip icon={<Check className="h-4 w-4" />}>
                  {answeredCount} Answered
                </InfoChip>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onBack}
                disabled={submittedRef.current}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-normal text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>

              <button
                type="button"
                onClick={toggleMark}
                disabled={timeLeft <= 0}
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-normal transition ${
                  marked.has(current)
                    ? "border-amber-200 bg-amber-50 text-amber-700"
                    : "border-slate-200 bg-white text-slate-600 shadow-sm hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <Bookmark
                  className={`h-4 w-4 ${
                    marked.has(current) ? "fill-current" : ""
                  }`}
                />
                {marked.has(current) ? "Marked" : "Mark"}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_350px]">
          <section className="min-w-0">
            <div className="rounded-2xl border border-slate-200/90 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.045)]">
              <div className="border-b border-slate-100 px-5 py-4 sm:px-7">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-normal uppercase tracking-[0.08em] text-slate-400">
                      Question {current + 1} of {count}
                    </p>

                    <p className="mt-1 text-sm font-normal text-slate-500">
                      {question.topic || "General"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {marked.has(current) && (
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs font-normal text-amber-700">
                        <Bookmark className="h-3.5 w-3.5 fill-current" />
                        Marked
                      </span>
                    )}

                    {visited.has(current) && (
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-normal text-slate-500">
                        Visited
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="px-5 py-6 sm:px-7 sm:py-8">
                <div className="max-w-4xl">
                  <h2 className="text-[18px] font-normal leading-7 tracking-tight text-slate-900 sm:text-[20px] sm:leading-8">
                    {question.question || question.text || "Question"}
                  </h2>

                  {question.description && (
                    <p className="mt-3 text-sm font-normal leading-6 text-slate-500">
                      {question.description}
                    </p>
                  )}

                  <div className="mt-7 space-y-3">
                    {question.options.map((option, index) => {
                      const selected = answers[current] === index;

                      return (
                        <button
                          key={`${question.id}-${index}`}
                          type="button"
                          onClick={() => selectAnswer(index)}
                          disabled={timeLeft <= 0}
                          className={`flex w-full items-center gap-4 rounded-xl border px-4 py-4 text-left transition-all sm:px-5 sm:py-4 ${
                            selected
                              ? "border-violet-300 bg-violet-50/70 shadow-[0_4px_14px_rgba(124,58,237,0.08)]"
                              : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70"
                          } disabled:cursor-not-allowed disabled:opacity-70`}
                        >
                          <span
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base font-normal ${
                              selected
                                ? "bg-violet-600 text-white"
                                : "border border-slate-200 bg-slate-50 text-slate-600"
                            }`}
                          >
                            {String.fromCharCode(65 + index)}
                          </span>

                          <span
                            className={`text-[16px] font-normal leading-6 ${
                              selected
                                ? "text-violet-900"
                                : "text-slate-700"
                            }`}
                          >
                            {option}
                          </span>

                          {selected && (
                            <span className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white">
                              <Check className="h-3.5 w-3.5" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                <button
                  type="button"
                  onClick={clearAnswer}
                  disabled={
                    answers[current] === undefined || timeLeft <= 0
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-normal text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <RotateCcw className="h-4 w-4" />
                  Clear Answer
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => goTo(current - 1)}
                    disabled={current === 0 || timeLeft <= 0}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-normal text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </button>

                  <button
                    type="button"
                    onClick={() => goTo(current + 1)}
                    disabled={current === count - 1 || timeLeft <= 0}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-normal text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          <aside className="space-y-5 xl:sticky xl:top-[92px] xl:self-start">
            <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.045)]">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                    <Clock3 className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="text-base font-normal text-slate-900">
                      Time Left
                    </h2>

                    <p className="mt-0.5 text-xs font-normal text-slate-400">
                      Auto-submit when time ends
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`mt-5 rounded-xl border px-4 py-5 text-center ${
                  timeLeft <= 60
                    ? "border-red-200 bg-red-50"
                    : "border-slate-100 bg-slate-50/80"
                }`}
              >
                <div className="flex items-center justify-center gap-1.5 font-[Verdana,sans-serif]">
                  <span
                    className={`text-3xl font-normal tracking-wide ${
                      timeLeft <= 60
                        ? "text-red-600"
                        : "text-slate-900"
                    }`}
                  >
                    {timer.hours}
                  </span>

                  <span className="pb-1 text-xl font-normal text-slate-300">
                    :
                  </span>

                  <span
                    className={`text-3xl font-normal tracking-wide ${
                      timeLeft <= 60
                        ? "text-red-600"
                        : "text-slate-900"
                    }`}
                  >
                    {timer.minutes}
                  </span>

                  <span className="pb-1 text-xl font-normal text-slate-300">
                    :
                  </span>

                  <span
                    className={`text-3xl font-normal tracking-wide ${
                      timeLeft <= 60
                        ? "text-red-600"
                        : "text-slate-900"
                    }`}
                  >
                    {timer.secs}
                  </span>
                </div>

                <div className="mt-2 flex justify-center gap-7 text-[10px] font-normal uppercase tracking-[0.08em] text-slate-400">
                  <span>Hours</span>
                  <span>Minutes</span>
                  <span>Seconds</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowEnd(true)}
                disabled={timeLeft <= 0}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-normal text-red-600 transition hover:border-red-200 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Square className="h-4 w-4" />
                End Test
              </button>
            </section>

            <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.045)]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-normal text-slate-900">
                    Your Progress
                  </h2>

                  <p className="mt-1 text-xs font-normal text-slate-400">
                    Questions answered
                  </p>
                </div>

                <span className="rounded-lg bg-violet-50 px-2.5 py-1.5 text-sm font-normal text-violet-700">
                  {progress}%
                </span>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-violet-600 transition-all duration-300"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-xs font-normal text-slate-400">
                <span>{answeredCount} answered</span>
                <span>{count - answeredCount} remaining</span>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.045)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-normal text-slate-900">
                    Question Palette
                  </h2>

                  <p className="mt-1 text-xs font-normal text-slate-400">
                    Jump to any question
                  </p>
                </div>

                <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-normal text-slate-500">
                  {current + 1}/{count}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-5 gap-2">
                {questions.map((item, index) => {
                  const isCurrent = current === index;
                  const isAnswered = answers[index] !== undefined;
                  const isMarked = marked.has(index);
                  const isVisited = visited.has(index);

                  let paletteClass =
                    "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50";

                  if (isCurrent) {
                    paletteClass =
                      "border-violet-600 bg-violet-600 text-white shadow-sm";
                  } else if (isAnswered) {
                    paletteClass =
                      "border-emerald-200 bg-emerald-50 text-emerald-700";
                  } else if (isMarked) {
                    paletteClass =
                      "border-amber-200 bg-amber-50 text-amber-700";
                  } else if (isVisited) {
                    paletteClass =
                      "border-slate-200 bg-slate-100 text-slate-600";
                  }

                  return (
                    <button
                      key={item.id || index}
                      type="button"
                      onClick={() => goTo(index)}
                      disabled={timeLeft <= 0}
                      className={`relative flex h-10 items-center justify-center rounded-lg border text-sm font-normal transition ${paletteClass} disabled:cursor-not-allowed disabled:opacity-60`}
                    >
                      {index + 1}

                      {isMarked && !isCurrent && (
                        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-amber-500" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2.5">
                <Legend color="bg-violet-600" label="Current" />
                <Legend color="bg-emerald-500" label="Answered" />
                <Legend color="bg-slate-300" label="Visited" />
                <Legend color="bg-amber-400" label="Marked" />
              </div>
            </section>
          </aside>
        </div>
      </main>

      {showEnd && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-[2px]">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_25px_70px_rgba(15,23,42,0.18)] sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <Flag className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-normal text-slate-900">
                    End Test?
                  </h2>

                  <p className="mt-1.5 text-sm font-normal leading-6 text-slate-500">
                    Are you sure you want to end this test? Your current
                    answers will be submitted.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowEnd(false)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-normal text-slate-400">
                  Answered
                </p>

                <p className="mt-1 text-xl font-normal text-slate-900">
                  {answeredCount}
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-normal text-slate-400">
                  Remaining
                </p>

                <p className="mt-1 text-xl font-normal text-slate-900">
                  {count - answeredCount}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowEnd(false)}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-normal text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Continue Test
              </button>

              <button
                type="button"
                onClick={finishTest}
                className="inline-flex items-center justify-center rounded-xl bg-red-600 px-5 py-2.5 text-sm font-normal text-white shadow-sm transition hover:bg-red-700"
              >
                Submit Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoChip({ icon, children }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-normal text-slate-500">
      {icon}
      {children}
    </span>
  );
}

function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-2 text-xs font-normal text-slate-500">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      <span>{label}</span>
    </div>
  );
}

export default MockTestInterface;
import { useEffect, useMemo, useState } from "react";



import {

  ArrowLeft,

  ArrowRight,

  Bookmark,

  Check,

  Clock3,

  FileText,

  Flag,

  Pause,

  Play,

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



  const secs = (safe % 60)

    .toString()

    .padStart(2, "0");



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



  const totalTime =

    count >= 100

      ? 180 * 60

      : count >= 50

        ? 120 * 60

        : 60 * 60;



  const [timeLeft, setTimeLeft] = useState(totalTime);

  const [paused, setPaused] = useState(false);

  const [current, setCurrent] = useState(0);

  const [answers, setAnswers] = useState({});

  const [marked, setMarked] = useState(new Set());

  const [visited, setVisited] = useState(() => new Set([0]));

  const [showEnd, setShowEnd] = useState(false);



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

    count > 0

      ? Math.round((answeredCount / count) * 100)

      : 0;



  const timer = formatTime(timeLeft);



  useEffect(() => {

    if (paused || timeLeft <= 0) {

      return undefined;

    }



    const timerId = window.setInterval(() => {

      setTimeLeft((value) => Math.max(0, value - 1));

    }, 1000);



    return () => window.clearInterval(timerId);

  }, [paused, timeLeft]);



  useEffect(() => {

    setVisited((old) => new Set([...old, current]));

  }, [current]);



  const selectAnswer = (optionIndex) => {

    setAnswers((old) => ({

      ...old,

      [current]: optionIndex,

    }));

  };



  const goTo = (index) => {

    if (index < 0 || index >= count) {

      return;

    }



    setCurrent(index);

  };



  const clearAnswer = () => {

    setAnswers((old) => {

      const next = { ...old };



      delete next[current];



      return next;

    });

  };



  const toggleMark = () => {

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



  /*

   * Safety guard:

   * If AI questions are not available, don't crash the page.

   */

  const finishTest = () => {
    if (!onFinishTest) {
      console.error("onFinishTest prop is missing.");
      return;
    }

    onFinishTest({
      testConfig,
      questions,
      answers,
    });
  };

  if (!question) {

    return (

      <div className="min-h-screen w-full bg-[#f5f3ff] text-[#11183b]">

        <Navbar

          onLogout={onLogout}

          onMockTests={onMockTests}

          onHome={onHome}

          activePage="mock"

        />



        <main className="flex min-h-screen items-center justify-center px-4 pt-[88px]">

          <div className="w-full max-w-[500px] rounded-[25px] border border-white bg-white p-8 text-center shadow-[0_15px_50px_rgba(83,52,180,0.10)]">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eee7ff] text-[#6425ed]">

              <FileText size={32} />

            </div>



            <h1 className="mt-5 text-2xl font-black text-[#10163b]">

              No Questions Available

            </h1>



            <p className="mt-2 text-sm font-medium leading-6 text-[#697399]">

              The mock test questions could not be loaded.

              Please generate the mock test again.

            </p>



            <button

              type="button"

              onClick={() => onBack?.()}

              className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#6f22f4] to-[#5424e8] px-6 text-sm font-bold text-white shadow-[0_9px_22px_rgba(101,38,237,0.22)]"

            >

              <ArrowLeft size={18} />

              Back to Mock Tests

            </button>

          </div>

        </main>

      </div>

    );

  }



  return (

    <div className="min-h-screen w-full overflow-x-hidden bg-[#f5f3ff] text-[#11183b]">

      <Navbar

        onLogout={onLogout}

        onMockTests={onMockTests}

        onHome={onHome}

        activePage="mock"

      />



      <main className="min-h-screen bg-[radial-gradient(circle_at_10%_30%,rgba(128,89,255,0.10),transparent_28%),radial-gradient(circle_at_90%_80%,rgba(150,122,255,0.14),transparent_30%)] px-3 pb-6 pt-[88px] sm:px-5 lg:px-7 lg:pt-[96px]">

        <div className="mx-auto max-w-[1480px]">

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">

            <div className="min-w-0">

              <section className="relative overflow-hidden rounded-[25px] border border-white bg-white/90 px-5 py-5 shadow-[0_15px_50px_rgba(83,52,180,0.10)] backdrop-blur-xl sm:px-7 sm:py-6">

                <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex min-w-0 items-center gap-4">

                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#eee7ff] text-[#6425ed] sm:h-20 sm:w-20">

                      <FileText size={38} strokeWidth={1.8} />

                    </div>



                    <div className="min-w-0">

                      <h1 className="truncate text-2xl font-black tracking-[-0.03em] text-[#10163b] sm:text-[29px]">

                        {testConfig?.exam

                          ? `${testConfig.exam} Mock Test`

                          : "Full Syllabus Mock Test - 01"}

                      </h1>



                      <p className="mt-1 text-sm font-semibold text-[#697399]">

                        {testConfig?.exam || "UPSC Civil Services"}{" "}

                        ·{" "}

                        {testConfig?.subjects?.join(", ") ||

                          "General Studies"}

                      </p>



                      <div className="mt-4 flex flex-wrap gap-2">

                        <InfoChip>

                          {count} Questions

                        </InfoChip>



                        <InfoChip>

                          {Math.floor(totalTime / 60)} Minutes

                        </InfoChip>



                        <InfoChip>+4 Mark</InfoChip>



                        <InfoChip>-1 Mark</InfoChip>



                        <InfoChip>

                          Multiple Choice

                        </InfoChip>

                      </div>

                    </div>

                  </div>

                </div>

              </section>



              <section className="mt-5 rounded-[25px] border border-white bg-white/95 p-5 shadow-[0_15px_50px_rgba(83,52,180,0.10)] sm:p-8">

                <div className="flex flex-wrap items-center justify-between gap-3">

                  <div className="flex items-center gap-3">

                    <span className="text-sm font-bold text-[#667093]">

                      Question {current + 1} of {count}

                    </span>



                    <span className="rounded-full bg-[#eee7ff] px-3 py-1.5 text-[11px] font-bold text-[#6425ed]">

                      {question.topic}

                    </span>

                  </div>



                  <div className="flex items-center gap-3">

                    <button

                      type="button"

                      onClick={toggleMark}

                      className={`inline-flex items-center gap-1.5 text-sm font-semibold ${

                        marked.has(current)

                          ? "text-[#6425ed]"

                          : "text-[#697399]"

                      }`}

                    >

                      <Bookmark

                        size={18}

                        fill={

                          marked.has(current)

                            ? "currentColor"

                            : "none"

                        }

                      />



                      <span className="hidden sm:inline">

                        Bookmark

                      </span>

                    </button>



                    <button

                      type="button"

                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#697399]"

                    >

                      <Flag size={18} />



                      <span className="hidden sm:inline">

                        Report

                      </span>

                    </button>

                  </div>

                </div>



                <h2 className="mt-7 max-w-[980px] text-[20px] font-extrabold leading-[1.45] tracking-[-0.02em] text-[#10163b] sm:text-[25px]">

                  {question.question}

                </h2>



                <div className="mt-7 space-y-3.5">

                  {question.options.map((option, index) => {

                    const selected =

                      answers[current] === index;



                    const letter = String.fromCharCode(

                      65 + index

                    );



                    return (

                      <button

                        type="button"

                        key={`${question.id}-${index}`}

                        onClick={() => selectAnswer(index)}

                        className={`flex w-full items-center gap-4 rounded-2xl border px-4 py-4 text-left transition-all sm:px-5 sm:py-4 ${

                          selected

                            ? "border-[#6d28f0] bg-[#f2ebff] shadow-[0_7px_24px_rgba(109,40,240,0.10)]"

                            : "border-[#e0e3f1] bg-white hover:border-[#cfc3ff] hover:bg-[#fbfaff]"

                        }`}

                      >

                        <span

                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base font-extrabold ${

                            selected

                              ? "bg-[#6d28f0] text-white"

                              : "bg-[#e9ecf5] text-[#1e2545]"

                          }`}

                        >

                          {letter}

                        </span>



                        <span

                          className={`text-[16px] font-semibold ${

                            selected

                              ? "text-[#6425ed]"

                              : "text-[#1c2445]"

                          }`}

                        >

                          {option}

                        </span>



                        {selected && (

                          <Check

                            className="ml-auto text-[#6425ed]"

                            size={20}

                          />

                        )}

                      </button>

                    );

                  })}

                </div>



                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                  <button

                    type="button"

                    onClick={clearAnswer}

                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#e1e3f0] bg-white px-5 text-sm font-bold text-[#626b8b] transition hover:border-[#cfc3ff] hover:text-[#6425ed]"

                  >

                    <RotateCcw size={17} />

                    Clear Answer

                  </button>



                  <div className="flex gap-2 sm:gap-3">

<button

  type="button"

  onClick={() => {

    if (current === count - 1) {

      finishTest();

      return;

    }



    goTo(current + 1);

  }}

  className="inline-flex h-11 min-w-[132px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#6f22f4] to-[#5424e8] px-6 text-sm font-bold text-white shadow-[0_9px_22px_rgba(101,38,237,0.22)] transition hover:-translate-y-0.5"

>

  {current === count - 1 ? "Submit Test" : "Next"}



  {current === count - 1 ? (

    <Check size={18} />

  ) : (

    <ArrowRight size={18} />

  )}

</button>

                  </div>

                </div>

              </section>

            </div>



            <aside className="space-y-5 xl:sticky xl:top-[92px] xl:self-start">

              <section className="rounded-[25px] border border-white bg-white/95 p-5 shadow-[0_15px_50px_rgba(83,52,180,0.10)]">

                <div className="flex items-center justify-between gap-3">

                  <div className="flex items-center gap-3">

                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eee7ff] text-[#6425ed]">

                      <Clock3 size={22} />

                    </span>



                    <h2 className="text-[18px] font-extrabold">

                      Time Left

                    </h2>

                  </div>



                  <button

                    type="button"

                    onClick={() =>

                      setPaused((value) => !value)

                    }

                    className="inline-flex items-center gap-1.5 rounded-full border border-[#e5e5f1] bg-white px-3 py-2 text-xs font-bold text-[#5f6786]"

                  >

                    {paused ? (

                      <Play size={14} />

                    ) : (

                      <Pause size={14} />

                    )}



                    {paused ? "Resume" : "Pause"}

                  </button>

                </div>



                <div className="mt-5 flex items-center justify-between gap-3">

                  <div>

                    <div className="text-3xl font-black tracking-[0.06em] text-[#11183b] sm:text-[35px]">

                      {timer.hours} : {timer.minutes} :{" "}

                      {timer.secs}

                    </div>



                    <div className="mt-1 flex gap-6 pl-1 text-[9px] font-semibold uppercase tracking-wide text-[#747d9c]">

                      <span>Hours</span>

                      <span>Minutes</span>

                      <span>Seconds</span>

                    </div>

                  </div>



                  <button

                    type="button"

                    onClick={() => setShowEnd(true)}

                    className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#ffe9ef] px-4 text-sm font-bold text-[#e34c68]"

                  >

                    <Square size={15} fill="currentColor" />

                    End Test

                  </button>

                </div>



                <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#e9e5f7]">

                  <div

                    className="h-full rounded-full bg-gradient-to-r from-[#7625f4] to-[#5526eb] transition-all"

                    style={{

                      width: `${progress}%`,

                    }}

                  />

                </div>



                <div className="mt-2 flex justify-between text-xs font-bold text-[#687193]">

                  <span>

                    {answeredCount}/{count} answered

                  </span>



                  <span className="text-[#6425ed]">

                    {progress}%

                  </span>

                </div>

              </section>



              <section className="rounded-[25px] border border-white bg-white/95 p-5 shadow-[0_15px_50px_rgba(83,52,180,0.10)]">

                <h2 className="text-[18px] font-extrabold">

                  Question Palette

                </h2>



                <div className="mt-4 grid grid-cols-2 gap-2 text-[10px] font-semibold text-[#687193] sm:grid-cols-4 xl:grid-cols-2 2xl:grid-cols-4">

                  <Legend

                    color="bg-emerald-400"

                    label="Answered"

                  />



                  <Legend

                    color="bg-[#6d28f0]"

                    label="Current"

                  />



                  <Legend

                    color="bg-[#e8eaf2]"

                    label="Not Visited"

                  />



                  <Legend

                    color="bg-[#ff9eb8]"

                    label="Marked"

                  />

                </div>



                <div className="mt-5 grid grid-cols-10 gap-1.5 sm:gap-2">

                  {questions.map((item, index) => {

                    const isCurrent =

                      current === index;



                    const isAnswered =

                      Object.prototype.hasOwnProperty.call(

                        answers,

                        index

                      );



                    const isMarked =

                      marked.has(index);



                    const isVisited =

                      visited.has(index);



                    let tone =

                      "bg-[#eef0f6] text-[#222945]";



                    if (isMarked) {

                      tone =

                        "bg-[#ffb1c5] text-[#a43c59]";

                    } else if (isCurrent) {

                      tone =

                        "bg-[#6d28f0] text-white shadow-md";

                    } else if (isAnswered) {

                      tone =

                        "bg-[#c9f3df] text-[#176b4a]";

                    } else if (isVisited) {

                      tone =

                        "bg-[#f1f2f8] text-[#333a55]";

                    }



                    return (

                      <button

                        key={item.id}

                        type="button"

                        onClick={() => goTo(index)}

                        className={`aspect-square rounded-lg text-[10px] font-bold transition hover:scale-105 sm:text-[11px] ${tone}`}

                      >

                        {index + 1}

                      </button>

                    );

                  })}

                </div>

              </section>

            </aside>

          </div>

        </div>

      </main>



      {showEnd && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#11152f]/35 px-4 backdrop-blur-sm">

          <div className="w-full max-w-[420px] rounded-3xl bg-white p-6 shadow-2xl">

            <div className="flex items-start justify-between">

              <div>

                <h3 className="text-xl font-extrabold text-[#11183b]">

                  End Test?

                </h3>



                <p className="mt-2 text-sm leading-6 text-[#687193]">

                  Your current answers will be submitted and
                  your result will be calculated.

                </p>

              </div>



              <button

                type="button"

                onClick={() => setShowEnd(false)}

                className="rounded-full bg-[#f3f2f9] p-2 text-[#687193]"

              >

                <X size={18} />

              </button>

            </div>



            <div className="mt-6 flex gap-3">

              <button

                type="button"

                onClick={() => setShowEnd(false)}

                className="flex-1 rounded-xl border border-[#dedbea] py-3 text-sm font-bold text-[#5d6685]"

              >

                Continue Test

              </button>



              <button

                type="button"

                onClick={() => {
                  setShowEnd(false);
                  finishTest();
                }}
                className="flex-1 rounded-xl bg-gradient-to-r from-[#6f22f4] to-[#5424e8] py-3 text-sm font-bold text-white"
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



function InfoChip({ children }) {

  return (

    <span className="rounded-full bg-[#f5f3fc] px-3 py-2 text-[10px] font-bold text-[#687193] sm:text-[11px]">

      {children}

    </span>

  );

}



function Legend({ color, label }) {

  return (

    <span className="flex items-center gap-1.5">

      <span

        className={`h-3 w-3 rounded-[4px] ${color}`}

      />

      {label}

    </span>

  );

}



export default MockTestInterface;
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  MinusCircle,
  RotateCcw,
  Trophy,
  Target,
  Clock3,
} from "lucide-react";

function MockTestResult({
  testConfig,
  questions = [],
  answers = {},
  onBack,
  onRetake,
}) {
  const totalQuestions = questions.length;

  const attempted = Object.keys(answers).length;

  const correct = questions.filter((question, index) => {
    return (
      Object.prototype.hasOwnProperty.call(answers, index) &&
      answers[index] === question.answer
    );
  }).length;

  const wrong = questions.filter((question, index) => {
    return (
      Object.prototype.hasOwnProperty.call(answers, index) &&
      answers[index] !== question.answer
    );
  }).length;

  const skipped = totalQuestions - attempted;

  // +4 for correct, -1 for wrong
  const score = correct * 4 - wrong;

  const maxScore = totalQuestions * 4;

  const accuracy =
    attempted > 0
      ? Math.round((correct / attempted) * 100)
      : 0;

  const percentage =
    maxScore > 0
      ? Math.max(0, Math.round((score / maxScore) * 100))
      : 0;

  const getResultMessage = () => {
    if (accuracy >= 90) {
      return "Outstanding performance! 🔥";
    }

    if (accuracy >= 75) {
      return "Excellent work! Keep it up. 💪";
    }

    if (accuracy >= 60) {
      return "Good attempt! You can improve further. 👍";
    }

    if (accuracy >= 40) {
      return "Keep practicing. You're getting there! 📚";
    }

    return "Don't worry. Practice makes perfect! 🚀";
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#f6f3ff] text-[#11183b]">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-white/80 bg-white/90 px-3 py-3 shadow-[0_8px_30px_rgba(80,45,160,0.08)] backdrop-blur-xl sm:px-5 lg:px-7">
        <div className="mx-auto flex h-[64px] max-w-[1480px] items-center justify-between rounded-2xl">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eee7ff] text-[#6425ed]">
              <ArrowLeft size={20} />
            </div>

            <div className="text-left">
              <div className="text-[17px] font-extrabold text-[#171d38]">
                Study<span className="text-[#6d28f0]">Gem</span>
              </div>

              <div className="hidden text-[9px] font-medium text-[#858da5] sm:block">
                Mock Test Result
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={onBack}
            className="rounded-xl border border-[#e5def8] bg-white px-4 py-2 text-xs font-bold text-[#6425ed] transition hover:bg-[#f7f3ff]"
          >
            Back to Mock Tests
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1250px] px-4 pb-12 pt-7 sm:px-6 lg:px-8">
        {/* RESULT HERO */}
        <section className="overflow-hidden rounded-[30px] border border-white bg-white shadow-[0_20px_60px_rgba(83,52,180,0.10)]">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#f2ebff] via-white to-[#eef2ff] px-5 py-9 text-center sm:px-10 sm:py-12">
            <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-[#8b5cf6]/10 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[#4f46e5]/10 blur-3xl" />

            <div className="relative">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#7c3aed] to-[#4f46e5] text-white shadow-[0_15px_35px_rgba(109,40,240,0.28)]">
                <Trophy size={38} />
              </div>

              <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-[#7b819c]">
                Test Completed
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#10163b] sm:text-5xl">
                Your Result is Ready
              </h1>

              <p className="mx-auto mt-3 max-w-[650px] text-sm font-medium leading-6 text-[#697399]">
                {getResultMessage()}
              </p>

              <div className="mx-auto mt-7 flex h-[150px] w-[150px] flex-col items-center justify-center rounded-full border-[10px] border-[#e9ddff] bg-white shadow-[0_15px_40px_rgba(90,60,180,0.12)]">
                <span className="text-4xl font-black text-[#6425ed]">
                  {score}
                </span>

                <span className="mt-1 text-xs font-bold text-[#7a829e]">
                  out of {maxScore}
                </span>
              </div>

              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <span className="rounded-full bg-white px-4 py-2 text-xs font-bold text-[#59627c] shadow-sm">
                  {testConfig?.exam || "Mock Test"}
                </span>

                {testConfig?.difficulty && (
                  <span className="rounded-full bg-white px-4 py-2 text-xs font-bold text-[#59627c] shadow-sm">
                    {testConfig.difficulty}
                  </span>
                )}

                <span className="rounded-full bg-white px-4 py-2 text-xs font-bold text-[#59627c] shadow-sm">
                  {totalQuestions} Questions
                </span>
              </div>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 border-t border-[#eeeaf7] sm:grid-cols-4">
            <ResultStat
              icon={<CheckCircle2 size={22} />}
              title="Correct"
              value={correct}
              subtitle={`${totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0}%`}
              iconClass="bg-[#dff8eb] text-[#159765]"
            />

            <ResultStat
              icon={<XCircle size={22} />}
              title="Wrong"
              value={wrong}
              subtitle={`${totalQuestions > 0 ? Math.round((wrong / totalQuestions) * 100) : 0}%`}
              iconClass="bg-[#ffe5eb] text-[#e34c68]"
            />

            <ResultStat
              icon={<MinusCircle size={22} />}
              title="Skipped"
              value={skipped}
              subtitle={`${totalQuestions > 0 ? Math.round((skipped / totalQuestions) * 100) : 0}%`}
              iconClass="bg-[#eef0f6] text-[#697399]"
            />

            <ResultStat
              icon={<Target size={22} />}
              title="Accuracy"
              value={`${accuracy}%`}
              subtitle={`${attempted} attempted`}
              iconClass="bg-[#eee7ff] text-[#6425ed]"
            />
          </div>
        </section>

        {/* SUMMARY */}
        <section className="mt-6 rounded-[26px] border border-white bg-white p-5 shadow-[0_15px_50px_rgba(83,52,180,0.08)] sm:p-7">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-black text-[#10163b] sm:text-2xl">
                Performance Summary
              </h2>

              <p className="mt-1 text-sm font-medium text-[#697399]">
                Here's how you performed in this mock test.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onRetake}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6f22f4] to-[#5424e8] px-4 py-3 text-xs font-bold text-white shadow-[0_8px_20px_rgba(101,38,237,0.20)]"
              >
                <RotateCcw size={16} />
                Retake Test
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <SummaryCard
              title="Score"
              value={`${score}/${maxScore}`}
              icon={<Trophy size={20} />}
            />

            <SummaryCard
              title="Accuracy"
              value={`${accuracy}%`}
              icon={<Target size={20} />}
            />

            <SummaryCard
              title="Attempted"
              value={`${attempted}/${totalQuestions}`}
              icon={<Clock3 size={20} />}
            />
          </div>
        </section>

        {/* QUESTION REVIEW */}
        <section className="mt-6">
          <div className="mb-5">
            <h2 className="text-2xl font-black tracking-[-0.03em] text-[#10163b]">
              Question-wise Review
            </h2>

            <p className="mt-1 text-sm font-medium text-[#697399]">
              Review your answers and understand the explanation for
              each question.
            </p>
          </div>

          <div className="space-y-4">
            {questions.map((question, index) => {
              const attemptedQuestion =
                Object.prototype.hasOwnProperty.call(
                  answers,
                  index
                );

              const userAnswer = attemptedQuestion
                ? answers[index]
                : null;

              const isCorrect =
                attemptedQuestion &&
                userAnswer === question.answer;

              const isSkipped = !attemptedQuestion;

              return (
                <QuestionReview
                  key={question.id || index}
                  question={question}
                  index={index}
                  userAnswer={userAnswer}
                  isCorrect={isCorrect}
                  isSkipped={isSkipped}
                />
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

function ResultStat({
  icon,
  title,
  value,
  subtitle,
  iconClass,
}) {
  return (
    <div className="flex items-center gap-3 border-b border-[#eeeaf7] px-4 py-5 sm:border-b-0 sm:px-6">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
      >
        {icon}
      </div>

      <div>
        <p className="text-[11px] font-bold text-[#7a829d]">
          {title}
        </p>

        <div className="mt-0.5 flex items-baseline gap-2">
          <span className="text-xl font-black text-[#151c3c]">
            {value}
          </span>

          <span className="text-[10px] font-semibold text-[#8990a9]">
            {subtitle}
          </span>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  icon,
}) {
  return (
    <div className="rounded-2xl border border-[#ece9f7] bg-[#faf9ff] p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#707895]">
          {title}
        </span>

        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eee7ff] text-[#6425ed]">
          {icon}
        </span>
      </div>

      <p className="mt-4 text-2xl font-black text-[#10163b]">
        {value}
      </p>
    </div>
  );
}

function QuestionReview({
  question,
  index,
  userAnswer,
  isCorrect,
  isSkipped,
}) {
  const getOptionClass = (optionIndex) => {
    const isCorrectOption =
      optionIndex === question.answer;

    const isUserOption =
      optionIndex === userAnswer;

    if (isCorrectOption) {
      return "border-[#b7ebd2] bg-[#effcf5]";
    }

    if (isUserOption && !isCorrect) {
      return "border-[#ffc4cf] bg-[#fff3f5]";
    }

    return "border-[#e7e8f0] bg-white";
  };

  return (
    <article className="overflow-hidden rounded-[25px] border border-white bg-white shadow-[0_12px_40px_rgba(83,52,180,0.07)]">
      {/* QUESTION HEADER */}
      <div className="border-b border-[#eeeaf7] bg-[#faf9ff] px-5 py-4 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-lg bg-[#eee7ff] px-3 py-1.5 text-xs font-black text-[#6425ed]">
              Q{index + 1}
            </span>

            {question.topic && (
              <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-bold text-[#697399]">
                {question.topic}
              </span>
            )}
          </div>

          {isSkipped ? (
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#eef0f6] px-3 py-1.5 text-[10px] font-bold text-[#697399]">
              <MinusCircle size={14} />
              Skipped
            </span>
          ) : isCorrect ? (
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#dff8eb] px-3 py-1.5 text-[10px] font-bold text-[#159765]">
              <CheckCircle2 size={14} />
              Correct
            </span>
          ) : (
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#ffe5eb] px-3 py-1.5 text-[10px] font-bold text-[#e34c68]">
              <XCircle size={14} />
              Wrong
            </span>
          )}
        </div>
      </div>

      {/* QUESTION */}
      <div className="px-5 py-5 sm:px-6 sm:py-6">
        <h3 className="text-[17px] font-extrabold leading-7 text-[#11183b] sm:text-[19px]">
          {question.question}
        </h3>

        {/* OPTIONS */}
        <div className="mt-5 space-y-2.5">
          {question.options.map((option, optionIndex) => {
            const isCorrectOption =
              optionIndex === question.answer;

            const isUserOption =
              optionIndex === userAnswer;

            const letter = String.fromCharCode(
              65 + optionIndex
            );

            return (
              <div
                key={optionIndex}
                className={`flex items-start gap-3 rounded-xl border px-4 py-3.5 ${getOptionClass(
                  optionIndex
                )}`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                    isCorrectOption
                      ? "bg-[#19a974] text-white"
                      : isUserOption
                        ? "bg-[#e34c68] text-white"
                        : "bg-[#eef0f6] text-[#26304f]"
                  }`}
                >
                  {letter}
                </span>

                <div className="min-w-0 flex-1 pt-1">
                  <p
                    className={`text-sm font-semibold ${
                      isCorrectOption
                        ? "text-[#15734f]"
                        : isUserOption
                          ? "text-[#b63854]"
                          : "text-[#303853]"
                    }`}
                  >
                    {option}
                  </p>

                  <div className="mt-1 flex flex-wrap gap-2">
                    {isCorrectOption && (
                      <span className="text-[10px] font-bold text-[#159765]">
                        Correct Answer
                      </span>
                    )}

                    {isUserOption &&
                      !isCorrectOption && (
                        <span className="text-[10px] font-bold text-[#e34c68]">
                          Your Answer
                        </span>
                      )}
                  </div>
                </div>

                {isCorrectOption && (
                  <CheckCircle2
                    size={19}
                    className="mt-1 shrink-0 text-[#159765]"
                  />
                )}

                {isUserOption &&
                  !isCorrectOption && (
                    <XCircle
                      size={19}
                      className="mt-1 shrink-0 text-[#e34c68]"
                    />
                  )}
              </div>
            );
          })}
        </div>

        {/* EXPLANATION */}
        <div className="mt-5 rounded-2xl border border-[#ddd2ff] bg-[#f8f5ff] p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6d28f0] text-white">
              <Target size={16} />
            </div>

            <h4 className="text-sm font-extrabold text-[#4f20c7]">
              Explanation
            </h4>
          </div>

          <p className="mt-3 text-sm font-medium leading-6 text-[#59627c]">
            {question.explanation ||
              "Explanation is not available for this question."}
          </p>
        </div>
      </div>
    </article>
  );
}

export default MockTestResult;
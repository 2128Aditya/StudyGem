import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  ArrowUp,
  BookOpen,
  Bot,
  CalendarDays,
  Check,
  ChevronRight,
  Code2,
  FileText,
  History,
  Lightbulb,
  MessageCircle,
  MoreVertical,
  Paperclip,
  Plus,
  Send,
  Sparkles,
  X,
  Zap,
} from "lucide-react";

import Navbar from "../components/Navbar";

/* =========================================================
   STARTER PROMPTS
========================================================= */

const starterPrompts = [
  {
    icon: <Lightbulb size={17} />,
    title: "Instant Doubt Solving",
    text: "Get clear explanations for any topic or question.",
    className: "bg-[#f0eaff] text-[#6425ed]",
  },

  {
    icon: <BookOpen size={17} />,
    title: "Study Plans",
    text: "Get personalized study plans and roadmaps.",
    className: "bg-[#e6faef] text-[#16a36a]",
  },

  {
    icon: <FileText size={17} />,
    title: "Summaries & Notes",
    text: "Generate short notes and key points.",
    className: "bg-[#ffeaf1] text-[#ed3f72]",
  },

  {
    icon: <Sparkles size={17} />,
    title: "Practice Questions",
    text: "Get MCQs, coding questions and mock tests.",
    className: "bg-[#fff0df] text-[#f28a19]",
  },
];

/* =========================================================
   EXAMPLE QUESTIONS
========================================================= */

const examples = [
  "Explain what is Operating System",
  "Give me DSA study plan for 30 days",
  "Solve this question: Two Sum",
  "Summarize DBMS in short notes",
  "Create a roadmap for Web Development",
  "Generate 10 MCQs on Networking",
];

/* =========================================================
   GET LOGGED IN USER
========================================================= */

const getLoggedInUserName = () => {
  try {
    const storedUser =
      localStorage.getItem("studyGemUser");

    if (!storedUser) {
      return "there";
    }

    const user = JSON.parse(storedUser);

    const possibleName =
      user?.name ||
      user?.fullName ||
      user?.username ||
      user?.firstName ||
      user?.studentName;

    if (
      typeof possibleName === "string" &&
      possibleName.trim()
    ) {
      return possibleName.trim();
    }

    if (
      typeof user?.email === "string" &&
      user.email.includes("@")
    ) {
      return user.email
        .split("@")[0]
        .replace(/[._-]+/g, " ")
        .replace(/\b\w/g, (letter) =>
          letter.toUpperCase()
        );
    }

    return "there";
  } catch (error) {
    console.error(
      "StudyGem User Parse Error:",
      error
    );

    return "there";
  }
};

/* =========================================================
   CREATE WELCOME MESSAGE
========================================================= */

const createWelcomeMessage = () => {
  const name = getLoggedInUserName();

  return {
    id: `welcome-${Date.now()}`,
    role: "assistant",
    type: "welcome",
    content: `👋 Hello ${name}!

I’m your StudyGem AI Assistant. I’m ready to help you with your studies, doubts, coding questions, study plans, notes and much more.`,
    bullets: [
      "Solving doubts and explaining concepts",
      "Creating study plans and roadmaps",
      "Generating notes and summaries",
      "Solving MCQs, coding and subjective questions",
      "Mock test preparation",
      "Interview and placement preparation",
    ],
  };
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

function AIAssistant({
  onBack,
  onLogout,
  onHome,
  onMockTests,
  onAI,
  onProfile,
  onRoadmaps,
  onTarget,
  onPYQ,
  onLeaderboard,
  onNotes,
}) {
  const [messages, setMessages] = useState(() => [
    createWelcomeMessage(),
  ]);

  const [input, setInput] = useState("");

  const [mobileInfoOpen, setMobileInfoOpen] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(false);

  const messagesContainerRef =
    useRef(null);

  const textareaRef = useRef(null);

  /* =======================================================
     API BASE URL
  ======================================================= */

  const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "https://studygem-your-knowledge-your-growth.onrender.com/api";

  /* =======================================================
     CAN SEND
  ======================================================= */

  const canSend =
    input.trim().length > 0 && !isLoading;

  /* =======================================================
     USER MESSAGE COUNT
  ======================================================= */

  const chatCount = useMemo(
    () =>
      messages.filter(
        (item) => item.role === "user"
      ).length,
    [messages]
  );

  /* =======================================================
     SCROLL ONLY CHAT AREA
  ======================================================= */

  useEffect(() => {
    const container =
      messagesContainerRef.current;

    if (!container) {
      return;
    }

    requestAnimationFrame(() => {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    });
  }, [messages, isLoading]);

  /* =======================================================
     SEND MESSAGE
  ======================================================= */

  const sendMessage = async (value = input) => {
    const text = value.trim();

    if (!text || isLoading) {
      return;
    }

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
    };

    /*
      IMPORTANT:
      Backend ko current user message ke bina
      previous conversation bhejenge.
    */

    const previousConversation =
      messages
        .filter(
          (item) =>
            (item.role === "user" ||
              item.role === "assistant") &&
            typeof item.content === "string"
        )
        .map((item) => ({
          role: item.role,
          content: item.content,
        }))
        .slice(-10);

    setMessages((current) => [
      ...current,
      userMessage,
    ]);

    setInput("");

    setIsLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/ai/chat`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            message: text,
            conversation:
              previousConversation,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data?.message ||
            "Failed to get AI response."
        );
      }

      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content:
          data.message ||
          "I couldn't generate a response.",
      };

      setMessages((current) => [
        ...current,
        assistantMessage,
      ]);
    } catch (error) {
      console.error(
        "AI Chat Error:",
        error
      );

      setMessages((current) => [
        ...current,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          type: "error",
          content:
            "Sorry, I couldn't connect to StudyGem AI right now. Please check your backend and AI configuration and try again.",
        },
      ]);
    } finally {
      setIsLoading(false);

      requestAnimationFrame(() => {
        textareaRef.current?.focus();
      });
    }
  };

  /* =======================================================
     NEW CHAT
  ======================================================= */

  const newChat = () => {
    setMessages([createWelcomeMessage()]);
    setInput("");
    setIsLoading(false);

    requestAnimationFrame(() => {
      messagesContainerRef.current?.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      textareaRef.current?.focus();
    });
  };

  /* =======================================================
     HANDLE KEY DOWN
  ======================================================= */

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      sendMessage();
    }
  };

  /* =======================================================
     QUICK EXAMPLE
  ======================================================= */

  const handleExampleClick = (example) => {
    setInput(example);

    requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });
  };

  /* =======================================================
     QUICK ACTION
  ======================================================= */

  const handleQuickAction = (action) => {
    if (action === "Browse Notes") {
      setInput(
        "Help me make short notes for my current subject."
      );
    }

    if (action === "Solve Question") {
      setInput(
        "Help me solve this question step by step."
      );
    }

    if (action === "Create Plan") {
      setInput(
        "Create a practical study plan for me."
      );
    }

    requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      className="h-screen w-full overflow-hidden bg-[#f7f5ff] text-[#10163b]"
      style={{
        backgroundImage: "url('/ai.png')",
        backgroundSize: "cover",
        backgroundPosition: "center top",
      }}
    >
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
  onTarget={onTarget}
  onPYQ={onPYQ}
  onLeaderboard={onLeaderboard}
  onNotes={onNotes}
        activePage="ai"
      />

      {/* ===================================================
          MAIN VIEWPORT
      =================================================== */}

      <main className="h-full w-full overflow-hidden px-3 pb-3 pt-[82px] sm:px-5 sm:pt-[88px] lg:px-7 lg:pt-[94px]">
        <div className="mx-auto h-full w-full max-w-[1600px]">
          <div className="grid h-full min-h-0 gap-5 xl:grid-cols-[0.82fr_1.35fr]">

            {/* =================================================
                LEFT INTRO
            ================================================= */}

            <section className="hidden min-h-0 flex-col justify-between overflow-hidden py-3 lg:flex xl:py-5">

              <div className="max-w-[610px]">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#e8ddff]/90 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#6425ed] shadow-sm backdrop-blur">
                  <Sparkles size={13} />
                  AI Powered Learning
                </span>

                <h1 className="mt-4 text-[38px] font-black leading-[1.03] tracking-[-0.045em] text-[#111744] xl:text-[52px] 2xl:text-[56px]">
                  Your Personal

                  <span className="block bg-gradient-to-r from-[#6d28d9] via-[#6425ed] to-[#4f46e5] bg-clip-text text-transparent">
                    AI Study Assistant
                  </span>
                </h1>

                <p className="mt-4 max-w-[560px] text-sm font-medium leading-6 text-[#4d5883] xl:text-base">
                  Ask doubts, get explanations,
                  solve questions, create study
                  plans, summarize topics and much
                  more.
                </p>
              </div>

              {/* ===============================================
                  FEATURE CARDS
              =============================================== */}

              <div className="mt-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  {starterPrompts.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-white/90 bg-white/90 p-4 shadow-[0_12px_30px_rgba(83,52,180,0.08)] backdrop-blur-md"
                    >
                      <div className="flex items-start gap-3">

                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.className}`}
                        >
                          {item.icon}
                        </span>

                        <div>
                          <h3 className="text-xs font-black text-[#1e274a] sm:text-sm">
                            {item.title}
                          </h3>

                          <p className="mt-1 text-[10px] font-medium leading-4 text-[#7b84a3] sm:text-[11px]">
                            {item.text}
                          </p>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>

                {/* =============================================
                    EXAMPLES
                ============================================= */}

                <div className="mt-4 rounded-[22px] border border-white/90 bg-white/90 p-4 shadow-[0_12px_35px_rgba(83,52,180,0.08)] backdrop-blur-md">

                  <div className="flex items-center gap-2 text-[#6425ed]">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eee7ff]">
                      <Zap size={16} />
                    </span>

                    <h3 className="text-xs font-black sm:text-sm">
                      Try these examples
                    </h3>
                  </div>

                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {examples.map((example) => (
                      <button
                        key={example}
                        type="button"
                        onClick={() =>
                          handleExampleClick(
                            example
                          )
                        }
                        className="group flex min-h-10 items-center justify-between rounded-xl border border-[#e9e3ff] bg-[#faf9ff] px-3 text-left text-[10px] font-semibold text-[#273158] transition hover:border-[#cdbdff] hover:bg-[#f4efff] sm:text-[11px]"
                      >
                        <span className="pr-2">
                          {example}
                        </span>

                        <ArrowUp
                          size={14}
                          className="shrink-0 rotate-45 text-[#6425ed] transition group-hover:translate-x-0.5"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* =================================================
                CHAT PANEL
            ================================================= */}

            <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-[24px] border border-white/90 bg-white/95 shadow-[0_20px_65px_rgba(65,40,155,0.13)] backdrop-blur-2xl sm:rounded-[28px]">

              {/* ===============================================
                  CHAT HEADER
              =============================================== */}

              <div className="flex shrink-0 items-center justify-between border-b border-[#ece9f7] px-4 py-3.5 sm:px-5 sm:py-4 lg:px-6">

                <div className="flex min-w-0 items-center gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#eee7ff] to-[#e1d7ff] text-[#6425ed] sm:h-11 sm:w-11">
                    <Bot size={23} />
                  </div>

                  <div className="min-w-0">
                    <h2 className="truncate text-base font-black text-[#10163b] sm:text-lg">
                      StudyGem AI
                    </h2>

                    <p className="mt-0.5 flex items-center gap-1.5 text-[10px] font-medium text-[#68739a] sm:text-xs">
                      <span className="h-2 w-2 rounded-full bg-[#20b77a]" />

                      Online

                      <span>•</span>

                      Your Personal Learning Assistant
                    </p>
                  </div>

                </div>

                {/* =============================================
                    HEADER BUTTONS
                ============================================= */}

                <div className="flex items-center gap-2">

                  <button
                    type="button"
                    onClick={newChat}
                    className="hidden items-center gap-2 rounded-xl border border-[#ddd5ff] bg-white px-3 py-2 text-xs font-bold text-[#6425ed] transition hover:bg-[#f7f3ff] sm:flex"
                  >
                    <Plus size={15} />
                    New Chat
                  </button>

                  <button
                    type="button"
                    className="hidden items-center gap-2 rounded-xl border border-[#e4e0f3] bg-white px-3 py-2 text-xs font-bold text-[#343c5d] transition hover:bg-[#faf9ff] md:flex"
                  >
                    <History size={15} />
                    Chat History
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setMobileInfoOpen(
                        (value) => !value
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f1ff] text-[#6425ed] transition hover:bg-[#eee7ff] sm:h-10 sm:w-10"
                  >
                    {mobileInfoOpen ? (
                      <X size={18} />
                    ) : (
                      <MoreVertical size={18} />
                    )}
                  </button>

                </div>
              </div>

              {/* ===============================================
                  MOBILE INFO
              =============================================== */}

              {mobileInfoOpen && (
                <div className="shrink-0 border-b border-[#ece9f7] bg-[#faf9ff] px-4 py-3 sm:hidden">

                  <div className="grid grid-cols-2 gap-2">

                    <button
                      type="button"
                      onClick={() => {
                        newChat();
                        setMobileInfoOpen(
                          false
                        );
                      }}
                      className="flex items-center justify-center gap-2 rounded-xl border border-[#e2d9ff] bg-white py-2.5 text-xs font-bold text-[#6425ed]"
                    >
                      <Plus size={15} />
                      New Chat
                    </button>

                    <button
                      type="button"
                      className="flex items-center justify-center gap-2 rounded-xl border border-[#e4e0f3] bg-white py-2.5 text-xs font-bold text-[#343c5d]"
                    >
                      <History size={15} />
                      History
                    </button>

                  </div>
                </div>
              )}

              {/* ===============================================
                  MESSAGES CONTAINER

                  IMPORTANT:
                  ONLY THIS AREA SCROLLS.
              =============================================== */}

              <div
                ref={messagesContainerRef}
                className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4 scroll-smooth sm:px-5 sm:py-5 lg:px-6"
              >

                <div className="mx-auto flex w-full max-w-[900px] flex-col gap-5">

                  {messages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                    />
                  ))}

                  {/* =============================================
                      AI TYPING
                  ============================================= */}

                  {isLoading && (
                    <TypingIndicator />
                  )}

                  {/* =============================================
                      CHAT COUNT
                  ============================================= */}

                  {chatCount > 0 && (
                    <div className="flex justify-center pt-1">
                      <span className="rounded-full bg-[#f4f0ff] px-3 py-1 text-[9px] font-bold text-[#7b6aaf]">
                        {chatCount} message
                        {chatCount > 1
                          ? "s"
                          : ""}{" "}
                        in this chat
                      </span>
                    </div>
                  )}

                </div>
              </div>

              {/* ===============================================
                  INPUT AREA

                  IMPORTANT:
                  SHRINK-0 = always stays at bottom
              =============================================== */}

              <div className="shrink-0 border-t border-[#eeeaf7] bg-white/95 p-3 sm:p-4 lg:p-5">

                <div className="mx-auto max-w-[900px]">

                  <div className="rounded-2xl border border-[#ddd6f4] bg-white shadow-[0_8px_30px_rgba(83,52,180,0.06)] transition focus-within:border-[#bca9ff] focus-within:ring-4 focus-within:ring-[#eee8ff]">

                    <div className="flex items-end gap-2 p-2">

                      {/* =========================================
                          ATTACHMENT
                      ========================================= */}

                      <button
                        type="button"
                        className="mb-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[#68739a] transition hover:bg-[#f5f2ff] hover:text-[#6425ed]"
                      >
                        <Paperclip size={18} />
                      </button>

                      {/* =========================================
                          TEXT INPUT
                      ========================================= */}

                      <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(event) =>
                          setInput(
                            event.target.value
                          )
                        }
                        onKeyDown={
                          handleKeyDown
                        }
                        rows={2}
                        disabled={isLoading}
                        placeholder="Type your question here..."
                        className="min-h-[48px] flex-1 resize-none bg-transparent px-1 py-2 text-sm font-medium text-[#202744] outline-none placeholder:text-[#a0a6ba] disabled:cursor-not-allowed disabled:opacity-60"
                      />

                      {/* =========================================
                          SEND BUTTON
                      ========================================= */}

                      <button
                        type="button"
                        disabled={!canSend}
                        onClick={() =>
                          sendMessage()
                        }
                        className="mb-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#7625f5] to-[#5424e8] text-white shadow-[0_8px_20px_rgba(101,38,237,0.2)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Send size={18} />
                      </button>

                    </div>

                    {/* =========================================
                        QUICK ACTIONS
                    ========================================= */}

                    <div className="flex flex-wrap items-center gap-1 px-3 pb-3 pt-0.5">

                      <QuickAction
                        icon={
                          <BookOpen
                            size={14}
                          />
                        }
                        label="Browse Notes"
                        onClick={() =>
                          handleQuickAction(
                            "Browse Notes"
                          )
                        }
                      />

                      <QuickAction
                        icon={
                          <Code2 size={14} />
                        }
                        label="Solve Question"
                        onClick={() =>
                          handleQuickAction(
                            "Solve Question"
                          )
                        }
                      />

                      <QuickAction
                        icon={
                          <CalendarDays
                            size={14}
                          />
                        }
                        label="Create Plan"
                        onClick={() =>
                          handleQuickAction(
                            "Create Plan"
                          )
                        }
                      />

                    </div>
                  </div>

                  <p className="mt-2 text-center text-[9px] font-medium text-[#9aa0b4]">
                    StudyGem AI can make
                    mistakes. Verify important
                    information.
                  </p>

                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   MESSAGE BUBBLE
========================================================= */

function MessageBubble({ message }) {
  /* =======================================================
     USER MESSAGE
  ======================================================= */

  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="flex max-w-[92%] items-end gap-2 sm:max-w-[78%]">

          <div className="rounded-2xl rounded-br-md bg-gradient-to-r from-[#7028ef] to-[#5b21eb] px-4 py-3 text-sm font-medium leading-6 text-white shadow-[0_8px_22px_rgba(101,38,237,0.18)]">
            <p className="whitespace-pre-wrap break-words">
              {message.content}
            </p>
          </div>

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eee7ff] text-[#6425ed]">
            <MessageCircle size={17} />
          </div>

        </div>
      </div>
    );
  }

  /* =======================================================
     ASSISTANT MESSAGE
  ======================================================= */

  return (
    <div className="flex items-start gap-2 sm:gap-3">

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f0eaff] text-[#6425ed] sm:h-10 sm:w-10">
        <Bot size={20} />
      </div>

      <div className="min-w-0 max-w-[96%] rounded-2xl rounded-tl-md bg-gradient-to-br from-[#f4f1ff] to-[#f8f7ff] px-4 py-3 text-sm leading-6 text-[#17204b] sm:max-w-[92%] sm:px-5">

        {/* ===============================================
            WELCOME MESSAGE
        =============================================== */}

        {message.type === "welcome" && (
          <>
            <p className="whitespace-pre-line font-medium">
              {message.content}
            </p>

            <ul className="mt-2 space-y-0.5 pl-4 font-medium">
              {message.bullets?.map(
                (bullet) => (
                  <li
                    key={bullet}
                    className="list-disc"
                  >
                    {bullet}
                  </li>
                )
              )}
            </ul>
          </>
        )}

        {/* ===============================================
            ERROR MESSAGE
        =============================================== */}

        {message.type === "error" && (
          <div>
            <div className="flex items-center gap-2 font-black text-[#c0395a]">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ffe8ef]">
                !
              </span>

              Something went wrong
            </div>

            <p className="mt-2">
              {message.content}
            </p>
          </div>
        )}

        {/* ===============================================
            NORMAL AI RESPONSE

            Markdown is converted into structured UI.
        =============================================== */}

        {!message.type && (
          <MarkdownContent
            content={message.content}
          />
        )}

      </div>
    </div>
  );
}

/* =========================================================
   TYPING INDICATOR
========================================================= */

function TypingIndicator() {
  return (
    <div className="flex items-start gap-2 sm:gap-3">

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f0eaff] text-[#6425ed] sm:h-10 sm:w-10">
        <Bot size={20} />
      </div>

      <div className="rounded-2xl rounded-tl-md bg-gradient-to-br from-[#f4f1ff] to-[#f8f7ff] px-5 py-4">

        <div className="flex items-center gap-1.5">

          <span className="h-2 w-2 animate-bounce rounded-full bg-[#7c3aed]" />

          <span
            className="h-2 w-2 animate-bounce rounded-full bg-[#7c3aed]"
            style={{
              animationDelay: "120ms",
            }}
          />

          <span
            className="h-2 w-2 animate-bounce rounded-full bg-[#7c3aed]"
            style={{
              animationDelay: "240ms",
            }}
          />

        </div>

      </div>
    </div>
  );
}

/* =========================================================
   MARKDOWN CONTENT

   Converts common AI markdown into a clean UI.

   Supported:
   - # Heading
   - ## Heading
   - ### Heading
   - **bold**
   - *italic*
   - bullets
   - numbered lists
   - blockquotes
   - code blocks
   - inline code
   - markdown tables
   - horizontal separators
========================================================= */

function MarkdownContent({ content }) {
  if (
    typeof content !== "string" ||
    !content.trim()
  ) {
    return null;
  }

  const normalized = content
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim();

  const lines = normalized.split("\n");

  const blocks = [];

  let index = 0;

  while (index < lines.length) {
    const rawLine = lines[index];

    const line = rawLine.trim();

    /* ================================================
       EMPTY LINE
    ================================================ */

    if (!line) {
      index += 1;
      continue;
    }

    /* ================================================
       CODE BLOCK
    ================================================ */

    if (
      line.startsWith("```")
    ) {
      const language =
        line
          .replace("```", "")
          .trim() || "code";

      const codeLines = [];

      index += 1;

      while (
        index < lines.length &&
        !lines[index]
          .trim()
          .startsWith("```")
      ) {
        codeLines.push(lines[index]);
        index += 1;
      }

      if (
        index < lines.length &&
        lines[index]
          .trim()
          .startsWith("```")
      ) {
        index += 1;
      }

      blocks.push({
        type: "code",
        language,
        content: codeLines.join(
          "\n"
        ),
      });

      continue;
    }

    /* ================================================
       TABLE
    ================================================ */

    if (
      lines[index + 1] &&
      isMarkdownTableSeparator(
        lines[index + 1]
      ) &&
      line.includes("|")
    ) {
      const tableLines = [];

      tableLines.push(line);

      index += 1;

      tableLines.push(
        lines[index].trim()
      );

      index += 1;

      while (
        index < lines.length &&
        lines[index].trim() &&
        lines[index].includes("|")
      ) {
        tableLines.push(
          lines[index].trim()
        );

        index += 1;
      }

      blocks.push({
        type: "table",
        rows: tableLines,
      });

      continue;
    }

    /* ================================================
       H1
    ================================================ */

    if (line.startsWith("# ")) {
      blocks.push({
        type: "h1",
        content: line
          .replace(/^#\s+/, "")
          .trim(),
      });

      index += 1;
      continue;
    }

    /* ================================================
       H2
    ================================================ */

    if (line.startsWith("## ")) {
      blocks.push({
        type: "h2",
        content: line
          .replace(/^##\s+/, "")
          .trim(),
      });

      index += 1;
      continue;
    }

    /* ================================================
       H3
    ================================================ */

    if (line.startsWith("### ")) {
      blocks.push({
        type: "h3",
        content: line
          .replace(/^###\s+/, "")
          .trim(),
      });

      index += 1;
      continue;
    }

    /* ================================================
       H4
    ================================================ */

    if (line.startsWith("#### ")) {
      blocks.push({
        type: "h4",
        content: line
          .replace(/^####\s+/, "")
          .trim(),
      });

      index += 1;
      continue;
    }

    /* ================================================
       HORIZONTAL RULE
    ================================================ */

    if (
      line === "---" ||
      line === "***" ||
      line === "___"
    ) {
      blocks.push({
        type: "hr",
      });

      index += 1;
      continue;
    }

    /* ================================================
       BULLET LIST
    ================================================ */

    if (
      /^[-*+]\s+/.test(line)
    ) {
      const items = [];

      while (
        index < lines.length &&
        /^[-*+]\s+/.test(
          lines[index].trim()
        )
      ) {
        items.push(
          lines[index]
            .trim()
            .replace(
              /^[-*+]\s+/,
              ""
            )
        );

        index += 1;
      }

      blocks.push({
        type: "ul",
        items,
      });

      continue;
    }

    /* ================================================
       NUMBERED LIST
    ================================================ */

    if (
      /^\d+\.\s+/.test(line)
    ) {
      const items = [];

      while (
        index < lines.length &&
        /^\d+\.\s+/.test(
          lines[index].trim()
        )
      ) {
        items.push(
          lines[index]
            .trim()
            .replace(
              /^\d+\.\s+/,
              ""
            )
        );

        index += 1;
      }

      blocks.push({
        type: "ol",
        items,
      });

      continue;
    }

    /* ================================================
       BLOCKQUOTE
    ================================================ */

    if (line.startsWith(">")) {
      const quoteLines = [];

      while (
        index < lines.length &&
        lines[index]
          .trim()
          .startsWith(">")
      ) {
        quoteLines.push(
          lines[index]
            .trim()
            .replace(/^>\s?/, "")
        );

        index += 1;
      }

      blocks.push({
        type: "quote",
        content:
          quoteLines.join(" "),
      });

      continue;
    }

    /* ================================================
       NORMAL PARAGRAPH

       Collect consecutive lines into
       one paragraph.
    ================================================ */

    const paragraphLines = [];

    while (index < lines.length) {
      const current =
        lines[index].trim();

      if (!current) {
        break;
      }

      if (
        current.startsWith("# ") ||
        current.startsWith("## ") ||
        current.startsWith("### ") ||
        current.startsWith("#### ") ||
        /^[-*+]\s+/.test(current) ||
        /^\d+\.\s+/.test(current) ||
        current.startsWith(">") ||
        current.startsWith("```") ||
        current === "---" ||
        current === "***" ||
        current === "___"
      ) {
        break;
      }

      if (
        index + 1 < lines.length &&
        isMarkdownTableSeparator(
          lines[index + 1]
        ) &&
        current.includes("|")
      ) {
        break;
      }

      paragraphLines.push(current);

      index += 1;
    }

    if (paragraphLines.length > 0) {
      blocks.push({
        type: "paragraph",
        content:
          paragraphLines.join(" "),
      });
    }
  }

  return (
    <div className="w-full space-y-4">
      {blocks.map((block, blockIndex) => {
        if (block.type === "h1") {
          return (
            <h1
              key={blockIndex}
              className="text-xl font-black leading-tight text-[#11183b] sm:text-2xl"
            >
              {renderInlineMarkdown(
                block.content
              )}
            </h1>
          );
        }

        if (block.type === "h2") {
          return (
            <div
              key={blockIndex}
              className="pt-1"
            >
              <h2 className="text-lg font-black leading-tight text-[#171f49] sm:text-xl">
                {renderInlineMarkdown(
                  block.content
                )}
              </h2>

              <div className="mt-2 h-1 w-10 rounded-full bg-[#7c3aed]" />
            </div>
          );
        }

        if (block.type === "h3") {
          return (
            <h3
              key={blockIndex}
              className="text-base font-black leading-tight text-[#202851] sm:text-lg"
            >
              {renderInlineMarkdown(
                block.content
              )}
            </h3>
          );
        }

        if (block.type === "h4") {
          return (
            <h4
              key={blockIndex}
              className="text-sm font-black text-[#252d55] sm:text-base"
            >
              {renderInlineMarkdown(
                block.content
              )}
            </h4>
          );
        }

        if (block.type === "paragraph") {
          return (
            <p
              key={blockIndex}
              className="text-sm font-medium leading-7 text-[#273158] sm:text-[15px]"
            >
              {renderInlineMarkdown(
                block.content
              )}
            </p>
          );
        }

        if (block.type === "ul") {
          return (
            <ul
              key={blockIndex}
              className="space-y-2 pl-5 text-sm font-medium leading-6 text-[#273158]"
            >
              {block.items.map(
                (item, itemIndex) => (
                  <li
                    key={itemIndex}
                    className="list-disc pl-1"
                  >
                    {renderInlineMarkdown(
                      item
                    )}
                  </li>
                )
              )}
            </ul>
          );
        }

        if (block.type === "ol") {
          return (
            <ol
              key={blockIndex}
              className="space-y-2 pl-5 text-sm font-medium leading-6 text-[#273158]"
            >
              {block.items.map(
                (item, itemIndex) => (
                  <li
                    key={itemIndex}
                    className="list-decimal pl-1"
                  >
                    {renderInlineMarkdown(
                      item
                    )}
                  </li>
                )
              )}
            </ol>
          );
        }

        if (block.type === "quote") {
          return (
            <blockquote
              key={blockIndex}
              className="rounded-r-xl border-l-4 border-[#7c3aed] bg-[#eee9ff] px-4 py-3 text-sm font-medium italic leading-6 text-[#3c4164]"
            >
              {renderInlineMarkdown(
                block.content
              )}
            </blockquote>
          );
        }

        if (block.type === "hr") {
          return (
            <div
              key={blockIndex}
              className="h-px w-full bg-[#e7e1fa]"
            />
          );
        }

        if (block.type === "code") {
          return (
            <CodeBlock
              key={blockIndex}
              language={block.language}
              code={block.content}
            />
          );
        }

        if (block.type === "table") {
          return (
            <MarkdownTable
              key={blockIndex}
              rows={block.rows}
            />
          );
        }

        return null;
      })}
    </div>
  );
}

/* =========================================================
   CHECK MARKDOWN TABLE SEPARATOR
========================================================= */

function isMarkdownTableSeparator(
  line
) {
  if (
    typeof line !== "string" ||
    !line.includes("|")
  ) {
    return false;
  }

  const cleaned = line
    .replace(/\|/g, "")
    .replace(/:/g, "")
    .replace(/-/g, "")
    .trim();

  return cleaned.length === 0;
}

/* =========================================================
   MARKDOWN TABLE
========================================================= */

function MarkdownTable({ rows }) {
  if (!rows?.length) {
    return null;
  }

  const parsedRows = rows
    .filter(
      (row) =>
        !isMarkdownTableSeparator(row)
    )
    .map((row) =>
      row
        .trim()
        .replace(/^\|/, "")
        .replace(/\|$/, "")
        .split("|")
        .map((cell) =>
          cell.trim()
        )
    );

  if (!parsedRows.length) {
    return null;
  }

  const header = parsedRows[0];

  const body = parsedRows.slice(1);

  return (
    <div className="my-2 w-full overflow-x-auto rounded-xl border border-[#e3dcf7] bg-white">
      <table className="w-full min-w-[520px] border-collapse text-left text-xs">
        <thead>
          <tr className="bg-[#eee9ff]">
            {header.map(
              (cell, index) => (
                <th
                  key={index}
                  className="border-b border-[#ddd5f4] px-3 py-2.5 font-black text-[#252b57]"
                >
                  {renderInlineMarkdown(
                    cell
                  )}
                </th>
              )
            )}
          </tr>
        </thead>

        <tbody>
          {body.map(
            (row, rowIndex) => (
              <tr
                key={rowIndex}
                className="transition hover:bg-[#faf8ff]"
              >
                {header.map(
                  (_, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="border-b border-[#eeeaf7] px-3 py-2.5 align-top font-medium leading-5 text-[#4a5272]"
                    >
                      {renderInlineMarkdown(
                        row[cellIndex] ||
                          ""
                      )}
                    </td>
                  )
                )}
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

/* =========================================================
   CODE BLOCK
========================================================= */

function CodeBlock({
  language,
  code,
}) {
  const [copied, setCopied] =
    useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        code
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (error) {
      console.error(
        "Copy Code Error:",
        error
      );
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-[#ddd6f4] bg-[#17152a] shadow-sm">

      <div className="flex items-center justify-between border-b border-white/10 bg-[#211d39] px-3 py-2">

        <div className="flex items-center gap-2">

          <Code2
            size={14}
            className="text-[#bca9ff]"
          />

          <span className="text-[10px] font-bold uppercase tracking-wider text-[#c9c2df]">
            {language || "code"}
          </span>

        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-[10px] font-bold text-[#c9c2df] transition hover:bg-white/10 hover:text-white"
        >
          {copied ? (
            <>
              <Check size={13} />
              Copied
            </>
          ) : (
            <>
              <FileText size={13} />
              Copy
            </>
          )}
        </button>

      </div>

      <pre className="max-h-[520px] overflow-auto p-4 text-xs leading-6 text-[#eeeaff]">
        <code>{code}</code>
      </pre>

    </div>
  );
}

/* =========================================================
   INLINE MARKDOWN RENDERER
========================================================= */

function renderInlineMarkdown(
  text
) {
  if (
    typeof text !== "string"
  ) {
    return text;
  }

  const parts = [];

  let remaining = text;

  let key = 0;

  const pattern =
    /(\*\*[^*]+\*\*|__[^_]+__|`[^`]+`|\*[^*]+\*|_[^_]+_|\[([^\]]+)\]\(([^)]+)\))/;

  while (remaining.length > 0) {
    const match =
      remaining.match(pattern);

    if (!match) {
      parts.push(
        <span key={key++}>
          {remaining}
        </span>
      );

      break;
    }

    const matchIndex =
      match.index ?? 0;

    if (matchIndex > 0) {
      parts.push(
        <span key={key++}>
          {remaining.slice(
            0,
            matchIndex
          )}
        </span>
      );
    }

    const token = match[0];

    /* ================================================
       LINK
    ================================================ */

    if (
      token.startsWith("[") &&
      token.includes("](")
    ) {
      const label =
        match[2];

      const href =
        match[3];

      parts.push(
        <a
          key={key++}
          href={href}
          target="_blank"
          rel="noreferrer"
          className="font-bold text-[#6425ed] underline underline-offset-2 hover:text-[#4f1dcc]"
        >
          {label}
        </a>
      );
    }

    /* ================================================
       BOLD
    ================================================ */

    else if (
      token.startsWith("**") ||
      token.startsWith("__")
    ) {
      parts.push(
        <strong
          key={key++}
          className="font-black text-[#17204b]"
        >
          {token.slice(2, -2)}
        </strong>
      );
    }

    /* ================================================
       INLINE CODE
    ================================================ */

    else if (
      token.startsWith("`")
    ) {
      parts.push(
        <code
          key={key++}
          className="rounded-md bg-[#e9e3fa] px-1.5 py-0.5 font-mono text-[0.9em] font-semibold text-[#5b21b6]"
        >
          {token.slice(1, -1)}
        </code>
      );
    }

    /* ================================================
       ITALIC
    ================================================ */

    else if (
      token.startsWith("*") ||
      token.startsWith("_")
    ) {
      parts.push(
        <em
          key={key++}
          className="font-medium italic"
        >
          {token.slice(1, -1)}
        </em>
      );
    }

    remaining =
      remaining.slice(
        matchIndex + token.length
      );
  }

  return parts;
}

/* =========================================================
   QUICK ACTION
========================================================= */

function QuickAction({
  icon,
  label,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[10px] font-bold text-[#30385b] transition hover:bg-[#f4f0ff] hover:text-[#6425ed]"
    >
      {icon}
      {label}
    </button>
  );
}

/* =========================================================
   EXPORT
========================================================= */

export default AIAssistant;
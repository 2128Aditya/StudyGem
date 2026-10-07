import { useEffect, useRef, useState } from "react";

import {

  Search,

  ArrowRight,

  Newspaper,

  FileText,

  Trophy,

  Map,

  Bot,

  UserRound,

  Star,

  ChevronLeft,

  ChevronRight,

  Play,

  Pause,

  Music2,

  Headphones,

  Volume2,

} from "lucide-react";

import Navbar from "../components/Navbar";

import homeBg from "../assets/new.png";

import motivationBg from "../assets/aadi.png";

const API_BASE_URL =

  import.meta.env.VITE_API_URL || "https\://studygem-your-knowledge-your-growth.onrender.com/api";

const motivationQuotes = [

  {

    english: "Success is the sum of small efforts, repeated every day.",

    hindi: "सफलता रोज़ किए गए छोटे-छोटे प्रयासों का परिणाम है।",

  },

  {

    english: "Don't stop when you're tired. Stop when you're done.",

    hindi: "थकने पर मत रुको, अपना लक्ष्य पूरा होने पर रुको।",

  },

  {

    english: "Your future is created by what you do today.",

    hindi: "तुम्हारा भविष्य इस बात से बनता है कि तुम आज क्या करते हो।",

  },

  {

    english: "Dream big, work hard, stay consistent.",

    hindi: "बड़ा सपना देखो, मेहनत करो और लगातार आगे बढ़ते रहो।",

  },

  {

    english: "Every expert was once a beginner.",

    hindi: "हर विशेषज्ञ कभी न कभी शुरुआत करने वाला ही था।",

  },

  {

    english: "Discipline will take you where motivation cannot.",

    hindi: "अनुशासन तुम्हें वहां ले जाएगा जहां केवल मोटिवेशन नहीं पहुंच सकता।",

  },

  {

    english: "One hour of focused study can change your entire day.",

    hindi: "एक घंटे की focused पढ़ाई तुम्हारा पूरा दिन बदल सकती है।",

  },

  {

    english: "Believe in yourself and keep moving forward.",

    hindi: "खुद पर विश्वास रखो और लगातार आगे बढ़ते रहो।",

  },

  {

    english: "Small progress is still progress.",

    hindi: "छोटी प्रगति भी प्रगति ही होती है।",

  },

  {

    english: "Your hard work today will become your confidence tomorrow.",

    hindi: "आज की मेहनत कल तुम्हारा आत्मविश्वास बनेगी।",

  },

];

const Home = ({

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

}) => {

  const [quoteIndex, setQuoteIndex] = useState(0);

  const [songs, setSongs] = useState([]);

  const [songIndex, setSongIndex] = useState(0);

  const [songsLoading, setSongsLoading] = useState(true);

  const [songsError, setSongsError] = useState("");

  const [isPlaying, setIsPlaying] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);

  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);

  const currentQuote = motivationQuotes[quoteIndex];

  const currentSong = songs[songIndex] || null;

  const randomFacts = [
    "The human brain can process information faster than most people realize.",
    "Spaced repetition helps you remember information for much longer.",
    "Teaching a concept to someone else is one of the best ways to understand it.",
    "A short focused study session can be more effective than hours of distracted study.",
    "Writing notes by hand can improve recall and help organize ideas.",
    "Taking small breaks during long study sessions can help maintain focus.",
    "Your brain continues processing and organizing memories even after you stop studying.",
    "Consistent daily practice usually beats last-minute cramming for long-term learning.",
  ];

  const [factIndex, setFactIndex] = useState(0);
  const currentFact = randomFacts[factIndex];

  const nextFact = () => {
    setFactIndex((previous) => (previous + 1) % randomFacts.length);
  };

  /* =========================================================

     AUTO CHANGE MOTIVATION EVERY 1 MINUTE

  ========================================================= */

  useEffect(() => {

    const quoteTimer = setInterval(() => {

      setQuoteIndex((previous) => {

        return (previous + 1) % motivationQuotes.length;

      });

    }, 60000);

    return () => clearInterval(quoteTimer);

  }, []);

  /* =========================================================

     FETCH REAL SONGS FROM BACKEND

  ========================================================= */

  useEffect(() => {

    const loadSongs = async () => {

      try {

        setSongsLoading(true);

        setSongsError("");

        const response = await fetch(`${API_BASE_URL}/songs`);

        const data = await response.json();

        if (!response.ok || !data.success) {

          throw new Error(

            data.message || "Unable to load study music."

          );

        }

        const receivedSongs = Array.isArray(data.songs)

          ? data.songs

          : Array.isArray(data.music)

          ? data.music

          : Array.isArray(data.data)

          ? data.data

          : [];

        const validSongs = receivedSongs

          .map((song) => ({

            ...song,

            audioUrl:

              song.audioUrl ||

              song.url ||

              song.fileUrl ||

              song.audio ||

              song.secureUrl ||

              "",

            title:

              song.title ||

              song.name ||

              "Motivation Track",

            artist:

              song.artist ||

              song.singer ||

              "StudyGem",

            thumbnail:

              song.thumbnail ||

              song.coverImage ||

              song.image ||

              song.thumbnailUrl ||

              "",

          }))

          .filter((song) => song.audioUrl);

        setSongs(validSongs);

        setSongIndex(0);

      } catch (error) {

        console.error("Songs Fetch Error:", error);

        setSongs([]);

        setSongsError(

          error.message || "Unable to load study music."

        );

      } finally {

        setSongsLoading(false);

      }

    };

    loadSongs();

  }, []);

  /* =========================================================

     LOAD CURRENT AUDIO

  ========================================================= */

  useEffect(() => {

    const audio = audioRef.current;

    if (!audio || !currentSong?.audioUrl) {

      return;

    }

    audio.pause();

    audio.src = currentSong.audioUrl;

    audio.load();

    setCurrentTime(0);

    setDuration(0);

    if (isPlaying) {

      const playPromise = audio.play();

      if (playPromise !== undefined) {

        playPromise.catch(() => {

          setIsPlaying(false);

        });

      }

    }

  }, [currentSong?.audioUrl]);

  /* =========================================================

     AUDIO EVENTS

  ========================================================= */

  useEffect(() => {

    const audio = audioRef.current;

    if (!audio) {

      return;

    }

    const handleTimeUpdate = () => {

      setCurrentTime(audio.currentTime || 0);

    };

    const handleLoadedMetadata = () => {

      setDuration(audio.duration || 0);

    };

    const handleEnded = () => {

      if (!songs.length) {

        setIsPlaying(false);

        return;

      }

      setSongIndex((previous) => {

        return (previous + 1) % songs.length;

      });

    };

    const handlePlay = () => {

      setIsPlaying(true);

    };

    const handlePause = () => {

      setIsPlaying(false);

    };

    audio.addEventListener(

      "timeupdate",

      handleTimeUpdate

    );

    audio.addEventListener(

      "loadedmetadata",

      handleLoadedMetadata

    );

    audio.addEventListener(

      "ended",

      handleEnded

    );

    audio.addEventListener(

      "play",

      handlePlay

    );

    audio.addEventListener(

      "pause",

      handlePause

    );

    return () => {

      audio.removeEventListener(

        "timeupdate",

        handleTimeUpdate

      );

      audio.removeEventListener(

        "loadedmetadata",

        handleLoadedMetadata

      );

      audio.removeEventListener(

        "ended",

        handleEnded

      );

      audio.removeEventListener(

        "play",

        handlePlay

      );

      audio.removeEventListener(

        "pause",

        handlePause

      );

    };

  }, [songs.length]);

  /* =========================================================

     PLAY / PAUSE

  ========================================================= */

  const togglePlay = async () => {

    const audio = audioRef.current;

    if (!audio || !currentSong?.audioUrl) {

      return;

    }

    try {

      if (audio.paused) {

        await audio.play();

        setIsPlaying(true);

      } else {

        audio.pause();

        setIsPlaying(false);

      }

    } catch (error) {

      console.error("Audio Play Error:", error);

      setIsPlaying(false);

    }

  };

  /* =========================================================

     NEXT SONG

  ========================================================= */

  const playNextSong = async () => {

    if (!songs.length) {

      return;

    }

    const nextIndex =

      (songIndex + 1) % songs.length;

    setSongIndex(nextIndex);

    setTimeout(async () => {

      const audio = audioRef.current;

      if (!audio) {

        return;

      }

      try {

        await audio.play();

        setIsPlaying(true);

      } catch {

        setIsPlaying(false);

      }

    }, 100);

  };

  /* =========================================================

     PREVIOUS SONG

  ========================================================= */

  const playPreviousSong = async () => {

    if (!songs.length) {

      return;

    }

    if (audioRef.current && audioRef.current.currentTime > 5) {

      audioRef.current.currentTime = 0;

      setCurrentTime(0);

      return;

    }

    const previousIndex =

      (songIndex - 1 + songs.length) %

      songs.length;

    setSongIndex(previousIndex);

    setTimeout(async () => {

      const audio = audioRef.current;

      if (!audio) {

        return;

      }

      try {

        await audio.play();

        setIsPlaying(true);

      } catch {

        setIsPlaying(false);

      }

    }, 100);

  };

  /* =========================================================

     PROGRESS SEEK

  ========================================================= */

  const handleSeek = (event) => {

    const value = Number(event.target.value);

    if (!audioRef.current) {

      return;

    }

    audioRef.current.currentTime = value;

    setCurrentTime(value);

  };

  /* =========================================================

     FORMAT TIME

  ========================================================= */

  const formatTime = (seconds) => {

    if (!Number.isFinite(seconds)) {

      return "0:00";

    }

    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = Math.floor(

      seconds % 60

    );

    return `${minutes}:${String(

      remainingSeconds

    ).padStart(2, "0")}`;

  };

  /* =========================================================

     MANUAL QUOTE NAVIGATION

  ========================================================= */

  const previousQuote = () => {

    setQuoteIndex((previous) => {

      return (

        (previous - 1 + motivationQuotes.length) %

        motivationQuotes.length

      );

    });

  };

  const nextQuote = () => {

    setQuoteIndex((previous) => {

      return (

        (previous + 1) % motivationQuotes.length

      );

    });

  };

  return (

    <div className="w-full min-h-screen bg-[#f8f6ff] overflow-x-hidden">

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

        activePage="home"

      />

      {/* =====================================================

          HERO

      ====================================================== */}

      <section

        className="

          relative

          w-full

          min-h-[calc(100vh-64px)]

          px-4

          pt-[88px]

          pb-6

          max-[380px]:px-3

          sm:px-6

          sm:pt-[92px]

          lg:h-screen

          lg:min-h-screen

          lg:px-0

          lg:pt-0

          lg:pb-0

          overflow-hidden

          bg-[#f8f6ff]

          lg:bg-cover

          lg:bg-center

          lg:bg-no-repeat

        "

        style={{

          backgroundImage: `url(${homeBg})`,

        }}

      >

        <div

          className="

            relative

            z-10

            w-full

            mx-auto

            max-w-[760px]

            flex

            flex-col

            justify-center

            min-h-full

            lg:absolute

            lg:left-[5.5%]

            lg:top-[82px]

            lg:w-[47%]

            lg:max-w-none

            lg:h-[calc(100vh-82px)]

            lg:min-h-0

          "

        >

          <div

            className="

              w-full

              flex

              flex-col

              justify-center

              py-3

              sm:py-4

              lg:h-full

              lg:py-5

            "

          >

            {/* BADGE */}

            <div

              className="

                w-fit

                max-w-full

                flex

                items-center

                gap-2

                px-3

                sm:px-4

                py-2

                rounded-full

                bg-white

                lg:bg-white/75

                backdrop-blur-sm

                shadow-[0_8px_25px_rgba(109,63,220,0.10)]

                text-[#6425ed]

                text-xs

                sm:text-sm

                font-semibold

                mb-4

                sm:mb-5

                lg:mb-4

                shrink-0

              "

            >

              <span className="text-[#ffb51e] text-base sm:text-lg shrink-0">

                ✦

              </span>

              <span className="truncate">

                Everything you need for your learning journey

              </span>
            </div>
      {/* SEARCH */}

            <div

              className="

                w-full

                h-[56px]

                sm:h-[60px]

                lg:h-[62px]

                xl:h-[66px]

                rounded-full

                bg-white

                lg:bg-white/90

                backdrop-blur-md

                border

                border-white

                shadow-[0_12px_35px_rgba(74,40,160,0.12)]

                flex

                items-center

                pl-4

                sm:pl-5

                lg:pl-6

                pr-2

                sm:pr-3

                mb-3

                shrink-0

              "

            >

              <Search

                size={23}

                strokeWidth={2.5}

                className="

                  text-[#6526ed]

                  shrink-0

                  sm:w-6

                  sm:h-6

                "

              />

              <input

                type="text"
                  aria-label="Search StudyGem for subjects, topics, notes, PYQs and mock tests"
  name="search"
                placeholder="Search for subjects, topics, notes, PYQs, mock tests..."

                className="

                  flex-1

                  min-w-0

                  h-full

                  px-3

                  sm:px-4

                  lg:px-4

                  bg-transparent

                  outline-none

                  text-[#202743]

                  text-[13px]

                  sm:text-[14px]

                  lg:text-[14px]

                  xl:text-[15px]

                  placeholder:text-[#858da5]

                "

              />

              <button

                type="button"

                className="

                  w-[40px]

                  h-[40px]

                  sm:w-[44px]

                  sm:h-[44px]

                  lg:w-[46px]

                  lg:h-[46px]

                  rounded-full

                  bg-gradient-to-r

                  from-[#7130ff]

                  to-[#4b20ed]

                  text-white

                  flex

                  items-center

                  justify-center

                  shrink-0

                  shadow-md

                  shadow-purple-200

                  transition

                  hover:scale-105

                  active:scale-95

                "

              >

                <ArrowRight

                  size={20}

                  className="sm:w-[21px] sm:h-[21px]"

                />

              </button>

            </div>

            {/* CATEGORY PILLS */}

            <div

              className="

                flex

                items-center

                gap-2

                mb-4

                flex-wrap

                shrink-0

              "

            >

              <Category active>

                DSA

              </Category>

              <Category>

                DBMS

              </Category>

              <Category>

                Operating System

              </Category>

              <Category>

                Computer Networks

              </Category>

              <Category>

                Aptitude

              </Category>

              <Category>

                Web Dev

              </Category>

            </div>

            {/* FEATURE CARDS */}

            <div

              className="

                w-full

                bg-white

                lg:bg-white/72

                backdrop-blur-md

                rounded-[20px]

                lg:rounded-[22px]

                p-3

                border

                border-white/80

                shadow-[0_15px_40px_rgba(80,45,160,0.09)]

                shrink-0

              "

            >

              <div

                className="

                  grid

                  grid-cols-1

                  min-[380px]:grid-cols-2

                  md:grid-cols-3

                  gap-2.5

                  lg:gap-3

                "

              >

                <FeatureCard

                  icon={<Newspaper size={24} />}

                  title="Current Affairs"

                  subtitle={

                    <>

                      Daily Latest

                      <br />

                      Updates

                    </>

                  }

                  type="purple"

                  onClick={onNotes}

                />

                <FeatureCard

                  icon={<FileText size={24} />}

                  title="Previous Year"

                  subtitle={

                    <>Chapter-wise PYQs</>

                  }

                  type="blue"

                  onClick={onPYQ}

                />

                <FeatureCard

                  icon={<Trophy size={24} />}

                  title="Mock Tests"

                  subtitle={

                    <>

                      Practice Like

                      <br />

                      Real Exam

                    </>

                  }

                  type="orange"

                  onClick={onMockTests}

                />

                <FeatureCard

                  icon={<Map size={24} />}

                  title="Roadmaps"

                  subtitle={

                    <>

                      Step-by-step

                      <br />

                      Learning Paths

                    </>

                  }

                  type="green"

                  onClick={onRoadmaps}

                />

                <FeatureCard

                  icon={<Bot size={24} />}

                  title="AI Assistant"

                  subtitle={

                    <>

                      Get Instant Doubt

                      <br />

                      Solutions

                    </>

                  }

                  type="pink"

                  onClick={onAI}

                />

                <FeatureCard

                  icon={<Trophy size={24} />}

                  title="Leaderboard"

                  subtitle={

                    <>

                      See Top

                      <br />

                      Performers

                    </>

                  }

                  type="purple"

                  onClick={onLeaderboard}

                />

              </div>

            </div>

            {/* STATS */}

            <div

              className="

                mt-3

                w-full

                grid

                grid-cols-2

                lg:flex

                lg:items-center

                lg:justify-between

                gap-y-3

                lg:gap-y-0

                gap-x-3

                px-4

                lg:px-4

                py-3

                rounded-[20px]

                lg:rounded-[22px]

                bg-white

                lg:bg-white/65

                backdrop-blur-md

                border

                border-white/80

                shrink-0

              "

            >

              <Stat

                icon={<UserRound size={22} />}

                number="1K+"

                label="Learners"

                type="purple"

              />

              <div className="hidden lg:block">

                <Divider />

              </div>

              <Stat

                icon={<FileText size={22} />}

                number="5K+"

                label="PYQs"

                type="green"

              />

              <div className="hidden lg:block">

                <Divider />

              </div>

              <Stat

                icon={<Trophy size={22} />}

                number="20K+"

                label="Mock Tests"

                type="orange"

              />

              <div className="hidden lg:block">

                <Divider />

              </div>

              <Stat

                icon={<Star size={22} />}

                number="4.8/5"

                label="User Rating"

                type="pink"

              />

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================

          MOTIVATION + REAL STUDY MUSIC

      ====================================================== */}

      <section

        className="

          relative

          w-full

          overflow-hidden

          bg-[#f7f4ff]

          bg-cover

          bg-center

          bg-no-repeat

        "

        style={{

          backgroundImage: `url(${motivationBg})`,

        }}

      >

        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px]" />

        <div

          className="

            relative

            z-10

            w-full

            max-w-[1450px]

            mx-auto

            px-4

            sm:px-6

            lg:px-8

            py-10

            sm:py-14

            lg:py-16

          "

        >

          {/* SECTION HEADING */}

          <div className="text-center mb-7 sm:mb-9">

            <div

              className="

                inline-flex

                items-center

                gap-2

                px-4

                py-2

                rounded-full

                bg-white/80

                border

                border-purple-100

                text-[#6a32e9]

                text-xs

                sm:text-sm

                font-medium

                shadow-sm

              "

            >

              <Headphones size={15} />

              Study • Focus • Achieve

            </div>

            <h2

              className="

                mt-4

                text-[28px]

                sm:text-[34px]

                lg:text-[42px]

                font-semibold

                tracking-tight

                text-[#171c3d]

              "

            >

              A Little Motivation Every Day.

            </h2>

            <p

              className="

                mt-2

                max-w-2xl

                mx-auto

                text-sm

                sm:text-base

                text-[#69738e]

              "

            >

              Stay focused, keep learning and make every study

              session count.

            </p>

          </div>

          {/* MAIN GRID */}

          <div

            className="

              grid

              grid-cols-1

              lg:grid-cols-[1.05fr_0.95fr]

              gap-5

              lg:gap-6

            "

          >

            {/* =================================================

                MOTIVATION CARD

            ================================================== */}

            <div

              className="

                relative

                min-h-[470px]

                lg:min-h-[560px]

                overflow-hidden

                rounded-[30px]

                bg-white/90

                border

                border-white

                shadow-[0_25px_70px_rgba(79,43,160,0.12)]

                backdrop-blur-md

                p-6

                sm:p-8

                flex

                flex-col

              "

            >

              <div

                className="

                  absolute

                  -top-24

                  -right-24

                  w-64

                  h-64

                  rounded-full

                  bg-purple-200/40

                  blur-3xl

                "

              />

              <div

                className="

                  absolute

                  -bottom-24

                  -left-24

                  w-64

                  h-64

                  rounded-full

                  bg-pink-200/30

                  blur-3xl

                "

              />

              <div

                className="

                  relative

                  z-10

                  flex

                  items-center

                  justify-between

                  gap-4

                "

              >

                <div>

                  <div

                    className="

                      flex

                      items-center

                      gap-2

                      text-[#6a32e9]

                      text-sm

                      font-medium

                    "

                  >

                    <span

                      className="

                        w-8

                        h-8

                        rounded-full

                        bg-[#f0e8ff]

                        flex

                        items-center

                        justify-center

                      "

                    >

                      ✦

                    </span>

                    Daily Motivation

                  </div>

                  <h3

                    className="

                      mt-3

                      text-[24px]

                      sm:text-[30px]

                      font-medium

                      text-[#151b3b]

                    "

                  >

                    Keep Going.

                  </h3>

                </div>

                <div

                  className="

                    w-12

                    h-12

                    rounded-2xl

                    bg-[#f1eaff]

                    text-[#6a32e9]

                    flex

                    items-center

                    justify-center

                    shrink-0

                  "

                >

                  <Star size={22} />

                </div>

              </div>

              <div

                className="

                  relative

                  z-10

                  flex-1

                  flex

                  flex-col

                  justify-center

                  py-8

                "

              >

                <div

                  className="

                    text-[#6a32e9]

                    text-5xl

                    sm:text-6xl

                    leading-none

                    opacity-20

                    font-serif

                  "

                >

                  “

                </div>

                <p

                  key={quoteIndex}

                  className="

                    mt-1

                    text-[25px]

                    sm:text-[32px]

                    lg:text-[36px]

                    leading-[1.25]

                    font-medium

                    tracking-tight

                    text-[#171d40]

                  "

                >

                  {currentQuote.english}

                </p>

                <div

                  className="

                    mt-7

                    h-px

                    w-20

                    bg-[#8a54ed]

                  "

                />

                <p

                  key={`hindi-${quoteIndex}`}

                  className="

                    mt-5

                    text-[16px]

                    sm:text-[18px]

                    leading-7

                    text-[#69738e]

                  "

                >

                  {currentQuote.hindi}

                </p>

                <div

                  className="

                    mt-8

                    rounded-2xl

                    bg-[#faf8ff]

                    border

                    border-[#eee8ff]

                    p-4

                    sm:p-5

                  "

                >

                  <p

                    className="

                      text-xs

                      uppercase

                      tracking-[0.16em]

                      text-[#8b91a8]

                    "

                  >

                    Remember

                  </p>

                  <p

                    className="

                      mt-2

                      text-sm

                      sm:text-base

                      text-[#303853]

                    "

                  >

                    Consistency beats intensity. One focused

                    session at a time.

                  </p>

                </div>

              </div>

              <div

                className="

                  relative

                  z-10

                  flex

                  items-center

                  justify-between

                  gap-4

                "

              >

                <button

                  type="button"

                  onClick={previousQuote}

                  className="

                    w-11

                    h-11

                    rounded-full

                    border

                    border-[#e8e1fa]

                    bg-white

                    text-[#6530dc]

                    flex

                    items-center

                    justify-center

                    transition

                    hover:bg-[#f7f2ff]

                    active:scale-95

                  "

                  aria-label="Previous quote"

                >

                  <ChevronLeft size={20} />

                </button>

                <div

                  className="

                    flex

                    items-center

                    gap-2

                  "

                >

                  {motivationQuotes.map(

                    (_, index) => (

                      <span

                        key={index}

                        className={`

                          h-1.5

                          rounded-full

                          transition-all

                          duration-300

                          ${

                            index === quoteIndex

                              ? "w-7 bg-[#7135e8]"

                              : "w-1.5 bg-[#d8cff0]"

                          }

                        `}

                      />

                    )

                  )}

                </div>

                <button

                  type="button"

                  onClick={nextQuote}

                  className="

                    w-11

                    h-11

                    rounded-full

                    border

                    border-[#e8e1fa]

                    bg-white

                    text-[#6530dc]

                    flex

                    items-center

                    justify-center

                    transition

                    hover:bg-[#f7f2ff]

                    active:scale-95

                  "

                  aria-label="Next quote"

                >

                  <ChevronRight size={20} />

                </button>

              </div>

            </div>

            {/* =================================================

                REAL MUSIC PLAYER

            ================================================== */}

            <div

              className="

                relative

                min-h-[470px]

                lg:min-h-[560px]

                overflow-hidden

                rounded-[30px]

                bg-[#151229]

                border

                border-white/10

                shadow-[0_25px_70px_rgba(28,17,67,0.22)]

                p-6

                sm:p-8

                text-white

                flex

                flex-col

              "

            >

              <div

                className="

                  absolute

                  -top-24

                  -right-20

                  w-72

                  h-72

                  rounded-full

                  bg-purple-500/20

                  blur-3xl

                "

              />

              <div

                className="

                  absolute

                  -bottom-28

                  -left-20

                  w-72

                  h-72

                  rounded-full

                  bg-indigo-500/15

                  blur-3xl

                "

              />

              <audio

                ref={audioRef}

                preload="metadata"

              />

              <div

                className="

                  relative

                  z-10

                  flex

                  items-center

                  justify-between

                  gap-4

                "

              >

                <div>

                  <div

                    className="

                      flex

                      items-center

                      gap-2

                      text-white/70

                      text-sm

                    "

                  >

                    <Music2 size={16} />

                    Study Music

                  </div>

                  <h3

                    className="

                      mt-3

                      text-[24px]

                      sm:text-[30px]

                      font-medium

                    "

                  >

                    Focus Mode

                  </h3>

                </div>

                <div

                  className="

                    w-12

                    h-12

                    rounded-2xl

                    bg-white/10

                    border

                    border-white/10

                    flex

                    items-center

                    justify-center

                  "

                >

                  <Volume2 size={21} />

                </div>

              </div>

              <div

                className="

                  relative

                  z-10

                  flex-1

                  flex

                  flex-col

                  justify-center

                  items-center

                  text-center

                "

              >

                <div

                  className="

                    relative

                    w-[190px]

                    h-[190px]

                    sm:w-[220px]

                    sm:h-[220px]

                    rounded-[34px]

                    overflow-hidden

                    bg-gradient-to-br

                    from-[#8c55ed]

                    via-[#5e35d8]

                    to-[#291568]

                    shadow-[0_25px_70px_rgba(99,56,205,0.40)]

                    flex

                    items-center

                    justify-center

                  "

                >

                  {currentSong?.thumbnail ? (

                    <img

                      src={currentSong.thumbnail}

                      alt="StudyGem study music and motivational learning playlist"

                      className="

                        absolute

                        inset-0

                        w-full

                        h-full

                        object-cover

                      "

                    />

                  ) : (

                    <>

                      <div

                        className="

                          absolute

                          inset-0

                          bg-gradient-to-br

                          from-[#9a63f2]

                          via-[#6336d8]

                          to-[#26145e]

                        "

                      />

                      <div

                        className="

                          absolute

                          w-32

                          h-32

                          rounded-full

                          border

                          border-white/15

                        "

                      />

                      <div

                        className="

                          absolute

                          w-24

                          h-24

                          rounded-full

                          border

                          border-white/15

                        "

                      />

                      <div

                        className="

                          absolute

                          w-16

                          h-16

                          rounded-full

                          border

                          border-white/15

                        "

                      />

                    </>

                  )}

                  <div

                    className="

                      relative

                      z-10

                      w-16

                      h-16

                      rounded-full

                      bg-white/15

                      backdrop-blur-md

                      border

                      border-white/20

                      flex

                      items-center

                      justify-center

                    "

                  >

                    <Music2 size={30} strokeWidth={1.7} />

                  </div>

                </div>

                <div className="mt-7">

                  <p

                    className="

                      text-[20px]

                      sm:text-[24px]

                      font-medium

                    "

                  >

                    Study Motivation

                  </p>

                  <p

                    className="

                      mt-2

                      text-sm

                      text-white/55

                    "

                  >

                    Keep going • Keep learning • Keep growing

                  </p>

                </div>

                {songsLoading && (

                  <p

                    className="

                      mt-3

                      text-xs

                      text-white/45

                    "

                  >

                    Loading study music...

                  </p>

                )}

                {!songsLoading &&

                  songsError && (

                    <p

                      className="

                        mt-3

                        text-xs

                        text-white/45

                      "

                    >

                      Study music is currently unavailable.

                    </p>

                  )}

                {!songsLoading &&

                  !songsError &&

                  !songs.length && (

                    <p

                      className="

                        mt-3

                        text-xs

                        text-white/45

                      "

                    >

                      No study music available yet.

                    </p>

                  )}

              </div>

              {/* PROGRESS */}

              <div className="relative z-10">

                <input

                  type="range"

                  min="0"

                  max={duration || 0}

                  step="0.1"

                  value={Math.min(

                    currentTime,

                    duration || 0

                  )}

                  onChange={handleSeek}

                  disabled={!currentSong}

                  className="

                    w-full

                    h-1.5

                    appearance-none

                    cursor-pointer

                    accent-[#a875ff]

                    bg-white/15

                    rounded-full

                  "

                />

                <div

                  className="

                    mt-2

                    flex

                    items-center

                    justify-between

                    text-[11px]

                    text-white/45

                  "

                >

                  <span>

                    {formatTime(currentTime)}

                  </span>

                  <span>

                    {formatTime(duration)}

                  </span>

                </div>

                {/* CONTROLS */}

                <div

                  className="

                    mt-5

                    flex

                    items-center

                    justify-center

                    gap-5

                  "

                >

                  <button

                    type="button"

                    onClick={playPreviousSong}

                    disabled={!songs.length}

                    className="

                      w-11

                      h-11

                      rounded-full

                      bg-white/8

                      border

                      border-white/10

                      flex

                      items-center

                      justify-center

                      text-white/75

                      transition

                      hover:bg-white/15

                      active:scale-95

                      disabled:opacity-30

                      disabled:cursor-not-allowed

                    "

                    aria-label="Previous track"

                  >

                    <ChevronLeft size={22} />

                  </button>

                  <button

                    type="button"

                    onClick={togglePlay}

                    disabled={!currentSong}

                    className="

                      w-[62px]

                      h-[62px]

                      rounded-full

                      bg-white

                      text-[#3d1d91]

                      flex

                      items-center

                      justify-center

                      shadow-[0_12px_35px_rgba(255,255,255,0.18)]

                      transition

                      hover:scale-105

                      active:scale-95

                      disabled:opacity-40

                      disabled:cursor-not-allowed

                    "

                    aria-label={

                      isPlaying

                        ? "Pause"

                        : "Play"

                    }

                  >

                    {isPlaying ? (

                      <Pause

                        size={25}

                        fill="currentColor"

                      />

                    ) : (

                      <Play

                        size={25}

                        fill="currentColor"

                        className="ml-1"

                      />

                    )}

                  </button>

                  <button

                    type="button"

                    onClick={playNextSong}

                    disabled={!songs.length}

                    className="

                      w-11

                      h-11

                      rounded-full

                      bg-white/8

                      border

                      border-white/10

                      flex

                      items-center

                      justify-center

                      text-white/75

                      transition

                      hover:bg-white/15

                      active:scale-95

                      disabled:opacity-30

                      disabled:cursor-not-allowed

                    "

                    aria-label="Next track"

                  >

                    <ChevronRight size={22} />

                  </button>

                </div>

                {/* NEXT TRACK */}

                <div

                  className="

                    mt-6

                    flex

                    items-center

                    justify-between

                    gap-4

                    rounded-2xl

                    bg-white/6

                    border

                    border-white/8

                    px-4

                    py-3.5

                  "

                >

                  <div className="flex items-center gap-3 min-w-0">

                    <div

                      className="

                        w-9

                        h-9

                        rounded-xl

                        bg-white/8

                        flex

                        items-center

                        justify-center

                        shrink-0

                      "

                    >

                      <Headphones size={17} />

                    </div>

                    <div className="min-w-0">

                      <p

                        className="

                          text-[11px]

                          uppercase

                          tracking-[0.14em]

                          text-white/40

                        "

                      >

                        Up Next

                      </p>

                      <p

                        className="

                          mt-0.5

                          text-sm

                          text-white/75

                        "

                      >

                        Next motivation track

                      </p>

                    </div>

                  </div>

                  <button

                    type="button"

                    onClick={playNextSong}

                    disabled={!songs.length}

                    className="

                      shrink-0

                      px-3.5

                      py-2

                      rounded-xl

                      bg-white/10

                      border

                      border-white/10

                      text-xs

                      text-white/80

                      transition

                      hover:bg-white/15

                      active:scale-95

                      disabled:opacity-30

                      disabled:cursor-not-allowed

                    "

                  >

                    Next

                  </button>

                </div>

                {songs.length > 0 && (

                  <div

                    className="

                      mt-3

                      text-center

                      text-[11px]

                      text-white/35

                    "

                  >

                    Track {songIndex + 1} of {songs.length}

                  </div>

                )}

              </div>

            </div>

          </div>

        </div>

        {/* RANDOM FACT */}
        <div className="mt-6 sm:mt-8">
          <div className="relative overflow-hidden rounded-[28px] border border-white/80 bg-white/90 p-5 sm:p-7 shadow-[0_20px_55px_rgba(79,43,160,0.10)] backdrop-blur-md">
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-purple-200/40 blur-3xl" />
            <div className="absolute -bottom-20 -left-12 h-36 w-36 rounded-full bg-pink-200/30 blur-3xl" />
            <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f0e8ff] text-2xl">🧠</div>
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-[#6a32e9]">
                    <span className="h-2 w-2 rounded-full bg-[#7c3aed]" />
                    Random Fact
                  </div>
                  <h3 className="mt-1 text-xl font-semibold text-[#171c3d] sm:text-2xl">Did You Know?</h3>
                  <p key={factIndex} className="mt-2 max-w-4xl text-sm leading-6 text-[#69738e] sm:text-base">{currentFact}</p>
                </div>
              </div>
              <button type="button" onClick={nextFact} className="shrink-0 rounded-xl bg-gradient-to-r from-[#7130ff] to-[#4b20ed] px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-purple-200 transition hover:-translate-y-0.5 hover:shadow-lg active:scale-95">Next Fact →</button>
            </div>
          </div>
        </div>
      </section>

    </div>

  );

};

/* =========================================================

   CATEGORY

========================================================= */

const Category = ({

  children,

  active = false,

}) => {

  return (

    <button

      type="button"

      className={`

        px-4

        sm:px-5

        h-[31px]

        sm:h-[33px]

        rounded-full

        text-[12px]

        sm:text-[13px]

        font-medium

        whitespace-nowrap

        transition

        duration-200

        shrink-0

        ${

          active

            ? "bg-gradient-to-r from-[#7630ff] to-[#5420ee] text-white shadow-md shadow-purple-200"

            : "bg-white/70 text-[#27304c] hover:bg-white"

        }

      `}

    >

      {children}

    </button>

  );

};

/* =========================================================

   FEATURE CARD

========================================================= */

const FeatureCard = ({

  icon,

  title,

  subtitle,

  type,

  onClick,

}) => {

  const styles = {

    purple: {

      bg: "bg-[#f1eaff]",

      icon: "text-[#6526ed]",

      arrow: "bg-[#e7d9ff] text-[#6526ed]",

    },

    blue: {

      bg: "bg-[#eaf3ff]",

      icon: "text-[#2382e8]",

      arrow: "bg-[#d8ebff] text-[#2382e8]",

    },

    orange: {

      bg: "bg-[#fff3e5]",

      icon: "text-[#f5a315]",

      arrow: "bg-[#ffe8c9] text-[#f5a315]",

    },

    green: {

      bg: "bg-[#e9faf3]",

      icon: "text-[#18b886]",

      arrow: "bg-[#d2f5e7] text-[#18b886]",

    },

    pink: {

      bg: "bg-[#ffedf7]",

      icon: "text-[#f22d8a]",

      arrow: "bg-[#ffd9ed] text-[#f22d8a]",

    },

  };

  const s = styles[type];

  return (

    <div

      className={`

        ${s.bg}

        rounded-[17px]

        lg:rounded-[18px]

        p-3

        min-h-[88px]

        sm:min-h-[96px]

        lg:min-h-[94px]

        xl:min-h-[102px]

        flex

        items-center

        gap-2

        lg:gap-2.5

        relative

        overflow-hidden

        transition-transform

        duration-200

        ${onClick ? "cursor-pointer hover:-translate-y-0.5" : ""}

      `}

        role={onClick ? "button" : undefined}

        tabIndex={onClick ? 0 : undefined}
        aria-label={onClick ? `${title} - StudyGem` : undefined}

        onClick={onClick}

        onKeyDown={(event) => {

          if (onClick && (event.key === "Enter" || event.key === " ")) {

            event.preventDefault();

            onClick();

          }

        }}>

      <div

        className={`

          w-[40px]

          h-[40px]

          sm:w-[44px]

          sm:h-[44px]

          lg:w-[44px]

          lg:h-[44px]

          rounded-full

          bg-white/65

          flex

          items-center

          justify-center

          shrink-0

          ${s.icon}

        `}

      >

        {icon}

      </div>

      <div className="min-w-0 pr-5">

        <h3

          className="

            text-[13px]

            lg:text-[14px]

            xl:text-[15px]

            font-bold

            text-[#121a38]

            leading-tight

            break-words

          "

        >

          {title}

        </h3>

        <p

          className="

            mt-1

            text-[10px]

            lg:text-[10px]

            xl:text-[11px]

            leading-[14px]

            xl:leading-[16px]

            text-[#69738e]

          "

        >

          {subtitle}

        </p>

      </div>

      <div

        className={`

          absolute

          right-2

          lg:right-2.5

          bottom-2

          lg:bottom-2.5

          w-[22px]

          h-[22px]

          lg:w-[24px]

          lg:h-[24px]

          rounded-full

          flex

          items-center

          justify-center

          ${s.arrow}

        `}

      >

        <ArrowRight size={13} />

      </div>

    </div>

  );

};

/* =========================================================

   STAT

========================================================= */

const Stat = ({

  icon,

  number,

  label,

  type,

}) => {

  const styles = {

    purple: {

      bg: "bg-[#f0e8ff]",

      text: "text-[#6425ed]",

    },

    green: {

      bg: "bg-[#e1f8ef]",

      text: "text-[#13ad80]",

    },

    orange: {

      bg: "bg-[#fff0da]",

      text: "text-[#f0a019]",

    },

    pink: {

      bg: "bg-[#ffe8f4]",

      text: "text-[#ee398f]",

    },

  };

  const s = styles[type];

  return (

    <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">

      <div

        className={`

          w-[36px]

          h-[36px]

          sm:w-[40px]

          sm:h-[40px]

          lg:w-[42px]

          lg:h-[42px]

          rounded-full

          ${s.bg}

          ${s.text}

          flex

          items-center

          justify-center

          shrink-0

        `}

      >

        {icon}

      </div>

      <div className="min-w-0">

        <div

          className="

            text-[16px]

            sm:text-[18px]

            lg:text-[18px]

            font-extrabold

            text-[#101936]

            leading-none

          "

        >

          {number}

        </div>

        <div

          className="

            text-[10px]

            sm:text-[11px]

            text-[#69738e]

            mt-1

            whitespace-nowrap

          "

        >

          {label}

        </div>

      </div>

    </div>

  );

};

/* =========================================================

   DIVIDER

========================================================= */

const Divider = () => {

  return (

    <div className="h-[42px] w-px bg-[#cfc5f5]" />

  );

};

export default Home;
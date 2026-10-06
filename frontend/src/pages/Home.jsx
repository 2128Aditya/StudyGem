import {
  Search,
  ArrowRight,
  BookOpen,
  FileText,
  Trophy,
  Map,
  Bot,
  Users,
  UserRound,
  Star,
} from "lucide-react";

import Navbar from "../components/Navbar";
import homeBg from "../assets/new.png";

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
}) => {
  return (
    <div className="w-full min-h-screen bg-[#f8f6ff] overflow-x-hidden">
      {/* =========================
          NAVBAR
      ========================= */}
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
  activePage="home"
/>

      {/* =========================
          HERO
      ========================= */}
      <section
        className="
          relative
          w-full

          /* Mobile */
          min-h-[calc(100vh-64px)]
          px-4
          pt-[88px]
          pb-6

          max-[380px]:px-3

          /* Tablet */
          sm:px-6
          sm:pt-[92px]

          /* Desktop */
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
        {/* =========================
            MAIN CONTENT
        ========================= */}
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

            /* Desktop */
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
            {/* =========================
                BADGE
            ========================= */}
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

            {/* =========================
                SEARCH
            ========================= */}
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

            {/* =========================
                CATEGORY PILLS
            ========================= */}
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
              <Category active>DSA</Category>
              <Category>DBMS</Category>
              <Category>Operating System</Category>
              <Category>Computer Networks</Category>
              <Category>Aptitude</Category>
              <Category>Web Dev</Category>
            </div>

            {/* =========================
                FEATURE CARDS
            ========================= */}
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
                  icon={<BookOpen size={24} />}
                  title="Study Notes"
                  subtitle={
                    <>
                      Structured & Easy
                      <br />
                      to Learn
                    </>
                  }
                  type="purple"
                />

                <FeatureCard
                  icon={<FileText size={24} />}
                  title="Previous Year"
                  subtitle={<>Chapter-wise PYQs</>}
                  type="blue"
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
                />

                <FeatureCard
                  icon={<Users size={24} />}
                  title="Community"
                  subtitle={
                    <>
                      Learn & Discuss
                      <br />
                      Together
                    </>
                  }
                  type="purple"
                />
              </div>
            </div>

            {/* =========================
                STATS
            ========================= */}
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
                number="1M+"
                label="Learners"
                type="purple"
              />

              <div className="hidden lg:block">
                <Divider />
              </div>

              <Stat
                icon={<FileText size={22} />}
                number="50K+"
                label="PYQs"
                type="green"
              />

              <div className="hidden lg:block">
                <Divider />
              </div>

              <Stat
                icon={<Trophy size={22} />}
                number="10K+"
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
    </div>
  );
};

/* =========================================================
   CATEGORY
========================================================= */

const Category = ({ children, active = false }) => {
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

const FeatureCard = ({ icon, title, subtitle, type }) => {
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

        hover:-translate-y-0.5
      `}
    >
      {/* ICON */}
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

      {/* CONTENT */}
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

      {/* ARROW */}
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

const Stat = ({ icon, number, label, type }) => {
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
  return <div className="h-[42px] w-px bg-[#cfc5f5]" />;
};

export default Home;
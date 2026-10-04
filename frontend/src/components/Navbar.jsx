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
import homeBg from "../assets/home.png";

const Home = ({ onLogout }) => {
  return (
    <div className="w-full min-h-screen bg-[#f8f6ff]">
      {/* SEPARATE NAVBAR */}
      <Navbar onLogout={onLogout} />

      {/* HERO */}
      <section
        className="
          relative
          w-full
          min-h-screen
          bg-cover
          bg-center
          bg-no-repeat
        "
        style={{
          backgroundImage: `url(${homeBg})`,
        }}
      >
        {/* LEFT CONTENT */}
        <div
          className="
            relative
            w-full
            min-h-screen
            px-5
            sm:px-6
            pt-[105px]
            pb-10

            flex
            flex-col

            lg:absolute
            lg:left-[5.5%]
            lg:top-[88px]
            lg:bottom-0
            lg:w-[47%]
            lg:px-0
            lg:pt-0
            lg:pb-5
            lg:min-h-0
            lg:justify-center
          "
        >
          {/* BADGE */}
          <div
            className="
              w-fit
              flex
              items-center
              gap-2
              px-4
              py-2
              rounded-full
              bg-white/75
              backdrop-blur-sm
              shadow-[0_8px_25px_rgba(109,63,220,0.10)]
              text-[#6425ed]
              text-xs
              sm:text-sm
              font-semibold
              mb-5
              sm:mb-6
              lg:mb-8
            "
          >
            <span className="text-[#ffb51e] text-lg">✦</span>

            <span className="whitespace-nowrap">
              Everything you need for your learning journey
            </span>
          </div>

          {/* SEARCH */}
          <div
            className="
              w-full
              h-[58px]
              sm:h-[64px]
              lg:h-[68px]
              rounded-full
              bg-white/90
              backdrop-blur-md
              border
              border-white
              shadow-[0_12px_35px_rgba(74,40,160,0.12)]
              flex
              items-center
              pl-4
              sm:pl-5
              lg:pl-7
              pr-2
              sm:pr-3
              mb-4
            "
          >
            <Search
              size={22}
              className="text-[#6526ed] shrink-0 sm:w-[24px] sm:h-[24px]"
              strokeWidth={2.5}
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
                lg:px-5
                bg-transparent
                outline-none
                text-[#202743]
                text-[13px]
                sm:text-[14px]
                lg:text-[15px]
                placeholder:text-[#858da5]
              "
            />

            <button
              type="button"
              className="
                shrink-0
                w-[42px]
                h-[42px]
                sm:w-[46px]
                sm:h-[46px]
                lg:w-[48px]
                lg:h-[48px]
                rounded-full
                bg-gradient-to-r
                from-[#7130ff]
                to-[#4b20ed]
                text-white
                flex
                items-center
                justify-center
                shadow-md
                shadow-purple-200
              "
            >
              <ArrowRight size={21} className="sm:w-[23px] sm:h-[23px]" />
            </button>
          </div>

          {/* CATEGORY PILLS */}
          <div
            className="
              flex
              items-center
              gap-2
              sm:gap-3
              mb-5
              sm:mb-6
              lg:mb-7
              flex-wrap
            "
          >
            <Category active>DSA</Category>

            <Category>DBMS</Category>

            <Category>Operating System</Category>

            <Category>Computer Networks</Category>

            <Category>Aptitude</Category>

            <Category>Web Dev</Category>
          </div>

          {/* FEATURE CARDS */}
          <div
            className="
              w-full
              bg-white/72
              backdrop-blur-md
              rounded-[20px]
              sm:rounded-[25px]
              p-3
              sm:p-4
              border
              border-white/80
              shadow-[0_15px_40px_rgba(80,45,160,0.09)]
            "
          >
            <div
              className="
                grid
                grid-cols-2
                gap-3
                sm:gap-4
                lg:grid-cols-3
              "
            >
              <FeatureCard
                icon={<BookOpen size={23} />}
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
                icon={<FileText size={23} />}
                title="Previous Year"
                subtitle={
                  <>
                    Chapter-wise PYQs
                  </>
                }
                type="blue"
              />

              <FeatureCard
                icon={<Trophy size={23} />}
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
                icon={<Map size={23} />}
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
                icon={<Bot size={23} />}
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
                icon={<Users size={23} />}
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

          {/* STATS */}
          <div
            className="
              mt-4
              sm:mt-5
              w-full

              grid
              grid-cols-2
              gap-3
              sm:gap-4

              lg:flex
              lg:items-center
              lg:justify-between
              lg:gap-0

              px-3
              sm:px-4
              lg:px-5
              py-3
              rounded-[20px]
              sm:rounded-[22px]
              bg-white/65
              backdrop-blur-md
              border
              border-white/80
            "
          >
            <Stat
              icon={<UserRound size={21} />}
              number="1M+"
              label="Learners"
              type="purple"
            />

            <Divider />

            <Stat
              icon={<FileText size={21} />}
              number="50K+"
              label="PYQs"
              type="green"
            />

            <Divider />

            <Stat
              icon={<Trophy size={21} />}
              number="10K+"
              label="Mock Tests"
              type="orange"
            />

            <Divider />

            <Stat
              icon={<Star size={21} />}
              number="4.8/5"
              label="User Rating"
              type="pink"
            />
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
        h-[32px]
        sm:h-[34px]
        rounded-full
        text-[11px]
        sm:text-[12px]
        lg:text-[13px]
        font-medium
        whitespace-nowrap
        transition

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

        rounded-[16px]
        sm:rounded-[20px]

        p-3
        sm:p-4

        min-h-[105px]
        sm:min-h-[112px]

        flex
        items-center

        gap-2
        sm:gap-3

        relative

        min-w-0
      `}
    >
      {/* ICON */}
      <div
        className={`
          w-[38px]
          h-[38px]

          sm:w-[48px]
          sm:h-[48px]

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
            text-[12px]
            sm:text-[15px]
            font-bold
            text-[#121a38]
            leading-tight
          "
        >
          {title}
        </h3>

        <p
          className="
            mt-1
            text-[9px]
            sm:text-[11px]
            leading-[14px]
            sm:leading-[17px]
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
          sm:right-3
          bottom-2
          sm:bottom-3

          w-[22px]
          h-[22px]

          sm:w-[25px]
          sm:h-[25px]

          rounded-full
          flex
          items-center
          justify-center

          ${s.arrow}
        `}
      >
        <ArrowRight size={12} className="sm:w-[14px] sm:h-[14px]" />
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
    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
      <div
        className={`
          w-[38px]
          h-[38px]

          sm:w-[44px]
          sm:h-[44px]

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
            sm:text-[19px]
            font-extrabold
            text-[#101936]
            leading-none
          "
        >
          {number}
        </div>

        <div
          className="
            text-[9px]
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
    <div className="hidden lg:block h-[45px] w-px bg-[#cfc5f5]" />
  );
};

export default Home;
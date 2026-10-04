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
    <div className="w-full h-screen overflow-hidden bg-[#f8f6ff]">

      {/* SEPARATE NAVBAR */}
     <Navbar onLogout={onLogout} />

      {/* HERO */}
      <section
        className="
          relative
          w-full
          h-full
          overflow-hidden
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
            absolute
            left-[5.5%]
            top-[88px]
            bottom-0
            w-[47%]
            flex
            flex-col
            justify-center
            pb-5
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
              text-sm
              font-semibold
              mb-8
            "
          >
            <span className="text-[#ffb51e] text-lg">
              ✦
            </span>

            Everything you need for your learning journey
          </div>

          {/* SEARCH */}
          <div
            className="
              w-full
              h-[68px]
              rounded-full
              bg-white/90
              backdrop-blur-md
              border
              border-white
              shadow-[0_12px_35px_rgba(74,40,160,0.12)]
              flex
              items-center
              pl-7
              pr-3
              mb-4
            "
          >

            <Search
              size={25}
              strokeWidth={2.5}
              className="text-[#6526ed] shrink-0"
            />

            <input
              type="text"
              placeholder="Search for subjects, topics, notes, PYQs, mock tests..."
              className="
                flex-1
                h-full
                px-5
                bg-transparent
                outline-none
                text-[#202743]
                text-[15px]
                placeholder:text-[#858da5]
              "
            />

            <button
              type="button"
              className="
                w-[48px]
                h-[48px]
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
              <ArrowRight size={23} />
            </button>

          </div>

          {/* CATEGORY PILLS */}
          <div className="flex items-center gap-3 mb-7 flex-wrap">

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
              bg-white/72
              backdrop-blur-md
              rounded-[25px]
              p-4
              border
              border-white/80
              shadow-[0_15px_40px_rgba(80,45,160,0.09)]
            "
          >

            <div className="grid grid-cols-3 gap-4">

              <FeatureCard
                icon={<BookOpen size={25} />}
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
                icon={<FileText size={25} />}
                title="Previous Year"
                subtitle={
                  <>
                    Chapter-wise PYQs
                  </>
                }
                type="blue"
              />

              <FeatureCard
                icon={<Trophy size={25} />}
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
                icon={<Map size={25} />}
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
                icon={<Bot size={25} />}
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
                icon={<Users size={25} />}
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
              mt-5
              w-full
              flex
              items-center
              justify-between
              px-5
              py-3
              rounded-[22px]
              bg-white/65
              backdrop-blur-md
              border
              border-white/80
            "
          >

            <Stat
              icon={<UserRound size={23} />}
              number="1M+"
              label="Learners"
              type="purple"
            />

            <Divider />

            <Stat
              icon={<FileText size={23} />}
              number="50K+"
              label="PYQs"
              type="green"
            />

            <Divider />

            <Stat
              icon={<Trophy size={23} />}
              number="10K+"
              label="Mock Tests"
              type="orange"
            />

            <Divider />

            <Stat
              icon={<Star size={23} />}
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
        px-5
        h-[34px]
        rounded-full
        text-[13px]
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
        rounded-[20px]
        p-4
        min-h-[112px]
        flex
        items-center
        gap-3
        relative
      `}
    >

      {/* ICON */}
      <div
        className={`
          w-[48px]
          h-[48px]
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
      <div className="min-w-0">

        <h3 className="text-[15px] font-bold text-[#121a38] leading-tight">
          {title}
        </h3>

        <p className="mt-1 text-[11px] leading-[17px] text-[#69738e]">
          {subtitle}
        </p>

      </div>

      {/* ARROW */}
      <div
        className={`
          absolute
          right-3
          bottom-3
          w-[25px]
          h-[25px]
          rounded-full
          flex
          items-center
          justify-center
          ${s.arrow}
        `}
      >
        <ArrowRight size={14} />
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
    <div className="flex items-center gap-3">

      <div
        className={`
          w-[44px]
          h-[44px]
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

      <div>

        <div className="text-[19px] font-extrabold text-[#101936] leading-none">
          {number}
        </div>

        <div className="text-[11px] text-[#69738e] mt-1">
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
    <div className="h-[45px] w-px bg-[#cfc5f5]" />
  );
};


export default Home;
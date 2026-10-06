import { useState } from "react";

import {
  Home,
  BookOpen,
  FileText,
  ClipboardCheck,
  Bot,
  Map,
  Trophy,
  Target,
  UserCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import logo from "../assets/logo.png";

function Navbar({
  onLogout,
  onHome,
  onMockTests,
  onAI,
  onProfile,
  onRoadmaps,
  onTarget,
  onPYQ,
  onLeaderboard,
  activePage = "home",
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    {
      label: "Home",
      icon: Home,
      page: "home",
    },
    {
      label: "Current Affairs",
      icon: BookOpen,
      page: "notes",
    },
    {
      label: "PYQs",
      icon: FileText,
      page: "pyq",
    },
    {
      label: "Mock Tests",
      icon: ClipboardCheck,
      page: "mock",
    },
    {
      label: "AI Assistant",
      icon: Bot,
      page: "ai",
    },
    {
      label: "Roadmaps",
      icon: Map,
      page: "roadmaps",
    },
    {
      label: "Leaderboard",
      icon: Trophy,
      page: "leaderboard",
    },
    {
      label: "Target",
      icon: Target,
      page: "target",
    },
  ];

  // =========================
  // NAVIGATION
  // =========================

  const handleNavigation = (page) => {
    setMobileOpen(false);

    // HOME
    if (page === "home") {
      if (onHome) {
        onHome();
      }

      return;
    }

    // PYQ
    if (page === "pyq") {
      if (onPYQ) {
        onPYQ();
      }

      return;
    }

    // MOCK TESTS
    if (page === "mock") {
      if (onMockTests) {
        onMockTests();
      }

      return;
    }

    // AI ASSISTANT
    if (page === "ai") {
      if (onAI) {
        onAI();
      }

      return;
    }

    // ROADMAPS
    if (page === "roadmaps") {
      if (onRoadmaps) {
        onRoadmaps();
      }

      return;
    }

    // LEADERBOARD
    if (page === "leaderboard") {
      if (onLeaderboard) {
        onLeaderboard();
      }

      return;
    }

    // TARGET
    if (page === "target") {
      if (onTarget) {
        onTarget();
      }

      return;
    }

    // PROFILE
    if (page === "profile") {
      if (onProfile) {
        onProfile();
      }

      return;
    }

    // OTHER MODULES
    console.log(`${page} page is not connected yet.`);
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    setMobileOpen(false);

    if (onLogout) {
      onLogout();
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 z-50 w-full px-3 pt-3 sm:px-5 lg:px-7">
        <div className="mx-auto w-full rounded-2xl border border-white/80 bg-white/90 shadow-[0_8px_30px_rgba(80,45,160,0.10)] backdrop-blur-xl">

          {/* =================================================
              MAIN NAVBAR
          ================================================= */}

          <div className="flex h-[64px] items-center justify-between px-4 sm:px-5 lg:h-[70px] lg:px-6">

            {/* ================= LOGO ================= */}

            <button
              type="button"
              onClick={() => handleNavigation("home")}
              className="flex shrink-0 items-center gap-2 border-0 bg-transparent outline-none"
            >
              <img
                src={logo}
                alt="StudyGem"
                className="h-9 w-9 rounded-xl object-cover sm:h-10 sm:w-10"
              />

              <div className="hidden text-left sm:block">
                <div className="text-[18px] font-extrabold leading-none text-[#171d38] lg:text-[20px]">
                  Study
                  <span className="text-[#6d28f0]">
                    Gem
                  </span>
                </div>

                <div className="mt-1 hidden text-[9px] font-medium text-[#858da5] lg:block">
                  Learn · Practice · Grow · Achieve
                </div>
              </div>
            </button>

            {/* ================= DESKTOP NAV ================= */}

            <nav className="hidden items-center gap-1 xl:flex">
              {navItems.map((item) => {
                const Icon = item.icon;

                const active =
                  activePage === item.page;

                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() =>
                      handleNavigation(item.page)
                    }
                    className={`
                      flex items-center gap-1.5 rounded-xl px-3 py-2
                      text-[12px] font-semibold transition-all duration-200
                      ${
                        active
                          ? "bg-[#f0e9ff] text-[#6425ed]"
                          : "text-[#59627c] hover:bg-[#f6f2ff] hover:text-[#6425ed]"
                      }
                    `}
                  >
                    <Icon
                      size={16}
                      strokeWidth={2}
                    />

                    <span>
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* ================= RIGHT SIDE ================= */}

            <div className="hidden items-center gap-2 lg:flex">

              {/* PROFILE */}

              <button
                type="button"
                onClick={() =>
                  handleNavigation("profile")
                }
                className={`
                  flex items-center gap-2 rounded-xl border px-3 py-2
                  transition
                  ${
                    activePage === "profile"
                      ? "border-[#ded2ff] bg-[#f0e9ff] text-[#6425ed]"
                      : "border-[#eee8ff] bg-[#faf8ff] text-[#4d556e] hover:bg-[#f3edff]"
                  }
                `}
              >
                <UserCircle
                  size={21}
                  className="text-[#6d28f0]"
                />

                <span className="hidden text-[12px] font-semibold xl:block">
                  Profile
                </span>
              </button>

              {/* LOGOUT */}

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#7630ff] to-[#5420ee] px-3 py-2 text-[12px] font-semibold text-white shadow-md shadow-purple-200 transition hover:opacity-90"
              >
                <LogOut size={17} />

                <span className="hidden xl:block">
                  Logout
                </span>
              </button>
            </div>

            {/* ================= TABLET RIGHT ================= */}

            <div className="hidden items-center gap-2 sm:flex lg:hidden">

              {/* PROFILE */}

              <button
                type="button"
                onClick={() =>
                  handleNavigation("profile")
                }
                className={`
                  flex h-10 w-10 items-center justify-center rounded-xl
                  ${
                    activePage === "profile"
                      ? "bg-[#e9ddff] text-[#6425ed]"
                      : "bg-[#f3edff] text-[#6425ed]"
                  }
                `}
              >
                <UserCircle size={21} />
              </button>

              {/* LOGOUT */}

              <button
                type="button"
                onClick={handleLogout}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-[#7630ff] to-[#5420ee] text-white shadow-md shadow-purple-200"
              >
                <LogOut size={18} />
              </button>
            </div>

            {/* ================= MOBILE MENU BUTTON ================= */}

            <button
              type="button"
              onClick={() =>
                setMobileOpen(
                  (prev) => !prev
                )
              }
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f3edff] text-[#6425ed] sm:hidden"
            >
              {mobileOpen ? (
                <X size={22} />
              ) : (
                <Menu size={22} />
              )}
            </button>
          </div>

          {/* =================================================
              MOBILE MENU
          ================================================= */}

          {mobileOpen && (
            <div className="border-t border-[#eee8ff] px-4 pb-4 pt-3 sm:hidden">

              <div className="grid grid-cols-2 gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;

                  const active =
                    activePage === item.page;

                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() =>
                        handleNavigation(
                          item.page
                        )
                      }
                      className={`
                        flex items-center gap-2 rounded-xl px-3 py-3
                        text-left text-[12px] font-semibold
                        ${
                          active
                            ? "bg-[#f0e9ff] text-[#6425ed]"
                            : "bg-[#faf9ff] text-[#59627c]"
                        }
                      `}
                    >
                      <Icon size={17} />

                      <span>
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* MOBILE PROFILE + LOGOUT */}

              <div className="mt-3 grid grid-cols-2 gap-2">

                {/* PROFILE */}

                <button
                  type="button"
                  onClick={() =>
                    handleNavigation(
                      "profile"
                    )
                  }
                  className={`
                    flex items-center justify-center gap-2 rounded-xl
                    border py-3 text-[12px] font-semibold
                    ${
                      activePage === "profile"
                        ? "border-[#ded2ff] bg-[#f0e9ff] text-[#6425ed]"
                        : "border-[#eee8ff] bg-white text-[#59627c]"
                    }
                  `}
                >
                  <UserCircle size={18} />

                  Profile
                </button>

                {/* LOGOUT */}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#7630ff] to-[#5420ee] py-3 text-[12px] font-semibold text-white"
                >
                  <LogOut size={18} />

                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}

export default Navbar;
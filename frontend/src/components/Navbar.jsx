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

function Navbar({ onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    {
      label: "Home",
      icon: Home,
    },
    {
      label: "Notes",
      icon: BookOpen,
    },
    {
      label: "PYQs",
      icon: FileText,
    },
    {
      label: "Mock Tests",
      icon: ClipboardCheck,
    },
    {
      label: "AI Assistant",
      icon: Bot,
    },
    {
      label: "Roadmaps",
      icon: Map,
    },
    {
      label: "Leaderboard",
      icon: Trophy,
    },
    {
      label: "Target",
      icon: Target,
    },
  ];

  const handleLogout = () => {
    setMobileOpen(false);

    if (onLogout) {
      onLogout();
    }
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <header className="fixed top-0 left-0 z-50 w-full px-3 pt-3 sm:px-5 lg:px-7">
        <div
          className="
            mx-auto
            w-full
            rounded-2xl
            border
            border-white/80
            bg-white/90
            backdrop-blur-xl
            shadow-[0_8px_30px_rgba(80,45,160,0.10)]
          "
        >
          <div className="flex h-[64px] items-center justify-between px-4 sm:px-5 lg:h-[70px] lg:px-6">
            {/* ================= LOGO ================= */}
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="
                flex
                shrink-0
                items-center
                gap-2
                border-0
                bg-transparent
                outline-none
              "
            >
              <img
                src={logo}
                alt="StudyGem"
                className="
                  h-9
                  w-9
                  rounded-xl
                  object-cover
                  sm:h-10
                  sm:w-10
                "
              />

              <div className="hidden sm:block text-left">
                <div className="text-[18px] font-extrabold leading-none text-[#171d38] lg:text-[20px]">
                  Study<span className="text-[#6d28f0]">Gem</span>
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
                const active = item.label === "Home";

                return (
                  <button
                    key={item.label}
                    type="button"
                    className={`
                      flex
                      items-center
                      gap-1.5
                      rounded-xl
                      px-3
                      py-2
                      text-[12px]
                      font-semibold
                      transition-all
                      duration-200
                      ${
                        active
                          ? "bg-[#f0e9ff] text-[#6425ed]"
                          : "text-[#59627c] hover:bg-[#f6f2ff] hover:text-[#6425ed]"
                      }
                    `}
                  >
                    <Icon size={16} strokeWidth={2} />

                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* ================= RIGHT SIDE ================= */}
            <div className="hidden items-center gap-2 lg:flex">
              {/* PROFILE */}
              <button
                type="button"
                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-[#eee8ff]
                  bg-[#faf8ff]
                  px-3
                  py-2
                  text-[#4d556e]
                  transition
                  hover:bg-[#f3edff]
                "
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
                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-gradient-to-r
                  from-[#7630ff]
                  to-[#5420ee]
                  px-3
                  py-2
                  text-[12px]
                  font-semibold
                  text-white
                  shadow-md
                  shadow-purple-200
                  transition
                  hover:opacity-90
                "
              >
                <LogOut size={17} />

                <span className="hidden xl:block">
                  Logout
                </span>
              </button>
            </div>

            {/* ================= TABLET RIGHT ================= */}
            <div className="hidden items-center gap-2 sm:flex lg:hidden">
              <button
                type="button"
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#f3edff]
                  text-[#6425ed]
                "
              >
                <UserCircle size={21} />
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-gradient-to-r
                  from-[#7630ff]
                  to-[#5420ee]
                  text-white
                  shadow-md
                  shadow-purple-200
                "
              >
                <LogOut size={18} />
              </button>
            </div>

            {/* ================= MOBILE MENU BUTTON ================= */}
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-[#f3edff]
                text-[#6425ed]
                sm:hidden
              "
            >
              {mobileOpen ? (
                <X size={22} />
              ) : (
                <Menu size={22} />
              )}
            </button>
          </div>

          {/* ================= MOBILE MENU ================= */}
          {mobileOpen && (
            <div
              className="
                border-t
                border-[#eee8ff]
                px-4
                pb-4
                pt-3
                sm:hidden
              "
            >
              <div className="grid grid-cols-2 gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = item.label === "Home";

                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setMobileOpen(false)}
                      className={`
                        flex
                        items-center
                        gap-2
                        rounded-xl
                        px-3
                        py-3
                        text-left
                        text-[12px]
                        font-semibold
                        ${
                          active
                            ? "bg-[#f0e9ff] text-[#6425ed]"
                            : "bg-[#faf9ff] text-[#59627c]"
                        }
                      `}
                    >
                      <Icon size={17} />

                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* MOBILE PROFILE + LOGOUT */}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-[#eee8ff]
                    bg-white
                    py-3
                    text-[12px]
                    font-semibold
                    text-[#59627c]
                  "
                >
                  <UserCircle size={18} />

                  Profile
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-gradient-to-r
                    from-[#7630ff]
                    to-[#5420ee]
                    py-3
                    text-[12px]
                    font-semibold
                    text-white
                  "
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
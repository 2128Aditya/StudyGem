import { useState } from "react";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Users,
  ShieldCheck,
} from "lucide-react";

import newBg from "../assets/new.png";
import phoneBg from "../assets/phone.png";
import logo from "../assets/logo.png";

const Login = ({ onSignup, onForgotPassword, onLogin }) => {
  const [role, setRole] = useState("student");

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api/auth";

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed. Please try again.");
        return;
      }

      if (!data.user || data.user.role !== role) {
        setError(
          role === "admin"
            ? "This account is not registered as an admin."
            : "This account is not registered as a student."
        );
        return;
      }

      localStorage.setItem("studyGemToken", data.token);
      localStorage.setItem("studyGemUser", JSON.stringify(data.user));

      onLogin(data.user);
    } catch (err) {
      console.error("Login Error:", err);

      setError(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#eaf5ff]">
      {/* =====================================================
          DESKTOP BACKGROUND
      ====================================================== */}
      <img
        src={newBg}
        alt="StudyGem Background"
        className="
          absolute inset-0
          hidden md:block
          h-full w-full
          object-cover object-center
        "
      />

      {/* =====================================================
          MOBILE BACKGROUND
      ====================================================== */}
      <img
        src={phoneBg}
        alt="StudyGem Mobile Background"
        className="
          absolute inset-0
          block md:hidden
          h-full w-full
          object-cover object-center
        "
      />

      {/* =====================================================
          DESKTOP LOGIN FORM
      ====================================================== */}
      <div
        className="
          absolute
          hidden md:flex
          left-[5.8%]
          top-1/2
          -translate-y-1/2
          w-[38%]
          max-w-[600px]
          min-w-[480px]
          max-h-[94vh]
          overflow-hidden
          rounded-[28px]
          bg-white/95
          shadow-[0_20px_70px_rgba(72,110,170,0.15)]
          backdrop-blur-sm
          flex-col
        "
      >
        <div className="w-full px-[7%] py-7 lg:py-8 xl:py-9">
          {/* LOGO */}
          <div className="mb-4 flex items-center">
            <img
              src={logo}
              alt="StudyGem"
              className="h-[55px] w-auto object-contain"
            />
          </div>

          {/* HEADING */}
          <div>
            <h1
              className="
                text-[#081653]
                text-[30px]
                lg:text-[32px]
                xl:text-[35px]
                font-extrabold
                tracking-tight
              "
            >
              Welcome Back 👋
            </h1>

            <p className="mt-1 text-[#667294] text-sm lg:text-[14px]">
              Login to continue your learning journey
            </p>
          </div>

          {/* STUDENT / ADMIN */}
          <div className="mt-5 p-1 bg-[#f0eff9] rounded-xl grid grid-cols-2">
            <button
              type="button"
              onClick={() => {
                setRole("student");
                setError("");
              }}
              className={`
                h-[44px]
                rounded-[10px]
                text-sm
                font-semibold
                flex
                items-center
                justify-center
                gap-2
                transition-all
                ${
                  role === "student"
                    ? "bg-[#eee5ff] text-[#5c20f5] shadow-sm"
                    : "text-[#59627c]"
                }
              `}
            >
              <Users size={17} />
              Student Login
            </button>

            <button
              type="button"
              onClick={() => {
                setRole("admin");
                setError("");
              }}
              className={`
                h-[44px]
                rounded-[10px]
                text-sm
                font-semibold
                flex
                items-center
                justify-center
                gap-2
                transition-all
                ${
                  role === "admin"
                    ? "bg-[#eee5ff] text-[#5c20f5] shadow-sm"
                    : "text-[#59627c]"
                }
              `}
            >
              <ShieldCheck size={17} />
              Admin Login
            </button>
          </div>

          {/* FORM */}
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            {/* EMAIL */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#20294a]">
                Email Address
              </label>

              <div
                className="
                  h-[54px]
                  rounded-xl
                  border
                  border-[#dfe4ef]
                  bg-white
                  flex
                  items-center
                  gap-3
                  px-4
                  focus-within:border-[#6930ff]
                  focus-within:ring-4
                  focus-within:ring-purple-100
                "
              >
                <Mail
                  size={19}
                  className="shrink-0 text-[#61708f]"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter your email"
                  className="
                    h-full
                    w-full
                    bg-transparent
                    outline-none
                    text-[14px]
                    text-[#151b36]
                    placeholder:text-[#9aa1b3]
                  "
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#20294a]">
                Password
              </label>

              <div
                className="
                  h-[54px]
                  rounded-xl
                  border
                  border-[#dfe4ef]
                  bg-white
                  flex
                  items-center
                  gap-3
                  px-4
                  focus-within:border-[#6930ff]
                  focus-within:ring-4
                  focus-within:ring-purple-100
                "
              >
                <Lock
                  size={19}
                  className="shrink-0 text-[#61708f]"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter your password"
                  className="
                    h-full
                    w-full
                    bg-transparent
                    outline-none
                    text-[14px]
                    text-[#151b36]
                    placeholder:text-[#9aa1b3]
                  "
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="shrink-0 text-[#69738d]"
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {/* REMEMBER + FORGOT */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-[#20294a]">
                <input
                  type="checkbox"
                  defaultChecked
                  className="
                    h-5
                    w-5
                    accent-[#6425ed]
                    cursor-pointer
                  "
                />

                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={onForgotPassword}
                className="
                  text-sm
                  font-semibold
                  text-[#5425ff]
                  hover:text-[#3515ce]
                "
              >
                Forgot Password?
              </button>
            </div>

            {/* ERROR */}
            {error && (
              <p className="text-center text-xs font-medium text-red-500">
                {error}
              </p>
            )}

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                h-[52px]
                rounded-xl
                bg-gradient-to-r
                from-[#9635ff]
                to-[#4b20ff]
                text-white
                font-bold
                text-[15px]
                flex
                items-center
                justify-center
                gap-2
                shadow-lg
                shadow-purple-200
                transition-all
                hover:-translate-y-[1px]
                hover:shadow-purple-300
                disabled:opacity-70
                disabled:cursor-not-allowed
              "
            >
              {loading ? "Logging in..." : "Login"}

              <ArrowRight size={19} />
            </button>
          </form>

          {/* SIGN UP */}
          <div className="mt-5 flex items-center justify-center gap-2">
            <span className="text-sm text-[#69738d]">
              Don't have an account?
            </span>

            <button
              type="button"
              onClick={onSignup}
              className="
                text-sm
                font-bold
                text-[#4d20f5]
                hover:text-[#3214c7]
              "
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          MOBILE LOGIN FORM
      ====================================================== */}
      <div
        className="
          absolute
          left-1/2
          top-[43%]
          -translate-x-1/2
          -translate-y-1/2
          block
          md:hidden
          w-[86%]
          max-w-[370px]
          rounded-[22px]
          bg-white/96
          shadow-[0_18px_60px_rgba(48,91,150,0.16)]
          backdrop-blur-sm
        "
      >
        <div className="w-full px-5 py-5">
          {/* LOGO */}
          <div className="mb-3 flex justify-center">
            <img
              src={logo}
              alt="StudyGem"
              className="h-[42px] w-auto object-contain"
            />
          </div>

          {/* HEADING */}
          <div className="text-center">
            <h1
              className="
                text-[#081653]
                text-[25px]
                font-extrabold
                tracking-tight
              "
            >
              Welcome Back 👋
            </h1>

            <p className="mt-1 text-[#667294] text-[11px]">
              Login to continue your learning journey
            </p>
          </div>

          {/* STUDENT / ADMIN */}
          <div className="mt-4 p-1 bg-[#f0eff9] rounded-xl grid grid-cols-2">
            <button
              type="button"
              onClick={() => {
                setRole("student");
                setError("");
              }}
              className={`
                h-[36px]
                rounded-[9px]
                text-[10px]
                font-semibold
                flex
                items-center
                justify-center
                gap-1.5
                transition-all
                ${
                  role === "student"
                    ? "bg-[#eee5ff] text-[#5c20f5]"
                    : "text-[#59627c]"
                }
              `}
            >
              <Users size={13} />
              Student Login
            </button>

            <button
              type="button"
              onClick={() => {
                setRole("admin");
                setError("");
              }}
              className={`
                h-[36px]
                rounded-[9px]
                text-[10px]
                font-semibold
                flex
                items-center
                justify-center
                gap-1.5
                transition-all
                ${
                  role === "admin"
                    ? "bg-[#eee5ff] text-[#5c20f5]"
                    : "text-[#59627c]"
                }
              `}
            >
              <ShieldCheck size={13} />
              Admin Login
            </button>
          </div>

          {/* FORM */}
          <form onSubmit={handleLogin} className="mt-4 space-y-3">
            {/* EMAIL */}
            <div>
              <label className="mb-1.5 block text-[10px] font-semibold text-[#20294a]">
                Email Address
              </label>

              <div
                className="
                  h-[40px]
                  rounded-lg
                  border
                  border-[#dfe4ef]
                  bg-white
                  flex
                  items-center
                  gap-2
                  px-3
                  focus-within:border-[#6930ff]
                  focus-within:ring-2
                  focus-within:ring-purple-100
                "
              >
                <Mail
                  size={14}
                  className="shrink-0 text-[#61708f]"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter your email"
                  className="
                    h-full
                    w-full
                    bg-transparent
                    outline-none
                    text-[11px]
                    text-[#151b36]
                    placeholder:text-[#9aa1b3]
                  "
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="mb-1.5 block text-[10px] font-semibold text-[#20294a]">
                Password
              </label>

              <div
                className="
                  h-[40px]
                  rounded-lg
                  border
                  border-[#dfe4ef]
                  bg-white
                  flex
                  items-center
                  gap-2
                  px-3
                  focus-within:border-[#6930ff]
                  focus-within:ring-2
                  focus-within:ring-purple-100
                "
              >
                <Lock
                  size={14}
                  className="shrink-0 text-[#61708f]"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter your password"
                  className="
                    h-full
                    w-full
                    bg-transparent
                    outline-none
                    text-[11px]
                    text-[#151b36]
                    placeholder:text-[#9aa1b3]
                  "
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="shrink-0 text-[#69738d]"
                >
                  {showPassword ? (
                    <EyeOff size={14} />
                  ) : (
                    <Eye size={14} />
                  )}
                </button>
              </div>
            </div>

            {/* REMEMBER + FORGOT */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-[10px] text-[#20294a]">
                <input
                  type="checkbox"
                  defaultChecked
                  className="
                    h-3.5
                    w-3.5
                    accent-[#6425ed]
                    cursor-pointer
                  "
                />

                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={onForgotPassword}
                className="
                  text-[10px]
                  font-semibold
                  text-[#5425ff]
                "
              >
                Forgot Password?
              </button>
            </div>

            {/* ERROR */}
            {error && (
              <p className="text-center text-[9px] font-medium text-red-500">
                {error}
              </p>
            )}

            {/* LOGIN */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                h-[40px]
                rounded-lg
                bg-gradient-to-r
                from-[#9635ff]
                to-[#4b20ff]
                text-white
                font-bold
                text-[11px]
                flex
                items-center
                justify-center
                gap-2
                shadow-md
                shadow-purple-200
                disabled:opacity-70
              "
            >
              {loading ? "Logging in..." : "Login"}

              <ArrowRight size={15} />
            </button>
          </form>

          {/* SIGN UP — BOTTOM */}
          <div className="mt-4 flex items-center justify-center gap-1.5">
            <span className="text-[10px] text-[#69738d]">
              Don't have an account?
            </span>

            <button
              type="button"
              onClick={onSignup}
              className="
                text-[10px]
                font-bold
                text-[#4d20f5]
              "
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
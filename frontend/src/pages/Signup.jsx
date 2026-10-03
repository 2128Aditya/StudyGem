import { useState } from "react";

import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

import pp from "../assets/pp.png";

const Signup = ({ onLogin }) => {
  const [step, setStep] = useState("signup");

  const [role, setRole] = useState("student");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [agree, setAgree] = useState(false);

  const [otp, setOtp] = useState("");

  const [error, setError] = useState("");

  // ==========================================
  // CREATE ACCOUNT
  // ==========================================
  const handleCreateAccount = (e) => {
    e.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please create a password.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (!confirmPassword) {
      setError("Please confirm your password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agree) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    /*
      BACKEND LATER:
      Here we will call API to create pending account
      and send OTP to user's email.
    */

    setStep("otp");
  };

  // ==========================================
  // VERIFY OTP
  // ==========================================
  const handleVerifyOtp = (e) => {
    e.preventDefault();

    setError("");

    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    /*
      DEMO OTP
      Later this will be replaced by backend verification.
    */

    if (otp !== "123456") {
      setError("Invalid OTP. Please try again.");
      return;
    }

    setStep("success");
  };

  // ==========================================
  // RESEND OTP
  // ==========================================
  const handleResendOtp = () => {
    setOtp("");
    setError("");

    /*
      BACKEND LATER:
      API call will resend OTP to email.
    */

    alert(`OTP sent to ${email}`);
  };

  // ==========================================
  // SIGNUP SCREEN
  // ==========================================
  if (step === "signup") {
    return (
      <div className="min-h-screen w-full bg-[#f4f1ff] flex items-center justify-center p-2 sm:p-4 lg:p-6 overflow-hidden">

        {/* MAIN CONTAINER */}
        <div
          className="
            relative
            w-full
            h-[96vh]
            max-h-[900px]
            max-w-[1500px]
            overflow-hidden
            rounded-[22px]
            sm:rounded-[28px]
            shadow-[0_25px_80px_rgba(68,35,180,0.18)]
            bg-white
          "
        >

          {/* BACKGROUND */}
          <img
            src={pp}
            alt="StudyGem"
            className="
              absolute
              inset-0
              w-full
              h-full
              object-cover
              object-center
            "
          />

          {/* RIGHT SIGNUP AREA */}
          <div
            className="
              absolute
              right-0
              top-0
              h-full
              w-[43%]
              min-w-[500px]
              flex
              items-center
              justify-center
              px-8
              xl:px-12
              bg-white/5
            "
          >

            {/* FORM CONTAINER */}
            <div
              className="
                w-full
                max-w-[510px]
                max-h-full
                py-6
                sm:py-8
                lg:py-10
              "
            >

              {/* LOGIN LINK */}
              <div className="flex justify-end items-center gap-2 mb-5">

                <span className="text-sm text-[#69738d]">
                  Already have an account?
                </span>

                <button
                  type="button"
                  onClick={onLogin}
                  className="
                    text-sm
                    font-bold
                    text-[#4d20f5]
                    hover:text-[#3214c7]
                    transition
                  "
                >
                  Login
                </button>

              </div>

              {/* HEADING */}
              <div>

                <p className="text-[#6425ed] text-sm font-semibold mb-1">
                  Start your journey 🚀
                </p>

                <h1
                  className="
                    text-[#081653]
                    text-3xl
                    xl:text-[38px]
                    font-extrabold
                    tracking-tight
                  "
                >
                  Create Account
                </h1>

                <p className="mt-1 text-[#747d97] text-sm">
                  Join StudyGem and start learning smarter.
                </p>

              </div>

              {/* STUDENT / ADMIN */}
              <div className="mt-5 p-1 bg-[#eef0f8] rounded-xl grid grid-cols-2">

                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`
                    h-10
                    rounded-[10px]
                    text-sm
                    font-semibold
                    transition-all

                    ${
                      role === "student"
                        ? "bg-gradient-to-r from-[#8b32ff] to-[#4c20ff] text-white shadow-md"
                        : "text-[#48516d]"
                    }
                  `}
                >
                  Student
                </button>

                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`
                    h-10
                    rounded-[10px]
                    text-sm
                    font-semibold
                    transition-all

                    ${
                      role === "admin"
                        ? "bg-gradient-to-r from-[#8b32ff] to-[#4c20ff] text-white shadow-md"
                        : "text-[#48516d]"
                    }
                  `}
                >
                  Admin
                </button>

              </div>

              {/* GOOGLE / GITHUB */}
              <div className="mt-4 grid grid-cols-2 gap-3">

                <button
                  type="button"
                  className="
                    h-[44px]
                    rounded-xl
                    border border-[#dfe2eb]
                    bg-white/95
                    flex
                    items-center
                    justify-center
                    gap-2
                    text-sm
                    font-semibold
                    text-[#17203d]
                    hover:bg-white
                    hover:border-[#c8cce0]
                    transition
                  "
                >
                  <span className="text-lg font-bold text-[#4285F4]">
                    G
                  </span>

                  Google
                </button>

                <button
                  type="button"
                  className="
                    h-[44px]
                    rounded-xl
                    border border-[#dfe2eb]
                    bg-white/95
                    flex
                    items-center
                    justify-center
                    gap-2
                    text-sm
                    font-semibold
                    text-[#17203d]
                    hover:bg-white
                    hover:border-[#c8cce0]
                    transition
                  "
                >
                  <span className="text-lg font-bold text-black">
                    ●
                  </span>

                  GitHub
                </button>

              </div>

              {/* DIVIDER */}
              <div className="flex items-center gap-3 my-4">

                <div className="h-px flex-1 bg-[#d9dce7]" />

                <span className="text-xs text-[#707993]">
                  or
                </span>

                <div className="h-px flex-1 bg-[#d9dce7]" />

              </div>

              {/* FORM */}
              <form
                onSubmit={handleCreateAccount}
                className="space-y-3"
              >

                {/* FULL NAME */}
                <div>

                  <label className="block text-sm font-medium text-[#20294a] mb-1.5">
                    Full Name
                  </label>

                  <div
                    className="
                      h-[46px]
                      rounded-xl
                      border
                      border-[#dfe3ec]
                      bg-white/95
                      flex
                      items-center
                      gap-3
                      px-4
                      focus-within:border-[#6930ff]
                      focus-within:ring-4
                      focus-within:ring-purple-100
                    "
                  >

                    <User
                      size={18}
                      className="text-[#68738f] shrink-0"
                    />

                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setError("");
                      }}
                      placeholder="Enter your full name"
                      className="
                        w-full
                        h-full
                        outline-none
                        bg-transparent
                        text-sm
                        text-[#151b36]
                        placeholder:text-[#9aa1b3]
                      "
                    />

                  </div>

                </div>

                {/* EMAIL */}
                <div>

                  <label className="block text-sm font-medium text-[#20294a] mb-1.5">
                    Email Address
                  </label>

                  <div
                    className="
                      h-[46px]
                      rounded-xl
                      border
                      border-[#dfe3ec]
                      bg-white/95
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
                      size={18}
                      className="text-[#68738f] shrink-0"
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
                        w-full
                        h-full
                        outline-none
                        bg-transparent
                        text-sm
                        text-[#151b36]
                        placeholder:text-[#9aa1b3]
                      "
                    />

                  </div>

                </div>

                {/* PASSWORD */}
                <div>

                  <label className="block text-sm font-medium text-[#20294a] mb-1.5">
                    Password
                  </label>

                  <div
                    className="
                      h-[46px]
                      rounded-xl
                      border
                      border-[#dfe3ec]
                      bg-white/95
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
                      size={18}
                      className="text-[#68738f] shrink-0"
                    />

                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError("");
                      }}
                      placeholder="Create a password"
                      className="
                        w-full
                        h-full
                        outline-none
                        bg-transparent
                        text-sm
                        text-[#151b36]
                        placeholder:text-[#9aa1b3]
                      "
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="text-[#69738d] shrink-0"
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>

                  </div>

                </div>

                {/* CONFIRM PASSWORD */}
                <div>

                  <label className="block text-sm font-medium text-[#20294a] mb-1.5">
                    Confirm Password
                  </label>

                  <div
                    className="
                      h-[46px]
                      rounded-xl
                      border
                      border-[#dfe3ec]
                      bg-white/95
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
                      size={18}
                      className="text-[#68738f] shrink-0"
                    />

                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setError("");
                      }}
                      placeholder="Confirm your password"
                      className="
                        w-full
                        h-full
                        outline-none
                        bg-transparent
                        text-sm
                        text-[#151b36]
                        placeholder:text-[#9aa1b3]
                      "
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                      className="text-[#69738d] shrink-0"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>

                  </div>

                </div>

                {/* TERMS */}
                <div className="flex items-start gap-2 pt-1">

                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => {
                      setAgree(e.target.checked);
                      setError("");
                    }}
                    className="
                      mt-[2px]
                      w-4
                      h-4
                      accent-[#6425ed]
                    "
                  />

                  <p className="text-[11px] text-[#737b91] leading-relaxed">

                    I agree to StudyGem's{" "}

                    <button
                      type="button"
                      className="text-[#5425ff] font-semibold"
                    >
                      Terms of Service
                    </button>

                    {" "}and{" "}

                    <button
                      type="button"
                      className="text-[#5425ff] font-semibold"
                    >
                      Privacy Policy
                    </button>

                  </p>

                </div>

                {/* ERROR */}
                {error && (
                  <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-600">
                    {error}
                  </div>
                )}

                {/* CREATE ACCOUNT */}
                <button
                  type="submit"
                  className="
                    w-full
                    h-[48px]
                    rounded-xl
                    bg-gradient-to-r
                    from-[#9635ff]
                    to-[#4b20ff]
                    text-white
                    font-bold
                    text-sm
                    flex
                    items-center
                    justify-center
                    gap-2
                    shadow-lg
                    shadow-purple-200
                    hover:shadow-purple-300
                    hover:-translate-y-[1px]
                    transition-all
                  "
                >
                  Create Account

                  <ArrowRight size={19} />

                </button>

              </form>

            </div>

          </div>

        </div>
      </div>
    );
  }

  // ==========================================================
  // OTP SCREEN
  // ==========================================================
  if (step === "otp") {
    return (
      <div className="min-h-screen w-full bg-[#f4f1ff] flex items-center justify-center p-2 sm:p-4 lg:p-6 overflow-hidden">

        {/* SAME MAIN CONTAINER */}
        <div
          className="
            relative
            w-full
            h-[96vh]
            max-h-[900px]
            max-w-[1500px]
            overflow-hidden
            rounded-[22px]
            sm:rounded-[28px]
            shadow-[0_25px_80px_rgba(68,35,180,0.18)]
            bg-white
          "
        >

          {/* BACKGROUND */}
          <img
            src={pp}
            alt="StudyGem"
            className="
              absolute
              inset-0
              w-full
              h-full
              object-cover
              object-center
            "
          />

          {/* RIGHT AREA */}
          <div
            className="
              absolute
              right-0
              top-0
              h-full
              w-[43%]
              min-w-[500px]
              flex
              items-center
              justify-center
              px-8
              xl:px-12
              bg-white/5
            "
          >

            <div className="w-full max-w-[510px]">

              {/* BACK TO SIGNUP */}
              <div className="flex justify-start items-center mb-6">

                <button
                  type="button"
                  onClick={() => {
                    setStep("signup");
                    setOtp("");
                    setError("");
                  }}
                  className="
                    flex
                    items-center
                    gap-2
                    text-sm
                    font-semibold
                    text-[#69738d]
                    hover:text-[#4d20f5]
                    transition
                  "
                >
                  <ArrowLeft size={17} />
                  Back
                </button>

              </div>

              {/* ICON */}
              <div className="flex items-center justify-center mb-5">

                <div
                  className="
                    w-16
                    h-16
                    rounded-2xl
                    bg-purple-100
                    flex
                    items-center
                    justify-center
                  "
                >
                  <ShieldCheck
                    size={32}
                    className="text-[#6425ed]"
                  />
                </div>

              </div>

              {/* HEADING */}
              <div className="text-center">

                <p className="text-[#6425ed] text-sm font-semibold mb-1">
                  Almost there! ✨
                </p>

                <h1
                  className="
                    text-[#081653]
                    text-3xl
                    xl:text-[38px]
                    font-extrabold
                    tracking-tight
                  "
                >
                  Verify Email
                </h1>

                <p className="mt-2 text-[#747d97] text-sm">
                  We've sent a 6-digit OTP to
                </p>

                <p className="mt-1 text-[#20294a] text-sm font-semibold break-all">
                  {email}
                </p>

              </div>

              {/* OTP FORM */}
              <form
                onSubmit={handleVerifyOtp}
                className="mt-7"
              >

                <label className="block text-sm font-medium text-[#20294a] mb-1.5">
                  Enter OTP
                </label>

                <div
                  className="
                    h-[52px]
                    rounded-xl
                    border
                    border-[#dfe3ec]
                    bg-white/95
                    flex
                    items-center
                    gap-3
                    px-4
                    focus-within:border-[#6930ff]
                    focus-within:ring-4
                    focus-within:ring-purple-100
                  "
                >

                  <ShieldCheck
                    size={18}
                    className="text-[#68738f] shrink-0"
                  />

                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, "");

                      setOtp(value);
                      setError("");
                    }}
                    placeholder="Enter 6-digit OTP"
                    className="
                      w-full
                      h-full
                      outline-none
                      bg-transparent
                      text-center
                      tracking-[0.4em]
                      font-bold
                      text-lg
                      text-[#151b36]
                      placeholder:text-[#9aa1b3]
                      placeholder:tracking-normal
                      placeholder:font-normal
                    "
                  />

                </div>

                {/* DEMO OTP */}
                <p className="mt-2 text-center text-xs text-[#8a91a5]">
                  Demo OTP:{" "}
                  <span className="font-bold text-[#6425ed]">
                    123456
                  </span>
                </p>

                {/* ERROR */}
                {error && (
                  <div className="mt-4 rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-600 text-center">
                    {error}
                  </div>
                )}

                {/* VERIFY BUTTON */}
                <button
                  type="submit"
                  className="
                    mt-5
                    w-full
                    h-[48px]
                    rounded-xl
                    bg-gradient-to-r
                    from-[#9635ff]
                    to-[#4b20ff]
                    text-white
                    font-bold
                    text-sm
                    flex
                    items-center
                    justify-center
                    gap-2
                    shadow-lg
                    shadow-purple-200
                    hover:shadow-purple-300
                    hover:-translate-y-[1px]
                    transition-all
                  "
                >
                  Verify & Continue
                  <ArrowRight size={19} />
                </button>

              </form>

              {/* RESEND */}
              <div className="text-center mt-5">

                <span className="text-sm text-[#747d97]">
                  Didn't receive the code?{" "}
                </span>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="
                    text-sm
                    font-bold
                    text-[#4d20f5]
                    hover:text-[#3214c7]
                  "
                >
                  Resend OTP
                </button>

              </div>

            </div>

          </div>

        </div>
      </div>
    );
  }

  // ==========================================================
  // SUCCESS SCREEN
  // ==========================================================
  return (
    <div className="min-h-screen w-full bg-[#f4f1ff] flex items-center justify-center p-2 sm:p-4 lg:p-6 overflow-hidden">

      {/* SAME MAIN CONTAINER */}
      <div
        className="
          relative
          w-full
          h-[96vh]
          max-h-[900px]
          max-w-[1500px]
          overflow-hidden
          rounded-[22px]
          sm:rounded-[28px]
          shadow-[0_25px_80px_rgba(68,35,180,0.18)]
          bg-white
        "
      >

        {/* BACKGROUND */}
        <img
          src={pp}
          alt="StudyGem"
          className="
            absolute
            inset-0
            w-full
            h-full
            object-cover
            object-center
          "
        />

        {/* RIGHT AREA */}
        <div
          className="
            absolute
            right-0
            top-0
            h-full
            w-[43%]
            min-w-[500px]
            flex
            items-center
            justify-center
            px-8
            xl:px-12
            bg-white/5
          "
        >

          <div className="w-full max-w-[510px] text-center">

            {/* SUCCESS ICON */}
            <div className="flex justify-center mb-6">

              <div
                className="
                  w-20
                  h-20
                  rounded-full
                  bg-green-100
                  flex
                  items-center
                  justify-center
                "
              >
                <CheckCircle2
                  size={45}
                  className="text-green-500"
                />
              </div>

            </div>

            {/* TEXT */}
            <p className="text-[#6425ed] text-sm font-semibold mb-1">
              Welcome to StudyGem 🎉
            </p>

            <h1
              className="
                text-[#081653]
                text-3xl
                xl:text-[38px]
                font-extrabold
                tracking-tight
              "
            >
              Congratulations!
            </h1>

            <p className="mt-2 text-[#6425ed] text-base font-bold">
              Account Created Successfully
            </p>

            <p className="mt-3 text-[#747d97] text-sm leading-6">
              Your email has been verified successfully.
              <br />
              Your StudyGem account is ready to use.
            </p>

            {/* EMAIL BOX */}
            <div
              className="
                mt-6
                h-[52px]
                rounded-xl
                border
                border-[#dfe3ec]
                bg-white/95
                flex
                items-center
                justify-center
                gap-3
                px-4
              "
            >

              <Mail
                size={18}
                className="text-[#6425ed] shrink-0"
              />

              <span className="text-sm font-medium text-[#20294a] break-all">
                {email}
              </span>

            </div>

            {/* BACK TO LOGIN */}
            <button
              type="button"
              onClick={onLogin}
              className="
                mt-5
                w-full
                h-[48px]
                rounded-xl
                bg-gradient-to-r
                from-[#9635ff]
                to-[#4b20ff]
                text-white
                font-bold
                text-sm
                flex
                items-center
                justify-center
                gap-2
                shadow-lg
                shadow-purple-200
                hover:shadow-purple-300
                hover:-translate-y-[1px]
                transition-all
              "
            >
              Back to Login
              <ArrowRight size={19} />
            </button>

            <p className="mt-5 text-[11px] text-[#737b91]">
              Your StudyGem journey starts here 🚀
            </p>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Signup;
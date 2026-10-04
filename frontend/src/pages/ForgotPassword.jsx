import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

import pp from "../assets/pp.png";

const ForgotPassword = ({ onLogin }) => {
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");

  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api/auth";

  const [loading, setLoading] = useState(false);

  // ==========================================
  // STEP 1 - SEND OTP
  // ==========================================

  const handleSendOTP = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to send OTP."
        );
      }

      setOtp("");
      setError("");
      setStep(2);
    } catch (err) {
      console.error("Forgot Password Error:", err);

      setError(
        err.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // STEP 2 - VERIFY OTP
  // ==========================================

  const handleVerifyOTP = async (e) => {
  e.preventDefault();

  if (otp.length !== 6) {
    setError("Please enter a valid 6-digit OTP.");
    return;
  }

  setError("");
  setLoading(true);

  try {
    const response = await fetch(
      `${API_BASE_URL}/verify-reset-otp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: otp.trim(),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || "Invalid OTP");
      return;
    }

    // ONLY correct OTP comes here
    setError("");
    setStep(3);
  } catch (err) {
    console.error("OTP Verification Error:", err);
    setError("Unable to verify OTP. Please try again.");
  } finally {
    setLoading(false);
  }
};
  // ==========================================
  // STEP 3 - RESET PASSWORD
  // ==========================================

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must contain at least 8 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            otp: otp.trim(),
            newPassword: password,
            confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to reset password."
        );
      }

      setError("");
      setStep(4);
    } catch (err) {
      console.error("Reset Password Error:", err);

      setError(
        err.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f4f1ff] flex items-center justify-center p-2 sm:p-4 lg:p-6 overflow-hidden">

      {/* MAIN CARD */}

      <div
        className="
          relative
          w-full
          max-w-[1500px]
          h-[96vh]
          max-h-[900px]
          overflow-hidden
          rounded-[22px]
          sm:rounded-[28px]
          bg-white
          shadow-[0_25px_80px_rgba(68,35,180,0.18)]
        "
      >

        {/* BACKGROUND */}

        <img
          src={pp}
          alt="StudyGem"
          className="
            absolute inset-0
            w-full h-full
            object-cover object-center
          "
        />

        {/* RIGHT AREA */}

        <div
          className="
            absolute right-0 top-0 h-full
            w-[43%] min-w-[500px]
            flex items-center justify-center
            px-8 xl:px-12
            bg-white/5
          "
        >

          <div
            className="
              w-full max-w-[510px]
              max-h-full
              overflow-y-auto
              py-8 sm:py-10 lg:py-12
            "
          >

            {/* TOP LOGIN */}

            <div className="flex justify-end items-center gap-2 mb-7">
              <span className="text-sm text-[#69738d]">
                Remember your password?
              </span>

              <button
                type="button"
                onClick={onLogin}
                className="
                  text-sm font-bold
                  text-[#4d20f5]
                  hover:text-[#3214c7]
                "
              >
                Login
              </button>
            </div>

            {/* ICON */}

            <div
              className="
                w-14 h-14 rounded-2xl
                bg-gradient-to-br from-[#9335ff] to-[#4b20ff]
                flex items-center justify-center
                shadow-lg shadow-purple-200
                mb-5
              "
            >
              {step === 1 && (
                <Mail
                  size={26}
                  className="text-white"
                />
              )}

              {step === 2 && (
                <ShieldCheck
                  size={27}
                  className="text-white"
                />
              )}

              {step === 3 && (
                <Lock
                  size={26}
                  className="text-white"
                />
              )}

              {step === 4 && (
                <CheckCircle2
                  size={27}
                  className="text-white"
                />
              )}
            </div>

            {/* STEP INDICATOR */}

            {step !== 4 && (
              <div className="flex items-center gap-2 mb-5">

                <div
                  className={`
                    h-1.5 flex-1 rounded-full
                    ${
                      step >= 1
                        ? "bg-[#6730ff]"
                        : "bg-[#e5e7ef]"
                    }
                  `}
                />

                <div
                  className={`
                    h-1.5 flex-1 rounded-full
                    ${
                      step >= 2
                        ? "bg-[#6730ff]"
                        : "bg-[#e5e7ef]"
                    }
                  `}
                />

                <div
                  className={`
                    h-1.5 flex-1 rounded-full
                    ${
                      step >= 3
                        ? "bg-[#6730ff]"
                        : "bg-[#e5e7ef]"
                    }
                  `}
                />

              </div>
            )}

            {/* ================= STEP 1 ================= */}

            {step === 1 && (
              <>
                <h1
                  className="
                    text-[#081653]
                    text-3xl xl:text-[38px]
                    font-extrabold
                    tracking-tight
                  "
                >
                  Forgot Password?
                </h1>

                <p className="mt-2 text-[#747d97] text-sm leading-6">
                  Enter your registered email address and we'll
                  send you a verification OTP.
                </p>

                <form
                  onSubmit={handleSendOTP}
                  className="mt-7"
                >

                  <label className="block text-sm font-medium text-[#20294a] mb-1.5">
                    Email Address
                  </label>

                  <div
                    className="
                      h-[48px]
                      rounded-xl
                      border border-[#dfe3ec]
                      bg-white
                      flex items-center gap-3 px-4
                      focus-within:border-[#6930ff]
                      focus-within:ring-4
                      focus-within:ring-purple-100
                    "
                  >

                    <Mail
                      size={18}
                      className="text-[#68738f]"
                    />

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      placeholder="Enter your email address"
                      className="
                        w-full h-full
                        outline-none
                        bg-transparent
                        text-sm
                        text-[#151b36]
                        placeholder:text-[#9aa1b3]
                      "
                    />

                  </div>

                  {error && (
                    <p className="text-xs text-red-500 mt-2">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="
                      mt-5
                      w-full h-[48px]
                      rounded-xl
                      bg-gradient-to-r
                      from-[#9635ff] to-[#4b20ff]
                      text-white font-bold text-sm
                      flex items-center justify-center gap-2
                      shadow-lg shadow-purple-200
                      hover:-translate-y-[1px]
                      transition-all
                      disabled:opacity-60
                      disabled:cursor-not-allowed
                    "
                  >
                    {loading ? "Sending..." : "Send OTP"}

                    {!loading && (
                      <ArrowRight size={19} />
                    )}
                  </button>

                </form>

                <button
                  type="button"
                  onClick={onLogin}
                  className="
                    mt-6 mx-auto
                    flex items-center gap-2
                    text-sm font-semibold
                    text-[#5425ff]
                  "
                >
                  <ArrowLeft size={17} />
                  Back to Login
                </button>
              </>
            )}

            {/* ================= STEP 2 ================= */}

            {step === 2 && (
              <>
                <h1
                  className="
                    text-[#081653]
                    text-3xl xl:text-[38px]
                    font-extrabold
                    tracking-tight
                  "
                >
                  Verify OTP
                </h1>

                <p className="mt-2 text-[#747d97] text-sm leading-6">
                  We've sent a 6-digit verification code to
                  <span className="font-semibold text-[#5425ff]">
                    {" "}{email}
                  </span>
                </p>

                <form
                  onSubmit={handleVerifyOTP}
                  className="mt-7"
                >

                  <label className="block text-sm font-medium text-[#20294a] mb-1.5">
                    Verification Code
                  </label>

                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => {
                      setOtp(
                        e.target.value.replace(/\D/g, "")
                      );
                      setError("");
                    }}
                    placeholder="Enter 6-digit OTP"
                    className="
                      w-full h-[52px]
                      rounded-xl
                      border border-[#dfe3ec]
                      bg-white
                      outline-none
                      text-center
                      text-xl
                      font-bold
                      tracking-[8px]
                      text-[#151b36]
                      focus:border-[#6930ff]
                      focus:ring-4
                      focus:ring-purple-100
                    "
                  />

                  {error && (
                    <p className="text-xs text-red-500 mt-2">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="
                      mt-5
                      w-full h-[48px]
                      rounded-xl
                      bg-gradient-to-r
                      from-[#9635ff] to-[#4b20ff]
                      text-white font-bold text-sm
                      flex items-center justify-center gap-2
                      shadow-lg shadow-purple-200
                      hover:-translate-y-[1px]
                      transition-all
                      disabled:opacity-60
                      disabled:cursor-not-allowed
                    "
                  >
                    {loading ? "Verifying..." : "Verify OTP"}

                    {!loading && (
                      <ArrowRight size={19} />
                    )}
                  </button>

                </form>

                <div className="flex justify-center mt-5">

                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setOtp("");
                      setError("");
                    }}
                    className="
                      text-xs font-semibold
                      text-[#5425ff]
                    "
                  >
                    Change Email
                  </button>

                  <span className="mx-3 text-[#c7cad4]">
                    |
                  </span>

                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={loading}
                    className="
                      text-xs font-semibold
                      text-[#5425ff]
                      disabled:opacity-50
                    "
                  >
                    Resend OTP
                  </button>

                </div>
              </>
            )}

            {/* ================= STEP 3 ================= */}

            {step === 3 && (
              <>
                <h1
                  className="
                    text-[#081653]
                    text-3xl xl:text-[38px]
                    font-extrabold
                    tracking-tight
                  "
                >
                  Create New Password
                </h1>

                <p className="mt-2 text-[#747d97] text-sm leading-6">
                  Create a strong new password for your StudyGem
                  account.
                </p>

                <form
                  onSubmit={handleResetPassword}
                  className="mt-7 space-y-4"
                >

                  {/* NEW PASSWORD */}

                  <div>

                    <label className="block text-sm font-medium text-[#20294a] mb-1.5">
                      New Password
                    </label>

                    <div
                      className="
                        h-[48px]
                        rounded-xl
                        border border-[#dfe3ec]
                        bg-white
                        flex items-center gap-3 px-4
                        focus-within:border-[#6930ff]
                        focus-within:ring-4
                        focus-within:ring-purple-100
                      "
                    >

                      <Lock
                        size={18}
                        className="text-[#68738f]"
                      />

                      <input
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setError("");
                        }}
                        placeholder="Enter new password"
                        className="
                          w-full h-full
                          outline-none
                          bg-transparent
                          text-sm
                        "
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(!showPassword)
                        }
                        className="text-[#69738d]"
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
                        h-[48px]
                        rounded-xl
                        border border-[#dfe3ec]
                        bg-white
                        flex items-center gap-3 px-4
                        focus-within:border-[#6930ff]
                        focus-within:ring-4
                        focus-within:ring-purple-100
                      "
                    >

                      <Lock
                        size={18}
                        className="text-[#68738f]"
                      />

                      <input
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(
                            e.target.value
                          );
                          setError("");
                        }}
                        placeholder="Confirm new password"
                        className="
                          w-full h-full
                          outline-none
                          bg-transparent
                          text-sm
                        "
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            !showConfirmPassword
                          )
                        }
                        className="text-[#69738d]"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>

                    </div>

                  </div>

                  {error && (
                    <p className="text-xs text-red-500">
                      {error}
                    </p>
                  )}

                  {/* PASSWORD RULE */}

                  <div
                    className="
                      p-3 rounded-xl
                      bg-[#f7f5ff]
                      border border-[#e9e3ff]
                      text-xs text-[#73708a]
                    "
                  >
                    Password should contain at least
                    <span className="font-semibold text-[#5425ff]">
                      {" "}8 characters
                    </span>.
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="
                      w-full h-[48px]
                      rounded-xl
                      bg-gradient-to-r
                      from-[#9635ff] to-[#4b20ff]
                      text-white font-bold text-sm
                      flex items-center justify-center gap-2
                      shadow-lg shadow-purple-200
                      hover:-translate-y-[1px]
                      transition-all
                      disabled:opacity-60
                      disabled:cursor-not-allowed
                    "
                  >
                    {loading
                      ? "Resetting..."
                      : "Reset Password"}

                    {!loading && (
                      <ArrowRight size={19} />
                    )}
                  </button>

                </form>
              </>
            )}

            {/* ================= STEP 4 ================= */}

            {step === 4 && (
              <div className="text-center">

                <div
                  className="
                    mx-auto
                    w-16 h-16
                    rounded-full
                    bg-[#eee9ff]
                    flex items-center justify-center
                    mb-5
                  "
                >
                  <CheckCircle2
                    size={34}
                    className="text-[#5b25ee]"
                  />
                </div>

                <h1
                  className="
                    text-[#081653]
                    text-3xl
                    xl:text-[38px]
                    font-extrabold
                  "
                >
                  Password Reset!
                </h1>

                <p className="mt-2 text-[#747d97] text-sm leading-6">
                  Your password has been successfully updated.
                  You can now login with your new password.
                </p>

                <button
                  type="button"
                  onClick={onLogin}
                  className="
                    mt-7
                    w-full h-[48px]
                    rounded-xl
                    bg-gradient-to-r
                    from-[#9635ff] to-[#4b20ff]
                    text-white font-bold text-sm
                    flex items-center justify-center gap-2
                    shadow-lg shadow-purple-200
                    hover:-translate-y-[1px]
                    transition-all
                  "
                >
                  Back to Login
                  <ArrowRight size={19} />
                </button>

              </div>
            )}

            {/* FOOTER */}

            <p
              className="
                text-center
                text-[9px]
                text-[#7c849b]
                mt-8
              "
            >
              © 2026 StudyGem. All rights reserved.
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
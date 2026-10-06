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

import pp from "../assets/logo.png";
import newBg from "../assets/new.png";
import phoneBg from "../assets/phone.png";

const ForgotPassword = ({ onLogin }) => {
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE_URL =
    import.meta.env.VITE_API_URL || https://studygem-your-knowledge-your-growth.onrender.com/api/auth";

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

      setError("");
      setStep(3);
    } catch (err) {
      console.error("OTP Verification Error:", err);

      setError(
        "Unable to verify OTP. Please try again."
      );
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
    <div className="relative min-h-screen w-full overflow-hidden bg-[#eaf5ff]">

      {/* ================================================= */}
      {/* DESKTOP BACKGROUND */}
      {/* ================================================= */}

      <img
        src={newBg}
        alt="StudyGem Background"
        className="
          absolute
          inset-0
          hidden
          h-full
          w-full
          object-cover
          lg:block
        "
      />

      {/* ================================================= */}
      {/* PHONE BACKGROUND */}
      {/* ================================================= */}

      <img
        src={phoneBg}
        alt="StudyGem Background"
        className="
          absolute
          inset-0
          block
          h-full
          w-full
          object-cover
          lg:hidden
        "
      />

      {/* ================================================= */}
      {/* DESKTOP LAYOUT */}
      {/* ================================================= */}

      <div
        className="
          relative
          z-10
          hidden
          min-h-screen
          w-full
          items-center
          justify-start
          px-[6%]
          lg:flex
        "
      >
        {/* FORM CARD */}

        <div
          className="
            w-full
            max-w-[520px]
            rounded-[28px]
            bg-white
            px-10
            py-7
            shadow-[0_20px_70px_rgba(50,60,150,0.14)]
            xl:max-w-[540px]
            xl:px-12
            xl:py-8
          "
        >

          {/* TOP LOGIN */}

          <div className="mb-5 flex items-center justify-between">
            <img
              src={pp}
              alt="StudyGem"
              className="h-[52px] w-auto object-contain"
            />

            <div className="flex items-center gap-1.5 text-sm">
              <span className="text-[#69738d]">
                Remember your password?
              </span>

              <button
                type="button"
                onClick={onLogin}
                className="
                  font-bold
                  text-[#4d20f5]
                  transition
                  hover:text-[#3214c7]
                "
              >
                Login
              </button>
            </div>
          </div>

          {/* ICON */}

          <div
            className="
              mb-4
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-xl
              bg-gradient-to-br
              from-[#9335ff]
              to-[#4b20ff]
              shadow-lg
              shadow-purple-200
            "
          >
            {step === 1 && (
              <Mail
                size={23}
                className="text-white"
              />
            )}

            {step === 2 && (
              <ShieldCheck
                size={24}
                className="text-white"
              />
            )}

            {step === 3 && (
              <Lock
                size={23}
                className="text-white"
              />
            )}

            {step === 4 && (
              <CheckCircle2
                size={24}
                className="text-white"
              />
            )}
          </div>

          {/* STEP INDICATOR */}

          {step !== 4 && (
            <div className="mb-4 flex items-center gap-2">
              <div
                className={`h-1.5 flex-1 rounded-full ${
                  step >= 1
                    ? "bg-[#6730ff]"
                    : "bg-[#e5e7ef]"
                }`}
              />

              <div
                className={`h-1.5 flex-1 rounded-full ${
                  step >= 2
                    ? "bg-[#6730ff]"
                    : "bg-[#e5e7ef]"
                }`}
              />

              <div
                className={`h-1.5 flex-1 rounded-full ${
                  step >= 3
                    ? "bg-[#6730ff]"
                    : "bg-[#e5e7ef]"
                }`}
              />
            </div>
          )}

          {/* ================================================= */}
          {/* STEP 1 */}
          {/* ================================================= */}

          {step === 1 && (
            <>
              <h1
                className="
                  text-[30px]
                  font-extrabold
                  tracking-tight
                  text-[#081653]
                  xl:text-[34px]
                "
              >
                Forgot Password?
              </h1>

              <p className="mt-1.5 text-sm leading-6 text-[#747d97]">
                Enter your registered email address and
                we'll send you a verification OTP.
              </p>

              <form
                onSubmit={handleSendOTP}
                className="mt-5"
              >
                <label className="mb-1.5 block text-sm font-medium text-[#20294a]">
                  Email Address
                </label>

                <div
                  className="
                    flex
                    h-[46px]
                    items-center
                    gap-3
                    rounded-xl
                    border
                    border-[#dfe3ec]
                    bg-white
                    px-4
                    transition
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
                      h-full
                      w-full
                      bg-transparent
                      text-sm
                      text-[#151b36]
                      outline-none
                      placeholder:text-[#9aa1b3]
                    "
                  />
                </div>

                {error && (
                  <p className="mt-2 text-xs text-red-500">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    mt-4
                    flex
                    h-[46px]
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-gradient-to-r
                    from-[#9635ff]
                    to-[#4b20ff]
                    text-sm
                    font-bold
                    text-white
                    shadow-lg
                    shadow-purple-200
                    transition-all
                    hover:-translate-y-[1px]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {loading ? "Sending..." : "Send OTP"}

                  {!loading && (
                    <ArrowRight size={18} />
                  )}
                </button>
              </form>

              <button
                type="button"
                onClick={onLogin}
                className="
                  mx-auto
                  mt-5
                  flex
                  items-center
                  gap-2
                  text-sm
                  font-semibold
                  text-[#5425ff]
                "
              >
                <ArrowLeft size={16} />
                Back to Login
              </button>
            </>
          )}

          {/* ================================================= */}
          {/* STEP 2 */}
          {/* ================================================= */}

          {step === 2 && (
            <>
              <h1
                className="
                  text-[30px]
                  font-extrabold
                  tracking-tight
                  text-[#081653]
                  xl:text-[34px]
                "
              >
                Verify OTP
              </h1>

              <p className="mt-1.5 text-sm leading-6 text-[#747d97]">
                We've sent a 6-digit verification code to{" "}
                <span className="font-semibold text-[#5425ff]">
                  {email}
                </span>
              </p>

              <form
                onSubmit={handleVerifyOTP}
                className="mt-5"
              >
                <label className="mb-1.5 block text-sm font-medium text-[#20294a]">
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
                    h-[50px]
                    w-full
                    rounded-xl
                    border
                    border-[#dfe3ec]
                    bg-white
                    text-center
                    text-xl
                    font-bold
                    tracking-[8px]
                    text-[#151b36]
                    outline-none
                    focus:border-[#6930ff]
                    focus:ring-4
                    focus:ring-purple-100
                  "
                />

                {error && (
                  <p className="mt-2 text-xs text-red-500">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    mt-4
                    flex
                    h-[46px]
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-gradient-to-r
                    from-[#9635ff]
                    to-[#4b20ff]
                    text-sm
                    font-bold
                    text-white
                    shadow-lg
                    shadow-purple-200
                    transition-all
                    hover:-translate-y-[1px]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {loading
                    ? "Verifying..."
                    : "Verify OTP"}

                  {!loading && (
                    <ArrowRight size={18} />
                  )}
                </button>
              </form>

              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setOtp("");
                    setError("");
                  }}
                  className="
                    text-xs
                    font-semibold
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
                    text-xs
                    font-semibold
                    text-[#5425ff]
                    disabled:opacity-50
                  "
                >
                  Resend OTP
                </button>
              </div>
            </>
          )}

          {/* ================================================= */}
          {/* STEP 3 */}
          {/* ================================================= */}

          {step === 3 && (
            <>
              <h1
                className="
                  text-[30px]
                  font-extrabold
                  tracking-tight
                  text-[#081653]
                  xl:text-[34px]
                "
              >
                Create New Password
              </h1>

              <p className="mt-1.5 text-sm leading-6 text-[#747d97]">
                Create a strong new password for your
                StudyGem account.
              </p>

              <form
                onSubmit={handleResetPassword}
                className="mt-5 space-y-3.5"
              >
                {/* NEW PASSWORD */}

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#20294a]">
                    New Password
                  </label>

                  <div
                    className="
                      flex
                      h-[46px]
                      items-center
                      gap-3
                      rounded-xl
                      border
                      border-[#dfe3ec]
                      bg-white
                      px-4
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
                        h-full
                        w-full
                        bg-transparent
                        text-sm
                        outline-none
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
                  <label className="mb-1.5 block text-sm font-medium text-[#20294a]">
                    Confirm Password
                  </label>

                  <div
                    className="
                      flex
                      h-[46px]
                      items-center
                      gap-3
                      rounded-xl
                      border
                      border-[#dfe3ec]
                      bg-white
                      px-4
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
                        h-full
                        w-full
                        bg-transparent
                        text-sm
                        outline-none
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

                <div
                  className="
                    rounded-xl
                    border
                    border-[#e9e3ff]
                    bg-[#f7f5ff]
                    p-2.5
                    text-xs
                    text-[#73708a]
                  "
                >
                  Password should contain at least{" "}
                  <span className="font-semibold text-[#5425ff]">
                    8 characters
                  </span>
                  .
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    flex
                    h-[46px]
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-gradient-to-r
                    from-[#9635ff]
                    to-[#4b20ff]
                    text-sm
                    font-bold
                    text-white
                    shadow-lg
                    shadow-purple-200
                    transition-all
                    hover:-translate-y-[1px]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {loading
                    ? "Resetting..."
                    : "Reset Password"}

                  {!loading && (
                    <ArrowRight size={18} />
                  )}
                </button>
              </form>
            </>
          )}

          {/* ================================================= */}
          {/* STEP 4 */}
          {/* ================================================= */}

          {step === 4 && (
            <div className="text-center">

              <div
                className="
                  mx-auto
                  mb-4
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-full
                  bg-[#eee9ff]
                "
              >
                <CheckCircle2
                  size={34}
                  className="text-[#5b25ee]"
                />
              </div>

              <h1
                className="
                  text-[30px]
                  font-extrabold
                  text-[#081653]
                  xl:text-[34px]
                "
              >
                Password Reset!
              </h1>

              <p className="mt-2 text-sm leading-6 text-[#747d97]">
                Your password has been successfully
                updated. You can now login with your
                new password.
              </p>

              <button
                type="button"
                onClick={onLogin}
                className="
                  mt-6
                  flex
                  h-[46px]
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-gradient-to-r
                  from-[#9635ff]
                  to-[#4b20ff]
                  text-sm
                  font-bold
                  text-white
                  shadow-lg
                  shadow-purple-200
                  transition-all
                  hover:-translate-y-[1px]
                "
              >
                Back to Login
                <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* FOOTER */}

          <p
            className="
              mt-5
              text-center
              text-[9px]
              text-[#7c849b]
            "
          >
            © 2026 StudyGem. All rights reserved.
          </p>
        </div>
      </div>

      {/* ================================================= */}
      {/* MOBILE LAYOUT */}
      {/* ================================================= */}

      <div
        className="
          relative
          z-10
          flex
          min-h-screen
          w-full
          items-start
          justify-center
          px-4
          pt-[8vh]
          pb-[28vh]
          lg:hidden
        "
      >
        <div
          className="
            w-full
            max-w-[360px]
            rounded-[22px]
            bg-white/95
            px-5
            py-5
            shadow-[0_15px_45px_rgba(60,80,150,0.18)]
            backdrop-blur-sm
          "
        >

          {/* MOBILE TOP */}

          <div className="mb-4 flex items-center justify-between">
            <img
              src={pp}
              alt="StudyGem"
              className="h-[38px] w-auto object-contain"
            />

            <div className="flex items-center gap-1 text-[10px]">
              <span className="text-[#69738d]">
                Remember password?
              </span>

              <button
                type="button"
                onClick={onLogin}
                className="
                  font-bold
                  text-[#4d20f5]
                "
              >
                Login
              </button>
            </div>
          </div>

          {/* MOBILE ICON */}

          <div
            className="
              mb-3
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-gradient-to-br
              from-[#9335ff]
              to-[#4b20ff]
            "
          >
            {step === 1 && (
              <Mail
                size={19}
                className="text-white"
              />
            )}

            {step === 2 && (
              <ShieldCheck
                size={20}
                className="text-white"
              />
            )}

            {step === 3 && (
              <Lock
                size={19}
                className="text-white"
              />
            )}

            {step === 4 && (
              <CheckCircle2
                size={20}
                className="text-white"
              />
            )}
          </div>

          {/* MOBILE STEPS */}

          {step !== 4 && (
            <div className="mb-3 flex items-center gap-1.5">
              <div
                className={`h-1 flex-1 rounded-full ${
                  step >= 1
                    ? "bg-[#6730ff]"
                    : "bg-[#e5e7ef]"
                }`}
              />

              <div
                className={`h-1 flex-1 rounded-full ${
                  step >= 2
                    ? "bg-[#6730ff]"
                    : "bg-[#e5e7ef]"
                }`}
              />

              <div
                className={`h-1 flex-1 rounded-full ${
                  step >= 3
                    ? "bg-[#6730ff]"
                    : "bg-[#e5e7ef]"
                }`}
              />
            </div>
          )}

          {/* MOBILE STEP 1 */}

          {step === 1 && (
            <>
              <h1
                className="
                  text-[25px]
                  font-extrabold
                  tracking-tight
                  text-[#081653]
                "
              >
                Forgot Password?
              </h1>

              <p className="mt-1 text-[11px] leading-5 text-[#747d97]">
                Enter your registered email and we'll
                send you a verification OTP.
              </p>

              <form
                onSubmit={handleSendOTP}
                className="mt-4"
              >
                <label className="mb-1 block text-[11px] font-semibold text-[#20294a]">
                  Email Address
                </label>

                <div
                  className="
                    flex
                    h-[42px]
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-[#dfe3ec]
                    bg-white
                    px-3
                  "
                >
                  <Mail
                    size={15}
                    className="text-[#68738f]"
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
                      text-[11px]
                      outline-none
                    "
                  />
                </div>

                {error && (
                  <p className="mt-1.5 text-[9px] text-red-500">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    mt-3
                    flex
                    h-[42px]
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-gradient-to-r
                    from-[#9635ff]
                    to-[#4b20ff]
                    text-[11px]
                    font-bold
                    text-white
                    shadow-lg
                    shadow-purple-200
                    disabled:opacity-60
                  "
                >
                  {loading ? "Sending..." : "Send OTP"}

                  {!loading && (
                    <ArrowRight size={15} />
                  )}
                </button>
              </form>

              <button
                type="button"
                onClick={onLogin}
                className="
                  mx-auto
                  mt-4
                  flex
                  items-center
                  gap-1.5
                  text-[10px]
                  font-semibold
                  text-[#5425ff]
                "
              >
                <ArrowLeft size={13} />
                Back to Login
              </button>
            </>
          )}

          {/* MOBILE STEP 2 */}

          {step === 2 && (
            <>
              <h1
                className="
                  text-[25px]
                  font-extrabold
                  tracking-tight
                  text-[#081653]
                "
              >
                Verify OTP
              </h1>

              <p className="mt-1 text-[11px] leading-5 text-[#747d97]">
                We've sent a 6-digit code to{" "}
                <span className="font-semibold text-[#5425ff]">
                  {email}
                </span>
              </p>

              <form
                onSubmit={handleVerifyOTP}
                className="mt-4"
              >
                <label className="mb-1 block text-[11px] font-semibold text-[#20294a]">
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
                    h-[45px]
                    w-full
                    rounded-xl
                    border
                    border-[#dfe3ec]
                    bg-white
                    text-center
                    text-lg
                    font-bold
                    tracking-[6px]
                    outline-none
                    focus:border-[#6930ff]
                    focus:ring-4
                    focus:ring-purple-100
                  "
                />

                {error && (
                  <p className="mt-1.5 text-[9px] text-red-500">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    mt-3
                    flex
                    h-[42px]
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-gradient-to-r
                    from-[#9635ff]
                    to-[#4b20ff]
                    text-[11px]
                    font-bold
                    text-white
                    shadow-lg
                    shadow-purple-200
                    disabled:opacity-60
                  "
                >
                  {loading
                    ? "Verifying..."
                    : "Verify OTP"}

                  {!loading && (
                    <ArrowRight size={15} />
                  )}
                </button>
              </form>

              <div className="mt-3 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setOtp("");
                    setError("");
                  }}
                  className="
                    text-[9px]
                    font-semibold
                    text-[#5425ff]
                  "
                >
                  Change Email
                </button>

                <span className="mx-2 text-[#c7cad4]">
                  |
                </span>

                <button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={loading}
                  className="
                    text-[9px]
                    font-semibold
                    text-[#5425ff]
                  "
                >
                  Resend OTP
                </button>
              </div>
            </>
          )}

          {/* MOBILE STEP 3 */}

          {step === 3 && (
            <>
              <h1
                className="
                  text-[25px]
                  font-extrabold
                  tracking-tight
                  text-[#081653]
                "
              >
                Create New Password
              </h1>

              <p className="mt-1 text-[11px] leading-5 text-[#747d97]">
                Create a strong new password for your
                StudyGem account.
              </p>

              <form
                onSubmit={handleResetPassword}
                className="mt-4 space-y-3"
              >
                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-[#20294a]">
                    New Password
                  </label>

                  <div
                    className="
                      flex
                      h-[42px]
                      items-center
                      gap-2
                      rounded-xl
                      border
                      border-[#dfe3ec]
                      bg-white
                      px-3
                    "
                  >
                    <Lock
                      size={15}
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
                        h-full
                        w-full
                        bg-transparent
                        text-[11px]
                        outline-none
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
                        <EyeOff size={15} />
                      ) : (
                        <Eye size={15} />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-[#20294a]">
                    Confirm Password
                  </label>

                  <div
                    className="
                      flex
                      h-[42px]
                      items-center
                      gap-2
                      rounded-xl
                      border
                      border-[#dfe3ec]
                      bg-white
                      px-3
                    "
                  >
                    <Lock
                      size={15}
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
                      placeholder="Confirm password"
                      className="
                        h-full
                        w-full
                        bg-transparent
                        text-[11px]
                        outline-none
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
                        <EyeOff size={15} />
                      ) : (
                        <Eye size={15} />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-[9px] text-red-500">
                    {error}
                  </p>
                )}

                <div
                  className="
                    rounded-lg
                    border
                    border-[#e9e3ff]
                    bg-[#f7f5ff]
                    p-2
                    text-[9px]
                    text-[#73708a]
                  "
                >
                  Password should contain at least{" "}
                  <span className="font-semibold text-[#5425ff]">
                    8 characters
                  </span>
                  .
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    flex
                    h-[42px]
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-gradient-to-r
                    from-[#9635ff]
                    to-[#4b20ff]
                    text-[11px]
                    font-bold
                    text-white
                    shadow-lg
                    shadow-purple-200
                    disabled:opacity-60
                  "
                >
                  {loading
                    ? "Resetting..."
                    : "Reset Password"}

                  {!loading && (
                    <ArrowRight size={15} />
                  )}
                </button>
              </form>
            </>
          )}

          {/* MOBILE STEP 4 */}

          {step === 4 && (
            <div className="text-center">

              <div
                className="
                  mx-auto
                  mb-4
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-full
                  bg-[#eee9ff]
                "
              >
                <CheckCircle2
                  size={30}
                  className="text-[#5b25ee]"
                />
              </div>

              <h1
                className="
                  text-[25px]
                  font-extrabold
                  text-[#081653]
                "
              >
                Password Reset!
              </h1>

              <p className="mt-2 text-[11px] leading-5 text-[#747d97]">
                Your password has been successfully
                updated. You can now login with your
                new password.
              </p>

              <button
                type="button"
                onClick={onLogin}
                className="
                  mt-5
                  flex
                  h-[42px]
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-gradient-to-r
                  from-[#9635ff]
                  to-[#4b20ff]
                  text-[11px]
                  font-bold
                  text-white
                  shadow-lg
                  shadow-purple-200
                "
              >
                Back to Login
                <ArrowRight size={15} />
              </button>
            </div>
          )}

          <p
            className="
              mt-4
              text-center
              text-[8px]
              text-[#7c849b]
            "
          >
            © 2026 StudyGem. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
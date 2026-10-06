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

import pp from "../assets/logo.png";

import newBg from "../assets/new.png";

import phoneBg from "../assets/phone.png";

const Signup = ({ onLogin }) => {

  const [step, setStep] = useState("signup");

  // Signup is STUDENT only

  const role = "student";

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [agree, setAgree] = useState(false);

  const [otp, setOtp] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const API_BASE_URL =

    import.meta.env.VITE_API_URL ||  "https://studygem-your-knowledge-your-growth.onrender.com/api";

  // =========================================================

  // CREATE ACCOUNT

  // =========================================================

  const handleCreateAccount = async (e) => {

    e.preventDefault();

    setError("");

    if (!name.trim()) {

      return setError("Please enter your full name.");

    }

    if (!email.trim()) {

      return setError("Please enter your email address.");

    }

    if (!email.includes("@")) {

      return setError("Please enter a valid email address.");

    }

    if (!password) {

      return setError("Please create a password.");

    }

    if (password.length < 8) {

      return setError("Password must be at least 8 characters.");

    }

    if (!confirmPassword) {

      return setError("Please confirm your password.");

    }

    if (password !== confirmPassword) {

      return setError("Passwords do not match.");

    }

    if (!agree) {

      return setError(

        "Please agree to the Terms of Service and Privacy Policy."

      );

    }

    try {

      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/auth/signup`, {

        method: "POST",

        headers: {

          "Content-Type": "application/json",

        },

        body: JSON.stringify({

          name: name.trim(),

          email: email.trim().toLowerCase(),

          password,

          confirmPassword,

          role,

        }),

      });

      const data = await response.json();

      if (!response.ok) {

        setError(

          data.message || "Unable to create account. Please try again."

        );

        return;

      }

      setEmail(data.email || email.trim().toLowerCase());

      setOtp("");

      setStep("otp");

    } catch (error) {

      console.error("Signup API Error:", error);

      setError(

        "Unable to connect to the server. Please make sure the backend is running."

      );

    } finally {

      setLoading(false);

    }

  };

  // =========================================================

  // VERIFY OTP

  // =========================================================

  const handleVerifyOtp = async (e) => {

    e.preventDefault();

    setError("");

    if (!otp) {

      return setError("Please enter the OTP.");

    }

    if (otp.length !== 6) {

      return setError("Please enter a valid 6-digit OTP.");

    }

    try {

      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {

        method: "POST",

        headers: {

          "Content-Type": "application/json",

        },

        body: JSON.stringify({

          email: email.trim().toLowerCase(),

          otp,

        }),

      });

      const data = await response.json();

      if (!response.ok) {

        setError(data.message || "Invalid OTP. Please try again.");

        return;

      }

      if (data.token) {

        localStorage.setItem("studyGemToken", data.token);

      }

      if (data.user) {

        localStorage.setItem(

          "studyGemUser",

          JSON.stringify(data.user)

        );

      }

      setOtp("");

      setStep("success");

    } catch (error) {

      console.error("Verify OTP API Error:", error);

      setError("Unable to connect to the server. Please try again.");

    } finally {

      setLoading(false);

    }

  };

  // =========================================================

  // RESEND OTP

  // =========================================================

  const handleResendOtp = async () => {

    setOtp("");

    setError("");

    try {

      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {

        method: "POST",

        headers: {

          "Content-Type": "application/json",

        },

        body: JSON.stringify({

          email: email.trim().toLowerCase(),

        }),

      });

      const data = await response.json();

      if (!response.ok) {

        setError(

          data.message || "Unable to resend OTP. Please try again."

        );

        return;

      }

      alert("A new OTP has been sent to your email.");

    } catch (error) {

      console.error("Resend OTP API Error:", error);

      setError("Unable to connect to the server. Please try again.");

    } finally {

      setLoading(false);

    }

  };

  // =========================================================

  // SIGNUP SCREEN

  // =========================================================

  if (step === "signup") {

    return (

      <div

        className="

          relative

          h-dvh

          w-full

          overflow-hidden

          bg-[#eef6ff]

          flex

          items-center

          justify-center

          p-2

          sm:p-4

          lg:p-5

        "

      >

        {/* =================================================

            LAPTOP BACKGROUND

        ================================================== */}

        <div

          className="

            absolute

            inset-0

            hidden

            lg:block

            bg-cover

            bg-center

            bg-no-repeat

          "

          style={{

            backgroundImage: `url(${newBg})`,

          }}

        />

        {/* =================================================

            PHONE BACKGROUND

        ================================================== */}

        <div

          className="

            absolute

            inset-0

            block

            bg-cover

            bg-center

            bg-no-repeat

            lg:hidden

          "

          style={{

            backgroundImage: `url(${phoneBg})`,

          }}

        />

        {/* =================================================

            MAIN CARD

        ================================================== */}

        <div

          className="

            relative

            z-10

            w-full

            h-full

            lg:h-[92dvh]

            lg:max-h-[820px]

            lg:max-w-[1500px]

            overflow-hidden

            rounded-[22px]

            sm:rounded-[28px]

            lg:bg-transparent

            shadow-none

            lg:shadow-[0_25px_80px_rgba(68,35,180,0.16)]

          "

        >

          {/* =================================================

              LAPTOP FORM AREA

          ================================================== */}

          <div

            className="

              absolute

              top-1/2

              left-1/2

              -translate-x-1/2

              -translate-y-1/2

              w-[92%]

              max-w-[470px]

              rounded-[24px]

              bg-white

              px-6

              py-5

              shadow-[0_18px_60px_rgba(42,55,120,0.14)]

              lg:top-1/2

              lg:left-[4.5%]

              lg:translate-x-0

              lg:-translate-y-1/2

              lg:w-[39%]

              lg:max-w-[520px]

              lg:rounded-[26px]

              lg:px-8

              lg:py-6

              xl:px-9

              xl:py-7

            "

          >

            {/* LOGO */}

            <div className="flex items-center justify-center lg:justify-start">

              <img

                src={pp}

                alt="StudyGem"

                className="

                  h-10

                  w-auto

                  object-contain

                  lg:h-11

                "

              />

            </div>

            {/* TOP LOGIN */}

            <div className="mt-3 flex justify-end items-center gap-1.5">

              <span className="text-[11px] text-[#69738d] lg:text-xs">

                
              </span>

              

            </div>

            {/* HEADING */}

            <div className="mt-2">

              <p className="text-[#6425ed] text-xs font-semibold mb-0.5">

                Start your journey 🚀

              </p>

              <h1

                className="

                  text-[#081653]

                  text-[25px]

                  sm:text-[28px]

                  lg:text-[30px]

                  xl:text-[32px]

                  font-extrabold

                  tracking-tight

                "

              >

                Create Account

              </h1>

              <p className="mt-0.5 text-[#747d97] text-xs">

                Join StudyGem and start learning smarter.

              </p>

            </div>

            {/* STUDENT ONLY */}

            <div

              className="

                mt-4

                h-9

                rounded-xl

                bg-[#eef0f8]

                p-1

              "

            >

              <div

                className="

                  h-full

                  rounded-[9px]

                  bg-gradient-to-r

                  from-[#8b32ff]

                  to-[#4c20ff]

                  text-white

                  text-xs

                  font-semibold

                  flex

                  items-center

                  justify-center

                  shadow-md

                "

              >

                Student

              </div>

            </div>

            {/* DIVIDER */}

            <div className="flex items-center gap-2.5 my-3">

              <div className="h-px flex-1 bg-[#e0e3eb]" />

              <span className="text-[10px] text-[#707993]">

                Create your account

              </span>

              <div className="h-px flex-1 bg-[#e0e3eb]" />

            </div>

            {/* FORM */}

            <form

              onSubmit={handleCreateAccount}

              className="space-y-2.5"

            >

              {/* FULL NAME */}

              <div>

                <label className="block text-[11px] font-semibold text-[#20294a] mb-1">

                  Full Name

                </label>

                <div

                  className="

                    h-[40px]

                    lg:h-[42px]

                    rounded-xl

                    border

                    border-[#dfe3ec]

                    bg-white

                    flex

                    items-center

                    gap-2.5

                    px-3

                    focus-within:border-[#6930ff]

                    focus-within:ring-2

                    focus-within:ring-purple-100

                  "

                >

                  <User

                    size={16}

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

                      text-xs

                      text-[#151b36]

                      placeholder:text-[#9aa1b3]

                    "

                  />

                </div>

              </div>

              {/* EMAIL */}

              <div>

                <label className="block text-[11px] font-semibold text-[#20294a] mb-1">

                  Email Address

                </label>

                <div

                  className="

                    h-[40px]

                    lg:h-[42px]

                    rounded-xl

                    border

                    border-[#dfe3ec]

                    bg-white

                    flex

                    items-center

                    gap-2.5

                    px-3

                    focus-within:border-[#6930ff]

                    focus-within:ring-2

                    focus-within:ring-purple-100

                  "

                >

                  <Mail

                    size={16}

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

                      text-xs

                      text-[#151b36]

                      placeholder:text-[#9aa1b3]

                    "

                  />

                </div>

              </div>

              {/* PASSWORD */}

              <div>

                <label className="block text-[11px] font-semibold text-[#20294a] mb-1">

                  Password

                </label>

                <div

                  className="

                    h-[40px]

                    lg:h-[42px]

                    rounded-xl

                    border

                    border-[#dfe3ec]

                    bg-white

                    flex

                    items-center

                    gap-2.5

                    px-3

                    focus-within:border-[#6930ff]

                    focus-within:ring-2

                    focus-within:ring-purple-100

                  "

                >

                  <Lock

                    size={16}

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

                      text-xs

                      text-[#151b36]

                      placeholder:text-[#9aa1b3]

                    "

                  />

                  <button

                    type="button"

                    onClick={() =>

                      setShowPassword((prev) => !prev)

                    }

                    className="text-[#69738d] shrink-0"

                  >

                    {showPassword ? (

                      <EyeOff size={16} />

                    ) : (

                      <Eye size={16} />

                    )}

                  </button>

                </div>

              </div>

              {/* CONFIRM PASSWORD */}

              <div>

                <label className="block text-[11px] font-semibold text-[#20294a] mb-1">

                  Confirm Password

                </label>

                <div

                  className="

                    h-[40px]

                    lg:h-[42px]

                    rounded-xl

                    border

                    border-[#dfe3ec]

                    bg-white

                    flex

                    items-center

                    gap-2.5

                    px-3

                    focus-within:border-[#6930ff]

                    focus-within:ring-2

                    focus-within:ring-purple-100

                  "

                >

                  <Lock

                    size={16}

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

                      text-xs

                      text-[#151b36]

                      placeholder:text-[#9aa1b3]

                    "

                  />

                  <button

                    type="button"

                    onClick={() =>

                      setShowConfirmPassword(

                        (prev) => !prev

                      )

                    }

                    className="text-[#69738d] shrink-0"

                  >

                    {showConfirmPassword ? (

                      <EyeOff size={16} />

                    ) : (

                      <Eye size={16} />

                    )}

                  </button>

                </div>

              </div>

              {/* TERMS */}

              <div className="flex items-start gap-2 pt-0.5">

                <input

                  type="checkbox"

                  checked={agree}

                  onChange={(e) => {

                    setAgree(e.target.checked);

                    setError("");

                  }}

                  className="

                    mt-[2px]

                    w-3.5

                    h-3.5

                    accent-[#6425ed]

                    shrink-0

                  "

                />

                <p className="text-[9px] lg:text-[10px] text-[#737b91] leading-relaxed">

                  I agree to StudyGem's{" "}

                  <button

                    type="button"

                    className="text-[#5425ff] font-semibold"

                  >

                    Terms of Service

                  </button>{" "}

                  and{" "}

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

                <div

                  className="

                    rounded-lg

                    bg-red-50

                    border

                    border-red-200

                    px-2.5

                    py-1.5

                    text-[10px]

                    text-red-600

                  "

                >

                  {error}

                </div>

              )}

              {/* CREATE ACCOUNT */}

              <button

                type="submit"

                disabled={loading}

                className="

                  w-full

                  h-[42px]

                  lg:h-[44px]

                  rounded-xl

                  bg-gradient-to-r

                  from-[#9635ff]

                  to-[#4b20ff]

                  text-white

                  font-bold

                  text-xs

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

                {loading

                  ? "Creating Account..."

                  : "Create Account"}

                {!loading && <ArrowRight size={17} />}

              </button>

            </form>

            {/* BOTTOM LOGIN */}

            <div className="mt-3 text-center">

              <span className="text-[10px] text-[#737b91]">

                Already have an account?{" "}

              </span>

              <button

                type="button"

                onClick={onLogin}

                className="

                  text-[10px]

                  font-bold

                  text-[#5425ff]

                  hover:text-[#3214c7]

                "

              >

                Login

              </button>

            </div>

          </div>

        </div>

      </div>

    );

  }

  // =========================================================

  // OTP SCREEN

  // =========================================================

  if (step === "otp") {

    return (

      <div

        className="

          relative

          h-dvh

          w-full

          overflow-hidden

          bg-[#eef6ff]

          flex

          items-center

          justify-center

          p-2

          sm:p-4

          lg:p-5

        "

      >

        {/* LAPTOP BG */}

        <div

          className="

            absolute

            inset-0

            hidden

            lg:block

            bg-cover

            bg-center

          "

          style={{

            backgroundImage: `url(${newBg})`,

          }}

        />

        {/* PHONE BG */}

        <div

          className="

            absolute

            inset-0

            block

            lg:hidden

            bg-cover

            bg-center

          "

          style={{

            backgroundImage: `url(${phoneBg})`,

          }}

        />

        <div

          className="

            relative

            z-10

            w-[92%]

            max-w-[470px]

            rounded-[24px]

            bg-white

            p-6

            shadow-[0_18px_60px_rgba(42,55,120,0.14)]

            lg:w-[39%]

            lg:max-w-[500px]

            lg:right-[-25%]

            lg:translate-x-0

          "

        >

          <div className="flex justify-start">

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

                gap-1.5

                text-xs

                font-semibold

                text-[#69738d]

                hover:text-[#4d20f5]

              "

            >

              <ArrowLeft size={16} />

              Back

            </button>

          </div>

          <div className="flex justify-center mt-4 mb-4">

            <div

              className="

                w-14

                h-14

                rounded-2xl

                bg-purple-100

                flex

                items-center

                justify-center

              "

            >

              <ShieldCheck

                size={28}

                className="text-[#6425ed]"

              />

            </div>

          </div>

          <div className="text-center">

            <p className="text-[#6425ed] text-xs font-semibold">

              Almost there! ✨

            </p>

            <h1

              className="

                text-[#081653]

                text-2xl

                lg:text-3xl

                font-extrabold

              "

            >

              Verify Email

            </h1>

            <p className="mt-1 text-[#747d97] text-xs">

              We've sent a 6-digit OTP to

            </p>

            <p className="mt-1 text-[#20294a] text-xs font-semibold break-all">

              {email}

            </p>

          </div>

          <form

            onSubmit={handleVerifyOtp}

            className="mt-5"

          >

            <label className="block text-xs font-medium text-[#20294a] mb-1.5">

              Enter OTP

            </label>

            <div

              className="

                h-[48px]

                rounded-xl

                border

                border-[#dfe3ec]

                bg-white

                flex

                items-center

                gap-3

                px-3

                focus-within:border-[#6930ff]

                focus-within:ring-2

                focus-within:ring-purple-100

              "

            >

              <ShieldCheck

                size={17}

                className="text-[#68738f]"

              />

              <input

                type="text"

                inputMode="numeric"

                maxLength={6}

                value={otp}

                onChange={(e) => {

                  const value = e.target.value.replace(

                    /\D/g,

                    ""

                  );

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

                  tracking-[0.35em]

                  font-bold

                  text-base

                  text-[#151b36]

                  placeholder:text-[#9aa1b3]

                  placeholder:tracking-normal

                  placeholder:font-normal

                "

              />

            </div>

            <p className="mt-2 text-center text-[10px] text-[#8a91a5]">

              Check your email inbox for the 6-digit verification code.

            </p>

            {error && (

              <div

                className="

                  mt-3

                  rounded-lg

                  bg-red-50

                  border

                  border-red-200

                  px-3

                  py-2

                  text-[10px]

                  text-red-600

                  text-center

                "

              >

                {error}

              </div>

            )}

            <button

              type="submit"

              disabled={loading}

              className="

                mt-4

                w-full

                h-[44px]

                rounded-xl

                bg-gradient-to-r

                from-[#9635ff]

                to-[#4b20ff]

                text-white

                font-bold

                text-xs

                flex

                items-center

                justify-center

                gap-2

                shadow-lg

                shadow-purple-200

              "

            >

              {loading

                ? "Verifying..."

                : "Verify & Continue"}

              {!loading && <ArrowRight size={17} />}

            </button>

          </form>

          <div className="text-center mt-4">

            <span className="text-xs text-[#747d97]">

              Didn't receive the code?{" "}

            </span>

            <button

              type="button"

              onClick={handleResendOtp}

              disabled={loading}

              className="

                text-xs

                font-bold

                text-[#4d20f5]

              "

            >

              {loading ? "Sending..." : "Resend OTP"}

            </button>

          </div>

        </div>

      </div>

    );

  }

  // =========================================================

  // SUCCESS SCREEN

  // =========================================================

  return (

    <div

      className="

        relative

        h-dvh

        w-full

        overflow-hidden

        bg-[#eef6ff]

        flex

        items-center

        justify-center

        p-2

        sm:p-4

        lg:p-5

      "

    >

      <div

        className="

          absolute

          inset-0

          hidden

          lg:block

          bg-cover

          bg-center

        "

        style={{

          backgroundImage: `url(${newBg})`,

        }}

      />

      <div

        className="

          absolute

          inset-0

          block

          lg:hidden

          bg-cover

          bg-center

        "

        style={{

          backgroundImage: `url(${phoneBg})`,

        }}

      />

      <div

        className="

          relative

          z-10

          w-[92%]

          max-w-[470px]

          rounded-[24px]

          bg-white

          p-7

          text-center

          shadow-[0_18px_60px_rgba(42,55,120,0.14)]

        "

      >

        <div className="flex justify-center mb-4">

          <div

            className="

              w-16

              h-16

              rounded-full

              bg-green-100

              flex

              items-center

              justify-center

            "

          >

            <CheckCircle2

              size={38}

              className="text-green-500"

            />

          </div>

        </div>

        <img

          src={pp}

          alt="StudyGem"

          className="h-10 w-auto mx-auto mb-4"

        />

        <p className="text-[#6425ed] text-xs font-semibold">

          Welcome to StudyGem 🎉

        </p>

        <h1

          className="

            mt-1

            text-[#081653]

            text-2xl

            lg:text-3xl

            font-extrabold

          "

        >

          Congratulations!

        </h1>

        <p className="mt-2 text-[#6425ed] text-sm font-bold">

          Account Created Successfully

        </p>

        <p className="mt-3 text-[#747d97] text-xs leading-5">

          Your email has been verified successfully.

          <br />

          Your StudyGem account is ready to use.

        </p>

        <button

          type="button"

          onClick={onLogin}

          className="

            mt-6

            w-full

            h-[44px]

            rounded-xl

            bg-gradient-to-r

            from-[#9635ff]

            to-[#4b20ff]

            text-white

            text-xs

            font-bold

            flex

            items-center

            justify-center

            gap-2

          "

        >

          Go to Login

          <ArrowRight size={17} />

        </button>

      </div>

    </div>

  );

};

export default Signup;

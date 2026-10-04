import { useState } from "react";







import {



  Mail,



  Lock,



  Eye,



  EyeOff,



  ArrowRight,





} from "lucide-react";







import pp from "../assets/pp.png";







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

        headers: { "Content-Type": "application/json" },

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



      localStorage.setItem("studyGemToken", data.token);

      localStorage.setItem("studyGemUser", JSON.stringify(data.user));



      onLogin();

    } catch (err) {

      setError(

        "Unable to connect to the server. Please make sure the backend is running."

      );

    } finally {

      setLoading(false);

    }

  };







  return (



    <div className="min-h-screen w-full bg-[#f4f1ff] flex items-center justify-center p-2 sm:p-4 lg:p-6 overflow-hidden">







      <div



        className="



          relative w-full max-w-[1500px]



          h-[96vh] max-h-[900px]



          overflow-hidden rounded-[22px] sm:rounded-[28px]



          bg-white



          shadow-[0_25px_80px_rgba(68,35,180,0.18)]



        "



      >







        {/* Background */}



        <img



          src={pp}



          alt="StudyGem"



          className="absolute inset-0 w-full h-full object-cover object-center"



        />







        {/* Right Side */}



        <div



          className="



            absolute right-0 top-0 h-full



            w-[43%] min-w-[500px]



            flex items-center justify-center



            px-8 xl:px-12



            bg-white/5



          "



        >







          <div className="w-full max-w-[510px] max-h-full overflow-y-auto py-6 sm:py-8 lg:py-10">







            {/* Signup */}



            <div className="flex justify-end items-center gap-2 mb-5">







              <span className="text-sm text-[#69738d]">



                Don't have an account?



              </span>







              <button



                type="button"



                onClick={onSignup}



                className="text-sm font-bold text-[#4d20f5] hover:text-[#3214c7]"



              >



                Sign Up



              </button>







            </div>







            {/* Heading */}



            <h1 className="text-[#081653] text-3xl xl:text-[38px] font-extrabold tracking-tight">



              Welcome Back!



            </h1>







            <p className="mt-1 text-[#747d97] text-sm">



              Login to continue your learning journey with StudyGem.



            </p>







            {/* Role */}



            <div className="mt-5 p-1 bg-[#eef0f8] rounded-xl grid grid-cols-2">







              <button



                type="button"



                onClick={() => setRole("student")}



                className={`



                  h-10 rounded-[10px] text-sm font-semibold transition-all







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



                  h-10 rounded-[10px] text-sm font-semibold transition-all







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







            {/* Social */}



            <div className="mt-4 grid grid-cols-2 gap-3">







              <button



                type="button"



                className="



                  h-[44px] rounded-xl border border-[#dfe2eb]



                  bg-white flex items-center justify-center gap-2



                  text-sm font-semibold text-[#17203d]



                  hover:border-[#c8cce0]



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



                  h-[44px] rounded-xl border border-[#dfe2eb]



                  bg-white flex items-center justify-center gap-2



                  text-sm font-semibold text-[#17203d]



                  hover:border-[#c8cce0]



                "



              >



                <span className="text-lg font-bold text-black">



                  ●



                </span>







                GitHub



              </button>







            </div>







            {/* Divider */}



            <div className="flex items-center gap-3 my-4">







              <div className="h-px flex-1 bg-[#d9dce7]" />







              <span className="text-xs text-[#707993]">



                or



              </span>







              <div className="h-px flex-1 bg-[#d9dce7]" />







            </div>







            {/* Form */}



            <form



              onSubmit={handleLogin}



              className="space-y-3"



            >







              {/* Email */}



              <div>







                <label className="block text-sm font-medium text-[#20294a] mb-1.5">



                  Email or Phone



                </label>







                <div



                  className="



                    h-[46px] rounded-xl border border-[#dfe3ec]



                    bg-white flex items-center gap-3 px-4



                    focus-within:border-[#6930ff]



                    focus-within:ring-4 focus-within:ring-purple-100



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



                    placeholder="Enter your email"



                    className="



                      w-full h-full outline-none bg-transparent



                      text-sm text-[#151b36]



                      placeholder:text-[#9aa1b3]



                    "



                  />







                </div>







              </div>







              {/* Password */}



              <div>







                <label className="block text-sm font-medium text-[#20294a] mb-1.5">



                  Password



                </label>







                <div



                  className="



                    h-[46px] rounded-xl border border-[#dfe3ec]



                    bg-white flex items-center gap-3 px-4



                    focus-within:border-[#6930ff]



                    focus-within:ring-4 focus-within:ring-purple-100



                  "



                >







                  <Lock



                    size={18}



                    className="text-[#68738f]"



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



                      w-full h-full outline-none bg-transparent



                      text-sm text-[#151b36]



                      placeholder:text-[#9aa1b3]



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







              {/* Forgot */}



              <div className="flex justify-end">







                <button



                  type="button"



                  onClick={onForgotPassword}



                  className="



                    text-xs font-semibold



                    text-[#5425ff]



                    hover:text-[#3515ce]



                  "



                >



                  Forgot Password?



                </button>







              </div>







              {/* Login */}



              {error && (

                <p className="text-xs font-medium text-red-500 text-center mb-2">

                  {error}

                </p>

              )}



              <button



                type="submit"

                disabled={loading}



                className="



                  w-full h-[48px] rounded-xl



                  bg-gradient-to-r from-[#9635ff] to-[#4b20ff]



                  text-white font-bold text-sm



                  flex items-center justify-center gap-2



                  shadow-lg shadow-purple-200



                  hover:shadow-purple-300



                  hover:-translate-y-[1px]



                  transition-all



                "



              >



                {loading ? "Logging in..." : "Login"}







                <ArrowRight size={19} />







              </button>







            </form>







            {/* Other Login */}



            <div className="flex items-center gap-3 my-4">







              <div className="h-px flex-1 bg-[#d9dce7]" />







              <span className="text-[11px] text-[#68728b]">



                Other Login Options



              </span>







              <div className="h-px flex-1 bg-[#d9dce7]" />







            </div>







            <div className="flex justify-center gap-7">















              {/* Microsoft */}



              <button



                type="button"



                className="flex flex-col items-center gap-1 text-[11px] text-[#1d2645]"



              >







                <div



                  className="



                    w-[44px] h-[40px] rounded-xl bg-white



                    border border-[#e3e6ee] shadow-sm



                    flex items-center justify-center



                  "



                >







                  <div className="grid grid-cols-2 gap-[2px]">







                    <span className="w-[8px] h-[8px] bg-[#f25022]" />



                    <span className="w-[8px] h-[8px] bg-[#7fba00]" />



                    <span className="w-[8px] h-[8px] bg-[#00a4ef]" />



                    <span className="w-[8px] h-[8px] bg-[#ffb900]" />







                  </div>







                </div>







                Microsoft







              </button>







              {/* Apple */}



              <button



                type="button"



                className="flex flex-col items-center gap-1 text-[11px] text-[#1d2645]"



              >







                <div



                  className="



                    w-[44px] h-[40px] rounded-xl bg-white



                    border border-[#e3e6ee] shadow-sm



                    flex items-center justify-center text-xl



                  "



                >



                  



                </div>







                Apple ID







              </button>







            </div>







            <p className="text-center text-[9px] text-[#7c849b] mt-3">







              By continuing, you agree to our{" "}







              <span className="text-[#5425ff] font-semibold">



                Terms of Service



              </span>{" "}







              and{" "}







              <span className="text-[#5425ff] font-semibold">



                Privacy Policy



              </span>







              .







            </p>







          </div>







        </div>







      </div>







    </div>



  );



};







export default Login;
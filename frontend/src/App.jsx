import { useState } from "react";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";

function App() {
  // Check login status when app starts
  const [page, setPage] = useState(() => {
    const token = localStorage.getItem("studyGemToken");

    return token ? "home" : "login";
  });

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("studyGemToken");
    localStorage.removeItem("studyGemUser");

    setPage("login");
  };

  // =========================
  // LOGIN SUCCESS
  // =========================
  const handleLogin = () => {
    setPage("home");
  };

  // =========================
  // SIGNUP PAGE
  // =========================
  const handleSignup = () => {
    setPage("signup");
  };

  // =========================
  // FORGOT PASSWORD PAGE
  // =========================
  const handleForgotPassword = () => {
    setPage("forgot");
  };

  // =========================
  // BACK TO LOGIN
  // =========================
  const handleBackToLogin = () => {
    setPage("login");
  };

  return (
    <div className="min-h-screen w-full">
      {/* =========================
          LOGIN
      ========================= */}
      {page === "login" && (
        <Login
          onSignup={handleSignup}
          onForgotPassword={handleForgotPassword}
          onLogin={handleLogin}
        />
      )}

      {/* =========================
          SIGNUP
      ========================= */}
      {page === "signup" && (
        <Signup onLogin={handleBackToLogin} />
      )}

      {/* =========================
          FORGOT PASSWORD
      ========================= */}
      {page === "forgot" && (
        <ForgotPassword onLogin={handleBackToLogin} />
      )}

      {/* =========================
          HOME
      ========================= */}
      {page === "home" && (
        <Home onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
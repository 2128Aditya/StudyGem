import { useState } from "react";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";

function App() {
  const [page, setPage] = useState(() => {
    const token = localStorage.getItem("studyGemToken");

    return token ? "home" : "login";
  });

  const handleLogout = () => {
    localStorage.removeItem("studyGemToken");
    localStorage.removeItem("studyGemUser");

    setPage("login");
  };

  return (
    <div className="min-h-screen">

      {page === "login" && (
        <Login
          onSignup={() => setPage("signup")}
          onForgotPassword={() => setPage("forgot")}
          onLogin={() => setPage("home")}
        />
      )}

      {page === "signup" && (
        <Signup
          onLogin={() => setPage("login")}
        />
      )}

      {page === "forgot" && (
        <ForgotPassword
          onLogin={() => setPage("login")}
        />
      )}

      {page === "home" && (
        <Home
          onLogout={handleLogout}
        />
      )}

    </div>
  );
}

export default App;
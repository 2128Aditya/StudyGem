import { useState } from "react";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  const [page, setPage] = useState("login");

  return (
    <div className="min-h-screen">

      {/* LOGIN */}
      {page === "login" && (
        <Login
          onSignup={() => setPage("signup")}
          onForgotPassword={() => setPage("forgot")}
        />
      )}

      {/* SIGNUP */}
      {page === "signup" && (
        <Signup
          onLogin={() => setPage("login")}
        />
      )}

      {/* FORGOT PASSWORD */}
      {page === "forgot" && (
        <ForgotPassword
          onLogin={() => setPage("login")}
        />
      )}

    </div>
  );
}

export default App;
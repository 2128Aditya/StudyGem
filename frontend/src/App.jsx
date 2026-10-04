import { useState } from "react";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import MockTests from "./pages/MockTests";
import MockTestInterface from "./pages/MockTestInterface";

function App() {
  const [page, setPage] = useState(() => {
    const token = localStorage.getItem("studyGemToken");
    return token ? "home" : "login";
  });

  const [testConfig, setTestConfig] = useState(null);

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("studyGemToken");
    localStorage.removeItem("studyGemUser");

    setTestConfig(null);
    setPage("login");
  };

  // =========================
  // HOME
  // =========================
  const openHome = () => {
    setPage("home");
  };

  // =========================
  // OPEN MOCK TEST CREATOR
  // =========================
  const openMockTests = () => {
    setPage("mock-create");
  };

  // =========================
  // START MOCK TEST
  // =========================
  const startMockTest = (config) => {
    setTestConfig(config);
    setPage("mock-test");
  };

  return (
    <div className="min-h-screen">
      {/* ================= LOGIN ================= */}
      {page === "login" && (
        <Login
          onSignup={() => setPage("signup")}
          onForgotPassword={() => setPage("forgot")}
          onLogin={() => setPage("home")}
        />
      )}

      {/* ================= SIGNUP ================= */}
      {page === "signup" && (
        <Signup onLogin={() => setPage("login")} />
      )}

      {/* ================= FORGOT PASSWORD ================= */}
      {page === "forgot" && (
        <ForgotPassword onLogin={() => setPage("login")} />
      )}

      {/* ================= HOME ================= */}
      {page === "home" && (
        <Home
          onLogout={handleLogout}
          onMockTests={openMockTests}
        />
      )}

      {/* ================= MOCK TEST CREATOR ================= */}
      {page === "mock-create" && (
        <MockTests
          onLogout={handleLogout}
          onMockTests={openMockTests}
          onHome={openHome}
          onStartTest={startMockTest}
        />
      )}

      {/* ================= ACTUAL MOCK TEST ================= */}
      {page === "mock-test" && (
        <MockTestInterface
          testConfig={testConfig}
          onLogout={handleLogout}
          onMockTests={openMockTests}
          onHome={openHome}
          onBack={openMockTests}
        />
      )}
    </div>
  );
}

export default App;
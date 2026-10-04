import { useState } from "react";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import MockTests from "./pages/MockTests";
import MockTestInterface from "./pages/MockTestInterface";
import MockTestResult from "./pages/MockTestResult";

function App() {
  // =========================
  // PAGE STATE
  // =========================
  const [page, setPage] = useState(() => {
    const token = localStorage.getItem("studyGemToken");

    return token ? "home" : "login";
  });

  // =========================
  // MOCK TEST CONFIG
  // =========================
  const [testConfig, setTestConfig] = useState(null);

  // =========================
  // MOCK TEST RESULT
  // =========================
  const [testResult, setTestResult] = useState(null);

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("studyGemToken");
    localStorage.removeItem("studyGemUser");

    setTestConfig(null);
    setTestResult(null);

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
    setTestResult(null);

    setPage("mock-test");
  };

  // =========================
  // FINISH MOCK TEST
  // =========================
  const finishMockTest = (resultData) => {
    setTestResult(resultData);

    setPage("mock-result");
  };

  // =========================
  // RETAKE MOCK TEST
  // =========================
  const retakeMockTest = () => {
    if (!testResult?.testConfig) {
      return;
    }

    setTestConfig(testResult.testConfig);
    setTestResult(null);

    setPage("mock-test");
  };

  // =========================
  // BACK TO MOCK TEST CREATOR
  // =========================
  const backToMockTests = () => {
    setTestResult(null);
    setPage("mock-create");
  };

  return (
    <div className="min-h-screen">
      {/* =====================================================
          LOGIN
      ===================================================== */}
      {page === "login" && (
        <Login
          onSignup={() => setPage("signup")}
          onForgotPassword={() => setPage("forgot")}
          onLogin={() => setPage("home")}
        />
      )}

      {/* =====================================================
          SIGNUP
      ===================================================== */}
      {page === "signup" && (
        <Signup
          onLogin={() => setPage("login")}
        />
      )}

      {/* =====================================================
          FORGOT PASSWORD
      ===================================================== */}
      {page === "forgot" && (
        <ForgotPassword
          onLogin={() => setPage("login")}
        />
      )}

      {/* =====================================================
          HOME
      ===================================================== */}
      {page === "home" && (
        <Home
          onLogout={handleLogout}
          onMockTests={openMockTests}
        />
      )}

      {/* =====================================================
          MOCK TEST CREATOR
      ===================================================== */}
      {page === "mock-create" && (
        <MockTests
          onLogout={handleLogout}
          onMockTests={openMockTests}
          onHome={openHome}
          onStartTest={startMockTest}
        />
      )}

      {/* =====================================================
          ACTUAL MOCK TEST
      ===================================================== */}
      {page === "mock-test" && (
        <MockTestInterface
          testConfig={testConfig}
          onLogout={handleLogout}
          onMockTests={openMockTests}
          onHome={openHome}
          onBack={openMockTests}
          onFinishTest={finishMockTest}
        />
      )}

      {/* =====================================================
          MOCK TEST RESULT
      ===================================================== */}
      {page === "mock-result" && (
        <MockTestResult
          testConfig={testResult?.testConfig}
          questions={testResult?.questions || []}
          answers={testResult?.answers || {}}
          onBack={backToMockTests}
          onRetake={retakeMockTest}
        />
      )}
    </div>
  );
}

export default App;
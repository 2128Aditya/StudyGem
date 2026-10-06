import { useState } from "react";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import MockTests from "./pages/MockTests";
import MockTestInterface from "./pages/MockTestInterface";
import MockTestResult from "./pages/MockTestResult";
import AIAssistant from "./pages/AIAssistant";
import Roadmap from "./pages/Roadmaps";
import Target from "./pages/Target";
import PYQ from "./pages/PYQ";
import Notes from "./pages/Notes";
import Leaderboard from "./pages/Leaderboard";
import AdminDashboard from "./pages/AdminDashboard";
import Footer from "./components/Footer";

function App() {
  // =========================
  // PAGE STATE
  // =========================

  const [page, setPage] = useState(() => {
    const token = localStorage.getItem("studyGemToken");
    const savedUser = localStorage.getItem("studyGemUser");

    if (!token) {
      return "login";
    }

    try {
      const user = JSON.parse(savedUser);

      return user?.role === "admin"
        ? "admin-dashboard"
        : "home";
    } catch {
      return "home";
    }
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
  // PROFILE
  // =========================

  const openProfile = () => {
    setPage("profile");
  };

  // =========================
  // AI ASSISTANT
  // =========================

  const openAI = () => {
    setPage("ai");
  };

  // =========================
  // MOCK TESTS
  // =========================

  const openMockTests = () => {
    setPage("mock-create");
  };

  // =========================
  // ROADMAP
  // =========================

  const openRoadmaps = () => {
    setPage("roadmaps");
  };

  // =========================
  // TARGET
  // =========================

  const openTarget = () => {
    setPage("target");
  };

  // =========================
  // PYQ
  // =========================

  const openPYQ = () => {
    setPage("pyq");
  };

  // =========================
  // NOTES / CURRENT AFFAIRS
  // =========================

  const openNotes = () => {
    setPage("notes");
  };

  // =========================
  // LEADERBOARD
  // =========================

  const openLeaderboard = () => {
    setPage("leaderboard");
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

  const finishMockTest = async (resultData) => {
    try {
      const token = localStorage.getItem("studyGemToken");

      if (!token) {
        console.error("StudyGem token not found.");

        setTestResult(resultData);
        setPage("mock-result");

        return;
      }

      const API_BASE_URL =
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000/api";

      const response = await fetch(
        `${API_BASE_URL}/mock/attempt`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            testConfig: resultData.testConfig,
            questions: resultData.questions,
            answers: resultData.answers,
            timeTakenSeconds:
              resultData.timeTakenSeconds || 0,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        console.error(
          "Failed to save mock result:",
          data.message || "Unknown error"
        );
      } else {
        console.log(
          "Mock test result saved successfully:",
          data.attempt
        );
      }

      setTestResult(resultData);
      setPage("mock-result");
    } catch (error) {
      console.error(
        "Mock Result Save Error:",
        error
      );

      setTestResult(resultData);
      setPage("mock-result");
    }
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
          onLogin={(user) => {
            setPage(
              user?.role === "admin"
                ? "admin-dashboard"
                : "home"
            );
          }}
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
          ADMIN DASHBOARD
      ===================================================== */}

      {page === "admin-dashboard" && (
        <AdminDashboard
          onLogout={handleLogout}
        />
      )}

      {/* =====================================================
          HOME
      ===================================================== */}

      {page === "home" && (
        <Home
          onLogout={handleLogout}
          onHome={openHome}
          onMockTests={openMockTests}
          onAI={openAI}
          onProfile={openProfile}
          onRoadmaps={openRoadmaps}
          onTarget={openTarget}
          onPYQ={openPYQ}
          onNotes={openNotes}
          onLeaderboard={openLeaderboard}
        />
      )}

      {/* =====================================================
          PROFILE
      ===================================================== */}

      {page === "profile" && (
        <Profile
          onBack={openHome}
          onLogout={handleLogout}
          onHome={openHome}
          onMockTests={openMockTests}
          onAI={openAI}
          onProfile={openProfile}
          onRoadmaps={openRoadmaps}
          onTarget={openTarget}
          onPYQ={openPYQ}
          onNotes={openNotes}
          onLeaderboard={openLeaderboard}
        />
      )}

      {/* =====================================================
          MOCK TEST CREATOR
      ===================================================== */}

      {page === "mock-create" && (
        <MockTests
          onLogout={handleLogout}
          onHome={openHome}
          onMockTests={openMockTests}
          onAI={openAI}
          onProfile={openProfile}
          onRoadmaps={openRoadmaps}
          onTarget={openTarget}
          onPYQ={openPYQ}
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
          onHome={openHome}
          onMockTests={openMockTests}
          onBack={openMockTests}
          onAI={openAI}
          onProfile={openProfile}
          onRoadmaps={openRoadmaps}
          onTarget={openTarget}
          onPYQ={openPYQ}
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

      {/* =====================================================
          AI ASSISTANT
      ===================================================== */}

      {page === "ai" && (
        <AIAssistant
          onLogout={handleLogout}
          onHome={openHome}
          onMockTests={openMockTests}
          onAI={openAI}
          onProfile={openProfile}
          onRoadmaps={openRoadmaps}
          onTarget={openTarget}
          onPYQ={openPYQ}
          onNotes={openNotes}
          onLeaderboard={openLeaderboard}
        />
      )}

      {/* =====================================================
          ROADMAP
      ===================================================== */}

      {page === "roadmaps" && (
        <Roadmap
          onLogout={handleLogout}
          onHome={openHome}
          onMockTests={openMockTests}
          onAI={openAI}
          onProfile={openProfile}
          onRoadmaps={openRoadmaps}
          onTarget={openTarget}
          onPYQ={openPYQ}
          onNotes={openNotes}
          onLeaderboard={openLeaderboard}
        />
      )}

      {/* =====================================================
          TARGET
      ===================================================== */}

      {page === "target" && (
        <Target
          onLogout={handleLogout}
          onHome={openHome}
          onMockTests={openMockTests}
          onAI={openAI}
          onProfile={openProfile}
          onRoadmaps={openRoadmaps}
          onTarget={openTarget}
          onPYQ={openPYQ}
          onNotes={openNotes}
          onLeaderboard={openLeaderboard}
        />
      )}

      {/* =====================================================
          PYQ
      ===================================================== */}

      {page === "pyq" && (
        <PYQ
          onLogout={handleLogout}
          onHome={openHome}
          onMockTests={openMockTests}
          onAI={openAI}
          onProfile={openProfile}
          onRoadmaps={openRoadmaps}
          onTarget={openTarget}
          onPYQ={openPYQ}
          onNotes={openNotes}
          onLeaderboard={openLeaderboard}
        />
      )}

      {/* =====================================================
          NOTES / CURRENT AFFAIRS
      ===================================================== */}

      {page === "notes" && (
        <Notes
          onLogout={handleLogout}
          onHome={openHome}
          onMockTests={openMockTests}
          onAI={openAI}
          onProfile={openProfile}
          onRoadmaps={openRoadmaps}
          onTarget={openTarget}
          onPYQ={openPYQ}
          onNotes={openNotes}
          onLeaderboard={openLeaderboard}
        />
      )}

      {/* =====================================================
          LEADERBOARD
      ===================================================== */}

      {page === "leaderboard" && (
        <Leaderboard
          onLogout={handleLogout}
          onHome={openHome}
          onMockTests={openMockTests}
          onAI={openAI}
          onProfile={openProfile}
          onRoadmaps={openRoadmaps}
          onTarget={openTarget}
          onPYQ={openPYQ}
          onNotes={openNotes}
          onLeaderboard={openLeaderboard}
        />
      )}

      {/* =====================================================
          FOOTER
      ===================================================== */}

      {page !== "login" &&
        page !== "signup" &&
        page !== "forgot" &&
        page !== "admin-dashboard" && (
          <Footer
            onHome={openHome}
            onMockTests={openMockTests}
            onAI={openAI}
            onRoadmaps={openRoadmaps}
            onPYQ={openPYQ}
            onNotes={openNotes}
            onLeaderboard={openLeaderboard}
          />
        )}
    </div>
  );
}

export default App;
const dotenv = require("dotenv");

// IMPORTANT: dotenv sabse pehle load hona chahiye
dotenv.config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const mockRoutes = require("./routes/mockRoutes");
const mockAttemptRoutes = require("./routes/mockAttemptRoutes");
const profileRoutes = require("./routes/profileRoutes");
const aiRoutes = require("./routes/aiRoutes");
const roadmapRoutes = require("./routes/roadmapRoutes");
const studyRoutes = require("./routes/studyRoutes");
const pyqRoutes = require("./routes/pyqRoutes");
connectDB();

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/mock", mockRoutes);
app.use(
  "/api/mock",
  mockAttemptRoutes
);
app.use("/api/ai", aiRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/study", studyRoutes);
app.use("/api/pyq", pyqRoutes);
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "StudyGem Backend is running 🚀",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
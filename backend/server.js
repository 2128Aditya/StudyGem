const dotenv = require("dotenv");

// IMPORTANT: dotenv sabse pehle load hona chahiye
dotenv.config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const mockRoutes = require("./routes/mockRoutes");
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/mock", mockRoutes);

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
import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import db from "./db.js";

import authRoutes from "./routes/auth.routes.js";
import codeRoutes from "./routes/code.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import adminRoutes from "./routes/adminRoutes/admin.routes.js";
import dashboardRoutes from "./routes/adminRoutes/dashboard.routes.js";
import usersRoutes from "./routes/adminRoutes/users.routes.js";
import problemsRoutes from "./routes/adminRoutes/problems.routes.js";
import submissionsRoutes from "./routes/adminRoutes/submissions.routes.js";
import feedbackRoutes from "./routes/adminRoutes/feedback.routes.js";
import leaderboardRoutes from "./routes/adminRoutes/leaderboard.routes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api", codeRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/problems", problemsRoutes);
app.use("/api/submissions", submissionsRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
  });
}

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled rejection:", reason, "Promise:", promise);
});

async function startServer() {
  try {
    await db.query("SELECT 1");
    console.log("✅ Database connection OK");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`✅ Backend running on ${PORT}`);
  }).on("error", (error) => {
    console.error("Server listen error:", error);
    process.exit(1);
  });
}

startServer();
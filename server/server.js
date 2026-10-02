require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

connectDB();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/jobs", require("./routes/jobRoutes"));
app.use("/api/applications", require("./routes/applicationRoutes"));
app.use("/api/assignments", require("./routes/assignmentRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/stats", require("./routes/statsRoutes"));

app.use(notFound);
app.use(errorHandler);

// Export Express app for Vercel
module.exports = app;

// Run locally
if (require.main === module) {
  const PORT = process.env.PORT || 8000;

  app.listen(PORT, () => {
    console.log(`API running on port ${PORT}`);
  });
}
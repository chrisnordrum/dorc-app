"use strict";
const path = require("path");
const express = require("express");
const fs = require("fs");

const PORT = process.env.PORT || 5050;
const app = express();

const distPath = path.join(__dirname, "..", "client", "dist");
app.use(express.static(distPath));

// API routes
app.get("/api/hello", (req, res) => {
  res.json({
    message: "Hello from the Express server!",
    timestamp: new Date().toISOString(),
  });
});

const questRoutes = require("./routes/questsRoutes");
app.use("/api/quests", questRoutes);

const userRoutes = require("./routes/usersRoutes");
app.use("/api/users", userRoutes);

const ranksRoutes = require("./routes/ranksRoutes");
app.use("/api/ranks", ranksRoutes);

const badgesRoutes = require("./routes/badgesRoutes");
app.use("/api/badges", badgesRoutes);

const dailyQuotesRoutes = require("./routes/dailyQuotesRoutes");
app.use("/api/dailyquotes", dailyQuotesRoutes);

// SPA fallback
app.get("/*splat", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});

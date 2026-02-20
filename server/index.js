"use strict";
const path = require("path");
const express = require("express");

const PORT = process.env.PORT || 5050;
const app = express();

const distPath = path.join(__dirname, "..", "client", "dist");
app.use(express.static(distPath));

app.use(express.json());

// API routes
app.get("/api/hello", (req, res) => {
  res.json({
    message: "Hello from the Express server!",
    timestamp: new Date().toISOString(),
  });
});

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
"use strict";
const path = require("path");
const express = require("express");
const fs = require("fs");

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

// GET all quests
app.get("/quests", (req, res) => {
  fs.readFile("./db.json", "utf8", (err, data) => {
    if (err) {
      res.status(500).json({ error: "Failed to read database" });
      return;
    }
    const db = JSON.parse(data);
    res.status(200).json(db.quests);
  });
});

// GET a specific quest
app.get("/quests/:id", (req, res) => {
  fs.readFile("./db.json", "utf8", (err, data) => {
    if (err) {
      res.status(500).json({ error: "Failed to read database" });
      return;
    }
    const db = JSON.parse(data);
    const quest = db.quests.find(
      (quest) => quest.id === Number.parseInt(req.params.id),
    );
    if (!quest) {
      res.status(404).json({ error: "Quest not found" });
      return;
    }
    res.status(200).json(quest);
  });
});

// POST a new quest
app.post("/quests", (req, res) => {
  res.send("POST /quests");
});

// PATCH a specific quest
app.patch("/quests/:id", (req, res) => {
  res.send("patch /quests/${req.params.id}");
});

// DELETE a specific quest
app.delete("/quests/:id", (req, res) => {
  res.send("delete /quests/${req.params.id}");
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

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

//API  use routes

const questRoutes = require("./routes/questRoutes");
app.use("/api/quests", questRoutes);

// GET a specific quest
// app.get("/quests/:id", (req, res) => {
//   fs.readFile("./db.json", "utf8", (err, data) => {
//     if (err) {
//       res.status(500).json({ error: "Failed to read database" });
//       return;
//     }
//     const db = JSON.parse(data);
//     const quest = db.quests.find(
//       (quest) => quest.id === Number.parseInt(req.params.id),
//     );
//     if (!quest) {
//       res.status(404).json({ error: "Quest not found" });
//       return;
//     }
//     res.status(200).json(quest);
//   });
// });

// GET a specific user
app.get("/users/:id", (req, res) => {
  fs.readFile("./db.json", "utf8", (err, data) => {
    if (err) {
      res.status(500).json({ error: "Failed to read database" });
      return;
    }
    const db = JSON.parse(data);
    const user = db.users.find(
      (user) => user.id === Number.parseInt(req.params.id),
    );
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.status(200).json(user);
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

"use strict";
const fs = require("fs");
const path = require("path");
const db = path.join(__dirname, "..", "data/db.json");

const getQuests = (req, res) => {
  fs.readFile(db, "utf8", (err, data) => {
    if (err) {
      res.status(500).json({ error: "Failed to read database" });
      return;
    }
    const db = JSON.parse(data);
    res.status(200).json(db.quests);
  });
};

module.exports = {
  getQuests,
};

// app.get("/quests", (req, res) => {
//   fs.readFile(db, "utf8", (err, data) => {
//     if (err) {
//       res.status(500).json({ error: "Failed to read database" });
//       return;
//     }
//     const db = JSON.parse(data);
//     res.status(200).json(db.quests);
//   });
// });

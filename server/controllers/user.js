const fs = require("fs");
const path = require("path");
const db = path.join(__dirname, "..", "data/db.json");

const getUser = (req, res) => {
  fs.readFile(db, "utf8", (err, data) => {
    if (err) {
      res.status(500).json({ error: "Failed to read database" });
      return;
    }
    const db = JSON.parse(data);
    res.status(200).json(db.users);
  });
};

// app.get("/users", (req, res) => {
//   fs.readFile("./db.json", "utf8", (err, data) => {
//     if (err) {
//       res.status(500).json({ error: "Failed to read database" });
//       return;
//     }
//     const db = JSON.parse(data);
//     res.status(200).json(db.users);
//   });
// });

module.exports = {
  getUser,
};

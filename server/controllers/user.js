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

// module.exports = {
//   getUser,
// };

"use strict";
const path = require("path");
const express = require("express");
const fs = require("fs");
const https = require("https");
const hsts = require("hsts");

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

// API routes using the index.js file in the routes folder
// (Users, Quests, Ranks, Badges, Daily Quotes)
// MVC pattern
const routes = require("./routes");
app.use("/api", routes);

// SPA fallback
app.get("/*splat", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Apply HSTS middleware to the HTTPS server
const hstsOptions = {
  maxAge: 31536000, // 1 year in seconds
  includeSubDomains: true, // Apply HSTS to all subdomains
  preload: true, // Include this site in the HSTS preload list
};

// Create HTTPS server with SSL certificate
const options = {
  key: fs.readFileSync("private-key.pem"), // Path to your private key
  cert: fs.readFileSync("certificate.pem"), // Path to your certificate
};

// Create HTTPS server
const httpsServer = https.createServer(options, (req, res) => {
  // Apply HSTS middleware
  hsts(hstsOptions)(req, res, () => {
    app(req, res);
  });
});

// start the Express server
httpsServer.listen(PORT, () => {
  console.log(`HTTPS Server running at https://localhost:${PORT}`);
});

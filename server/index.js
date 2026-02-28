"use strict";
const express = require("express");
const path = require("path");
const fs = require("fs");
const helmet = require("helmet");
const https = require("https");

const PORT = process.env.PORT || 5050;
const app = express();

// Security headers
app.use(
  helmet({
    // Sets default HTTP response headers from Helmet middleware
    //
    // HTTP response header configurations:
    contentSecurityPolicy: {
      directives: {
        fontSrc: ["'self'"], // Only load fonts from self
        frameAncestors: ["'none'"], // The document cannot be loaded in any frame => to avoid clickjacking attacks
      },
    },
    xFrameOptions: { action: "deny" }, // Legacy fallback for CSP: frameAncestors
    hsts: {
      maxAge: 31536000, // 1 year in seconds
      includeSubDomains: true, // Apply HSTS to all subdomains
      preload: true, // Include this site in the HSTS preload list
    },
  }),
);

// Serve badges statically with caching headers for 1 month.
app.use(
  "/badges",
  express.static(path.join(__dirname, "public", "badges"), {
    setHeaders: (res, path) => {
      if (path.endsWith(".png")) {
        res.set("Cache-Control", "max-age=2592000");
      }
    },
  }),
);

// API routes using the index.js file in the routes folder
// (Users, Quests, Ranks, Badges, Daily Quotes)
// MVC pattern
const routes = require("./routes");
app.use("/api", routes);

// Serve Vite build
const distPath = path.join(__dirname, "..", "client", "dist");
app.use(express.static(distPath));

// SPA fallback
app.get("/*splat", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// HTTPS Credentials
const options = {
  key: fs.readFileSync("private-key.pem"), // Path to your private key
  cert: fs.readFileSync("certificate.pem"), // Path to your certificate
};

// Create and start the HTTPS server
https.createServer(options, app).listen(PORT, () => {
  console.log(`HTTPS Server running at https://localhost:${PORT}`);
});

"use strict";
//require("dotenv").config();
const express = require("express");
const session = require("express-session");
const path = require("path");
const fs = require("fs");
const helmet = require("helmet");
const https = require("https");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const passport = require("passport");
require("./middleware/passport");
const googleRoutes = require("./routes/googleRoutes");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const PORT = process.env.PORT || 5050;
const app = express();

// Swagger API documentation
const swaggerDocument = YAML.load(path.join(__dirname, "docs", "swagger.yaml"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Security headers
app.use(
  helmet({
    // Sets default HTTP response headers from Helmet middleware
    //
    // HTTP response header configurations:
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        fontSrc: ["'self'"], // Only load fonts from self
        frameAncestors: ["'none'"], // The document cannot be loaded in any frame => to avoid clickjacking attacks
        imgSrc: ["'self'", "data:"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"], // Only load styles from self
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

// for google
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: "lax",
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", googleRoutes);

if (process.env.NODE_ENV === "production") {
  // Health route
  app.get("/", (req, res) => {
    res.json({ status: "ok", service: "dorc-api" });
  });
} else {
  // Serve Vite build
  const distPath = path.join(__dirname, "..", "client", "dist");
  app.use(express.static(distPath));

  // SPA fallback
  app.get("/*splat", (req, res) => {
    res.set("Cache-Control", "no-store"); // The application shell should not be cached to ensure users always receive the latest build
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.set("Cache-Control", "no-store"); // Temporary server errors should not be cached
  res.status(500).json({ error: "Internal Server Error" });
});

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

// Start the server
if (process.env.NODE_ENV === "production") {
  // In production we let the platform serve HTTPS at the edge
  app.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server running on port ${PORT}`);
  });
} else {
  // For local development we use the self-signed HTTPS server
  const options = {
    key: fs.readFileSync("private-key.pem"),
    cert: fs.readFileSync("certificate.pem"),
  };

  https.createServer(options, app).listen(PORT, () => {
    connectToMongoDB();
    console.log(`HTTPS Server running at https://localhost:${PORT}`);
  });
}

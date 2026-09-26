"use strict";
//require("dotenv").config();
const fs = require("fs");
const https = require("https");
const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT || 5050;

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

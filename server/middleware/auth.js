"use strict";
const jwt = require("jsonwebtoken");

// Middleware to authenticate users based on their token
const authMiddleware = (req, res, next) => {
  // Get the token from the request header
  const token = req.headers.token;
  // If the token is not present, return a 401 error
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
  // Try to verify the token
  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // Set the user in the request object
    req.user = decoded;
    // Call the next middleware function
    next();
  } catch {
    // If the token is not valid, return a 401 error
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;

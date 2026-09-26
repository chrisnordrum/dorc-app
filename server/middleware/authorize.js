"use strict";

// Middleware to authorize users based on their role
const authorize = (roles) => {
  // Check if the user is authenticated and has the required role
  return (req, res, next) => {
    // Call the next middleware function
    if (req.user && roles.includes(req.user.role)) {
      next();
    } else {
      // If the user is not authenticated or does not have the required role, return a 403 error
      return res.status(403).json({
        message: "You are not authorized to access this resource",
      });
    }
  };
};

module.exports = authorize;

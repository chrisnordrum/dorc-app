const User = require("../models/User");

/**
 * Controller: Get the admin dashboard
 *
 * Handles GET requests to fetch the admin dashboard.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {JSON} - JSON object with welcome message
 */
const getDashboard = async (req, res) => {
  res.status(200).json({
    message: "Welcome to the admin dashboard!",
  });
};

/**
 * Controller: Get all users for the admin
 *
 * Handles GET requests to fetch all users for the admin.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {JSON} - JSON object with all users' information.
 */
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch {
    res.status(500).json({ message: "Error fetching all users for the admin" });
  }
};

module.exports = {
  getDashboard,
  getUsers,
};

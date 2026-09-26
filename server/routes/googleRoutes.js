// require("dotenv").config();
const express = require("express");
const passport = require("passport");

const router = express.Router();

// Start Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/register",
  }),
  (req, res) => {
    res.redirect("http://localhost:5173/profile");
  },
);

module.exports = router;

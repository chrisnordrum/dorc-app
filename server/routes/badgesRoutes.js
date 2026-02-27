"use strict";

const express = require("express");
const router = express.Router();

// Controller: Get all badges
const { getBadges } = require("../controllers/badgesController");

router.get("/", getBadges);

module.exports = router;

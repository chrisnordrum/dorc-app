"use strict";

const express = require("express");
const router = express.Router();

// Controller: Get daily quotes
const { getDailyQuotes } = require("../controllers/dailyQuotesController");

router.get("/", getDailyQuotes);

module.exports = router;

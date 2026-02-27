"use strict";

const express = require("express");
const router = express.Router();

const { getDailyQuotes } = require("../controllers/dailyQuotesController");

router.get("/", getDailyQuotes);

module.exports = router;

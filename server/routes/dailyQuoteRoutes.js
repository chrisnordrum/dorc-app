"use strict";

const express = require("express");
const router = express.Router();

const { getDailyQuote } = require("../controllers/dailyQuote");

router.get("/", getDailyQuote);

module.exports = router;

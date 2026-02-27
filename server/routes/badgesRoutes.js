"use strict";

const express = require("express");
const router = express.Router();

const { getBadges } = require("../controllers/badges");

router.get("/", getBadges);

module.exports = router;

"use strict";

const express = require("express");
const router = express.Router();

const { getRank } = require("../controllers/rank");

router.get("/", getRank);

module.exports = router;

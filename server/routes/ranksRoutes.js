"use strict";

const express = require("express");
const router = express.Router();

const { getRanks } = require("../controllers/ranksController");

router.get("/", getRanks);

module.exports = router;

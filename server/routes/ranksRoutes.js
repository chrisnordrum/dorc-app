"use strict";

const express = require("express");
const router = express.Router();

// Controller: Get all ranks
const { getRanks } = require("../controllers/ranksController");

router.get("/", getRanks);

module.exports = router;

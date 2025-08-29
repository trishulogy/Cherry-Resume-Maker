const express = require("express");
const { generateResume } = require("../controllers/resumeController");

const router = express.Router();

router.post("/generate", generateResume);

module.exports = router;

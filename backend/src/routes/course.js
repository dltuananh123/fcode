const express = require("express");
const router = express.Router();
const { getAllCourses } = require("../controllers/courseController");

router.get("/", getAllCourses);

module.exports = router;

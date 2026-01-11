const express = require("express");
const router = express.Router();
const {
  getAllCourses,
  getCourseDetail,
} = require("../controllers/courseController");

router.get("/", getAllCourses);
router.get("/:id", getCourseDetail);

module.exports = router;

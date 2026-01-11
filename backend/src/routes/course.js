const express = require("express");
const router = express.Router();
const {
  getAllCourses,
  getCourseDetail,
  enrollCourse,
} = require("../controllers/courseController");
const verifyToken = require("../middlewares/authMiddleware");

router.get("/", getAllCourses);
router.get("/:id", getCourseDetail);
router.post("/enroll", verifyToken, enrollCourse);

module.exports = router;

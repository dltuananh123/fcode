const express = require("express");
const router = express.Router();
const {
  getAllCourses,
  getCourseDetail,
  enrollCourse,
  getEnrolledCourseDetail,
  getLessonDetail,
  markLessonComplete,
  updateLessonProgress,
} = require("../controllers/courseController");
const verifyToken = require("../middlewares/authMiddleware");

router.get("/", getAllCourses);
router.get("/:id", getCourseDetail);
router.post("/enroll", verifyToken, enrollCourse);
router.get("/enrolled/:id", verifyToken, getEnrolledCourseDetail);
router.get("/lesson/:lessonId", verifyToken, getLessonDetail);
router.post("/lesson/:lessonId/complete", verifyToken, markLessonComplete);
router.put("/lesson/:lessonId/progress", verifyToken, updateLessonProgress);

module.exports = router;


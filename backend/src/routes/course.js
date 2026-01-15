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
  createCourse,
  getMyEnrolledCourses,
  getMyCourses,
  deleteCourse,
  updateCourse,
} = require("../controllers/courseController");
const verifyToken = require("../middlewares/authMiddleware");

router.get("/", getAllCourses);
router.post("/create", verifyToken, createCourse);
router.post("/enroll", verifyToken, enrollCourse);
router.get("/my-enrolled", verifyToken, getMyEnrolledCourses);
router.get("/my-courses", verifyToken, getMyCourses);
router.get("/enrolled/:id", verifyToken, getEnrolledCourseDetail);
router.get("/lesson/:lessonId", verifyToken, getLessonDetail);
router.post("/lesson/:lessonId/complete", verifyToken, markLessonComplete);
router.put("/lesson/:lessonId/progress", verifyToken, updateLessonProgress);
router.put("/:id", verifyToken, updateCourse);
router.delete("/:id", verifyToken, deleteCourse);
router.get("/:id", getCourseDetail);

module.exports = router;


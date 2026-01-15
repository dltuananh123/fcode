const express = require("express");
const router = express.Router();
const {
  getCourseReviews,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
const verifyToken = require("../middlewares/authMiddleware");

// Get all reviews for a course (public)
router.get("/course/:courseId", getCourseReviews);

// Create a review (authenticated)
router.post("/course/:courseId", verifyToken, createReview);

// Update a review (authenticated, owner only)
router.put("/:reviewId", verifyToken, updateReview);

// Delete a review (authenticated, owner only)
router.delete("/:reviewId", verifyToken, deleteReview);

module.exports = router;

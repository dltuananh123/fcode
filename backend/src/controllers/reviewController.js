const { Review, User, Course } = require("../models");

// Get all reviews for a course
const getCourseReviews = async (req, res) => {
  try {
    const { courseId } = req.params;

    const reviews = await Review.findAll({
      where: { course_id: courseId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["user_id", "full_name", "avatar_url"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    res.status(200).json(reviews);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error when getting reviews" });
  }
};

// Create a review
const createReview = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    // Check if course exists
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if user already reviewed this course
    const existingReview = await Review.findOne({
      where: { user_id: userId, course_id: courseId },
    });

    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this course" });
    }

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    const review = await Review.create({
      user_id: userId,
      course_id: courseId,
      rating,
      comment: comment || null,
    });

    const reviewWithUser = await Review.findByPk(review.review_id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["user_id", "full_name", "avatar_url"],
        },
      ],
    });

    res.status(201).json(reviewWithUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error when creating review" });
  }
};

// Update a review
const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    const review = await Review.findByPk(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if user owns this review
    if (review.user_id !== userId) {
      return res
        .status(403)
        .json({ message: "You can only update your own reviews" });
    }

    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res
          .status(400)
          .json({ message: "Rating must be between 1 and 5" });
      }
      review.rating = rating;
    }

    if (comment !== undefined) {
      review.comment = comment;
    }

    await review.save();

    const reviewWithUser = await Review.findByPk(review.review_id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["user_id", "full_name", "avatar_url"],
        },
      ],
    });

    res.status(200).json(reviewWithUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error when updating review" });
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    const review = await Review.findByPk(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if user owns this review
    if (review.user_id !== userId) {
      return res
        .status(403)
        .json({ message: "You can only delete your own reviews" });
    }

    await review.destroy();

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error when deleting review" });
  }
};

module.exports = {
  getCourseReviews,
  createReview,
  updateReview,
  deleteReview,
};

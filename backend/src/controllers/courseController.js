const { Course, User, Category } = require("../models");
const { Chapter, Lesson } = require("../models");

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [
        {
          model: User,
          as: "teacher",
          attributes: ["full_name", "avatar_url"],
        },
        {
          model: Category,
          as: "category",
          attributes: ["name"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    res.status(200).json(courses);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error when getting all courses" });
  }
};

const getCourseDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findOne({
      where: { course_id: id },
      include: [
        {
          model: User,
          as: "teacher",
          attributes: ["full_name", "avatar_url", "bio"],
        },
        {
          model: Category,
          as: "category",
          attributes: ["name"],
        },
        {
          model: Chapter,
          as: "chapters",
          include: [
            {
              model: Lesson,
              as: "lessons",
              attributes: [
                "lesson_id",
                "title",
                "duration_seconds",
                "is_preview",
                "content_type",
              ],
            },
          ],
          order: [["order_index", "ASC"]],
        },
      ],
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(course);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getAllCourses, getCourseDetail };

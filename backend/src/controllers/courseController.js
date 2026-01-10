const { Course, User, Category } = require("../models");

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

module.exports = { getAllCourses };

const { Course, User, Category } = require("../models");
const { Chapter, Lesson } = require("../models");
const { Enrollment, LessonProgress } = require("../models");

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

const enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    const existingEnrollment = await Enrollment.findOne({
      where: { user_id: userId, course_id: courseId },
    });

    if (existingEnrollment) {
      return res
        .status(400)
        .json({ message: "You have already enrolled in this course!" });
    }

    await Enrollment.create({
      user_id: userId,
      course_id: courseId,
    });

    res.status(201).json({ message: "Enrollment successful!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get enrolled course detail (with full lesson info including video_url)
const getEnrolledCourseDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if user is enrolled
    const enrollment = await Enrollment.findOne({
      where: { user_id: userId, course_id: id },
    });

    if (!enrollment) {
      return res
        .status(403)
        .json({ message: "You are not enrolled in this course" });
    }

    const course = await Course.findOne({
      where: { course_id: id },
      include: [
        {
          model: User,
          as: "teacher",
          attributes: ["full_name", "avatar_url", "bio"],
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
                "video_url",
                "content_text",
                "order_index",
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

    // Get lesson progress for this user
    const lessonIds = course.chapters.flatMap((ch) =>
      ch.lessons.map((l) => l.lesson_id)
    );

    const progressRecords = await LessonProgress.findAll({
      where: {
        user_id: userId,
        lesson_id: lessonIds,
      },
    });

    const progressMap = {};
    progressRecords.forEach((p) => {
      progressMap[p.lesson_id] = {
        is_completed: p.is_completed,
        last_watched_second: p.last_watched_second,
      };
    });

    // Attach progress to lessons
    const courseData = course.toJSON();
    courseData.chapters.forEach((chapter) => {
      chapter.lessons.forEach((lesson) => {
        lesson.progress = progressMap[lesson.lesson_id] || {
          is_completed: false,
          last_watched_second: 0,
        };
      });
    });

    res.status(200).json(courseData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get lesson detail
const getLessonDetail = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const userId = req.user.id;

    const lesson = await Lesson.findOne({
      where: { lesson_id: lessonId },
      include: [
        {
          model: Chapter,
          as: "chapter",
          include: [
            {
              model: Course,
              as: "course",
              attributes: ["course_id", "title"],
            },
          ],
        },
      ],
    });

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    const courseId = lesson.chapter.course.course_id;

    // Check if user is enrolled
    const enrollment = await Enrollment.findOne({
      where: { user_id: userId, course_id: courseId },
    });

    if (!enrollment) {
      return res
        .status(403)
        .json({ message: "You are not enrolled in this course" });
    }

    // Get lesson progress
    let progress = await LessonProgress.findOne({
      where: { user_id: userId, lesson_id: lessonId },
    });

    if (!progress) {
      progress = { is_completed: false, last_watched_second: 0 };
    }

    res.status(200).json({
      ...lesson.toJSON(),
      progress,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Mark lesson as complete
const markLessonComplete = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const userId = req.user.id;

    const lesson = await Lesson.findOne({
      where: { lesson_id: lessonId },
      include: [
        {
          model: Chapter,
          as: "chapter",
          include: [
            {
              model: Course,
              as: "course",
              attributes: ["course_id"],
            },
          ],
        },
      ],
    });

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    const courseId = lesson.chapter.course.course_id;

    // Check if user is enrolled
    const enrollment = await Enrollment.findOne({
      where: { user_id: userId, course_id: courseId },
    });

    if (!enrollment) {
      return res
        .status(403)
        .json({ message: "You are not enrolled in this course" });
    }

    // Create or update progress
    const [progress, created] = await LessonProgress.findOrCreate({
      where: { user_id: userId, lesson_id: lessonId },
      defaults: { is_completed: true },
    });

    if (!created) {
      progress.is_completed = true;
      await progress.save();
    }

    res.status(200).json({ message: "Lesson marked as complete", progress });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update lesson progress (watch time)
const updateLessonProgress = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { last_watched_second } = req.body;
    const userId = req.user.id;

    const lesson = await Lesson.findOne({
      where: { lesson_id: lessonId },
      include: [
        {
          model: Chapter,
          as: "chapter",
          include: [
            {
              model: Course,
              as: "course",
              attributes: ["course_id"],
            },
          ],
        },
      ],
    });

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    const courseId = lesson.chapter.course.course_id;

    // Check if user is enrolled
    const enrollment = await Enrollment.findOne({
      where: { user_id: userId, course_id: courseId },
    });

    if (!enrollment) {
      return res
        .status(403)
        .json({ message: "You are not enrolled in this course" });
    }

    // Create or update progress
    const [progress, created] = await LessonProgress.findOrCreate({
      where: { user_id: userId, lesson_id: lessonId },
      defaults: { last_watched_second: last_watched_second || 0 },
    });

    if (!created) {
      progress.last_watched_second = last_watched_second || 0;
      await progress.save();
    }

    res.status(200).json({ message: "Progress updated", progress });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllCourses,
  getCourseDetail,
  enrollCourse,
  getEnrolledCourseDetail,
  getLessonDetail,
  markLessonComplete,
  updateLessonProgress,
};

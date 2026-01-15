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

// Create a new course (teacher only)
const createCourse = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, thumbnail_url, price, level, category_id } = req.body;

    // Check if user is a teacher
    const user = await User.findByPk(userId);
    if (user.role !== "teacher" && user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only teachers can create courses" });
    }

    const course = await Course.create({
      title,
      description,
      thumbnail_url: thumbnail_url || "/thumbnail.png",
      price: price || 0,
      level: level || "beginner",
      teacher_id: userId,
      category_id: category_id || null,
    });

    res.status(201).json(course);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error when creating course" });
  }
};

// Get enrolled courses for a user
const getMyEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;

    const enrollments = await Enrollment.findAll({
      where: { user_id: userId },
    });

    const courseIds = enrollments.map((e) => e.course_id);

    const courses = await Course.findAll({
      where: { course_id: courseIds },
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
    res.status(500).json({ message: "Error when getting enrolled courses" });
  }
};

// Get courses created by teacher
const getMyCourses = async (req, res) => {
  try {
    const userId = req.user.id;

    const courses = await Course.findAll({
      where: { teacher_id: userId },
      include: [
        {
          model: User,
          as: "teacher",
          attributes: ["full_name", "avatar_url"],
        },
        {
          model: Chapter,
          as: "chapters",
          include: [
            {
              model: Lesson,
              as: "lessons",
            },
          ],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    res.status(200).json(courses);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error when getting my courses" });
  }
};

// Delete a course (teacher only)
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const course = await Course.findByPk(id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if user is the teacher or admin
    if (course.teacher_id !== userId) {
      const user = await User.findByPk(userId);
      if (user.role !== "admin") {
        return res
          .status(403)
          .json({ message: "You can only delete your own courses" });
      }
    }

    await course.destroy();
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error when deleting course" });
  }
};

// Update course with chapters and lessons
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { title, description, thumbnail_url, price, level, chapters } = req.body;

    const course = await Course.findByPk(id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if user is the teacher
    if (course.teacher_id !== userId) {
      const user = await User.findByPk(userId);
      if (user.role !== "admin") {
        return res
          .status(403)
          .json({ message: "You can only update your own courses" });
      }
    }

    // Update course basic info
    if (title) course.title = title;
    if (description !== undefined) course.description = description;
    if (thumbnail_url !== undefined) course.thumbnail_url = thumbnail_url;
    if (price !== undefined) course.price = price;
    if (level) course.level = level;
    await course.save();

    // Update chapters and lessons if provided
    if (chapters && Array.isArray(chapters)) {
      // Delete existing chapters and lessons
      const existingChapters = await Chapter.findAll({
        where: { course_id: id },
      });
      for (const chapter of existingChapters) {
        await Lesson.destroy({ where: { chapter_id: chapter.chapter_id } });
      }
      await Chapter.destroy({ where: { course_id: id } });

      // Create new chapters and lessons
      for (let i = 0; i < chapters.length; i++) {
        const chapterData = chapters[i];
        const chapter = await Chapter.create({
          course_id: id,
          title: chapterData.title,
          order_index: i + 1,
        });

        if (chapterData.lessons && Array.isArray(chapterData.lessons)) {
          for (let j = 0; j < chapterData.lessons.length; j++) {
            const lessonData = chapterData.lessons[j];
            await Lesson.create({
              chapter_id: chapter.chapter_id,
              title: lessonData.title,
              content_type: lessonData.content_type || "video",
              video_url: lessonData.video_url || null,
              content_text: lessonData.content_text || null,
              duration_seconds: lessonData.duration_seconds || 0,
              is_preview: lessonData.is_preview || false,
              order_index: j + 1,
            });
          }
        }
      }
    }

    const updatedCourse = await Course.findByPk(id, {
      include: [
        {
          model: Chapter,
          as: "chapters",
          include: [
            {
              model: Lesson,
              as: "lessons",
            },
          ],
          order: [["order_index", "ASC"]],
        },
      ],
    });

    res.status(200).json(updatedCourse);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error when updating course" });
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
  createCourse,
  getMyEnrolledCourses,
  getMyCourses,
  deleteCourse,
  updateCourse,
};

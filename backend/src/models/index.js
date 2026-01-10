const { sequelize } = require("../config/connectDB");

const User = require("./User");
const Category = require("./Category");
const Course = require("./Course");
const Chapter = require("./Chapter");
const Lesson = require("./Lesson");
const Enrollment = require("./Enrollment");
const LessonProgress = require("./LessonProgress");
const Review = require("./Review");
const Message = require("./Message");

User.hasMany(Course, { foreignKey: "teacher_id", as: "teaching_courses" });
Course.belongsTo(User, { foreignKey: "teacher_id", as: "teacher" });

Category.hasMany(Course, { foreignKey: "category_id", as: "courses" });
Course.belongsTo(Category, { foreignKey: "category_id", as: "category" });

Course.hasMany(Chapter, {
  foreignKey: "course_id",
  as: "chapters",
  onDelete: "CASCADE",
});
Chapter.belongsTo(Course, { foreignKey: "course_id", as: "course" });

Chapter.hasMany(Lesson, {
  foreignKey: "chapter_id",
  as: "lessons",
  onDelete: "CASCADE",
});
Lesson.belongsTo(Chapter, { foreignKey: "chapter_id", as: "chapter" });

User.belongsToMany(Course, {
  through: Enrollment,
  foreignKey: "user_id",
  as: "enrolled_courses",
});
Course.belongsToMany(User, {
  through: Enrollment,
  foreignKey: "course_id",
  as: "students",
});
Enrollment.belongsTo(User, { foreignKey: "user_id" });
Enrollment.belongsTo(Course, { foreignKey: "course_id" });

User.hasMany(LessonProgress, { foreignKey: "user_id", as: "progress" });
Lesson.hasMany(LessonProgress, { foreignKey: "lesson_id" });
LessonProgress.belongsTo(User, { foreignKey: "user_id" });
LessonProgress.belongsTo(Lesson, { foreignKey: "lesson_id" });

User.hasMany(Review, { foreignKey: "user_id" });
Course.hasMany(Review, { foreignKey: "course_id", as: "reviews" });
Review.belongsTo(User, { foreignKey: "user_id", as: "user" });
Review.belongsTo(Course, { foreignKey: "course_id" });

User.hasMany(Message, { foreignKey: "sender_id", as: "sent_messages" });
User.hasMany(Message, { foreignKey: "receiver_id", as: "received_messages" });
Message.belongsTo(User, { foreignKey: "sender_id", as: "sender" });
Message.belongsTo(User, { foreignKey: "receiver_id", as: "receiver" });

module.exports = {
  sequelize,
  User,
  Category,
  Course,
  Chapter,
  Lesson,
  Enrollment,
  LessonProgress,
  Review,
  Message,
};

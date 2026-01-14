import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getCourseById, enrollCourse, getEnrolledCourse } from "../services/courseService";

const CourseDetailPage = () => {
  const { id } = useParams(); // Get ID from URL (e.g. /course/1 -> id = 1)
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [checkingEnrollment, setCheckingEnrollment] = useState(true);

  // Check if user is already enrolled
  useEffect(() => {
    const checkEnrollment = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        try {
          await getEnrolledCourse(id);
          setIsEnrolled(true);
        } catch (error) {
          // User is not enrolled, that's fine
          setIsEnrolled(false);
        }
      }
      setCheckingEnrollment(false);
    };
    checkEnrollment();
  }, [id]);

  const handleEnroll = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("You need to login to enroll in this course!");
      return;
    }

    if (window.confirm("Are you sure you want to enroll in this course?")) {
      try {
        await enrollCourse(id);
        alert("Enrollment successful! Good luck.");
        setIsEnrolled(true);
        navigate(`/course/${id}/lessons`);
      } catch (error) {
        alert(error.message || "Enrollment failed");
      }
    }
  };

  useEffect(() => {
    const fetchDetail = async () => {
      const data = await getCourseById(id);
      setCourse(data);
      setLoading(false);
    };
    fetchDetail();
  }, [id]);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (!course)
    return (
      <div className="text-center mt-5 text-danger">Course not found!</div>
    );

  return (
    <div className="container mt-4">
      {/* Course Header */}
      <div className="row">
        <div className="col-md-8">
          <h1 className="fw-bold">{course.title}</h1>
          <p className="lead">{course.description}</p>
          <div className="d-flex align-items-center mb-3">
            <img
              src={
                course.teacher?.avatar_url || "https://via.placeholder.com/50"
              }
              alt="GV"
              className="rounded-circle me-2"
              style={{ width: "50px", height: "50px" }}
            />
            <div>
              <strong>Teacher: {course.teacher?.full_name}</strong>
              <div className="text-muted small">{course.teacher?.bio}</div>
            </div>
          </div>
        </div>

        {/* Right column (Price & Buy button) */}
        <div className="col-md-4">
          <div className="card shadow-sm">
            <img
              src={course.thumbnail_url}
              className="card-img-top"
              alt="Course"
            />
            <div className="card-body">
              <h3 className="text-primary fw-bold text-center">
                {course.price === 0 || course.price === "0.00"
                  ? "Free"
                  : parseInt(course.price).toLocaleString() + " $"}
              </h3>
              {checkingEnrollment ? (
                <button className="btn btn-secondary w-100 btn-lg mt-3" disabled>
                  Checking...
                </button>
              ) : isEnrolled ? (
                <Link
                  to={`/course/${id}/lessons`}
                  className="btn btn-success w-100 btn-lg mt-3"
                >
                  <i className="bi bi-play-circle me-2"></i>
                  Go to Lessons
                </Link>
              ) : (
                <button
                  className="btn btn-primary w-100 btn-lg mt-3"
                  onClick={handleEnroll}
                >
                  Enroll now
                </button>
              )}
              <ul className="list-group list-group-flush mt-3">
                <li className="list-group-item">Level: {course.level}</li>
                <li className="list-group-item">
                  Total chapters: {course.chapters?.length || 0}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* Curriculum */}
      <div className="row mt-5">
        <div className="col-md-8">
          <h3 className="mb-3">Course content</h3>
          <div className="accordion" id="accordionChapters">
            {course.chapters &&
              course.chapters.map((chapter, index) => (
                <div className="accordion-item" key={chapter.chapter_id}>
                  <h2 className="accordion-header" id={`heading${index}`}>
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#collapse${index}`}
                      aria-expanded="true"
                    >
                      <strong>{chapter.title}</strong>
                    </button>
                  </h2>
                  <div
                    id={`collapse${index}`}
                    className="accordion-collapse collapse show"
                  >
                    <div className="accordion-body p-0">
                      <ul className="list-group list-group-flush">
                        {chapter.lessons &&
                          chapter.lessons.map((lesson) => (
                            <li
                              key={lesson.lesson_id}
                              className="list-group-item d-flex justify-content-between align-items-center"
                            >
                              <span>
                                <i
                                  className={`bi ${lesson.content_type === "video"
                                    ? "bi-play-circle-fill"
                                    : "bi-file-text"
                                    } me-2`}
                                ></i>
                                {lesson.title}
                              </span>
                              <span className="badge bg-secondary rounded-pill">
                                {Math.floor(lesson.duration_seconds / 60)}{" "}
                                minutes
                              </span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="mb-5"></div> {/* Bottom margin */}
    </div>
  );
};

export default CourseDetailPage;


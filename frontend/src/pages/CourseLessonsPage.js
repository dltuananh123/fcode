import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getEnrolledCourse } from "../services/courseService";

const CourseLessonsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEnrolledCourse = async () => {
            try {
                const data = await getEnrolledCourse(id);
                setCourse(data);
                setLoading(false);
            } catch (err) {
                setError(err.message || "Failed to load course");
                setLoading(false);
            }
        };
        fetchEnrolledCourse();
    }, [id]);

    // Calculate total progress
    const calculateProgress = () => {
        if (!course || !course.chapters) return 0;
        let totalLessons = 0;
        let completedLessons = 0;
        course.chapters.forEach((chapter) => {
            chapter.lessons?.forEach((lesson) => {
                totalLessons++;
                if (lesson.progress?.is_completed) completedLessons++;
            });
        });
        return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger text-center">
                    <h4>Access Denied</h4>
                    <p>{error}</p>
                    <Link to="/" className="btn btn-primary">
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="container mt-5 text-center">
                <h3 className="text-danger">Course not found!</h3>
                <Link to="/" className="btn btn-primary mt-3">
                    Back to Home
                </Link>
            </div>
        );
    }

    const progress = calculateProgress();

    return (
        <div className="bg-light min-vh-100">
            {/* Header */}
            <div className="bg-dark text-white py-4">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-8">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb mb-2">
                                    <li className="breadcrumb-item">
                                        <Link to="/" className="text-white-50 text-decoration-none">
                                            Home
                                        </Link>
                                    </li>
                                    <li className="breadcrumb-item text-white active" aria-current="page">
                                        {course.title}
                                    </li>
                                </ol>
                            </nav>
                            <h2 className="fw-bold mb-2">{course.title}</h2>
                            <div className="d-flex align-items-center">
                                <img
                                    src={course.teacher?.avatar_url || "https://via.placeholder.com/40"}
                                    alt="Teacher"
                                    className="rounded-circle me-2"
                                    style={{ width: "40px", height: "40px" }}
                                />
                                <span>Instructor: {course.teacher?.full_name}</span>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card bg-white text-dark">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="fw-bold">Your Progress</span>
                                        <span className="badge bg-primary">{progress}%</span>
                                    </div>
                                    <div className="progress" style={{ height: "10px" }}>
                                        <div
                                            className="progress-bar bg-success"
                                            role="progressbar"
                                            style={{ width: `${progress}%` }}
                                            aria-valuenow={progress}
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Course Content */}
            <div className="container py-4">
                <div className="row">
                    <div className="col-12">
                        <h4 className="mb-4">
                            <i className="bi bi-list-ul me-2"></i>
                            Course Content
                        </h4>

                        <div className="accordion" id="courseLessonsAccordion">
                            {course.chapters &&
                                course.chapters.map((chapter, chapterIndex) => {
                                    const chapterCompleted = chapter.lessons?.every(
                                        (l) => l.progress?.is_completed
                                    );
                                    const lessonsCompleted = chapter.lessons?.filter(
                                        (l) => l.progress?.is_completed
                                    ).length || 0;
                                    const totalLessons = chapter.lessons?.length || 0;

                                    return (
                                        <div className="accordion-item shadow-sm mb-2" key={chapter.chapter_id}>
                                            <h2 className="accordion-header" id={`heading${chapterIndex}`}>
                                                <button
                                                    className="accordion-button"
                                                    type="button"
                                                    data-bs-toggle="collapse"
                                                    data-bs-target={`#collapse${chapterIndex}`}
                                                    aria-expanded="true"
                                                    aria-controls={`collapse${chapterIndex}`}
                                                >
                                                    <div className="d-flex justify-content-between align-items-center w-100 me-3">
                                                        <div className="d-flex align-items-center">
                                                            {chapterCompleted ? (
                                                                <span className="badge bg-success me-2">
                                                                    <i className="bi bi-check-circle-fill"></i>
                                                                </span>
                                                            ) : (
                                                                <span className="badge bg-secondary me-2">
                                                                    {chapterIndex + 1}
                                                                </span>
                                                            )}
                                                            <strong>{chapter.title}</strong>
                                                        </div>
                                                        <span className="badge bg-light text-dark">
                                                            {lessonsCompleted}/{totalLessons} lessons
                                                        </span>
                                                    </div>
                                                </button>
                                            </h2>
                                            <div
                                                id={`collapse${chapterIndex}`}
                                                className="accordion-collapse collapse show"
                                                aria-labelledby={`heading${chapterIndex}`}
                                            >
                                                <div className="accordion-body p-0">
                                                    <ul className="list-group list-group-flush">
                                                        {chapter.lessons &&
                                                            chapter.lessons.map((lesson, lessonIndex) => (
                                                                <li
                                                                    key={lesson.lesson_id}
                                                                    className="list-group-item d-flex justify-content-between align-items-center py-3 px-4 lesson-item"
                                                                    style={{ cursor: "pointer" }}
                                                                    onClick={() =>
                                                                        navigate(`/course/${id}/lesson/${lesson.lesson_id}`)
                                                                    }
                                                                >
                                                                    <div className="d-flex align-items-center">
                                                                        {lesson.progress?.is_completed ? (
                                                                            <i className="bi bi-check-circle-fill text-success me-3 fs-5"></i>
                                                                        ) : (
                                                                            <i
                                                                                className={`bi ${lesson.content_type === "video"
                                                                                        ? "bi-play-circle"
                                                                                        : "bi-file-text"
                                                                                    } text-primary me-3 fs-5`}
                                                                            ></i>
                                                                        )}
                                                                        <div>
                                                                            <div className="fw-medium">{lesson.title}</div>
                                                                            <small className="text-muted">
                                                                                {lesson.content_type === "video" ? "Video" : "Document"} •{" "}
                                                                                {Math.floor(lesson.duration_seconds / 60)} min
                                                                            </small>
                                                                        </div>
                                                                    </div>
                                                                    <i className="bi bi-chevron-right text-muted"></i>
                                                                </li>
                                                            ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Inline styles for hover effect */}
            <style>
                {`
          .lesson-item:hover {
            background-color: #f8f9fa;
            transition: background-color 0.2s ease;
          }
        `}
            </style>
        </div>
    );
};

export default CourseLessonsPage;

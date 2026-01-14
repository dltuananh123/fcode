import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
    getLessonDetail,
    getEnrolledCourse,
    markLessonComplete,
} from "../services/courseService";

const LessonPage = () => {
    const { courseId, lessonId } = useParams();
    const navigate = useNavigate();
    const [lesson, setLesson] = useState(null);
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [lessonData, courseData] = await Promise.all([
                    getLessonDetail(lessonId),
                    getEnrolledCourse(courseId),
                ]);
                setLesson(lessonData);
                setCourse(courseData);
                setLoading(false);
            } catch (err) {
                setError(err.message || "Failed to load lesson");
                setLoading(false);
            }
        };
        fetchData();
    }, [courseId, lessonId]);

    // Extract YouTube video ID from URL
    const getYouTubeVideoId = (url) => {
        if (!url) return null;
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    };

    // Find current lesson index and navigation
    const findLessonNavigation = () => {
        if (!course || !course.chapters) return { prev: null, next: null, current: null };

        const allLessons = [];
        course.chapters.forEach((chapter) => {
            chapter.lessons?.forEach((l) => {
                allLessons.push({ ...l, chapterTitle: chapter.title });
            });
        });

        const currentIndex = allLessons.findIndex(
            (l) => l.lesson_id === parseInt(lessonId)
        );

        return {
            prev: currentIndex > 0 ? allLessons[currentIndex - 1] : null,
            next: currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null,
            current: allLessons[currentIndex] || null,
            totalLessons: allLessons.length,
            currentNumber: currentIndex + 1,
        };
    };

    const handleMarkComplete = async () => {
        try {
            await markLessonComplete(lessonId);
            setLesson((prev) => ({
                ...prev,
                progress: { ...prev.progress, is_completed: true },
            }));
            // Update course data to reflect completion
            setCourse((prev) => {
                const updated = { ...prev };
                updated.chapters = updated.chapters.map((chapter) => ({
                    ...chapter,
                    lessons: chapter.lessons.map((l) =>
                        l.lesson_id === parseInt(lessonId)
                            ? { ...l, progress: { ...l.progress, is_completed: true } }
                            : l
                    ),
                }));
                return updated;
            });
        } catch (err) {
            alert(err.message || "Failed to mark lesson as complete");
        }
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

    if (!lesson) {
        return (
            <div className="container mt-5 text-center">
                <h3 className="text-danger">Lesson not found!</h3>
                <Link to={`/course/${courseId}/lessons`} className="btn btn-primary mt-3">
                    Back to Course
                </Link>
            </div>
        );
    }

    const videoId = getYouTubeVideoId(lesson.video_url);
    const nav = findLessonNavigation();

    return (
        <div className="d-flex" style={{ minHeight: "100vh" }}>
            {/* Sidebar */}
            <div
                className={`bg-white border-end ${sidebarOpen ? "" : "d-none"}`}
                style={{ width: "350px", overflowY: "auto", maxHeight: "100vh" }}
            >
                <div className="p-3 bg-dark text-white">
                    <Link
                        to={`/course/${courseId}/lessons`}
                        className="text-white text-decoration-none d-flex align-items-center mb-2"
                    >
                        <i className="bi bi-arrow-left me-2"></i>
                        Back to Course
                    </Link>
                    <h6 className="mb-0 fw-bold">{course?.title}</h6>
                </div>

                <div className="accordion" id="lessonsSidebar">
                    {course?.chapters?.map((chapter, chapterIndex) => (
                        <div className="accordion-item border-0" key={chapter.chapter_id}>
                            <h2 className="accordion-header">
                                <button
                                    className="accordion-button py-2 px-3 small"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target={`#sidebarChapter${chapterIndex}`}
                                    aria-expanded="true"
                                >
                                    <span className="badge bg-secondary me-2 small">
                                        {chapterIndex + 1}
                                    </span>
                                    <span className="fw-medium">{chapter.title}</span>
                                </button>
                            </h2>
                            <div
                                id={`sidebarChapter${chapterIndex}`}
                                className="accordion-collapse collapse show"
                            >
                                <ul className="list-group list-group-flush">
                                    {chapter.lessons?.map((l) => (
                                        <li
                                            key={l.lesson_id}
                                            className={`list-group-item list-group-item-action py-2 px-4 small d-flex align-items-center ${l.lesson_id === parseInt(lessonId)
                                                    ? "bg-primary bg-opacity-10 border-start border-primary border-3"
                                                    : ""
                                                }`}
                                            style={{ cursor: "pointer" }}
                                            onClick={() =>
                                                navigate(`/course/${courseId}/lesson/${l.lesson_id}`)
                                            }
                                        >
                                            {l.progress?.is_completed ? (
                                                <i className="bi bi-check-circle-fill text-success me-2"></i>
                                            ) : (
                                                <i className="bi bi-circle text-muted me-2"></i>
                                            )}
                                            <span
                                                className={
                                                    l.lesson_id === parseInt(lessonId) ? "fw-bold" : ""
                                                }
                                            >
                                                {l.title}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-grow-1 bg-light">
                {/* Top bar */}
                <div className="bg-white border-bottom py-2 px-4 d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        <button
                            className="btn btn-outline-secondary btn-sm me-3"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            <i className={`bi ${sidebarOpen ? "bi-chevron-left" : "bi-list"}`}></i>
                        </button>
                        <span className="text-muted small">
                            Lesson {nav.currentNumber} of {nav.totalLessons}
                        </span>
                    </div>
                    <div>
                        {!lesson.progress?.is_completed && (
                            <button
                                className="btn btn-success btn-sm"
                                onClick={handleMarkComplete}
                            >
                                <i className="bi bi-check-circle me-1"></i>
                                Mark as Complete
                            </button>
                        )}
                        {lesson.progress?.is_completed && (
                            <span className="badge bg-success">
                                <i className="bi bi-check-circle-fill me-1"></i>
                                Completed
                            </span>
                        )}
                    </div>
                </div>

                {/* Video Container */}
                <div className="container-fluid px-0">
                    {lesson.content_type === "video" && videoId ? (
                        <div
                            className="ratio ratio-16x9 bg-dark"
                            style={{ maxHeight: "70vh" }}
                        >
                            <iframe
                                src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                                title={lesson.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    ) : lesson.content_type === "video" && lesson.video_url ? (
                        <div
                            className="ratio ratio-16x9 bg-dark"
                            style={{ maxHeight: "70vh" }}
                        >
                            <video controls className="w-100">
                                <source src={lesson.video_url} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    ) : (
                        <div
                            className="bg-primary bg-opacity-10 py-5 text-center"
                            style={{ minHeight: "200px" }}
                        >
                            <i className="bi bi-file-text display-1 text-primary"></i>
                            <h4 className="mt-3">Document Lesson</h4>
                        </div>
                    )}
                </div>

                {/* Lesson Content */}
                <div className="container py-4">
                    <div className="row">
                        <div className="col-lg-8">
                            {/* Lesson Title */}
                            <h2 className="fw-bold mb-3">{lesson.title}</h2>

                            {/* Lesson Meta */}
                            <div className="d-flex align-items-center mb-4 text-muted">
                                <span className="me-3">
                                    <i className="bi bi-clock me-1"></i>
                                    {Math.floor(lesson.duration_seconds / 60)} minutes
                                </span>
                                <span className="me-3">
                                    <i className="bi bi-collection me-1"></i>
                                    {lesson.content_type === "video" ? "Video" : "Document"}
                                </span>
                            </div>

                            {/* Lesson Content Text */}
                            {lesson.content_text && (
                                <div className="card shadow-sm">
                                    <div className="card-header bg-white">
                                        <h5 className="mb-0">
                                            <i className="bi bi-journal-text me-2"></i>
                                            Lesson Content
                                        </h5>
                                    </div>
                                    <div className="card-body">
                                        <div
                                            className="lesson-content"
                                            style={{ whiteSpace: "pre-wrap" }}
                                        >
                                            {lesson.content_text}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Navigation */}
                            <div className="d-flex justify-content-between mt-4 pt-4 border-top">
                                {nav.prev ? (
                                    <button
                                        className="btn btn-outline-primary"
                                        onClick={() =>
                                            navigate(`/course/${courseId}/lesson/${nav.prev.lesson_id}`)
                                        }
                                    >
                                        <i className="bi bi-chevron-left me-2"></i>
                                        Previous: {nav.prev.title}
                                    </button>
                                ) : (
                                    <div></div>
                                )}
                                {nav.next ? (
                                    <button
                                        className="btn btn-primary"
                                        onClick={() =>
                                            navigate(`/course/${courseId}/lesson/${nav.next.lesson_id}`)
                                        }
                                    >
                                        Next: {nav.next.title}
                                        <i className="bi bi-chevron-right ms-2"></i>
                                    </button>
                                ) : (
                                    <Link
                                        to={`/course/${courseId}/lessons`}
                                        className="btn btn-success"
                                    >
                                        <i className="bi bi-check-circle me-2"></i>
                                        Complete Course
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LessonPage;

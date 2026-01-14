import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getCourseById } from "../services/courseService";

const CoursePage = () => {
    const { id, lessonId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [expandedChapters, setExpandedChapters] = useState({});

    // Get user info from localStorage
    const user = JSON.parse(localStorage.getItem("user"))?.user;

    useEffect(() => {
        const fetchCourse = async () => {
            const data = await getCourseById(id);
            setCourse(data);
            setLoading(false);

            // Auto-expand all chapters and select first lesson or lessonId from URL
            if (data?.chapters) {
                const expanded = {};
                data.chapters.forEach((chapter, index) => {
                    expanded[index] = true;
                });
                setExpandedChapters(expanded);

                // Find lesson by lessonId or default to first lesson
                let foundLesson = null;
                if (lessonId) {
                    for (const chapter of data.chapters) {
                        const lesson = chapter.lessons?.find(
                            (l) => l.lesson_id === parseInt(lessonId)
                        );
                        if (lesson) {
                            foundLesson = lesson;
                            break;
                        }
                    }
                }

                // If no lessonId or lesson not found, select first lesson
                if (!foundLesson && data.chapters[0]?.lessons?.[0]) {
                    foundLesson = data.chapters[0].lessons[0];
                }

                setSelectedLesson(foundLesson);
            }
        };
        fetchCourse();
    }, [id, lessonId]);

    const toggleChapter = (index) => {
        setExpandedChapters((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const handleSelectLesson = (lesson) => {
        setSelectedLesson(lesson);
        // Update URL without reloading
        navigate(`/course/${id}/learn/${lesson.lesson_id}`, { replace: true });
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    // Extract YouTube video ID from URL
    const getYouTubeVideoId = (url) => {
        if (!url) return null;
        const regExp =
            /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
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

    if (!course) {
        return (
            <div className="d-flex flex-column justify-content-center align-items-center vh-100">
                <h3 className="text-danger mb-3">Course not found!</h3>
                <Link to="/" className="btn btn-primary">
                    Back to Home
                </Link>
            </div>
        );
    }

    const videoId = selectedLesson?.video_url
        ? getYouTubeVideoId(selectedLesson.video_url)
        : null;

    return (
        <div className="d-flex flex-column vh-100">
            {/* Header */}
            <nav className="navbar navbar-light bg-light px-4 shadow-sm">
                <div className="d-flex align-items-center">
                    <Link to="/" className="text-decoration-none">
                        <span className="navbar-brand mb-0 h1 fw-bold text-primary">
                            F-Code Learning
                        </span>
                    </Link>
                    <span className="ms-3 text-muted">|</span>
                    <span className="ms-3 fw-semibold text-dark">{course.title}</span>
                </div>
                <div className="d-flex align-items-center">
                    <span className="me-3">
                        Hello, <b>{user ? user.full_name : "Guest"}</b>
                    </span>
                    <button onClick={handleLogout} className="btn btn-sm btn-danger">
                        Logout
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <div className="d-flex flex-grow-1 overflow-hidden">
                {/* Video/Content Area */}
                <div className="flex-grow-1 d-flex flex-column bg-dark">
                    {/* Video Player */}
                    <div className="ratio ratio-16x9 bg-black">
                        {selectedLesson?.content_type === "video" && videoId ? (
                            <iframe
                                src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`}
                                title={selectedLesson.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="border-0"
                            ></iframe>
                        ) : selectedLesson?.content_type === "video" &&
                            selectedLesson?.video_url ? (
                            <video
                                src={selectedLesson.video_url}
                                controls
                                className="w-100 h-100"
                            >
                                Your browser does not support video playback.
                            </video>
                        ) : (
                            <div className="d-flex justify-content-center align-items-center h-100 text-white">
                                <div className="text-center">
                                    <i className="bi bi-play-circle fs-1 mb-3 d-block"></i>
                                    <p>Select a lesson to start learning</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Lesson Info */}
                    <div className="p-4 bg-white flex-grow-1 overflow-auto">
                        {selectedLesson ? (
                            <>
                                <h3 className="fw-bold mb-2">{selectedLesson.title}</h3>
                                <div className="d-flex align-items-center text-muted mb-3">
                                    <span className="badge bg-primary me-2">
                                        {selectedLesson.content_type === "video" ? "Video" : "Text"}
                                    </span>
                                    <span>
                                        <i className="bi bi-clock me-1"></i>
                                        {Math.floor(selectedLesson.duration_seconds / 60)} minutes
                                    </span>
                                </div>
                                {selectedLesson.content && (
                                    <div className="lesson-content mt-4">
                                        <h5 className="fw-semibold mb-3">Lesson Content</h5>
                                        <div className="bg-light p-3 rounded">
                                            <p style={{ whiteSpace: "pre-wrap" }}>
                                                {selectedLesson.content}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center text-muted py-5">
                                <i className="bi bi-book fs-1 mb-3 d-block"></i>
                                <p>Select a lesson from the sidebar to view content</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar - Course Content */}
                <div
                    className="bg-light border-start overflow-auto"
                    style={{ width: "350px", minWidth: "350px" }}
                >
                    <div className="p-3 border-bottom bg-white">
                        <h5 className="fw-bold mb-0">
                            <i className="bi bi-list-ul me-2"></i>
                            Course Content
                        </h5>
                    </div>

                    <div className="accordion accordion-flush" id="courseContent">
                        {course.chapters &&
                            course.chapters.map((chapter, index) => (
                                <div className="accordion-item" key={chapter.chapter_id}>
                                    <h2 className="accordion-header">
                                        <button
                                            className={`accordion-button ${expandedChapters[index] ? "" : "collapsed"
                                                } fw-semibold`}
                                            type="button"
                                            onClick={() => toggleChapter(index)}
                                            style={{ fontSize: "0.95rem" }}
                                        >
                                            <div>
                                                <div>{chapter.title}</div>
                                                <small className="text-muted fw-normal">
                                                    {chapter.lessons?.length || 0} lessons
                                                </small>
                                            </div>
                                        </button>
                                    </h2>
                                    <div
                                        className={`accordion-collapse collapse ${expandedChapters[index] ? "show" : ""
                                            }`}
                                    >
                                        <div className="accordion-body p-0">
                                            <ul className="list-group list-group-flush">
                                                {chapter.lessons &&
                                                    chapter.lessons.map((lesson) => (
                                                        <li
                                                            key={lesson.lesson_id}
                                                            className={`list-group-item list-group-item-action d-flex align-items-center py-3 ${selectedLesson?.lesson_id === lesson.lesson_id
                                                                    ? "active"
                                                                    : ""
                                                                }`}
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => handleSelectLesson(lesson)}
                                                        >
                                                            <i
                                                                className={`bi ${lesson.content_type === "video"
                                                                        ? "bi-play-circle-fill"
                                                                        : "bi-file-text-fill"
                                                                    } me-3 ${selectedLesson?.lesson_id === lesson.lesson_id
                                                                        ? "text-white"
                                                                        : "text-primary"
                                                                    }`}
                                                            ></i>
                                                            <div className="flex-grow-1">
                                                                <div
                                                                    className={`${selectedLesson?.lesson_id ===
                                                                            lesson.lesson_id
                                                                            ? "text-white"
                                                                            : ""
                                                                        }`}
                                                                    style={{ fontSize: "0.9rem" }}
                                                                >
                                                                    {lesson.title}
                                                                </div>
                                                                <small
                                                                    className={`${selectedLesson?.lesson_id ===
                                                                            lesson.lesson_id
                                                                            ? "text-white-50"
                                                                            : "text-muted"
                                                                        }`}
                                                                >
                                                                    {Math.floor(lesson.duration_seconds / 60)} min
                                                                </small>
                                                            </div>
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
        </div>
    );
};

export default CoursePage;

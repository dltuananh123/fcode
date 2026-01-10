import React, { useEffect, useState } from "react";
import { getAllCourses } from "../services/courseService";
import CourseCard from "../components/CourseCard";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Lấy thông tin user từ LocalStorage để hiện lời chào
  const user = JSON.parse(localStorage.getItem("user"))?.user;

  useEffect(() => {
    const fetchCourses = async () => {
      const data = await getAllCourses();
      setCourses(data);
      setLoading(false);
    };
    fetchCourses();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div>
      {/* Header đơn giản */}
      <nav className="navbar navbar-light bg-light px-4 mb-4 shadow-sm">
        <span className="navbar-brand mb-0 h1 fw-bold text-primary">
          F-Code Learning
        </span>
        <div className="d-flex align-items-center">
          <span className="me-3">
            Xin chào, <b>{user ? user.full_name : "Khách"}</b>
          </span>
          <button onClick={handleLogout} className="btn btn-sm btn-danger">
            Đăng xuất
          </button>
        </div>
      </nav>

      {/* Nội dung chính */}
      <div className="container">
        <h2 className="mb-4 text-center fw-bold">Danh Sách Khóa Học Nổi Bật</h2>

        {loading ? (
          <div className="text-center mt-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p>Đang tải khóa học...</p>
          </div>
        ) : (
          <div className="row">
            {courses.length > 0 ? (
              courses.map((course) => (
                <CourseCard key={course.course_id} course={course} />
              ))
            ) : (
              <p className="text-center text-muted">
                Chưa có khóa học nào được đăng tải.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;

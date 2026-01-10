import React from "react";
import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {
  // Nếu không có ảnh thì dùng ảnh mặc định
  const defaultImg = "https://files.fullstack.edu.vn/f8-prod/courses/13/13.png";

  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100 shadow-sm">
        <img
          src={course.thumbnail_url || defaultImg}
          className="card-img-top"
          alt={course.title}
          style={{ height: "200px", objectFit: "cover" }}
        />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{course.title}</h5>
          <p className="card-text text-muted" style={{ fontSize: "0.9rem" }}>
            {course.description
              ? course.description.substring(0, 100) + "..."
              : ""}
          </p>

          <div className="mt-auto">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="badge bg-info text-dark">
                {course.level || "Beginner"}
              </span>
              <span className="fw-bold text-primary">
                {course.price === 0 || course.price === "0.00"
                  ? "Miễn phí"
                  : parseInt(course.price).toLocaleString() + " đ"}
              </span>
            </div>

            <div className="d-flex align-items-center mb-3">
              <small className="text-muted">
                GV: {course.teacher ? course.teacher.full_name : "Admin"}
              </small>
            </div>

            <Link
              to={`/course/${course.course_id}`}
              className="btn btn-outline-primary w-100"
            >
              Xem chi tiết
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;

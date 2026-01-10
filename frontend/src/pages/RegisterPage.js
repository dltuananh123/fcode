import React, { useState } from "react";
import { registerUser } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "student", // Mặc định là học sinh
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerUser(formData);
      alert("Đăng ký thành công! Mời bạn đăng nhập.");
      navigate("/login"); // Chuyển sang trang Login
    } catch (err) {
      alert(err.message || "Lỗi đăng ký");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card mx-auto shadow" style={{ maxWidth: "500px" }}>
        <div className="card-body p-4">
          <h3 className="card-title text-center mb-4">Đăng Ký Tài Khoản</h3>
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label className="form-label">Họ và Tên</label>
              <input
                type="text"
                name="full_name"
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Mật khẩu</label>
              <input
                type="password"
                name="password"
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Vai trò</label>
              <select
                name="role"
                className="form-select"
                onChange={handleChange}
              >
                <option value="student">Học sinh</option>
                <option value="teacher">Giáo viên</option>
              </select>
            </div>
            <button type="submit" className="btn btn-success w-100">
              Đăng Ký
            </button>
          </form>
          <div className="mt-3 text-center">
            <small>
              Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

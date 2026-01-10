import React, { useState } from "react";
import { loginUser } from "../services/authService";
import { useNavigate, Link } from "react-router-dom"; // Dùng để chuyển trang

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Để lưu thông báo lỗi
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Chặn reload trang
    try {
      await loginUser({ email, password });
      alert("Đăng nhập thành công!");
      navigate("/"); // Chuyển về trang chủ (chưa làm, kệ nó)
    } catch (err) {
      setError(err.message || "Sai email hoặc mật khẩu!");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card mx-auto shadow" style={{ maxWidth: "400px" }}>
        <div className="card-body p-4">
          <h3 className="card-title text-center mb-4">F-Code Login</h3>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Đăng Nhập
            </button>
          </form>

          <div className="mt-3 text-center">
            <small>
              Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

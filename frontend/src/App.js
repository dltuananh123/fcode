import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap cho đẹp

function App() {
  return (
    <Router>
      <Routes>
        {/* Nếu vào trang chủ "/" -> Tự nhảy sang "/login" */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Định nghĩa các đường dẫn */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;

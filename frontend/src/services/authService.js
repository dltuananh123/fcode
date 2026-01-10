import axios from "axios";

// Đường dẫn API của Backend (Bạn đang chạy ở port 8080)
const API_URL = "http://localhost:8080/api/auth";

// 1. Hàm Đăng ký
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    // Ném lỗi ra để Frontend bắt được và hiện thông báo đỏ
    throw error.response ? error.response.data : { message: "Lỗi server" };
  }
};

// 2. Hàm Đăng nhập
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);

    // Nếu có token thì lưu vào bộ nhớ trình duyệt (LocalStorage)
    if (response.data.token) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }

    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Lỗi server" };
  }
};

// 3. Hàm Đăng xuất (Xóa token)
export const logoutUser = () => {
  localStorage.removeItem("user");
};

import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Lỗi server" };
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    if (response.data.token) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Lỗi server" };
  }
};

export const logoutUser = () => {
  localStorage.removeItem("user");
};

export const logout = logoutUser;

export const updateProfile = async (profileData) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    const response = await axios.put(`${API_URL}/profile`, profileData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Update local storage with new user data
    if (response.data.user) {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      currentUser.user = {
        ...currentUser.user,
        ...response.data.user,
      };
      localStorage.setItem("user", JSON.stringify(currentUser));
    }

    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Lỗi server" };
  }
};
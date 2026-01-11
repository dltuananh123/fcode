import axios from "axios";

const API_URL = "http://localhost:8080/api/courses";

export const getAllCourses = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error when getting all courses:", error.message);
    return [];
  }
};

export const getCourseById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error when getting course detail:", error);
    return null;
  }
};

export const enrollCourse = async (courseId) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    const response = await axios.post(
      `${API_URL}/enroll`,
      { courseId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : { message: "Connection error" };
  }
};

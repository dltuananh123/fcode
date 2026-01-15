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

export const getEnrolledCourse = async (courseId) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    const response = await axios.get(`${API_URL}/enrolled/${courseId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error when getting enrolled course:", error);
    throw error.response
      ? error.response.data
      : { message: "Connection error" };
  }
};

export const getLessonDetail = async (lessonId) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    const response = await axios.get(`${API_URL}/lesson/${lessonId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error when getting lesson detail:", error);
    throw error.response
      ? error.response.data
      : { message: "Connection error" };
  }
};

export const markLessonComplete = async (lessonId) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    const response = await axios.post(
      `${API_URL}/lesson/${lessonId}/complete`,
      {},
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

export const getMyEnrolledCourses = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    const response = await axios.get(`${API_URL}/my-enrolled`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error when getting enrolled courses:", error);
    return [];
  }
};

export const getMyCourses = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    const response = await axios.get(`${API_URL}/my-courses`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error when getting my courses:", error);
    return [];
  }
};

export const deleteCourse = async (courseId) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    const response = await axios.delete(`${API_URL}/${courseId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : { message: "Connection error" };
  }
};

export const createCourse = async (courseData) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    const response = await axios.post(`${API_URL}/create`, courseData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : { message: "Connection error" };
  }
};

export const updateCourse = async (courseId, courseData) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    const response = await axios.put(`${API_URL}/${courseId}`, courseData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : { message: "Connection error" };
  }
};

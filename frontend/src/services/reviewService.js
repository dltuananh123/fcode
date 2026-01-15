import axios from "axios";

const API_URL = "http://localhost:8080/api/reviews";

export const getCourseReviews = async (courseId) => {
  try {
    const response = await axios.get(`${API_URL}/course/${courseId}`);
    return response.data;
  } catch (error) {
    console.error("Error when getting reviews:", error);
    return [];
  }
};

export const createReview = async (courseId, rating, comment) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    const response = await axios.post(
      `${API_URL}/course/${courseId}`,
      { rating, comment },
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

export const updateReview = async (reviewId, rating, comment) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    const response = await axios.put(
      `${API_URL}/${reviewId}`,
      { rating, comment },
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

export const deleteReview = async (reviewId) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    const response = await axios.delete(`${API_URL}/${reviewId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : { message: "Connection error" };
  }
};

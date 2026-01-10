import axios from "axios";

const API_URL = "http://localhost:8080/api/courses";

export const getAllCourses = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error when getting all courses:", error);
    return [];
  }
};

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import CourseDetailPage from "./pages/CourseDetailPage";
import CourseLessonsPage from "./pages/CourseLessonsPage";
import LessonPage from "./pages/LessonPage";
import ChatBox from "./components/ChatBox";

import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/course/:id" element={<CourseDetailPage />} />
        <Route path="/course/:id/lessons" element={<CourseLessonsPage />} />
        <Route path="/course/:courseId/lesson/:lessonId" element={<LessonPage />} />
      </Routes>
      {/* Chat box */}
      <ChatBox />
    </Router>
  );
}

export default App;


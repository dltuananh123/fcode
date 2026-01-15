import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import CourseDetailPage from "./pages/CourseDetailPage";
import CourseLessonsPage from "./pages/CourseLessonsPage";
import LessonPage from "./pages/LessonPage";
import ChatBox from "./components/ChatBox";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/course/:id" element={<CourseDetailPage />} />
          <Route path="/course/:id/lessons" element={<CourseLessonsPage />} />
          <Route path="/course/:courseId/lesson/:lessonId" element={<LessonPage />} />
        </Routes>
        <ChatBox />
      </Router>
    </ThemeProvider>
  );
}

export default App;

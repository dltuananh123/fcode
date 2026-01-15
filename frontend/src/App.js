import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import theme from './theme';
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import CourseDetailPage from "./pages/CourseDetailPage";
import CourseLessonsPage from "./pages/CourseLessonsPage";
import LessonPage from "./pages/LessonPage";
import ProfilePage from "./pages/ProfilePage";
import CreateCoursePage from "./pages/CreateCoursePage";
import AccessDeniedPage from "./pages/AccessDeniedPage";
import ChatBox from "./components/ChatBox";

const AppContent = () => {
  const location = useLocation();
  
  // Chỉ hiển thị ChatBox ở trang chủ và các trang course
  const showChatBox = location.pathname === "/" || location.pathname.startsWith("/course");

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/create-course" element={<CreateCoursePage />} />
        <Route path="/access-denied" element={<AccessDeniedPage />} />
        <Route path="/course/:id" element={<CourseDetailPage />} />
        <Route path="/course/:id/lessons" element={<CourseLessonsPage />} />
        <Route path="/course/:courseId/lesson/:lessonId" element={<LessonPage />} />
      </Routes>
      {showChatBox && <ChatBox />}
    </Box>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Box,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getAllCourses } from "../services/courseService";
import CourseCard from "../components/CourseCard";

const HomePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"))?.user;

  useEffect(() => {
    const fetchCourses = async () => {
      const data = await getAllCourses();
      setCourses(data);
      setLoading(false);
    };
    fetchCourses();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 500 }}>
            🎓 F-Code Learning
          </Typography>
          <Typography variant="body1" sx={{ mr: 2, display: { xs: "none", sm: "block" } }}>
            Xin chào, <strong>{user ? user.full_name : "Khách"}</strong>
          </Typography>
          <Button
            color="inherit"
            onClick={handleLogout}
            variant="outlined"
            sx={{
              borderColor: "rgba(255, 255, 255, 0.5)",
              color: "white",
              "&:hover": {
                borderColor: "white",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            Đăng xuất
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              mb: 2,
              fontWeight: 500,
              color: "primary.main",
            }}
          >
            Khóa Học Nổi Bật
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Khám phá các khóa học chất lượng cao được giảng dạy bởi các chuyên gia
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {courses.length > 0 ? (
              courses.map((course) => (
                <Grid item xs={12} sm={6} md={4} key={course.course_id}>
                  <CourseCard course={course} />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Box sx={{ textAlign: "center", py: 5 }}>
                  <Typography variant="body1" color="text.secondary">
                    Chưa có khóa học nào được đăng tải.
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default HomePage;

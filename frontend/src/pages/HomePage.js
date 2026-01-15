import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Box,
  CircularProgress,
  Typography,
  Button,
  Stack,
  alpha,
  useTheme,
} from "@mui/material";
import { getAllCourses } from "../services/courseService";
import CourseCard from "../components/CourseCard";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { RocketLaunch, ArrowForward } from "@mui/icons-material";

const HomePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    document.title = "Trang chủ - F-Code Learning";
    const fetchCourses = async () => {
      try {
        const data = await getAllCourses();
        setCourses(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch courses", error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 12 },
          px: 2,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Abstract Background Shapes */}
        <Box sx={{ 
            position: 'absolute', top: '-20%', right: '-10%', width: '600px', height: '600px', 
            background: `radial-gradient(circle, ${alpha(theme.palette.primary.light, 0.2)} 0%, transparent 70%)`, 
            borderRadius: '50%', filter: 'blur(50px)', zIndex: 0 
        }} />
        <Box sx={{ 
            position: 'absolute', bottom: '-10%', left: '-10%', width: '400px', height: '400px', 
            background: `radial-gradient(circle, ${alpha(theme.palette.secondary.light, 0.1)} 0%, transparent 70%)`, 
            borderRadius: '50%', filter: 'blur(40px)', zIndex: 0 
        }} />

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 1, borderRadius: '50px', bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', mb: 3 }}>
                <RocketLaunch fontSize="small" />
                <Typography variant="subtitle2" fontWeight={600}>Nền tảng học tập thế hệ mới</Typography>
            </Box>
          <Typography
            component="h1"
            variant="h1"
            sx={{
              mb: 3,
              background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))'
            }}
          >
            Nâng tầm kỹ năng <br /> Lập trình của bạn
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 5, maxWidth: '800px', mx: 'auto', lineHeight: 1.6 }}>
            Khám phá hàng trăm khóa học chất lượng cao từ các chuyên gia hàng đầu.
            Học mọi lúc, mọi nơi, và xây dựng sự nghiệp vững chắc.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button variant="contained" size="large" endIcon={<ArrowForward />} sx={{ fontSize: '1.1rem', px: 4, py: 1.5 }}>
              Bắt đầu ngay
            </Button>
            <Button variant="outlined" size="large" sx={{ fontSize: '1.1rem', px: 4, py: 1.5 }}>
              Tìm hiểu thêm
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Courses Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
          <Box>
            <Typography variant="h3" component="h2" sx={{ mb: 1, color: 'text.primary' }}>
              Khóa học nổi bật
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Những khóa học được đánh giá cao nhất tháng này
            </Typography>
          </Box>
          <Button color="primary" endIcon={<ArrowForward />}>Xem tất cả</Button>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress size={60} />
          </Box>
        ) : (
          <Grid container spacing={4}>
            {courses.length > 0 ? (
              courses.map((course) => (
                <Grid item xs={12} sm={6} md={4} key={course.course_id}>
                  <CourseCard course={course} />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Box 
                    sx={{ 
                        textAlign: "center", 
                        py: 10, 
                        bgcolor: 'white', 
                        borderRadius: 4, 
                        border: '2px dashed #e2e8f0' 
                    }}
                >
                    <Box 
                        component="img" 
                        src="https://illustrations.popsy.co/emerald/surr-searching.svg" 
                        sx={{ width: 200, height: 200, mb: 2, opacity: 0.8 }}
                    />
                  <Typography variant="h5" color="text.primary" gutterBottom fontWeight={600}>
                    Chưa có khóa học nào được đăng tải
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Hãy quay lại sau hoặc đăng ký nhận thông báo khi có khóa học mới.
                  </Typography>
                  {/* Instructor CTA could go here */}
                </Box>
              </Grid>
            )}
          </Grid>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default HomePage;

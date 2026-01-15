import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardMedia,
  CardContent,
  Button,
  Avatar,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  ExpandMore,
  PlayCircle,
  Description,
  Person,
  School,
} from "@mui/icons-material";
import { useParams, Link as RouterLink, useNavigate } from "react-router-dom";
import { getCourseById, enrollCourse, getEnrolledCourse } from "../services/courseService";

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [checkingEnrollment, setCheckingEnrollment] = useState(true);
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const checkEnrollment = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        try {
          await getEnrolledCourse(id);
          setIsEnrolled(true);
        } catch (error) {
          setIsEnrolled(false);
        }
      }
      setCheckingEnrollment(false);
    };
    checkEnrollment();
  }, [id]);

  useEffect(() => {
    const fetchDetail = async () => {
      const data = await getCourseById(id);
      setCourse(data);
      setLoading(false);
    };
    fetchDetail();
  }, [id]);

  const handleEnroll = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login");
      return;
    }

    setEnrolling(true);
    try {
      await enrollCourse(id);
      setIsEnrolled(true);
      setEnrollDialogOpen(false);
      navigate(`/course/${id}/lessons`);
    } catch (error) {
      alert(error.message || "Enrollment failed");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!course) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">Course not found!</Alert>
      </Container>
    );
  }

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} phút`;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" component="h1" sx={{ mb: 2, fontWeight: 500 }}>
            {course.title}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {course.description}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Avatar
              src={course.teacher?.avatar_url}
              sx={{ width: 56, height: 56, mr: 2 }}
            >
              <Person />
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                Giảng viên: {course.teacher?.full_name || "Admin"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {course.teacher?.bio || "Chuyên gia trong lĩnh vực"}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
              Nội dung khóa học
            </Typography>
            {course.chapters && course.chapters.length > 0 ? (
              course.chapters.map((chapter, index) => (
                <Accordion key={chapter.chapter_id} defaultExpanded={index === 0}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography sx={{ fontWeight: 500 }}>{chapter.title}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List>
                      {chapter.lessons &&
                        chapter.lessons.map((lesson) => (
                          <ListItem key={lesson.lesson_id}>
                            {lesson.content_type === "video" ? (
                              <PlayCircle sx={{ mr: 1, color: "primary.main" }} />
                            ) : (
                              <Description sx={{ mr: 1, color: "text.secondary" }} />
                            )}
                            <ListItemText
                              primary={lesson.title}
                              secondary={formatDuration(lesson.duration_seconds)}
                            />
                          </ListItem>
                        ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                Chưa có nội dung
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ width: { xs: "100%", md: "350px" } }}>
          <Card elevation={3}>
            <CardMedia
              component="img"
              height="200"
              image={course.thumbnail_url}
              alt={course.title}
            />
            <CardContent>
              <Typography
                variant="h5"
                sx={{
                  textAlign: "center",
                  mb: 2,
                  fontWeight: 600,
                  color: "primary.main",
                }}
              >
                {course.price === 0 || course.price === "0.00"
                  ? "Miễn phí"
                  : `${parseInt(course.price).toLocaleString()} đ`}
              </Typography>

              {checkingEnrollment ? (
                <Button
                  fullWidth
                  variant="contained"
                  disabled
                  sx={{ mb: 2, py: 1.5 }}
                >
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Đang kiểm tra...
                </Button>
              ) : isEnrolled ? (
                <Button
                  component={RouterLink}
                  to={`/course/${id}/lessons`}
                  fullWidth
                  variant="contained"
                  color="success"
                  startIcon={<School />}
                  sx={{ mb: 2, py: 1.5 }}
                >
                  Vào học ngay
                </Button>
              ) : (
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => setEnrollDialogOpen(true)}
                  sx={{ mb: 2, py: 1.5 }}
                >
                  Đăng ký khóa học
                </Button>
              )}

              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", py: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Cấp độ:
                  </Typography>
                  <Chip label={course.level || "Beginner"} size="small" />
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", py: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Số chương:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {course.chapters?.length || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Dialog open={enrollDialogOpen} onClose={() => setEnrollDialogOpen(false)}>
        <DialogTitle>Xác nhận đăng ký</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn đăng ký khóa học này không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEnrollDialogOpen(false)}>Hủy</Button>
          <Button
            onClick={handleEnroll}
            variant="contained"
            disabled={enrolling}
          >
            {enrolling ? <CircularProgress size={20} /> : "Xác nhận"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CourseDetailPage;

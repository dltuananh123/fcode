import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
  IconButton,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
} from "@mui/material";
import {
  Menu,
  CheckCircle,
  RadioButtonUnchecked,
  PlayCircle,
  Description,
  ArrowBack,
  NavigateBefore,
  NavigateNext,
  CheckCircleOutline,
} from "@mui/icons-material";
import { useParams, Link as RouterLink, useNavigate } from "react-router-dom";
import {
  getLessonDetail,
  getEnrolledCourse,
  markLessonComplete,
} from "../services/courseService";

const LessonPage = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [markingComplete, setMarkingComplete] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lessonData, courseData] = await Promise.all([
          getLessonDetail(lessonId),
          getEnrolledCourse(courseId),
        ]);
        setLesson(lessonData);
        setCourse(courseData);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to load lesson");
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId, lessonId]);

  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const findLessonNavigation = () => {
    if (!course || !course.chapters) return { prev: null, next: null, current: null, totalLessons: 0, currentNumber: 0 };

    const allLessons = [];
    course.chapters.forEach((chapter) => {
      chapter.lessons?.forEach((l) => {
        allLessons.push({ ...l, chapterTitle: chapter.title });
      });
    });

    const currentIndex = allLessons.findIndex(
      (l) => l.lesson_id === parseInt(lessonId)
    );

    return {
      prev: currentIndex > 0 ? allLessons[currentIndex - 1] : null,
      next: currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null,
      current: allLessons[currentIndex] || null,
      totalLessons: allLessons.length,
      currentNumber: currentIndex + 1,
    };
  };

  const handleMarkComplete = async () => {
    setMarkingComplete(true);
    try {
      await markLessonComplete(lessonId);
      setLesson((prev) => ({
        ...prev,
        progress: { ...prev.progress, is_completed: true },
      }));
      setCourse((prev) => {
        const updated = { ...prev };
        updated.chapters = updated.chapters.map((chapter) => ({
          ...chapter,
          lessons: chapter.lessons.map((l) =>
            l.lesson_id === parseInt(lessonId)
              ? { ...l, progress: { ...l.progress, is_completed: true } }
              : l
          ),
        }));
        return updated;
      });
    } catch (err) {
      alert(err.message || "Failed to mark lesson as complete");
    } finally {
      setMarkingComplete(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button component={RouterLink} to="/" variant="contained">
          Về trang chủ
        </Button>
      </Container>
    );
  }

  if (!lesson) {
    return (
      <Container sx={{ mt: 4, textAlign: "center" }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Lesson not found!
        </Alert>
        <Button component={RouterLink} to={`/course/${courseId}/lessons`} variant="contained">
          Về khóa học
        </Button>
      </Container>
    );
  }

  const videoId = getYouTubeVideoId(lesson.video_url);
  const nav = findLessonNavigation();
  const drawerWidth = 350;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Drawer
        variant="persistent"
        open={sidebarOpen}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Box sx={{ bgcolor: "primary.main", color: "white", p: 2 }}>
          <Button
            component={RouterLink}
            to={`/course/${courseId}/lessons`}
            startIcon={<ArrowBack />}
            sx={{ color: "white", mb: 1 }}
          >
            Về khóa học
          </Button>
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            {course?.title}
          </Typography>
        </Box>
        <Box sx={{ overflow: "auto" }}>
          {course?.chapters?.map((chapter, chapterIndex) => (
            <Accordion key={chapter.chapter_id} defaultExpanded={chapterIndex === 0}>
              <AccordionSummary>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {chapter.title}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0 }}>
                <List dense>
                  {chapter.lessons?.map((l) => (
                    <ListItem key={l.lesson_id} disablePadding>
                      <ListItemButton
                        selected={l.lesson_id === parseInt(lessonId)}
                        onClick={() => navigate(`/course/${courseId}/lesson/${l.lesson_id}`)}
                      >
                        <ListItemIcon>
                          {l.progress?.is_completed ? (
                            <CheckCircle color="success" fontSize="small" />
                          ) : (
                            <RadioButtonUnchecked fontSize="small" />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={l.title}
                          primaryTypographyProps={{
                            fontSize: "0.875rem",
                            fontWeight: l.lesson_id === parseInt(lessonId) ? 600 : 400,
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "#FCFCFC",
          minHeight: "100vh",
        }}
      >
        <Paper
          elevation={1}
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 0,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu />
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              Bài {nav.currentNumber} / {nav.totalLessons}
            </Typography>
          </Box>
          <Box>
            {lesson.progress?.is_completed ? (
              <Chip
                icon={<CheckCircleOutline />}
                label="Đã hoàn thành"
                color="success"
                variant="outlined"
              />
            ) : (
              <Button
                variant="contained"
                color="success"
                size="small"
                startIcon={<CheckCircleOutline />}
                onClick={handleMarkComplete}
                disabled={markingComplete}
              >
                {markingComplete ? <CircularProgress size={16} /> : "Đánh dấu hoàn thành"}
              </Button>
            )}
          </Box>
        </Paper>

        <Box sx={{ bgcolor: "#000" }}>
          {lesson.content_type === "video" && videoId ? (
            <Box
              sx={{
                position: "relative",
                paddingTop: "56.25%",
                maxHeight: "70vh",
              }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                title={lesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
              />
            </Box>
          ) : lesson.content_type === "video" && lesson.video_url ? (
            <Box
              component="video"
              controls
              sx={{ width: "100%", maxHeight: "70vh" }}
            >
              <source src={lesson.video_url} type="video/mp4" />
            </Box>
          ) : (
            <Box
              sx={{
                minHeight: "200px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "primary.light",
                color: "white",
              }}
            >
              <Description sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h5">Tài liệu bài học</Typography>
            </Box>
          )}
        </Box>

        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography variant="h4" component="h1" sx={{ mb: 2, fontWeight: 500 }}>
            {lesson.title}
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
            <Chip
              icon={<PlayCircle />}
              label={`${Math.floor(lesson.duration_seconds / 60)} phút`}
              variant="outlined"
            />
            <Chip
              label={lesson.content_type === "video" ? "Video" : "Tài liệu"}
              variant="outlined"
            />
          </Box>

          {lesson.content_text && (
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                  Nội dung bài học
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ whiteSpace: "pre-wrap" }}
                  color="text.secondary"
                >
                  {lesson.content_text}
                </Typography>
              </CardContent>
            </Card>
          )}

          <Divider sx={{ my: 4 }} />

          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
            {nav.prev ? (
              <Button
                variant="outlined"
                startIcon={<NavigateBefore />}
                onClick={() => navigate(`/course/${courseId}/lesson/${nav.prev.lesson_id}`)}
                sx={{ flex: 1 }}
              >
                Trước: {nav.prev.title}
              </Button>
            ) : (
              <Box sx={{ flex: 1 }} />
            )}
            {nav.next ? (
              <Button
                variant="contained"
                endIcon={<NavigateNext />}
                onClick={() => navigate(`/course/${courseId}/lesson/${nav.next.lesson_id}`)}
                sx={{ flex: 1 }}
              >
                Tiếp: {nav.next.title}
              </Button>
            ) : (
              <Button
                component={RouterLink}
                to={`/course/${courseId}/lessons`}
                variant="contained"
                color="success"
                sx={{ flex: 1 }}
              >
                Hoàn thành khóa học
              </Button>
            )}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LessonPage;

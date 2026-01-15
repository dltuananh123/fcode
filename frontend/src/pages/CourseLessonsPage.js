import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Chip,
  CircularProgress,
  Alert,
  Avatar,
  Button,
} from "@mui/material";
import {
  ExpandMore,
  CheckCircle,
  PlayCircle,
  Description,
  Person,
} from "@mui/icons-material";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useParams, Link as RouterLink, useNavigate } from "react-router-dom";
import { getEnrolledCourse } from "../services/courseService";

const CourseLessonsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnrolledCourse = async () => {
      try {
        const data = await getEnrolledCourse(id);
        setCourse(data);
        if (data) {
          document.title = `${data.title} - Bài học - F-Code Learning`;
        } else {
          document.title = "Bài học - F-Code Learning";
        }
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to load course");
        setLoading(false);
      }
    };
    fetchEnrolledCourse();
  }, [id]);

  const calculateProgress = () => {
    if (!course || !course.chapters) return 0;
    let totalLessons = 0;
    let completedLessons = 0;
    course.chapters.forEach((chapter) => {
      chapter.lessons?.forEach((lesson) => {
        totalLessons++;
        if (lesson.progress?.is_completed) completedLessons++;
      });
    });
    return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
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
        <Box sx={{ textAlign: "center" }}>
          <Button component={RouterLink} to="/" variant="contained">
            Về trang chủ
          </Button>
        </Box>
      </Container>
    );
  }

  if (!course) {
    return (
      <Container sx={{ mt: 4, textAlign: "center" }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Course not found!
        </Alert>
        <Button component={RouterLink} to="/" variant="contained">
          Về trang chủ
        </Button>
      </Container>
    );
  }

  const progress = calculateProgress();
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} phút`;
  };

  return (
    <>
      <Header />
      <Box sx={{ flexGrow: 1, minHeight: "calc(100vh - 200px)", backgroundColor: "#FCFCFC", display: "flex", flexDirection: "column" }}>

      <Box sx={{ bgcolor: "grey.900", color: "white", py: 4 }}>
        <Container>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar
              src={course.teacher?.avatar_url}
              sx={{ width: 48, height: 48, mr: 2 }}
            >
              <Person />
            </Avatar>
            <Typography variant="body1">
              Giảng viên: {course.teacher?.full_name}
            </Typography>
          </Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 500, mb: 3 }}>
            {course.title}
          </Typography>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  Tiến độ của bạn
                </Typography>
                <Chip label={`${progress}%`} color="primary" />
              </Box>
              <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 8 }} />
            </CardContent>
          </Card>
        </Container>
      </Box>

      <Container sx={{ py: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 500 }}>
          Nội dung khóa học
        </Typography>

        {course.chapters && course.chapters.length > 0 ? (
          course.chapters.map((chapter, chapterIndex) => {
            const chapterCompleted = chapter.lessons?.every(
              (l) => l.progress?.is_completed
            );
            const lessonsCompleted = chapter.lessons?.filter(
              (l) => l.progress?.is_completed
            ).length || 0;
            const totalLessons = chapter.lessons?.length || 0;

            return (
              <Accordion key={chapter.chapter_id} defaultExpanded={chapterIndex === 0} sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box sx={{ display: "flex", alignItems: "center", width: "100%", mr: 2 }}>
                    {chapterCompleted ? (
                      <CheckCircle sx={{ color: "success.main", mr: 1 }} />
                    ) : (
                      <Chip label={chapterIndex + 1} size="small" sx={{ mr: 1 }} />
                    )}
                    <Typography sx={{ fontWeight: 500, flexGrow: 1 }}>
                      {chapter.title}
                    </Typography>
                    <Chip
                      label={`${lessonsCompleted}/${totalLessons} bài học`}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0 }}>
                  <List>
                    {chapter.lessons &&
                      chapter.lessons.map((lesson) => (
                        <ListItem key={lesson.lesson_id} disablePadding>
                          <ListItemButton
                            onClick={() =>
                              navigate(`/course/${id}/lesson/${lesson.lesson_id}`)
                            }
                          >
                            <ListItemIcon>
                              {lesson.progress?.is_completed ? (
                                <CheckCircle color="success" />
                              ) : lesson.content_type === "video" ? (
                                <PlayCircle color="primary" />
                              ) : (
                                <Description color="action" />
                              )}
                            </ListItemIcon>
                            <ListItemText
                              primary={lesson.title}
                              secondary={`${lesson.content_type === "video" ? "Video" : "Tài liệu"} • ${formatDuration(lesson.duration_seconds)}`}
                            />
                          </ListItemButton>
                        </ListItem>
                      ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            );
          })
        ) : (
          <Alert severity="info">Chưa có nội dung</Alert>
        )}
      </Container>
      </Box>
      <Footer />
    </>
  );
};

export default CourseLessonsPage;

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
  TextField,
  Rating,
  Divider,
  Paper,
} from "@mui/material";
import {
  ExpandMore,
  PlayCircle,
  Description,
  Person,
  School,
  Star,
  Edit,
  Delete,
} from "@mui/icons-material";
import { useParams, Link as RouterLink, useNavigate } from "react-router-dom";
import { getCourseById, enrollCourse, getEnrolledCourse } from "../services/courseService";
import {
  getCourseReviews,
  createReview,
  updateReview,
  deleteReview,
} from "../services/reviewService";
import Header from "../components/Header";
import Footer from "../components/Footer";

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [checkingEnrollment, setCheckingEnrollment] = useState(true);
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"))?.user;

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
      if (data) {
        document.title = `${data.title} - F-Code Learning`;
      } else {
        document.title = "Chi tiết khóa học - F-Code Learning";
      }
      setLoading(false);
    };
    fetchDetail();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoadingReviews(true);
      const data = await getCourseReviews(id);
      setReviews(data);
      setLoadingReviews(false);
    };
    fetchReviews();
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

  const handleOpenReviewDialog = (review = null) => {
    if (review) {
      setEditingReview(review);
      setReviewRating(review.rating);
      setReviewComment(review.comment || "");
    } else {
      setEditingReview(null);
      setReviewRating(5);
      setReviewComment("");
    }
    setReviewDialogOpen(true);
  };

  const handleCloseReviewDialog = () => {
    setReviewDialogOpen(false);
    setEditingReview(null);
    setReviewRating(5);
    setReviewComment("");
  };

  const handleSubmitReview = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setSubmittingReview(true);
    try {
      if (editingReview) {
        await updateReview(editingReview.review_id, reviewRating, reviewComment);
      } else {
        await createReview(id, reviewRating, reviewComment);
      }
      const updatedReviews = await getCourseReviews(id);
      setReviews(updatedReviews);
      handleCloseReviewDialog();
    } catch (error) {
      alert(error.message || "Có lỗi xảy ra");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) {
      return;
    }

    try {
      await deleteReview(reviewId);
      const updatedReviews = await getCourseReviews(id);
      setReviews(updatedReviews);
    } catch (error) {
      alert(error.message || "Có lỗi xảy ra");
    }
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const userReview = reviews.find((r) => r.user?.user_id === user?.id);

  return (
    <>
      <Header />
      <Box sx={{ minHeight: "calc(100vh - 200px)", display: "flex", flexDirection: "column" }}>
        <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
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
              image={course.thumbnail_url || "/thumbnail.png"}
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

          <Divider sx={{ my: 4 }} />

          {/* Reviews Section */}
          <Box sx={{ mt: 4 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 500 }}>
                Đánh giá khóa học
              </Typography>
              {reviews.length > 0 && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Star sx={{ color: "warning.main" }} />
                  <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    {getAverageRating()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ({reviews.length} đánh giá)
                  </Typography>
                </Box>
              )}
            </Box>

            {user && !userReview && (
              <Button
                variant="outlined"
                startIcon={<Star />}
                onClick={() => handleOpenReviewDialog()}
                sx={{ mb: 3 }}
              >
                Viết đánh giá
              </Button>
            )}

            {loadingReviews ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            ) : reviews.length === 0 ? (
              <Paper sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="body1" color="text.secondary">
                  Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá khóa học này!
                </Typography>
              </Paper>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {reviews.map((review) => (
                  <Card key={review.review_id} elevation={1}>
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 1,
                        }}
                      >
                        <Box sx={{ display: "flex", gap: 2, flex: 1 }}>
                          <Avatar
                            src={review.user?.avatar_url}
                            sx={{ width: 40, height: 40 }}
                          >
                            {review.user?.full_name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                              {review.user?.full_name || "Anonymous"}
                            </Typography>
                            <Rating
                              value={review.rating}
                              readOnly
                              size="small"
                              sx={{ mt: 0.5 }}
                            />
                            {review.comment && (
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                {review.comment}
                              </Typography>
                            )}
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: "block", mt: 1 }}
                            >
                              {new Date(review.created_at).toLocaleDateString("vi-VN")}
                            </Typography>
                          </Box>
                        </Box>
                        {user && review.user?.user_id === user.id && (
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Button
                              size="small"
                              startIcon={<Edit />}
                              onClick={() => handleOpenReviewDialog(review)}
                            >
                              Sửa
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              startIcon={<Delete />}
                              onClick={() => handleDeleteReview(review.review_id)}
                            >
                              Xóa
                            </Button>
                          </Box>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </Box>
        </Container>
      </Box>

      <Dialog
        open={reviewDialogOpen}
        onClose={handleCloseReviewDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingReview ? "Chỉnh sửa đánh giá" : "Viết đánh giá"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography component="legend" sx={{ mb: 1 }}>
              Đánh giá
            </Typography>
            <Rating
              value={reviewRating}
              onChange={(event, newValue) => {
                setReviewRating(newValue);
              }}
              size="large"
            />
          </Box>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Nhận xét (tùy chọn)"
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            sx={{ mt: 3 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReviewDialog}>Hủy</Button>
          <Button
            onClick={handleSubmitReview}
            variant="contained"
            disabled={submittingReview || reviewRating === 0}
          >
            {submittingReview ? (
              <CircularProgress size={20} />
            ) : editingReview ? (
              "Cập nhật"
            ) : (
              "Gửi đánh giá"
            )}
          </Button>
        </DialogActions>
      </Dialog>

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
      <Footer />
    </>
  );
};

export default CourseDetailPage;

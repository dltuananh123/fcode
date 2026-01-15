import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Grid,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Paper,
  Stack,
  alpha,
  useTheme,
  Tooltip,
} from "@mui/material";
import {
  User,
  Mail,
  GraduationCap,
  FileText,
  Edit,
  Save,
  X,
  Upload,
  BookOpen,
  Trash2,
  ExternalLink,
  Plus,
  Camera,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { updateProfile, logout } from "../services/authService";
import {
  getMyEnrolledCourses,
  getMyCourses,
  deleteCourse,
} from "../services/courseService";
import CourseCard from "../components/CourseCard";

const ProfilePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const fileInputRef = useRef(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    full_name: "",
    bio: "",
    avatar_url: "",
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    document.title = "Trang cá nhân - F-Code Learning";
    const userData = JSON.parse(localStorage.getItem("user"))?.user;
    if (userData) {
      setUser(userData);
      setEditData({
        full_name: userData.full_name || "",
        bio: userData.bio || "",
        avatar_url: userData.avatar_url || "",
      });
      setAvatarPreview(userData.avatar_url || null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      if (user) {
        setLoadingCourses(true);
        try {
          const [enrolled, myCoursesData] = await Promise.all([
            getMyEnrolledCourses(),
            user.role === "teacher" ? getMyCourses() : Promise.resolve([]),
          ]);
          setEnrolledCourses(enrolled);
          setMyCourses(myCoursesData);
        } catch (error) {
          console.error("Error fetching courses:", error);
        } finally {
          setLoadingCourses(false);
        }
      }
    };
    fetchCourses();
  }, [user]);

  const getRoleLabel = (role) => {
    const roleMap = {
      student: "Học viên",
      teacher: "Giảng viên",
      admin: "Quản trị viên",
    };
    return roleMap[role] || role;
  };

  const getRoleColor = (role) => {
    return role === "teacher" ? "success" : "primary";
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditData({
      full_name: user.full_name || "",
      bio: user.bio || "",
      avatar_url: user.avatar_url || "",
    });
    setAvatarPreview(user.avatar_url || null);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setEditData((prev) => ({
          ...prev,
          avatar_url: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await updateProfile(editData);
      if (response.user) {
        setUser(response.user);
        const currentUser = JSON.parse(localStorage.getItem("user"));
        currentUser.user = response.user;
        localStorage.setItem("user", JSON.stringify(currentUser));
      }
      setEditMode(false);
    } catch (error) {
      alert(error.message || "Có lỗi xảy ra khi cập nhật thông tin");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;
    setDeleting(true);
    try {
      await deleteCourse(courseToDelete.course_id);
      setMyCourses(myCourses.filter((c) => c.course_id !== courseToDelete.course_id));
      setDeleteDialogOpen(false);
      setCourseToDelete(null);
    } catch (error) {
      alert(error.message || "Có lỗi xảy ra khi xóa khóa học");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <>
        <Header />
        <Container sx={{ mt: 8, textAlign: 'center' }}>
          <Alert severity="warning" sx={{ display: 'inline-flex' }}>Vui lòng đăng nhập để xem trang cá nhân</Alert>
          <Box mt={2}>
              <Button variant="contained" onClick={() => navigate('/login')}>Đăng nhập ngay</Button>
          </Box>
        </Container>
        <Footer />
      </>
    );
  }

  // Cover Image Gradient
  const coverGradient = `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.8)} 0%, ${alpha(theme.palette.secondary.main, 0.9)} 100%)`;

  return (
    <>
      <Header />
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh", pb: 8 }}>
        
        {/* Cover Banner */}
        <Box 
            sx={{ 
                height: 200, 
                width: '100%', 
                background: coverGradient,
                position: 'relative'
            }} 
        />

        <Container maxWidth="lg" sx={{ mt: -10 }}>
          <Grid container spacing={4}>
            
            {/* Sidebar (Left) */}
            <Grid item xs={12} md={4}>
                <Stack spacing={3}>
                    {/* User Card */}
                    <Card sx={{ textAlign: "center", overflow: 'visible', position: 'relative' }}>
                        <CardContent sx={{ pt: 0, pb: 4 }}>
                            {/* Avatar Wrapper */}
                            <Box sx={{ position: 'relative', display: 'inline-block', mt: -6, mb: 2 }}>
                                <Avatar
                                    src={editMode ? avatarPreview : user.avatar_url}
                                    sx={{
                                        width: 140,
                                        height: 140,
                                        border: '4px solid white',
                                        boxShadow: theme.shadows[3],
                                        bgcolor: 'primary.main',
                                        fontSize: '3.5rem'
                                    }}
                                >
                                    {user.full_name?.charAt(0)}
                                </Avatar>
                                {editMode && (
                                    <IconButton
                                        onClick={() => fileInputRef.current?.click()}
                                        sx={{
                                            position: "absolute",
                                            bottom: 5,
                                            right: 5,
                                            bgcolor: "primary.main",
                                            color: "white",
                                            border: '2px solid white',
                                            "&:hover": { bgcolor: "primary.dark" },
                                        }}
                                        size="small"
                                    >
                                        <Camera size={18} />
                                    </IconButton>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    style={{ display: "none" }}
                                />
                            </Box>

                            {editMode ? (
                                <TextField
                                    fullWidth
                                    label="Họ và tên"
                                    value={editData.full_name}
                                    onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
                                    sx={{ mb: 2 }}
                                    size="small"
                                />
                            ) : (
                                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                                    {user.full_name}
                                </Typography>
                            )}

                            <Chip
                                label={getRoleLabel(user.role)}
                                color={getRoleColor(user.role)}
                                size="small"
                                sx={{ mb: 3, fontWeight: 600 }}
                            />

                            <Stack spacing={2} sx={{ textAlign: 'left', px: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Mail size={20} color={theme.palette.text.secondary} />
                                    <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                    <FileText size={20} color={theme.palette.text.secondary} style={{ marginTop: 2 }} />
                                    <Box sx={{ flex: 1 }}>
                                        {editMode ? (
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={3}
                                                value={editData.bio}
                                                onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                                                placeholder="Giới thiệu đôi chút về bản thân..."
                                                size="small"
                                            />
                                        ) : (
                                            <Typography variant="body2" color="text.secondary">
                                                {user.bio || "Chưa có giới thiệu..."}
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            </Stack>

                            {/* Action Buttons */}
                            <Box sx={{ mt: 4, display: 'flex', gap: 1, justifyContent: 'center' }}>
                                {editMode ? (
                                    <>
                                        <Button variant="outlined" color="inherit" onClick={handleCancelEdit} disabled={saving}>Hủy</Button>
                                        <Button variant="contained" disabled={saving} onClick={handleSave} startIcon={<Save size={18} />}>
                                            {saving ? "Lưu..." : "Lưu"}
                                        </Button>
                                    </>
                                ) : (
                                    <Button variant="outlined" fullWidth startIcon={<Edit size={18} />} onClick={handleEdit}>
                                        Chỉnh sửa hồ sơ
                                    </Button>
                                )}
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Stats or Additional Info could go here */}
                </Stack>
            </Grid>

            {/* Main Content (Right) */}
            <Grid item xs={12} md={8}>
                <Stack spacing={4} sx={{ mt: { xs: 4, md: 10 } }}>
                    
                    {/* ENROLLED COURSES */}
                    <Box>
                        <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BookOpen size={24} color={theme.palette.primary.main} /> 
                            Đang theo học
                        </Typography>
                        
                        {loadingCourses ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
                        ) : enrolledCourses.length === 0 ? (
                           <Alert severity="info" variant="outlined" sx={{ borderRadius: 2 }}>
                                Bạn chưa đăng ký khóa học nào. <Button href="/" size="small">Khám phá ngay</Button>
                           </Alert>
                        ) : (
                            <Grid container spacing={3}>
                                {enrolledCourses.map((course) => (
                                    <Grid item xs={12} sm={6} key={course.course_id}>
                                        <CourseCard course={course} />
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Box>

                    {/* TEACHER'S MANAGED COURSES */}
                    {user.role === "teacher" && (
                        <Box>
                             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                                <Typography variant="h5" component="h2" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <GraduationCap size={24} color={theme.palette.success.main} /> 
                                    Quản lý khóa học
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="success"
                                    startIcon={<Plus size={20} />}
                                    onClick={() => navigate("/create-course")}
                                >
                                    Tạo khóa học mới
                                </Button>
                             </Box>

                            {loadingCourses ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
                            ) : myCourses.length === 0 ? (
                                <Paper sx={{ p: 4, textAlign: 'center', borderStyle: 'dashed' }}>
                                    <Typography color="text.secondary" sx={{ mb: 2 }}>Bạn chưa tạo khóa học nào.</Typography>
                                    <Button variant="outlined" onClick={() => navigate("/create-course")}>Bắt đầu ngay</Button>
                                </Paper>
                            ) : (
                                <Grid container spacing={3}>
                                    {myCourses.map((course) => (
                                        <Grid item xs={12} sm={6} key={course.course_id}>
                                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                                {/* Simple Management Card */}
                                                <Box sx={{ position: 'relative', pt: '56.25%' }}>
                                                     <Box component="img" src={course.thumbnail_url || "/thumbnail.png"} sx={{ position: 'absolute', top: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                                                     <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 1 }}>
                                                        <Tooltip title="Xóa">
                                                            <IconButton size="small" sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'error.50' } }} color="error" onClick={() => { setCourseToDelete(course); setDeleteDialogOpen(true); }}>
                                                                <Trash2 size={16} />
                                                            </IconButton>
                                                        </Tooltip>
                                                     </Box>
                                                </Box>
                                                <CardContent>
                                                    <Typography variant="h6" noWrap sx={{ fontWeight: 600 }}>{course.title}</Typography>
                                                    <Typography variant="body2" color="text.secondary" noWrap sx={{ mb: 2 }}>{course.description}</Typography>
                                                    <Typography variant="caption" sx={{ display: 'block', mb: 2, color: 'text.secondary' }}>
                                                        {course.chapters?.length || 0} chương • {course.students_count || 0} học viên
                                                    </Typography>
                                                    <Button variant="outlined" size="small" fullWidth endIcon={<ExternalLink size={14} />} href={`/course/${course.course_id}`}>
                                                        Xem chi tiết
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </Box>
                    )}

                </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa khóa học <strong>"{courseToDelete?.title}"</strong>? <br/>
            Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined" color="inherit">Hủy</Button>
          <Button
            onClick={handleDeleteCourse}
            color="error"
            variant="contained"
            disabled={deleting}
            autoFocus
          >
            {deleting ? "Đang xóa..." : "Xóa vĩnh viễn"}
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </>
  );
};

export default ProfilePage;

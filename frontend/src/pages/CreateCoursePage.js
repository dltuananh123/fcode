import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  MenuItem,
  Paper,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Divider,
  Chip,
  useTheme,
  Grid,
  InputAdornment,
} from "@mui/material";
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  Plus,
  Trash2,
  ChevronDown,
  Video,
  FileText,
  DollarSign,
  MonitorPlay,
  Layers,
  Image as ImageIcon
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AccessDeniedPage from "./AccessDeniedPage";
import { createCourse, updateCourse } from "../services/courseService";

const CreateCoursePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail_url: "",
    price: "0",
    level: "beginner",
    category_id: "",
  });

  const user = JSON.parse(localStorage.getItem("user"))?.user;
  const isTeacher = user?.role === "teacher";

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!isTeacher) {
      return;
    }
  }, [user, isTeacher, navigate]);

  useEffect(() => {
    document.title = "Tạo bài giảng mới - F-Code Learning";
  }, []);

  if (!user) {
    return null;
  }

  if (!isTeacher) {
    return <AccessDeniedPage />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
        setFormData((prev) => ({
          ...prev,
          thumbnail_url: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveThumbnail = () => {
    setThumbnailPreview(null);
    setFormData((prev) => ({
      ...prev,
      thumbnail_url: "",
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const addChapter = () => {
    setChapters([
      ...chapters,
      {
        id: Date.now(),
        title: "",
        lessons: [],
      },
    ]);
  };

  const updateChapter = (chapterId, field, value) => {
    setChapters(
      chapters.map((ch) =>
        ch.id === chapterId ? { ...ch, [field]: value } : ch
      )
    );
  };

  const deleteChapter = (chapterId) => {
    setChapters(chapters.filter((ch) => ch.id !== chapterId));
  };

  const addLesson = (chapterId) => {
    setChapters(
      chapters.map((ch) =>
        ch.id === chapterId
          ? {
              ...ch,
              lessons: [
                ...ch.lessons,
                {
                  id: Date.now(),
                  title: "",
                  content_type: "video",
                  video_url: "",
                  content_text: "",
                  duration_seconds: 0,
                  is_preview: false,
                },
              ],
            }
          : ch
      )
    );
  };

  const updateLesson = (chapterId, lessonId, field, value) => {
    setChapters(
      chapters.map((ch) =>
        ch.id === chapterId
          ? {
              ...ch,
              lessons: ch.lessons.map((lesson) =>
                lesson.id === lessonId ? { ...lesson, [field]: value } : lesson
              ),
            }
          : ch
      )
    );
  };

  const deleteLesson = (chapterId, lessonId) => {
    setChapters(
      chapters.map((ch) =>
        ch.id === chapterId
          ? {
              ...ch,
              lessons: ch.lessons.filter((lesson) => lesson.id !== lessonId),
            }
          : ch
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Validate chapters
      const hasChapters = chapters.length > 0;
      if (hasChapters) {
        for (const chapter of chapters) {
          if (!chapter.title.trim()) {
            throw new Error("Vui lòng điền tên cho tất cả các chương");
          }
          for (const lesson of chapter.lessons) {
            if (!lesson.title.trim()) {
              throw new Error("Vui lòng điền tên cho tất cả các bài học");
            }
            if (
              lesson.content_type === "video" &&
              !lesson.video_url.trim()
            ) {
              throw new Error("Vui lòng thêm video URL cho các bài học video");
            }
          }
        }
      }

      const courseData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        thumbnail_url: formData.thumbnail_url || "/thumbnail.png",
      };

      const course = await createCourse(courseData);

      if (hasChapters) {
        const chaptersData = chapters.map((ch) => ({
          title: ch.title,
          lessons: ch.lessons.map((lesson) => ({
            title: lesson.title,
            content_type: lesson.content_type,
            video_url: lesson.video_url || null,
            content_text: lesson.content_text || null,
            duration_seconds: parseInt(lesson.duration_seconds) || 0,
            is_preview: lesson.is_preview || false,
          })),
        }));

        await updateCourse(course.course_id, {
          chapters: chaptersData,
        });
      }

      setSuccess("Tạo khóa học thành công!");
      setTimeout(() => {
        navigate(`/course/${course.course_id}`);
      }, 1500);
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra khi tạo khóa học");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh", pb: 8 }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Header Action Row */}
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Button
              startIcon={<ArrowLeft size={20} />}
              onClick={() => navigate("/")}
              color="inherit"
              sx={{ fontWeight: 500 }}
            >
              Quay lại
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center', mb: 5 }}>
               <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
                 Tạo bài giảng mới
               </Typography>
               <Typography color="text.secondary">
                 Chia sẻ kiến thức của bạn với cộng đồng từ F-Code
               </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{success}</Alert>}

          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
                
                {/* 1. CORE INFO CARD - 2 COLUMN LAYOUT */}
                <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MonitorPlay size={20} /> Thông tin cơ bản
                    </Typography>
                    
                    <Grid container spacing={4}>
                        {/* LEFT COLUMN: FIELDS */}
                        <Grid item xs={12} md={8}>
                            <Stack spacing={3}>
                                <TextField
                                    fullWidth
                                    label="Tiêu đề khóa học"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    placeholder="VD: Lập trình ReactJS từ A-Z"
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    fullWidth
                                    label="Mô tả ngắn"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    multiline
                                    rows={4}
                                    placeholder="Mô tả những gì học viên sẽ học được..."
                                    InputLabelProps={{ shrink: true }}
                                />
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Giá (VNĐ)"
                                            name="price"
                                            type="number"
                                            value={formData.price}
                                            onChange={handleChange}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start"><DollarSign size={16}/></InputAdornment>,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            select
                                            label="Cấp độ"
                                            name="level"
                                            value={formData.level}
                                            onChange={handleChange}
                                        >
                                            <MenuItem value="beginner">Người mới bắt đầu</MenuItem>
                                            <MenuItem value="intermediate">Trung bình</MenuItem>
                                            <MenuItem value="advanced">Nâng cao</MenuItem>
                                        </TextField>
                                    </Grid>
                                </Grid>
                            </Stack>
                        </Grid>

                        {/* RIGHT COLUMN: THUMBNAIL */}
                        <Grid item xs={12} md={4}>
                             <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: 'text.secondary' }}>Thumbnail</Typography>
                             <Box
                                sx={{
                                    height: '100%',
                                    minHeight: 250,
                                    border: "2px dashed",
                                    borderColor: thumbnailPreview ? "transparent" : "divider",
                                    borderRadius: 3,
                                    bgcolor: 'background.default',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s',
                                    "&:hover": { borderColor: !thumbnailPreview && "primary.main", bgcolor: !thumbnailPreview && 'primary.50' }
                                }}
                             >
                                 {thumbnailPreview ? (
                                    <>
                                        <Box
                                            component="img"
                                            src={thumbnailPreview}
                                            alt="Preview"
                                            sx={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
                                        />
                                        <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.4)', opacity: 0, transition: '0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', "&:hover": { opacity: 1 } }}>
                                             <Button variant="contained" color="error" size="small" onClick={handleRemoveThumbnail} startIcon={<Trash2 size={16}/>}>
                                                 Xóa ảnh
                                             </Button>
                                        </Box>
                                    </>
                                 ) : (
                                    <Box 
                                        sx={{ textAlign: 'center', p: 2, cursor: 'pointer', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <ImageIcon size={48} color={theme.palette.text.secondary} style={{ marginBottom: 16, opacity: 0.5 }} />
                                        <Typography variant="body2" fontWeight={600}>Tải ảnh lên</Typography>
                                        <Typography variant="caption" color="text.secondary">16:9 (Khuyên dùng)</Typography>
                                    </Box>
                                 )}
                                 <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} style={{ display: "none" }} />
                             </Box>
                        </Grid>
                    </Grid>
                </Paper>

                {/* 2. CURRICULUM BUILDER */}
                <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Layers size={21} /> Nội dung chương trình
                        </Typography>
                        <Button variant="outlined" startIcon={<Plus size={18} />} onClick={addChapter}>
                            Thêm chương mới
                        </Button>
                    </Box>

                    {chapters.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 6, bgcolor: 'background.default', borderRadius: 2, border: '1px dashed #cbd5e1' }}>
                            <Layers size={40} color="#94a3b8" style={{ marginBottom: 16 }} />
                            <Typography color="text.secondary">Chưa có nội dung nào. Hãy bắt đầu bằng việc thêm chương đầu tiên.</Typography>
                        </Box>
                    ) : (
                        <Stack spacing={2}>
                             {chapters.map((chapter, index) => (
                                 <Accordion key={chapter.id} defaultExpanded disableGutters elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '12px !important', '&:before': { display: 'none' }, overflow: 'hidden' }}>
                                     <AccordionSummary expandIcon={<ChevronDown size={20} />} sx={{ bgcolor: 'background.default' }}>
                                         <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
                                             <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main', minWidth: 80 }}>CHƯƠNG {index + 1}</Typography>
                                             <TextField 
                                                variant="standard" 
                                                placeholder="Nhập tên chương..." 
                                                value={chapter.title} 
                                                onChange={(e) => updateChapter(chapter.id, "title", e.target.value)}
                                                onClick={(e) => e.stopPropagation()}
                                                fullWidth
                                                InputProps={{ disableUnderline: true, style: { fontWeight: 600 } }}
                                             />
                                             <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); deleteChapter(chapter.id); }}>
                                                 <Trash2 size={16} />
                                             </IconButton>
                                         </Box>
                                     </AccordionSummary>
                                     <Divider />
                                     <AccordionDetails sx={{ p: 3, bgcolor: '#fff' }}>
                                         <Stack spacing={2}>
                                             {chapter.lessons.map((lesson, lIndex) => (
                                                 <Paper key={lesson.id} elevation={0} sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, border: '1px solid #f1f5f9' }}>
                                                     <Grid container spacing={2} alignItems="flex-start">
                                                         <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
                                                             <Typography variant="caption" fontWeight={600} color="text.secondary">BÀI {lIndex + 1}</Typography>
                                                             <IconButton size="small" color="error" onClick={() => deleteLesson(chapter.id, lesson.id)}>
                                                                 <Trash2 size={14} />
                                                             </IconButton>
                                                         </Grid>
                                                         <Grid item xs={12} md={6}>
                                                             <TextField label="Tên bài học" size="small" fullWidth value={lesson.title} onChange={(e) => updateLesson(chapter.id, lesson.id, "title", e.target.value)} />
                                                         </Grid>
                                                         <Grid item xs={12} md={3}>
                                                             <TextField select label="Loại" size="small" fullWidth value={lesson.content_type} onChange={(e) => updateLesson(chapter.id, lesson.id, "content_type", e.target.value)}>
                                                                 <MenuItem value="video"> Video</MenuItem>
                                                                 <MenuItem value="document">Tài liệu</MenuItem>
                                                             </TextField>
                                                         </Grid>
                                                         <Grid item xs={12} md={3}>
                                                              <TextField label="Thời lượng (s)" type="number" size="small" fullWidth value={lesson.duration_seconds} onChange={(e) => updateLesson(chapter.id, lesson.id, "duration_seconds", e.target.value)} />
                                                         </Grid>
                                                         {lesson.content_type === "video" ? (
                                                             <Grid item xs={12}>
                                                                 <TextField label="URL Video" size="small" fullWidth value={lesson.video_url} onChange={(e) => updateLesson(chapter.id, lesson.id, "video_url", e.target.value)} placeholder="https://..." />
                                                             </Grid>
                                                         ) : (
                                                             <Grid item xs={12}>
                                                                 <TextField label="Nội dung text" multiline rows={2} size="small" fullWidth value={lesson.content_text} onChange={(e) => updateLesson(chapter.id, lesson.id, "content_text", e.target.value)} />
                                                             </Grid>
                                                         )}
                                                     </Grid>
                                                 </Paper>
                                             ))}
                                             <Button startIcon={<Plus size={16} />} size="small" onClick={() => addLesson(chapter.id)}>Thêm bài học</Button>
                                         </Stack>
                                     </AccordionDetails>
                                 </Accordion>
                             ))}
                        </Stack>
                    )}
                </Paper>

                {/* SUBMIT */}
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
                    <Button size="large" onClick={() => navigate("/")} disabled={loading} sx={{ minWidth: 120 }}>
                        Hủy bỏ
                    </Button>
                    <Button type="submit" variant="contained" size="large" startIcon={loading ? <CircularProgress size={20} color="inherit"/> : <Save size={20} />} disabled={loading} sx={{ minWidth: 180, py: 1.5 }}>
                        {loading ? "Đang xử lý..." : "Xuất bản khóa học"}
                    </Button>
                </Box>
            </Stack>
          </form>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default CreateCoursePage;

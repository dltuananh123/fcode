import React, { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
  CircularProgress,
  Grid,
} from "@mui/material";
import { GraduationCap, User } from "lucide-react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { registerUser } from "../services/authService";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    document.title = "Đăng ký - F-Code Learning";
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registerUser(formData);
      navigate("/login");
    } catch (err) {
      setError(err.message || "Lỗi đăng ký");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            component="img"
            src="/fcode.png"
            alt="F-Code Learning"
            sx={{
              height: 60,
              mb: 2,
            }}
          />
          <Typography
            component="h1"
            variant="h4"
            sx={{
              mb: 1,
              fontWeight: 500,
              color: "primary.main",
            }}
          >
            Đăng Ký Tài Khoản
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Tạo tài khoản mới để bắt đầu học tập
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleRegister}
            sx={{ width: "100%" }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="full_name"
              label="Họ và Tên"
              name="full_name"
              autoComplete="name"
              autoFocus
              value={formData.full_name}
              onChange={handleChange}
              variant="outlined"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mật khẩu"
              type="password"
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              variant="outlined"
            />
            <Box sx={{ mt: 2, mb: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  mb: 1.5,
                  fontWeight: 500,
                  fontSize: "1.2rem",
                  textAlign: "center",
                }}
              >
                Bạn là <span style={{ color: "#d32f2f" }}>*</span>
              </Typography>
              <Grid container spacing={2} justifyContent="center">
                <Grid
                  item
                  xs={6}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    onClick={() =>
                      setFormData({ ...formData, role: "student" })
                    }
                    sx={{
                      p: 2,
                      border: 2,
                      borderRadius: "4px",
                      borderColor:
                        formData.role === "student"
                          ? "primary.main"
                          : "grey.300",
                      bgcolor:
                        formData.role === "student"
                          ? "rgba(0, 155, 100, 0.1)"
                          : "transparent",
                      cursor: "pointer",
                      transition: "all 0.3s",
                      "&:hover": {
                        borderColor: "primary.main",
                        bgcolor:
                          formData.role === "student"
                            ? "rgba(0, 155, 100, 0.1)"
                            : "action.hover",
                      },
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                      width: "100%",
                      maxWidth: 220,
                      minHeight: 110,
                    }}
                  >
                    <GraduationCap
                      size={32}
                      color={
                        formData.role === "student" ? "#009B64" : "#757575"
                      }
                    />
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: formData.role === "student" ? 600 : 400,
                        color:
                          formData.role === "student"
                            ? "primary.main"
                            : "text.secondary",
                      }}
                    >
                      Học viên
                    </Typography>
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={6}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    onClick={() =>
                      setFormData({ ...formData, role: "teacher" })
                    }
                    sx={{
                      p: 2,
                      border: 2,
                      borderRadius: "4px",
                      borderColor:
                        formData.role === "teacher"
                          ? "primary.main"
                          : "grey.300",
                      bgcolor:
                        formData.role === "teacher"
                          ? "rgba(0, 155, 100, 0.1)"
                          : "transparent",
                      cursor: "pointer",
                      transition: "all 0.3s",
                      "&:hover": {
                        borderColor: "primary.main",
                        bgcolor:
                          formData.role === "teacher"
                            ? "rgba(0, 155, 100, 0.1)"
                            : "action.hover",
                      },
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                      width: "100%",
                      maxWidth: 220,
                      minHeight: 110,
                    }}
                  >
                    <User
                      size={32}
                      color={
                        formData.role === "teacher" ? "#009B64" : "#757575"
                      }
                    />
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: formData.role === "teacher" ? 600 : 400,
                        color:
                          formData.role === "teacher"
                            ? "primary.main"
                            : "text.secondary",
                      }}
                    >
                      Giảng viên
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Đăng Ký"
              )}
            </Button>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Đã có tài khoản?{" "}
              <Link component={RouterLink} to="/login" underline="hover">
                Đăng nhập
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterPage;

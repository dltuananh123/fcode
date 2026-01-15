import React from "react";
import { Container, Box, Typography, Button, Paper } from "@mui/material";
import { Lock, Home } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const AccessDeniedPage = () => {
  React.useEffect(() => {
    document.title = "Truy cập bị từ chối - F-Code Learning";
  }, []);

  return (
    <>
      <Header />
      <Box
        sx={{
          minHeight: "calc(100vh - 200px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: "center",
            }}
          >
            <Lock size={80} style={{ color: "#d32f2f", marginBottom: 16 }} />
            <Typography variant="h4" component="h1" sx={{ mb: 2, fontWeight: 500 }}>
              Truy cập bị từ chối
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Bạn không có quyền truy cập trang này. Chỉ có giảng viên mới có thể
              truy cập tính năng này.
            </Typography>
            <Button
              component={RouterLink}
              to="/"
              variant="contained"
              startIcon={<Home size={20} />}
              size="large"
            >
              Về trang chủ
            </Button>
          </Paper>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default AccessDeniedPage;

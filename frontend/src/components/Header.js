import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  useScrollTrigger,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import {
  Code as CodeIcon,
  Menu as MenuIcon,
  AccountCircle,
} from "@mui/icons-material";
import { logout } from "../services/authService";

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Glass effect trigger
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    handleClose();
    navigate("/login");
  };

  return (
    <AppBar
      position="sticky"
      elevation={trigger ? 4 : 0}
      sx={{
        backgroundColor: trigger ? "rgba(255, 255, 255, 0.8)" : "transparent",
        backdropFilter: trigger ? "blur(12px)" : "none",
        borderBottom: trigger ? "1px solid rgba(0,0,0,0.05)" : "none",
        transition: "all 0.3s ease",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ height: 70 }}>
          {/* LOGO */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "primary.main",
              flexGrow: { xs: 1, md: 0 },
              mr: 4,
            }}
          >
            <CodeIcon sx={{ fontSize: 32, mr: 1 }} />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                fontFamily: "Outfit",
                letterSpacing: "-0.5px",
                color: "text.primary",
              }}
            >
              F-Code
              <Typography
                component="span"
                variant="h5"
                sx={{ color: "primary.main", fontWeight: 700 }}
              >
                Learning
              </Typography>
            </Typography>
          </Box>

          {/* DESKTOP NAV */}
          <Box sx={{ display: { xs: "none", md: "flex" }, flexGrow: 1 }}>
            <Button
              component={Link}
              to="/"
              sx={{ color: "text.secondary", fontWeight: 600, px: 2 }}
            >
              Trang chủ
            </Button>
            <Button
              href="#"
              sx={{ color: "text.secondary", fontWeight: 600, px: 2 }}
            >
              Khóa học
            </Button>
            <Button
              href="#"
              sx={{ color: "text.secondary", fontWeight: 600, px: 2 }}
            >
              Blog
            </Button>
          </Box>

          {/* AUTH ACTIONS */}
          <Box sx={{ display: "flex", gap: 2 }}>
            {user ? (
              <>
                <Button
                  onClick={handleMenu}
                  startIcon={<Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>{user.full_name?.charAt(0)}</Avatar>}
                  sx={{
                    color: "text.primary",
                    fontWeight: 600,
                    textTransform: "none",
                  }}
                >
                  {user.full_name}
                </Button>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      boxShadow: 3,
                      borderRadius: 2,
                      minWidth: 180,
                    }
                  }}
                >
                  <MenuItem onClick={() => { handleClose(); navigate("/profile"); }}>
                    Hồ sơ cá nhân
                  </MenuItem>
                  {user.role === "instructor" && (
                     <MenuItem onClick={() => { handleClose(); navigate("/create-course"); }}>
                     Tạo khóa học
                   </MenuItem>
                  )}
                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>Đăng xuất</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  component={Link}
                  to="/login"
                  sx={{
                    color: "text.primary",
                    fontWeight: 600,
                    "&:hover": { bgcolor: "rgba(0,0,0,0.05)" },
                  }}
                >
                  Đăng nhập
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  sx={{
                    px: 3,
                    borderRadius: "50px",
                    fontWeight: 600,
                  }}
                >
                  Đăng ký miễn phí
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;

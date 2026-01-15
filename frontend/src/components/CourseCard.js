import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";
import SchoolIcon from "@mui/icons-material/School";

const CourseCard = ({ course }) => {
  const defaultImg =
    "https://files.fullstack.edu.vn/f8-prod/courses/13/13.png";

  const getLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case "beginner":
        return "success";
      case "intermediate":
        return "warning";
      case "advanced":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={course.thumbnail_url || defaultImg}
        alt={course.title}
        sx={{ objectFit: "cover" }}
      />
      <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
          <Chip
            label={course.level || "Beginner"}
            color={getLevelColor(course.level)}
            size="small"
            sx={{ fontWeight: 500 }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: course.price === 0 || course.price === "0.00" ? "success.main" : "primary.main",
            }}
          >
            {course.price === 0 || course.price === "0.00"
              ? "Miễn phí"
              : `${parseInt(course.price).toLocaleString()} đ`}
          </Typography>
        </Box>
        <Typography
          variant="h6"
          component="h2"
          sx={{
            fontWeight: 500,
            mb: 1,
            minHeight: "60px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {course.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            flexGrow: 1,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {course.description || "Khóa học chất lượng cao"}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <SchoolIcon sx={{ fontSize: 18, mr: 0.5, color: "text.secondary" }} />
          <Typography variant="caption" color="text.secondary">
            {course.teacher ? course.teacher.full_name : "Admin"}
          </Typography>
        </Box>
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          component={Link}
          to={`/course/${course.course_id}`}
          variant="contained"
          fullWidth
          sx={{ py: 1 }}
        >
          Xem Chi Tiết
        </Button>
      </CardActions>
    </Card>
  );
};

export default CourseCard;

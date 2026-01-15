import React from "react";
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Box,
  Rating,
  Avatar,
} from "@mui/material";
import { Link } from "react-router-dom";
import { AccessTime, Person } from "@mui/icons-material";

const CourseCard = ({ course }) => {
  // Generate a random gradient placeholder if no image
  const placeholderImage = `https://source.unsplash.com/random/800x600?programming,code&sig=${course.course_id}`;
  // Fallback to a solid color if Unsplash acts up, or use a local asset pattern. 
  // For now, let's use a nice gradient div if we want, but CardMedia likes images.
  // We'll stick to a reliable placeholder service or the gradient approach.
  
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <CardActionArea
        component={Link}
        to={`/course/${course.course_id}`}
        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
      >
        <Box sx={{ position: 'relative', width: '100%', pt: '56.25%' /* 16:9 Aspect Ratio */ }}>
            <CardMedia
            component="img"
            image={course.thumbnail_url || course.thumbnail || "/thumbnail.png"}
            alt={course.title}
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
            }}
            />
             <Chip
                label="Premium"
                color="primary"
                size="small"
                sx={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    fontWeight: 600,
                    backdropFilter: 'blur(4px)',
                }}
            />
        </Box>

        <CardContent sx={{ flexGrow: 1, width: '100%', pt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
             <Chip 
                label={course.category || "Development"} 
                size="small" 
                sx={{ bgcolor: 'rgba(5, 150, 105, 0.1)', color: 'primary.main', fontWeight: 600, fontSize: '0.7rem', borderRadius: 1 }} 
             />
             <Box sx={{ display: 'flex', alignItems: 'center', color: '#fbbf24' }}>
                <Rating value={4.5} precision={0.5} size="small" readOnly sx={{ color: 'inherit' }} />
                <Typography variant="caption" sx={{ color: 'text.secondary', ml: 0.5, fontWeight: 500 }}>(24)</Typography>
             </Box>
          </Box>
          
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{ 
                fontWeight: 700, 
                fontSize: '1.1rem', 
                lineHeight: 1.4,
                mb: 1,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
            }}
          >
            {course.title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              mb: 2,
              lineHeight: 1.6
            }}
          >
            {course.description}
          </Typography>

           <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto', pt: 2, borderTop: '1px solid #f1f5f9' }}>
               <Box sx={{ display: 'flex', alignItems: 'center' }}>
                   <Avatar sx={{ width: 24, height: 24, mr: 1, fontSize: '0.8rem' }}>I</Avatar>
                   <Typography variant="caption" color="text.primary" fontWeight={600}>Instructor</Typography>
               </Box>
               <Typography variant="h6" color="primary.main" fontWeight={700}>
                   Free
               </Typography>
           </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default CourseCard;

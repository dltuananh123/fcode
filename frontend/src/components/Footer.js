import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn, Code as CodeIcon } from '@mui/icons-material';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                bgcolor: '#0f172a', // Slate 900
                color: 'white',
                pt: 8,
                pb: 4,
                mt: 'auto', // Push to bottom
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    {/* Brand Column */}
                    <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <CodeIcon sx={{ fontSize: 32, mr: 1, color: 'primary.main' }} />
                            <Typography variant="h5" sx={{ fontFamily: 'Outfit', fontWeight: 700 }}>
                                F-Code Learning
                            </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3, maxWidth: 300 }}>
                            Nền tảng học lập trình trực tuyến hàng đầu. Nâng cao kỹ năng, phát triển sự nghiệp của bạn ngay hôm nay.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            {[Facebook, Twitter, Instagram, LinkedIn].map((Icon, index) => (
                                <IconButton key={index} sx={{ color: '#94a3b8', '&:hover': { color: 'primary.main' } }}>
                                    <Icon />
                                </IconButton>
                            ))}
                        </Box>
                    </Grid>

                    {/* Links Column 1 */}
                    <Grid item xs={6} md={2}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#f8fafc' }}>
                            Khám phá
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Link href="#" color="inherit" underline="hover" sx={{ color: '#94a3b8' }}>Khóa học</Link>
                            <Link href="#" color="inherit" underline="hover" sx={{ color: '#94a3b8' }}>Blog</Link>
                            <Link href="#" color="inherit" underline="hover" sx={{ color: '#94a3b8' }}>Tài liệu</Link>
                        </Box>
                    </Grid>

                    {/* Links Column 2 */}
                    <Grid item xs={6} md={2}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#f8fafc' }}>
                            Về chúng tôi
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Link href="#" color="inherit" underline="hover" sx={{ color: '#94a3b8' }}>Giới thiệu</Link>
                            <Link href="#" color="inherit" underline="hover" sx={{ color: '#94a3b8' }}>Liên hệ</Link>
                            <Link href="#" color="inherit" underline="hover" sx={{ color: '#94a3b8' }}>Điều khoản</Link>
                        </Box>
                    </Grid>

                    {/* Newsletter - Simplified as Text for now */}
                    <Grid item xs={12} md={4}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#f8fafc' }}>
                            Liên hệ hỗ trợ
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1 }}>
                            Email: support@fcode.edu.vn
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                            Hotline: 1900 1234
                        </Typography>
                    </Grid>
                </Grid>

                {/* Copyright */}
                <Box sx={{ mt: 8, pt: 3, borderTop: '1px solid #1e293b', textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                        © {new Date().getFullYear()} F-Code Learning. All rights reserved.
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Make by FCT1 Team.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;

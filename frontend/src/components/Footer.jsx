import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton, Divider, Stack } from '@mui/material';
import {
  WorkspacePremium as CrownIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Instagram as InstagramIcon,
  Facebook as FacebookIcon,
  YouTube as YouTubeIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Footer = () => {
  const navigate = useNavigate();
  const { requireAuth } = useAuth();
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#141414',
        color: '#E0E0E0',
        pt: { xs: 8, md: 10 },
        pb: 4,
        borderTop: '3px solid #FF6B00',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Accent glow */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(255, 107, 0, 0.12) 0%, rgba(20,20,20,0) 70%)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg">
        <Grid container spacing={5}>
          {/* Column 1: Brand & Bio */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #FF6B00 0%, #FF9040 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFF',
                  boxShadow: '0 4px 14px rgba(255, 107, 0, 0.4)',
                }}
              >
                <CrownIcon sx={{ fontSize: 26 }} />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    letterSpacing: '0.04em',
                    color: '#FFFFFF',
                    lineHeight: 1.1,
                  }}
                >
                  KING BARBAR
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    letterSpacing: '0.22em',
                    color: '#FF6B00',
                    fontSize: '0.62rem',
                    display: 'block',
                  }}
                >
                  ROYAL GROOMING & SPA
                </Typography>
              </Box>
            </Box>

            <Typography variant="body2" sx={{ color: '#9E9E9E', lineHeight: 1.7, mb: 3 }}>
              Your Style. Your King. Elevating the art of modern men's barbering with bespoke styling,
              precision beard architecture, and luxurious royal spa treatments.
            </Typography>

            <Stack direction="row" spacing={1.5}>
              <IconButton
                sx={{
                  bgcolor: 'rgba(255,255,255,0.05)',
                  color: '#FF6B00',
                  '&:hover': { bgcolor: '#FF6B00', color: '#FFF' },
                }}
              >
                <InstagramIcon fontSize="small" />
              </IconButton>
              <IconButton
                sx={{
                  bgcolor: 'rgba(255,255,255,0.05)',
                  color: '#FF6B00',
                  '&:hover': { bgcolor: '#FF6B00', color: '#FFF' },
                }}
              >
                <FacebookIcon fontSize="small" />
              </IconButton>
              <IconButton
                sx={{
                  bgcolor: 'rgba(255,255,255,0.05)',
                  color: '#FF6B00',
                  '&:hover': { bgcolor: '#FF6B00', color: '#FFF' },
                }}
              >
                <YouTubeIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Grid>

          {/* Column 2: Quick Links */}
          <Grid item xs={6} sm={4} md={2.5}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#FFFFFF', mb: 2.5 }}>
              Explore
            </Typography>
            <Stack spacing={1.5}>
              <Link component={RouterLink} to="/" sx={{ color: '#9E9E9E', textDecoration: 'none', '&:hover': { color: '#FF6B00' } }}>
                Home
              </Link>
              <Link component={RouterLink} to="/services" sx={{ color: '#9E9E9E', textDecoration: 'none', '&:hover': { color: '#FF6B00' } }}>
                Barber Services
              </Link>
              <Link component={RouterLink} to="/hairstyles" sx={{ color: '#9E9E9E', textDecoration: 'none', '&:hover': { color: '#FF6B00' } }}>
                Hairstyle Lookbook
              </Link>
              <Link
                component="button"
                onClick={() => requireAuth(() => navigate('/book'), '/book')}
                sx={{
                  color: '#FF6B00',
                  fontWeight: 600,
                  textDecoration: 'none',
                  textAlign: 'left',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  p: 0,
                  fontSize: 'inherit',
                  fontFamily: 'inherit',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Book Appointment
              </Link>
              <Link component={RouterLink} to="/my-bookings" sx={{ color: '#9E9E9E', textDecoration: 'none', '&:hover': { color: '#FF6B00' } }}>
                My Appointments
              </Link>
            </Stack>
          </Grid>

          {/* Column 3: Salon Hours */}
          <Grid item xs={6} sm={4} md={2.5}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#FFFFFF', mb: 2.5 }}>
              Working Hours
            </Typography>
            <Stack spacing={1.8}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <TimeIcon sx={{ color: '#FF6B00', fontSize: 20, mt: 0.2 }} />
                <Box>
                  <Typography variant="body2" sx={{ color: '#FFF', fontWeight: 600 }}>
                    Mon – Fri
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#9E9E9E' }}>
                    10:00 AM – 07:30 PM
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <TimeIcon sx={{ color: '#FF6B00', fontSize: 20, mt: 0.2 }} />
                <Box>
                  <Typography variant="body2" sx={{ color: '#FFF', fontWeight: 600 }}>
                    Sat – Sun
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#9E9E9E' }}>
                    09:30 AM – 08:00 PM
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Grid>

          {/* Column 4: Contact & Location */}
          <Grid item xs={12} sm={4} md={3}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#FFFFFF', mb: 2.5 }}>
              Visit Our Salon
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <LocationIcon sx={{ color: '#FF6B00', fontSize: 20, mt: 0.3 }} />
                <Typography variant="body2" sx={{ color: '#9E9E9E', lineHeight: 1.5 }}>
                  King Barbar Luxury Salon, 5th Avenue, Royal Plaza, Chennai, TN - 600001
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <PhoneIcon sx={{ color: '#FF6B00', fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: '#FFF', fontWeight: 600 }}>
                  +91 98765 43210
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <EmailIcon sx={{ color: '#FF6B00', fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: '#9E9E9E' }}>
                  ajairaja2004@gmail.com
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="caption" sx={{ color: '#757575' }}>
            © {new Date().getFullYear()} KING BARBAR SHOP. All rights reserved. Crafted for Gentlemen.
          </Typography>
          <Stack direction="row" spacing={3}>
            <Link component={RouterLink} to="/admin" sx={{ color: '#616161', fontSize: '0.75rem', textDecoration: 'none', '&:hover': { color: '#FF6B00' } }}>
              Admin Portal
            </Link>
            <Link component={RouterLink} to="/services" sx={{ color: '#616161', fontSize: '0.75rem', textDecoration: 'none', '&:hover': { color: '#FF6B00' } }}>
              Services
            </Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

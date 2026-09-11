import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  Divider,
  Stack,
  Avatar,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  WorkspacePremium as CrownIcon,
  CalendarMonth as CalendarIcon,
  AccessTime as TimeIcon,
  ContentCut as BarberIcon,
  EventNote as BookingsIcon,
  Home as HomeIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
import confetti from 'canvas-confetti';
import dayjs from 'dayjs';

const BookingSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;

  useEffect(() => {
    // Trigger celebration confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF6B00', '#FFB800', '#FFA04D', '#1A1A1A'],
    });
  }, []);

  if (!booking) {
    return (
      <Box sx={{ textAlign: 'center', py: 12 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          No active booking session found.
        </Typography>
        <Button component={RouterLink} to="/my-bookings" variant="contained" color="primary">
          Go to My Bookings
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#FFF8F2', minHeight: '90vh', py: { xs: 5, md: 8 } }}>
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 5,
            bgcolor: '#FFFFFF',
            border: '1px solid rgba(255, 107, 0, 0.15)',
            boxShadow: '0 20px 60px rgba(255, 107, 0, 0.12)',
            textAlign: 'center',
          }}
        >
          {/* Animated Success Badge */}
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: 'rgba(82, 196, 26, 0.12)',
              border: '3px solid #52C41A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 46, color: '#52C41A' }} />
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 900, color: '#1A1A1A', mb: 1 }}>
            Appointment Confirmed!
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', mb: 3 }}>
            Thank you! Your chair is reserved at King Barbar Shop.
          </Typography>

          {/* Booking ID Chip */}
          <Box sx={{ mb: 4 }}>
            <Chip
              icon={<CrownIcon sx={{ color: '#FF6B00 !important' }} />}
              label={`Booking Reference: ${booking.bookingNumber}`}
              sx={{
                bgcolor: '#FFF6ED',
                color: '#1A1A1A',
                fontWeight: 800,
                fontSize: '0.9rem',
                py: 2.2,
                px: 1,
                border: '1px solid rgba(255, 107, 0, 0.3)',
              }}
            />
          </Box>

          {/* Details Card */}
          <Box
            sx={{
              p: 3,
              borderRadius: 3.5,
              bgcolor: '#FFF8F2',
              border: '1px solid rgba(255, 107, 0, 0.15)',
              textAlign: 'left',
              mb: 4,
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar
                    src={booking.service?.image}
                    variant="rounded"
                    sx={{ width: 48, height: 48, borderRadius: 2 }}
                  />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1A1A1A', lineHeight: 1.2 }}>
                      {booking.service?.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#FF6B00', fontWeight: 700 }}>
                      {booking.service?.duration} mins • Master Barber
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12}><Divider sx={{ my: 0.5 }} /></Grid>

              <Grid item xs={6}>
                <Typography variant="caption" sx={{ color: '#888', fontWeight: 700, display: 'block' }}>
                  DATE
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 800, color: '#1A1A1A' }}>
                  {dayjs(booking.date).format('ddd, MMM D, YYYY')}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="caption" sx={{ color: '#888', fontWeight: 700, display: 'block' }}>
                  TIME SLOT
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 800, color: '#FF6B00' }}>
                  {booking.timeSlot}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="caption" sx={{ color: '#888', fontWeight: 700, display: 'block' }}>
                  STATUS
                </Typography>
                <Chip
                  label={booking.status}
                  size="small"
                  sx={{
                    bgcolor: '#52C41A',
                    color: '#FFF',
                    fontWeight: 800,
                    fontSize: '0.7rem',
                    height: 22,
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <Typography variant="caption" sx={{ color: '#888', fontWeight: 700, display: 'block' }}>
                  TOTAL PRICE
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#FF6B00' }}>
                  ₹{booking.totalAmount}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Action Buttons */}
          <Stack spacing={2}>
            <Button
              component={RouterLink}
              to="/my-bookings"
              variant="contained"
              color="primary"
              size="large"
              startIcon={<BookingsIcon />}
              sx={{
                py: 1.5,
                borderRadius: 2.5,
                fontWeight: 700,
                fontSize: '1rem',
              }}
            >
              View My Bookings
            </Button>

            <Button
              component={RouterLink}
              to="/services"
              variant="outlined"
              size="large"
              startIcon={<BarberIcon />}
              sx={{
                py: 1.3,
                borderRadius: 2.5,
                fontWeight: 600,
                color: '#1A1A1A',
                borderColor: 'rgba(0,0,0,0.2)',
                '&:hover': {
                  borderColor: '#FF6B00',
                  color: '#FF6B00',
                },
              }}
            >
              Book Another Service
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default BookingSuccessPage;

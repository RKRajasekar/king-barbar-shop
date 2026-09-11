import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Stepper,
  Step,
  StepLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  TextField,
  Chip,
  Paper,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Avatar,
  Stack,
} from '@mui/material';
import {
  ContentCut as BarberIcon,
  CalendarMonth as CalendarIcon,
  AccessTime as TimeIcon,
  CheckCircle as CheckCircleIcon,
  WorkspacePremium as CrownIcon,
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Person as PersonIcon,
  Lock as LockIcon,
  Info as InfoIcon,
  EventBusy as ClosedIcon,
} from '@mui/icons-material';
import { useNavigate, useSearchParams, Link as RouterLink } from 'react-router-dom';
import dayjs from 'dayjs';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const steps = ['Select Service', 'Select Date & Time', 'Review & Confirm'];

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const preselectedServiceId = searchParams.get('serviceId');
  const navigate = useNavigate();
  const { user, isAuthenticated, login } = useAuth();
  const { showSuccess, showError } = useNotification();

  // Wizard state
  const [activeStep, setActiveStep] = useState(0);

  // Data state
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [selectedService, setSelectedService] = useState(null);

  // Date & Time state
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isSalonClosed, setIsSalonClosed] = useState(false);
  const [closedReason, setClosedReason] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [notes, setNotes] = useState('');

  // Submitting state
  const [submitting, setSubmitting] = useState(false);

  // 1. Fetch all active services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get('/services');
        if (response.data.success) {
          setServices(response.data.services);

          if (preselectedServiceId) {
            const pre = response.data.services.find((s) => s.id === parseInt(preselectedServiceId));
            if (pre) {
              setSelectedService(pre);
              setActiveStep(1); // Advance to date & time if service was clicked from cards
            }
          }
        }
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServices();
  }, [preselectedServiceId]);

  // 2. Fetch available slots whenever selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      fetchSlotsForDate(selectedDate);
    }
  }, [selectedDate]);

  const fetchSlotsForDate = async (dateStr) => {
    setLoadingSlots(true);
    setSelectedTimeSlot('');
    try {
      const response = await api.get(`/bookings/slots/availability?date=${dateStr}`);
      if (response.data.success) {
        setIsSalonClosed(Boolean(response.data.isClosed));
        setClosedReason(response.data.reason || '');
        setAvailableSlots(response.data.slots || []);
      }
    } catch (err) {
      console.error('Error fetching time slots:', err);
      showError('Failed to fetch available slots.');
    } finally {
      setLoadingSlots(false);
    }
  };

  // Step navigation
  const handleNext = () => {
    if (activeStep === 0 && !selectedService) {
      showError('Please select a service to proceed.');
      return;
    }
    if (activeStep === 1) {
      if (!selectedDate) {
        showError('Please select an appointment date.');
        return;
      }
      if (!selectedTimeSlot) {
        showError('Please select an available time slot.');
        return;
      }
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  // Submit Booking
  const handleConfirmBooking = async () => {
    if (!isAuthenticated) {
      showError('Please login to confirm your appointment.');
      navigate('/login', { state: { from: location } });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        serviceId: selectedService.id,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        notes: notes.trim(),
      };

      const response = await api.post('/bookings', payload);

      if (response.data.success) {
        showSuccess('Appointment booked successfully!');
        navigate('/booking-success', {
          state: {
            booking: response.data.booking,
          },
        });
      }
    } catch (err) {
      console.error('Booking submission error:', err);
      showError(err.message || 'Failed to confirm booking.');
    } finally {
      setSubmitting(false);
    }
  };

  // Generate next 14 dates for easy date selection pills
  const nextDates = Array.from({ length: 14 }).map((_, index) => {
    const d = dayjs().add(index, 'day');
    return {
      dateStr: d.format('YYYY-MM-DD'),
      dayName: index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : d.format('ddd'),
      dayNum: d.format('DD'),
      month: d.format('MMM'),
    };
  });

  return (
    <Box sx={{ bgcolor: '#FFF8F2', minHeight: '90vh', py: { xs: 4, md: 7 } }}>
      <Container maxWidth="lg">
        {/* Title & Header */}
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Chip
            icon={<CrownIcon sx={{ fontSize: '18px !important' }} />}
            label="RESERVE YOUR CHAIR"
            sx={{
              bgcolor: 'rgba(255, 107, 0, 0.12)',
              color: '#FF6B00',
              fontWeight: 800,
              fontSize: '0.8rem',
              mb: 1.5,
              px: 1.5,
            }}
          />
          <Typography variant="h2" sx={{ fontWeight: 900, color: '#1A1A1A', mb: 1, fontSize: { xs: '2rem', md: '2.8rem' } }}>
            Book Your Appointment
          </Typography>
          <Typography variant="body1" sx={{ color: '#666' }}>
            Experience royalty. Select your service, pick a date and time, and we'll take care of the rest.
          </Typography>
        </Box>

        {/* Stepper Header */}
        <Box sx={{ mb: 6 }}>
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{
              '& .MuiStepIcon-root.Mui-active': {
                color: '#FF6B00',
              },
              '& .MuiStepIcon-root.Mui-completed': {
                color: '#52C41A',
              },
              '& .MuiStepLabel-label': {
                fontWeight: 700,
                fontSize: '0.9rem',
                color: '#666',
              },
              '& .MuiStepLabel-label.Mui-active': {
                color: '#FF6B00',
                fontWeight: 800,
              },
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Grid container spacing={4}>
          {/* Main Wizard Content */}
          <Grid item xs={12} md={activeStep === 2 ? 7 : 8}>
            {/* STEP 1: SELECT SERVICE */}
            {activeStep === 0 && (
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, md: 4 },
                  borderRadius: 4,
                  bgcolor: '#FFFFFF',
                  border: '1px solid rgba(255, 107, 0, 0.12)',
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#1A1A1A', mb: 1 }}>
                  Choose Your Service
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
                  Click on any service card to select it for your booking.
                </Typography>

                {loadingServices ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress sx={{ color: '#FF6B00' }} />
                  </Box>
                ) : (
                  <Grid container spacing={2.5}>
                    {services.map((service) => {
                      const isSelected = selectedService?.id === service.id;
                      return (
                        <Grid item xs={12} sm={6} key={service.id}>
                          <Card
                            onClick={() => setSelectedService(service)}
                            sx={{
                              p: 2,
                              cursor: 'pointer',
                              borderRadius: 3.5,
                              border: isSelected ? '2px solid #FF6B00' : '1px solid rgba(0,0,0,0.08)',
                              bgcolor: isSelected ? '#FFF6ED' : '#FFFFFF',
                              boxShadow: isSelected ? '0 8px 24px rgba(255, 107, 0, 0.2)' : 'none',
                              transition: 'all 0.25s ease',
                              display: 'flex',
                              gap: 2,
                              alignItems: 'center',
                              '&:hover': {
                                borderColor: '#FF6B00',
                                transform: 'translateY(-2px)',
                              },
                            }}
                          >
                            <Avatar
                              src={service.image}
                              variant="rounded"
                              sx={{ width: 64, height: 64, borderRadius: 2.5 }}
                            />
                            <Box sx={{ flexGrow: 1 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1A1A1A', lineHeight: 1.2 }}>
                                  {service.name}
                                </Typography>
                                {isSelected && (
                                  <CheckCircleIcon sx={{ color: '#FF6B00', fontSize: 20 }} />
                                )}
                              </Box>

                              <Typography
                                variant="caption"
                                sx={{
                                  color: '#777',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 1,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  my: 0.5,
                                }}
                              >
                                {service.description}
                              </Typography>

                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#FF6B00' }}>
                                  ₹{service.price}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#888', display: 'flex', alignItems: 'center', gap: 0.3 }}>
                                  <TimeIcon sx={{ fontSize: 13 }} /> {service.duration} mins
                                </Typography>
                              </Box>
                            </Box>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={!selectedService}
                    onClick={handleNext}
                    endIcon={<ArrowForwardIcon />}
                    sx={{ px: 4, py: 1.4, borderRadius: 2.5, fontWeight: 700 }}
                  >
                    Continue to Date & Time
                  </Button>
                </Box>
              </Paper>
            )}

            {/* STEP 2: SELECT DATE & TIME */}
            {activeStep === 1 && (
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, md: 4 },
                  borderRadius: 4,
                  bgcolor: '#FFFFFF',
                  border: '1px solid rgba(255, 107, 0, 0.12)',
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#1A1A1A', mb: 1 }}>
                  Select Appointment Date
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', mb: 2.5 }}>
                  Choose your preferred day within the next two weeks.
                </Typography>

                {/* Horizontal Date Selector Carousel / Grid */}
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1.5,
                    overflowX: 'auto',
                    pb: 2,
                    mb: 4,
                    '&::-webkit-scrollbar': { height: 6 },
                    '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255, 107, 0, 0.3)', borderRadius: 3 },
                  }}
                >
                  {nextDates.map((item) => {
                    const isSelectedDate = selectedDate === item.dateStr;
                    return (
                      <Box
                        key={item.dateStr}
                        onClick={() => setSelectedDate(item.dateStr)}
                        sx={{
                          minWidth: 80,
                          py: 2,
                          px: 1.5,
                          textAlign: 'center',
                          borderRadius: 3,
                          cursor: 'pointer',
                          border: isSelectedDate ? '2px solid #FF6B00' : '1px solid rgba(0,0,0,0.08)',
                          bgcolor: isSelectedDate ? '#FF6B00' : '#FFF8F2',
                          color: isSelectedDate ? '#FFFFFF' : '#1A1A1A',
                          boxShadow: isSelectedDate ? '0 6px 16px rgba(255, 107, 0, 0.3)' : 'none',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            borderColor: '#FF6B00',
                          },
                        }}
                      >
                        <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', color: isSelectedDate ? 'rgba(255,255,255,0.85)' : '#888' }}>
                          {item.dayName}
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 900, my: 0.3 }}>
                          {item.dayNum}
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', color: isSelectedDate ? 'rgba(255,255,255,0.85)' : '#666' }}>
                          {item.month}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Time Slots Selection */}
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#1A1A1A', mb: 1 }}>
                  Select Available Time Slot
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
                  Showing open appointment times for <strong>{dayjs(selectedDate).format('dddd, MMMM D, YYYY')}</strong>.
                </Typography>

                {loadingSlots ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                    <CircularProgress sx={{ color: '#FF6B00' }} />
                  </Box>
                ) : isSalonClosed ? (
                  <Alert severity="warning" icon={<ClosedIcon />} sx={{ borderRadius: 3, my: 2 }}>
                    The salon is closed on this date ({closedReason || 'Scheduled Holiday'}). Please choose another date.
                  </Alert>
                ) : availableSlots.length === 0 ? (
                  <Alert severity="info" sx={{ borderRadius: 3, my: 2 }}>
                    No time slots configured for this date.
                  </Alert>
                ) : (
                  <Grid container spacing={2}>
                    {availableSlots.map((slot) => {
                      const isSelected = selectedTimeSlot === slot.startTime;
                      const isAvailable = slot.isAvailable;

                      return (
                        <Grid item xs={6} sm={4} md={3} key={slot.id || slot.startTime}>
                          <Button
                            fullWidth
                            disabled={!isAvailable}
                            onClick={() => setSelectedTimeSlot(slot.startTime)}
                            variant={isSelected ? 'contained' : 'outlined'}
                            color={isSelected ? 'primary' : 'inherit'}
                            sx={{
                              py: 1.5,
                              borderRadius: 2.5,
                              fontWeight: 700,
                              fontSize: '0.9rem',
                              borderWidth: 1.5,
                              borderColor: isSelected
                                ? '#FF6B00'
                                : isAvailable
                                ? 'rgba(255, 107, 0, 0.3)'
                                : 'rgba(0,0,0,0.1)',
                              bgcolor: isSelected
                                ? 'linear-gradient(135deg, #FF6B00 0%, #FF8533 100%)'
                                : isAvailable
                                ? '#FFFFFF'
                                : '#F5F5F5',
                              color: isSelected
                                ? '#FFFFFF'
                                : isAvailable
                                ? '#1A1A1A'
                                : '#B0B0B0',
                              '&:hover': {
                                borderWidth: 1.5,
                                borderColor: '#FF6B00',
                                bgcolor: isSelected ? undefined : '#FFF1E6',
                              },
                            }}
                          >
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                {slot.startTime}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  fontSize: '0.65rem',
                                  fontWeight: 700,
                                  color: isSelected
                                    ? 'rgba(255,255,255,0.9)'
                                    : isAvailable
                                    ? '#52C41A'
                                    : '#FF4D4F',
                                }}
                              >
                                {isAvailable ? 'Available' : 'Booked'}
                              </Typography>
                            </Box>
                          </Button>
                        </Grid>
                      );
                    })}
                  </Grid>
                )}

                {/* Additional Notes */}
                <Box sx={{ mt: 4 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#1A1A1A' }}>
                    Special Requests or Style Notes (Optional)
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="e.g. skin fade taper, beard shape request, or sensitive scalp..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                  <Button
                    variant="outlined"
                    onClick={handleBack}
                    startIcon={<ArrowBackIcon />}
                    sx={{ px: 3, borderRadius: 2.5 }}
                  >
                    Back to Services
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={!selectedDate || !selectedTimeSlot || isSalonClosed}
                    onClick={handleNext}
                    endIcon={<ArrowForwardIcon />}
                    sx={{ px: 4, borderRadius: 2.5, fontWeight: 700 }}
                  >
                    Review Appointment
                  </Button>
                </Box>
              </Paper>
            )}

            {/* STEP 3: REVIEW & CONFIRM */}
            {activeStep === 2 && (
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, md: 4 },
                  borderRadius: 4,
                  bgcolor: '#FFFFFF',
                  border: '1px solid rgba(255, 107, 0, 0.12)',
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#1A1A1A', mb: 1 }}>
                  Confirm Your Booking Details
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
                  Please review the appointment details before confirming.
                </Typography>

                {/* Authenticated Customer & Appointment Details */}
                <Box
                  sx={{
                    p: 3,
                    bgcolor: '#FFF8F2',
                    borderRadius: 3.5,
                    border: '1px solid rgba(255, 107, 0, 0.15)',
                    mb: 3,
                  }}
                >
                  <Grid container spacing={2.5}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" sx={{ color: '#888', fontWeight: 700, display: 'block' }}>
                        AUTHENTICATED CUSTOMER
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1A1A1A' }}>
                        {user?.name || 'Customer'}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" sx={{ color: '#888', fontWeight: 700, display: 'block' }}>
                        REGISTERED EMAIL
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#555' }}>
                        {user?.email || 'N/A'}
                      </Typography>
                    </Grid>

                    {user?.phone && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" sx={{ color: '#888', fontWeight: 700, display: 'block' }}>
                          PHONE NUMBER
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 700, color: '#1A1A1A' }}>
                          {user.phone}
                        </Typography>
                      </Grid>
                    )}

                    <Grid item xs={12} sm={user?.phone ? 6 : 12}>
                      <Typography variant="caption" sx={{ color: '#888', fontWeight: 700, display: 'block' }}>
                        SERVICE SELECTED
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#FF6B00' }}>
                        {selectedService?.name}
                      </Typography>
                    </Grid>

                    <Grid item xs={6} sm={4}>
                      <Typography variant="caption" sx={{ color: '#888', fontWeight: 700, display: 'block' }}>
                        DATE
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 700 }}>
                        {dayjs(selectedDate).format('MMM D, YYYY')}
                      </Typography>
                    </Grid>

                    <Grid item xs={6} sm={4}>
                      <Typography variant="caption" sx={{ color: '#888', fontWeight: 700, display: 'block' }}>
                        TIME SLOT
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 700, color: '#FF6B00' }}>
                        {selectedTimeSlot}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Typography variant="caption" sx={{ color: '#888', fontWeight: 700, display: 'block' }}>
                        DURATION
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 700 }}>
                        {selectedService?.duration} mins
                      </Typography>
                    </Grid>

                    {notes && (
                      <Grid item xs={12}>
                        <Typography variant="caption" sx={{ color: '#888', fontWeight: 700, display: 'block' }}>
                          SPECIAL INSTRUCTIONS
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#555', fontStyle: 'italic' }}>
                          "{notes}"
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                  <Button
                    variant="outlined"
                    onClick={handleBack}
                    startIcon={<ArrowBackIcon />}
                    sx={{ px: 3, borderRadius: 2.5 }}
                  >
                    Change Slot
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={submitting}
                    onClick={handleConfirmBooking}
                    startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2.5,
                      fontWeight: 800,
                      fontSize: '1rem',
                    }}
                  >
                    {submitting ? 'Confirming...' : 'Confirm Appointment'}
                  </Button>
                </Box>
              </Paper>
            )}
          </Grid>

          {/* Right Summary Card (Sticky) */}
          <Grid item xs={12} md={activeStep === 2 ? 5 : 4}>
            <Card
              sx={{
                p: 3,
                borderRadius: 4,
                bgcolor: '#FFFFFF',
                border: '1px solid rgba(255, 107, 0, 0.15)',
                boxShadow: '0 8px 30px rgba(255, 107, 0, 0.08)',
                position: { md: 'sticky' },
                top: 100,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                <Avatar sx={{ bgcolor: '#FF6B00', width: 36, height: 36 }}>
                  <CrownIcon fontSize="small" />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#1A1A1A' }}>
                  Booking Summary
                </Typography>
              </Box>

              {selectedService ? (
                <>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2.5 }}>
                    <Avatar
                      src={selectedService.image}
                      variant="rounded"
                      sx={{ width: 60, height: 60, borderRadius: 2 }}
                    />
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1A1A1A', lineHeight: 1.2 }}>
                        {selectedService.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#FF6B00', fontWeight: 700 }}>
                        {selectedService.category}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#777', mt: 0.3 }}>
                        ⏱ {selectedService.duration} mins
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Stack spacing={1.5} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        Date:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {selectedDate ? dayjs(selectedDate).format('ddd, MMM D, YYYY') : 'Not selected'}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        Time Slot:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: selectedTimeSlot ? '#FF6B00' : '#999' }}>
                        {selectedTimeSlot || 'Not selected'}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        Customer:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#1A1A1A' }}>
                        {user?.name}
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#1A1A1A' }}>
                      Total Price:
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#FF6B00' }}>
                      ₹{selectedService.price}
                    </Typography>
                  </Box>

                  {activeStep < 2 && (
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      disabled={activeStep === 1 && (!selectedDate || !selectedTimeSlot || isSalonClosed)}
                      onClick={handleNext}
                      sx={{ py: 1.4, borderRadius: 2.5, fontWeight: 700 }}
                    >
                      {activeStep === 0 ? 'Select Date & Time' : 'Proceed to Review'}
                    </Button>
                  )}
                </>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <BarberIcon sx={{ fontSize: 40, color: '#CCC', mb: 1 }} />
                  <Typography variant="body2" sx={{ color: '#888' }}>
                    Select a service on the left to begin your booking summary.
                  </Typography>
                </Box>
              )}
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default BookingPage;

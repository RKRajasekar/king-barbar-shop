import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
  Chip,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Stack,
  IconButton,
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  AccessTime as TimeIcon,
  Cancel as CancelIcon,
  Receipt as ReceiptIcon,
  ContentCut as BarberIcon,
  WorkspacePremium as CrownIcon,
  CheckCircle as CheckIcon,
  ErrorOutline as WarningIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import dayjs from 'dayjs';
import api from '../services/api';
import { useNotification } from '../context/NotificationContext';

const getStatusColor = (status) => {
  switch (status) {
    case 'CONFIRMED':
      return { bgcolor: '#E6F7FF', color: '#1890FF', border: '#91D5FF' };
    case 'COMPLETED':
      return { bgcolor: '#F6FFED', color: '#52C41A', border: '#B7EB8F' };
    case 'CANCELLED':
      return { bgcolor: '#FFF1F0', color: '#FF4D4F', border: '#FFA39E' };
    case 'PENDING':
    default:
      return { bgcolor: '#FFFBE6', color: '#FAAD14', border: '#FFE58F' };
  }
};

const MyBookingsPage = () => {
  const { showSuccess, showError } = useNotification();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');

  // Cancel dialog state
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  // Receipt details dialog state
  const [receiptBooking, setReceiptBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, [activeTab]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const statusParam = activeTab === 'ALL' ? '' : `?status=${activeTab}`;
      const response = await api.get(`/bookings/my${statusParam}`);
      if (response.data.success) {
        setBookings(response.data.bookings);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      showError('Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCancelDialog = (booking) => {
    setSelectedBookingForCancel(booking);
    setCancelDialogOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedBookingForCancel) return;
    setCancelling(true);
    try {
      const response = await api.patch(`/bookings/${selectedBookingForCancel.id}/cancel`);
      if (response.data.success) {
        showSuccess('Appointment cancelled successfully.');
        setCancelDialogOpen(false);
        setSelectedBookingForCancel(null);
        fetchBookings();
      }
    } catch (err) {
      showError(err.message || 'Failed to cancel appointment.');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <Box sx={{ bgcolor: '#FFF8F2', minHeight: '90vh', py: { xs: 5, md: 8 } }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 4, gap: 2 }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 900, color: '#1A1A1A' }}>
              My Appointments
            </Typography>
            <Typography variant="body1" sx={{ color: '#666' }}>
              Track your scheduled visits, past history, and manage appointments.
            </Typography>
          </Box>
          <Button
            component={RouterLink}
            to="/book"
            variant="contained"
            color="primary"
            startIcon={<BarberIcon />}
            sx={{ borderRadius: 2.5, fontWeight: 700, px: 3 }}
          >
            Book New Appointment
          </Button>
        </Box>

        {/* Filter Tabs */}
        <Tabs
          value={activeTab}
          onChange={(e, val) => setActiveTab(val)}
          sx={{
            mb: 4,
            borderBottom: '1px solid rgba(255, 107, 0, 0.15)',
            '& .MuiTabs-indicator': { bgcolor: '#FF6B00', height: 3 },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: '#666',
              '&.Mui-selected': { color: '#FF6B00' },
            },
          }}
        >
          <Tab label="All Bookings" value="ALL" />
          <Tab label="Confirmed / Upcoming" value="CONFIRMED" />
          <Tab label="Completed" value="COMPLETED" />
          <Tab label="Cancelled" value="CANCELLED" />
        </Tabs>

        {/* Bookings List */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress sx={{ color: '#FF6B00' }} />
          </Box>
        ) : bookings.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 10,
              bgcolor: '#FFF',
              borderRadius: 4,
              border: '1px dashed rgba(255, 107, 0, 0.3)',
            }}
          >
            <CalendarIcon sx={{ fontSize: 54, color: '#FF8E53', mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#1A1A1A', mb: 1 }}>
              No appointments found
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
              {activeTab === 'ALL'
                ? "You haven't booked any appointments yet."
                : `No appointments with status "${activeTab}".`}
            </Typography>
            <Button
              component={RouterLink}
              to="/book"
              variant="contained"
              color="primary"
              sx={{ borderRadius: 2.5, fontWeight: 700 }}
            >
              Book Now
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {bookings.map((booking) => {
              const statusStyle = getStatusColor(booking.status);
              const canCancel = booking.status === 'PENDING' || booking.status === 'CONFIRMED';

              return (
                <Grid item xs={12} md={6} key={booking.id}>
                  <Card
                    sx={{
                      borderRadius: 4,
                      bgcolor: '#FFFFFF',
                      border: '1px solid rgba(255, 107, 0, 0.12)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                      p: 3,
                      transition: 'all 0.25s ease',
                      '&:hover': {
                        borderColor: '#FF6B00',
                        boxShadow: '0 8px 30px rgba(255, 107, 0, 0.1)',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                          src={booking.service?.image}
                          variant="rounded"
                          sx={{ width: 52, height: 52, borderRadius: 2.5 }}
                        />
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1A1A1A', lineHeight: 1.2 }}>
                            {booking.service?.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#888', fontWeight: 600 }}>
                            Ref: {booking.bookingNumber}
                          </Typography>
                        </Box>
                      </Box>

                      <Chip
                        label={booking.status}
                        size="small"
                        sx={{
                          bgcolor: statusStyle.bgcolor,
                          color: statusStyle.color,
                          border: `1px solid ${statusStyle.border}`,
                          fontWeight: 800,
                          fontSize: '0.75rem',
                        }}
                      />
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Grid container spacing={2} sx={{ mb: 2.5 }}>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: '#888', display: 'block', fontWeight: 600 }}>
                          DATE
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.3 }}>
                          <CalendarIcon sx={{ fontSize: 16, color: '#FF6B00' }} />
                          <Typography variant="body2" sx={{ fontWeight: 700, color: '#1A1A1A' }}>
                            {dayjs(booking.date).format('ddd, MMM D, YYYY')}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: '#888', display: 'block', fontWeight: 600 }}>
                          TIME SLOT
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.3 }}>
                          <TimeIcon sx={{ fontSize: 16, color: '#FF6B00' }} />
                          <Typography variant="body2" sx={{ fontWeight: 800, color: '#FF6B00' }}>
                            {booking.timeSlot}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: '#888', display: 'block', fontWeight: 600 }}>
                          DURATION
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#555' }}>
                          {booking.service?.duration} mins
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: '#888', display: 'block', fontWeight: 600 }}>
                          AMOUNT
                        </Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#1A1A1A' }}>
                          ₹{booking.totalAmount}
                        </Typography>
                      </Grid>
                    </Grid>

                    {booking.notes && (
                      <Box sx={{ mb: 2.5, p: 1.5, bgcolor: '#FFF8F2', borderRadius: 2 }}>
                        <Typography variant="caption" sx={{ color: '#888', display: 'block', fontWeight: 700 }}>
                          NOTES:
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#555', fontStyle: 'italic' }}>
                          "{booking.notes}"
                        </Typography>
                      </Box>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1 }}>
                      <Button
                        size="small"
                        startIcon={<ReceiptIcon />}
                        onClick={() => setReceiptBooking(booking)}
                        sx={{ color: '#666', fontWeight: 600 }}
                      >
                        Receipt
                      </Button>

                      {canCancel && (
                        <Button
                          size="small"
                          color="error"
                          variant="outlined"
                          startIcon={<CancelIcon />}
                          onClick={() => handleOpenCancelDialog(booking)}
                          sx={{ borderRadius: 2, fontWeight: 700 }}
                        >
                          Cancel Booking
                        </Button>
                      )}
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        {/* Cancel Confirmation Dialog */}
        <Dialog
          open={cancelDialogOpen}
          onClose={() => !cancelling && setCancelDialogOpen(false)}
          PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
        >
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#d32f2f', fontWeight: 800 }}>
            <WarningIcon />
            Cancel Appointment?
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ color: '#444' }}>
              Are you sure you want to cancel your booking for{' '}
              <strong>{selectedBookingForCancel?.service?.name}</strong> on{' '}
              <strong>{selectedBookingForCancel && dayjs(selectedBookingForCancel.date).format('MMM D, YYYY')}</strong> at{' '}
              <strong>{selectedBookingForCancel?.timeSlot}</strong>?
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button
              disabled={cancelling}
              onClick={() => setCancelDialogOpen(false)}
              sx={{ fontWeight: 600 }}
            >
              Keep Appointment
            </Button>
            <Button
              variant="contained"
              color="error"
              disabled={cancelling}
              onClick={handleConfirmCancel}
              sx={{ borderRadius: 2, fontWeight: 700 }}
            >
              {cancelling ? 'Cancelling...' : 'Yes, Cancel Appointment'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Receipt / Details Modal Dialog */}
        <Dialog
          open={Boolean(receiptBooking)}
          onClose={() => setReceiptBooking(null)}
          maxWidth="xs"
          fullWidth
          PaperProps={{ sx: { borderRadius: 4, p: 2 } }}
        >
          {receiptBooking && (
            <>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: '#FF6B00', width: 48, height: 48, mx: 'auto', mb: 1 }}>
                  <CrownIcon />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 900 }}>
                  KING BARBAR SHOP
                </Typography>
                <Typography variant="caption" sx={{ color: '#888' }}>
                  Appointment Receipt #{receiptBooking.bookingNumber}
                </Typography>
              </Box>

              <Divider sx={{ mb: 2 }} />

              <Stack spacing={1.5} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: '#666' }}>Service:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{receiptBooking.service?.name}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: '#666' }}>Date:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{dayjs(receiptBooking.date).format('MMM D, YYYY')}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: '#666' }}>Time Slot:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#FF6B00' }}>{receiptBooking.timeSlot}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: '#666' }}>Status:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{receiptBooking.status}</Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Total Paid / Due:</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 900, color: '#FF6B00' }}>₹{receiptBooking.totalAmount}</Typography>
                </Box>
              </Stack>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => setReceiptBooking(null)}
                sx={{ borderRadius: 2.5, fontWeight: 700 }}
              >
                Close Receipt
              </Button>
            </>
          )}
        </Dialog>
      </Container>
    </Box>
  );
};

export default MyBookingsPage;

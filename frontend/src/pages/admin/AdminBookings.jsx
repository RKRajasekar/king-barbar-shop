import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Divider,
  Tabs,
  Tab,
  Avatar,
} from '@mui/material';
import {
  Search as SearchIcon,
  CheckCircle as CompleteIcon,
  Cancel as CancelIcon,
  ThumbUp as ConfirmIcon,
  Visibility as ViewIcon,
  EventNote as BookingsIcon,
  CalendarToday as DateIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import api from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

const AdminBookings = () => {
  const { showSuccess, showError } = useNotification();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Details Modal
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, [statusFilter, dateFilter]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (dateFilter) params.append('date', dateFilter);

      const response = await api.get(`/admin/bookings?${params.toString()}`);
      if (response.data.success) {
        setBookings(response.data.bookings);
      }
    } catch (err) {
      console.error('Error fetching admin bookings:', err);
      showError('Failed to fetch bookings list.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      const response = await api.patch(`/admin/bookings/${bookingId}/status`, { status: newStatus });
      if (response.data.success) {
        showSuccess(`Booking updated to ${newStatus}`);
        fetchBookings();
        if (selectedBooking && selectedBooking.id === bookingId) {
          setSelectedBooking((prev) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      showError(err.message || 'Failed to update booking status.');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.bookingNumber?.toLowerCase().includes(q) ||
      b.user?.name?.toLowerCase().includes(q) ||
      b.user?.email?.toLowerCase().includes(q) ||
      b.service?.name?.toLowerCase().includes(q)
    );
  });

  const getStatusChip = (status) => {
    const config = {
      CONFIRMED: { bg: '#E6F7FF', color: '#1890FF' },
      COMPLETED: { bg: '#F6FFED', color: '#52C41A' },
      CANCELLED: { bg: '#FFF1F0', color: '#FF4D4F' },
      PENDING: { bg: '#FFFBE6', color: '#FAAD14' },
    };
    const c = config[status] || { bg: '#F5F5F5', color: '#666' };
    return <Chip label={status} size="small" sx={{ bgcolor: c.bg, color: c.color, fontWeight: 800, fontSize: '0.7rem' }} />;
  };

  return (
    <Box>
      {/* Title */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: '#1A1A1A' }}>
          Appointments & Bookings Management
        </Typography>
        <Typography variant="body2" sx={{ color: '#666' }}>
          View, search, confirm, complete, and manage all customer appointments.
        </Typography>
      </Box>

      {/* Filter Tabs */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 4,
          bgcolor: '#FFFFFF',
          border: '1px solid rgba(0,0,0,0.06)',
          mb: 3,
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}>
            <Tabs
              value={statusFilter}
              onChange={(e, val) => setStatusFilter(val)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTabs-indicator': { bgcolor: '#FF6B00', height: 3 },
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  minWidth: 'auto',
                  px: 2,
                  '&.Mui-selected': { color: '#FF6B00' },
                },
              }}
            >
              <Tab label="All" value="ALL" />
              <Tab label="Pending" value="PENDING" />
              <Tab label="Confirmed" value="CONFIRMED" />
              <Tab label="Completed" value="COMPLETED" />
              <Tab label="Cancelled" value="CANCELLED" />
            </Tabs>
          </Grid>

          <Grid item xs={12} sm={6} md={3.5}>
            <TextField
              size="small"
              fullWidth
              placeholder="Search by ID, name, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#FF6B00', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3.5}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                size="small"
                type="date"
                fullWidth
                label="Filter by Date"
                InputLabelProps={{ shrink: true }}
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
              {dateFilter && (
                <Button size="small" onClick={() => setDateFilter('')} sx={{ color: '#666' }}>
                  Clear
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Bookings Table */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          bgcolor: '#FFFFFF',
          border: '1px solid rgba(0,0,0,0.06)',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress sx={{ color: '#FF6B00' }} />
          </Box>
        ) : filteredBookings.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <BookingsIcon sx={{ fontSize: 48, color: '#CCC', mb: 1.5 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A1A1A' }}>
              No bookings match the filter criteria
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting the status, date, or search keyword.
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#FAFAFA' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800, color: '#666' }}>BOOKING ID</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#666' }}>CUSTOMER</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#666' }}>SERVICE</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#666' }}>APPT DATE & TIME</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#666' }}>PRICE</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#666' }}>STATUS</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800, color: '#666' }}>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBookings.map((b) => (
                  <TableRow key={b.id} hover>
                    <TableCell sx={{ fontWeight: 800, color: '#FF6B00' }}>
                      {b.bookingNumber}
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {b.user?.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {b.user?.email} • {b.user?.phone || 'No phone'}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {b.service?.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#888' }}>
                        {b.service?.duration} mins
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {dayjs(b.date).format('MMM D, YYYY')}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#FF6B00', fontWeight: 700 }}>
                        {b.timeSlot}
                      </Typography>
                    </TableCell>

                    <TableCell sx={{ fontWeight: 800 }}>
                      ₹{b.totalAmount}
                    </TableCell>

                    <TableCell>
                      {getStatusChip(b.status)}
                    </TableCell>

                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                        <Tooltip title="View Details">
                          <IconButton size="small" onClick={() => setSelectedBooking(b)}>
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        {b.status === 'PENDING' && (
                          <Tooltip title="Confirm Appointment">
                            <IconButton
                              size="small"
                              onClick={() => handleUpdateStatus(b.id, 'CONFIRMED')}
                              sx={{ color: '#1890FF', bgcolor: '#E6F7FF' }}
                            >
                              <ConfirmIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}

                        {b.status !== 'COMPLETED' && b.status !== 'CANCELLED' && (
                          <Tooltip title="Mark Completed">
                            <IconButton
                              size="small"
                              onClick={() => handleUpdateStatus(b.id, 'COMPLETED')}
                              sx={{ color: '#52C41A', bgcolor: '#F6FFED' }}
                            >
                              <CompleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}

                        {b.status !== 'CANCELLED' && (
                          <Tooltip title="Cancel Booking">
                            <IconButton
                              size="small"
                              onClick={() => handleUpdateStatus(b.id, 'CANCELLED')}
                              sx={{ color: '#FF4D4F', bgcolor: '#FFF1F0' }}
                            >
                              <CancelIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Booking Details Modal Dialog */}
      <Dialog
        open={Boolean(selectedBooking)}
        onClose={() => setSelectedBooking(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, p: 1.5 } }}
      >
        {selectedBooking && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 900 }}>
                  Booking Details #{selectedBooking.bookingNumber}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Booked on {dayjs(selectedBooking.createdAt).format('MMMM D, YYYY h:mm A')}
                </Typography>
              </Box>
              <IconButton onClick={() => setSelectedBooking(null)}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent dividers>
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                    CUSTOMER NAME
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 800 }}>
                    {selectedBooking.user?.name}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                    EMAIL & PHONE
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {selectedBooking.user?.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedBooking.user?.phone || 'No phone provided'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                    SERVICE
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 800, color: '#FF6B00' }}>
                    {selectedBooking.service?.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {selectedBooking.service?.duration} mins • ₹{selectedBooking.totalAmount}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                    APPOINTMENT TIME
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 800 }}>
                    {dayjs(selectedBooking.date).format('dddd, MMM D, YYYY')}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#FF6B00' }}>
                    {selectedBooking.timeSlot}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                    CURRENT STATUS
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    {getStatusChip(selectedBooking.status)}
                  </Box>
                </Grid>

                {selectedBooking.notes && (
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                      CUSTOMER SPECIAL NOTES
                    </Typography>
                    <Box sx={{ p: 1.5, bgcolor: '#FFF8F2', borderRadius: 2, mt: 0.5 }}>
                      <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                        "{selectedBooking.notes}"
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleUpdateStatus(selectedBooking.id, 'CONFIRMED')}
                  disabled={selectedBooking.status === 'CONFIRMED'}
                >
                  Confirm
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="success"
                  onClick={() => handleUpdateStatus(selectedBooking.id, 'COMPLETED')}
                  disabled={selectedBooking.status === 'COMPLETED'}
                >
                  Complete
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => handleUpdateStatus(selectedBooking.id, 'CANCELLED')}
                  disabled={selectedBooking.status === 'CANCELLED'}
                >
                  Cancel
                </Button>
              </Box>

              <Button onClick={() => setSelectedBooking(null)}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default AdminBookings;

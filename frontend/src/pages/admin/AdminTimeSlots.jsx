import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Switch,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  AccessTime as TimeIcon,
  EventBusy as ClosedIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import api from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

const AdminTimeSlots = () => {
  const { showSuccess, showError } = useNotification();
  const [slots, setSlots] = useState([]);
  const [blockedDates, setBlockedDates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Slot Dialog State
  const [slotDialogOpen, setSlotDialogOpen] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [savingSlot, setSavingSlot] = useState(false);

  // Add Blocked Date Dialog State
  const [dateDialogOpen, setDateDialogOpen] = useState(false);
  const [blockDate, setBlockDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [blockReason, setBlockReason] = useState('');
  const [savingDate, setSavingDate] = useState(false);

  useEffect(() => {
    fetchSlotsAndDates();
  }, []);

  const fetchSlotsAndDates = async () => {
    setLoading(true);
    try {
      const [slotsRes, datesRes] = await Promise.all([
        api.get('/timeslots'),
        api.get('/timeslots/blocked-dates'),
      ]);

      if (slotsRes.data.success) {
        setSlots(slotsRes.data.slots);
      }
      if (datesRes.data.success) {
        setBlockedDates(datesRes.data.blockedDates);
      }
    } catch (err) {
      console.error('Error fetching time slots and blocked dates:', err);
      showError('Failed to fetch schedule data.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSlot = async (slot) => {
    try {
      const response = await api.patch(`/timeslots/${slot.id}/toggle`);
      if (response.data.success) {
        showSuccess(response.data.message);
        fetchSlotsAndDates();
      }
    } catch (err) {
      showError(err.message || 'Failed to update time slot status.');
    }
  };

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    setSavingSlot(true);
    try {
      const response = await api.post('/timeslots', { startTime, endTime, isActive: true });
      if (response.data.success) {
        showSuccess('Time slot created successfully!');
        setSlotDialogOpen(false);
        setStartTime('');
        setEndTime('');
        fetchSlotsAndDates();
      }
    } catch (err) {
      showError(err.message || 'Failed to create time slot.');
    } finally {
      setSavingSlot(false);
    }
  };

  const handleDeleteSlot = async (id) => {
    try {
      const response = await api.delete(`/timeslots/${id}`);
      if (response.data.success) {
        showSuccess('Time slot deleted.');
        fetchSlotsAndDates();
      }
    } catch (err) {
      showError(err.message || 'Failed to delete slot.');
    }
  };

  const handleAddBlockedDate = async (e) => {
    e.preventDefault();
    setSavingDate(true);
    try {
      const response = await api.post('/timeslots/blocked-dates', {
        date: blockDate,
        reason: blockReason,
      });
      if (response.data.success) {
        showSuccess('Salon holiday/closed date scheduled!');
        setDateDialogOpen(false);
        setBlockReason('');
        fetchSlotsAndDates();
      }
    } catch (err) {
      showError(err.message || 'Failed to block date.');
    } finally {
      setSavingDate(false);
    }
  };

  const handleRemoveBlockedDate = async (id) => {
    try {
      const response = await api.delete(`/timeslots/blocked-dates/${id}`);
      if (response.data.success) {
        showSuccess('Date unblocked.');
        fetchSlotsAndDates();
      }
    } catch (err) {
      showError(err.message || 'Failed to unblock date.');
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#1A1A1A' }}>
            Time Slots & Working Schedule
          </Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>
            Manage daily appointment intervals, enabled hours, and scheduled holidays.
          </Typography>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress sx={{ color: '#FF6B00' }} />
        </Box>
      ) : (
        <Grid container spacing={4}>
          {/* Daily Operating Time Slots */}
          <Grid item xs={12} lg={7}>
            <Paper
              elevation={0}
              sx={{
                p: 3.5,
                borderRadius: 4,
                bgcolor: '#FFFFFF',
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#1A1A1A' }}>
                    Daily Booking Slots
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Toggle slots to make them available or unavailable for clients.
                  </Typography>
                </Box>
                <Button
                  size="small"
                  variant="outlined"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => setSlotDialogOpen(true)}
                  sx={{ borderRadius: 2, fontWeight: 700 }}
                >
                  Add Slot
                </Button>
              </Box>

              <Grid container spacing={2}>
                {slots.map((slot) => (
                  <Grid item xs={12} sm={6} key={slot.id}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        bgcolor: slot.isActive ? '#FFF6ED' : '#F9F9F9',
                        border: slot.isActive ? '1px solid #FF8E53' : '1px solid rgba(0,0,0,0.08)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: slot.isActive ? '#1A1A1A' : '#888' }}>
                          {slot.startTime} – {slot.endTime}
                        </Typography>
                        <Chip
                          label={slot.isActive ? 'ACTIVE' : 'DISABLED'}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            bgcolor: slot.isActive ? '#52C41A' : '#CCC',
                            color: '#FFF',
                            mt: 0.5,
                          }}
                        />
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Switch
                          size="small"
                          checked={slot.isActive}
                          onChange={() => handleToggleSlot(slot)}
                          color="primary"
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteSlot(slot.id)}
                          sx={{ color: '#FF4D4F' }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>

          {/* Blocked Dates / Salon Holidays */}
          <Grid item xs={12} lg={5}>
            <Paper
              elevation={0}
              sx={{
                p: 3.5,
                borderRadius: 4,
                bgcolor: '#FFFFFF',
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#1A1A1A' }}>
                    Salon Closed Dates / Holidays
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Dates where no bookings can be made.
                  </Typography>
                </Box>
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => setDateDialogOpen(true)}
                  sx={{ borderRadius: 2, fontWeight: 700 }}
                >
                  Block Date
                </Button>
              </Box>

              {blockedDates.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <ClosedIcon sx={{ fontSize: 40, color: '#CCC', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    No blocked dates or holidays scheduled. Salon is open all standard days.
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead sx={{ bgcolor: '#FAFAFA' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 800 }}>DATE</TableCell>
                        <TableCell sx={{ fontWeight: 800 }}>REASON</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 800 }}>ACTION</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {blockedDates.map((bDate) => (
                        <TableRow key={bDate.id} hover>
                          <TableCell sx={{ fontWeight: 700, color: '#FF4D4F' }}>
                            {dayjs(bDate.date).format('MMM D, YYYY')}
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {bDate.reason || 'Salon Maintenance'}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={() => handleRemoveBlockedDate(bDate.id)}
                              sx={{ color: '#FF4D4F' }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Add Slot Dialog */}
      <Dialog
        open={slotDialogOpen}
        onClose={() => setSlotDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>Add Time Slot</Typography>
          <IconButton onClick={() => setSlotDialogOpen(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <form onSubmit={handleCreateSlot}>
          <DialogContent dividers>
            <TextField
              fullWidth
              label="Start Time"
              placeholder="e.g. 08:00 PM"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="End Time"
              placeholder="e.g. 08:30 PM"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setSlotDialogOpen(false)}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={savingSlot}
              sx={{ borderRadius: 2, fontWeight: 700 }}
            >
              {savingSlot ? 'Adding...' : 'Add Slot'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Add Blocked Date Dialog */}
      <Dialog
        open={dateDialogOpen}
        onClose={() => setDateDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>Block Salon Date</Typography>
          <IconButton onClick={() => setDateDialogOpen(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <form onSubmit={handleAddBlockedDate}>
          <DialogContent dividers>
            <TextField
              fullWidth
              type="date"
              label="Date to Block"
              InputLabelProps={{ shrink: true }}
              value={blockDate}
              onChange={(e) => setBlockDate(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Reason (Optional)"
              placeholder="e.g. National Holiday / Annual Maintenance"
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setDateDialogOpen(false)}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              color="error"
              disabled={savingDate}
              sx={{ borderRadius: 2, fontWeight: 700 }}
            >
              {savingDate ? 'Blocking...' : 'Block Date'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default AdminTimeSlots;

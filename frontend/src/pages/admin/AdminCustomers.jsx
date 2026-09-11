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
  Avatar,
  Chip,
  Switch,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Divider,
  CircularProgress,
  Stack,
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  People as CustomersIcon,
  Close as CloseIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  CalendarMonth as CalendarIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import api from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

const AdminCustomers = () => {
  const { showSuccess, showError } = useNotification();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Customer Details Modal
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/customers');
      if (response.data.success) {
        setCustomers(response.data.customers);
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
      showError('Failed to fetch customer directory.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCustomer = async (customer) => {
    try {
      const response = await api.patch(`/admin/customers/${customer.id}/toggle`);
      if (response.data.success) {
        showSuccess(response.data.message);
        fetchCustomers();
      }
    } catch (err) {
      showError(err.message || 'Failed to update customer status.');
    }
  };

  const handleViewCustomer = async (customerId) => {
    setSelectedCustomerId(customerId);
    setLoadingDetails(true);
    try {
      const response = await api.get(`/admin/customers/${customerId}`);
      if (response.data.success) {
        setCustomerDetails(response.data.customer);
      }
    } catch (err) {
      showError('Failed to fetch customer history.');
    } finally {
      setLoadingDetails(false);
    }
  };

  const filteredCustomers = customers.filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.toLowerCase().includes(q)
    );
  });

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#1A1A1A' }}>
            Customer Directory
          </Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>
            Manage registered clients, review total spending, and inspect booking history.
          </Typography>
        </Box>

        <TextField
          size="small"
          placeholder="Search customer name, email, phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#FF6B00', fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
          sx={{ width: { xs: '100%', sm: 300 } }}
        />
      </Box>

      {/* Customers Table */}
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
        ) : filteredCustomers.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <CustomersIcon sx={{ fontSize: 48, color: '#CCC', mb: 1.5 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              No customers found
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#FAFAFA' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800, color: '#666' }}>CUSTOMER</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#666' }}>PHONE</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#666' }}>JOINED DATE</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#666' }}>TOTAL BOOKINGS</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#666' }}>TOTAL SPENT</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#666' }}>STATUS</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800, color: '#666' }}>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCustomers.map((c) => (
                  <TableRow key={c.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar src={c.avatar} sx={{ bgcolor: '#FF6B00', width: 40, height: 40 }}>
                          {c.name?.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                            {c.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {c.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell sx={{ fontWeight: 600 }}>
                      {c.phone || <span style={{ color: '#AAA' }}>N/A</span>}
                    </TableCell>

                    <TableCell sx={{ color: '#666' }}>
                      {dayjs(c.createdAt).format('MMM D, YYYY')}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={`${c.totalBookings} visits`}
                        size="small"
                        sx={{ bgcolor: '#FFF1E6', color: '#FF6B00', fontWeight: 700 }}
                      />
                    </TableCell>

                    <TableCell sx={{ fontWeight: 800, color: '#1A1A1A' }}>
                      ₹{c.totalSpent}
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Switch
                          size="small"
                          checked={c.isActive}
                          onChange={() => handleToggleCustomer(c)}
                          color="primary"
                        />
                        <Typography variant="caption" sx={{ fontWeight: 700, color: c.isActive ? '#52C41A' : '#FF4D4F' }}>
                          {c.isActive ? 'Active' : 'Disabled'}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell align="right">
                      <Tooltip title="View Profile & Booking History">
                        <IconButton size="small" onClick={() => handleViewCustomer(c.id)}>
                          <ViewIcon fontSize="small" sx={{ color: '#1890FF' }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Customer Profile & History Modal Dialog */}
      <Dialog
        open={Boolean(selectedCustomerId)}
        onClose={() => {
          setSelectedCustomerId(null);
          setCustomerDetails(null);
        }}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, p: 1.5 } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            Customer Profile & Appointment History
          </Typography>
          <IconButton onClick={() => { setSelectedCustomerId(null); setCustomerDetails(null); }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {loadingDetails || !customerDetails ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress sx={{ color: '#FF6B00' }} />
            </Box>
          ) : (
            <Box>
              {/* Customer summary card */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 3, p: 2.5, bgcolor: '#FFF8F2', borderRadius: 3 }}>
                <Avatar
                  src={customerDetails.avatar}
                  sx={{ width: 64, height: 64, bgcolor: '#FF6B00', border: '2px solid #FF8E53' }}
                >
                  {customerDetails.name?.charAt(0)}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>
                    {customerDetails.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {customerDetails.email} • {customerDetails.phone || 'No phone'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#888' }}>
                    Member since {dayjs(customerDetails.createdAt).format('MMMM D, YYYY')}
                  </Typography>
                </Box>
              </Box>

              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2 }}>
                Past & Upcoming Appointments ({customerDetails.bookings?.length || 0})
              </Typography>

              {customerDetails.bookings?.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                  No appointments booked by this customer yet.
                </Typography>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead sx={{ bgcolor: '#FAFAFA' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 800 }}>REF #</TableCell>
                        <TableCell sx={{ fontWeight: 800 }}>SERVICE</TableCell>
                        <TableCell sx={{ fontWeight: 800 }}>DATE & TIME</TableCell>
                        <TableCell sx={{ fontWeight: 800 }}>PRICE</TableCell>
                        <TableCell sx={{ fontWeight: 800 }}>STATUS</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {customerDetails.bookings.map((b) => (
                        <TableRow key={b.id}>
                          <TableCell sx={{ fontWeight: 700, color: '#FF6B00' }}>{b.bookingNumber}</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>{b.service?.name}</TableCell>
                          <TableCell>{dayjs(b.date).format('MMM D, YYYY')} @ {b.timeSlot}</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>₹{b.totalAmount}</TableCell>
                          <TableCell>
                            <Chip
                              label={b.status}
                              size="small"
                              sx={{
                                fontWeight: 800,
                                fontSize: '0.65rem',
                                bgcolor:
                                  b.status === 'CONFIRMED'
                                    ? '#E6F7FF'
                                    : b.status === 'COMPLETED'
                                    ? '#F6FFED'
                                    : b.status === 'CANCELLED'
                                    ? '#FFF1F0'
                                    : '#FFFBE6',
                                color:
                                  b.status === 'CONFIRMED'
                                    ? '#1890FF'
                                    : b.status === 'COMPLETED'
                                    ? '#52C41A'
                                    : b.status === 'CANCELLED'
                                    ? '#FF4D4F'
                                    : '#FAAD14',
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => { setSelectedCustomerId(null); setCustomerDetails(null); }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminCustomers;

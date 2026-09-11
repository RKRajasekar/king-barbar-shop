import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Divider,
  LinearProgress,
  IconButton,
  Tooltip,
  Stack,
} from '@mui/material';
import {
  AttachMoney as RevenueIcon,
  People as CustomersIcon,
  CalendarToday as TodayIcon,
  EventAvailable as UpcomingIcon,
  CheckCircle as CompletedIcon,
  Cancel as CancelledIcon,
  ContentCut as ServicesIcon,
  ArrowForward as ArrowForwardIcon,
  Check as CheckActionIcon,
  Close as CloseActionIcon,
  WorkspacePremium as CrownIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import dayjs from 'dayjs';
import api from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

const AdminDashboard = () => {
  const { showSuccess, showError } = useNotification();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/dashboard');
      if (response.data.success) {
        setData(response.data);
      }
    } catch (err) {
      console.error('Error fetching admin dashboard data:', err);
      showError('Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      const response = await api.patch(`/admin/bookings/${bookingId}/status`, { status: newStatus });
      if (response.data.success) {
        showSuccess(`Booking updated to ${newStatus}`);
        fetchDashboardData();
      }
    } catch (err) {
      showError(err.message || 'Failed to update booking status.');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: '#FF6B00' }} />
      </Box>
    );
  }

  const stats = data?.stats || {};
  const recentBookings = data?.recentBookings || [];
  const popularServices = data?.popularServices || [];

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue?.toLocaleString() || 0}`,
      desc: 'All completed appointments',
      icon: <RevenueIcon />,
      color: '#FF6B00',
      bgcolor: '#FFF6ED',
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers || 0,
      desc: 'Registered gentlemen',
      icon: <CustomersIcon />,
      color: '#1890FF',
      bgcolor: '#E6F7FF',
    },
    {
      title: "Today's Bookings",
      value: stats.todayBookings || 0,
      desc: 'Scheduled for today',
      icon: <TodayIcon />,
      color: '#722ED1',
      bgcolor: '#F9F0FF',
    },
    {
      title: 'Upcoming Bookings',
      value: stats.upcomingBookings || 0,
      desc: 'Pending & Confirmed',
      icon: <UpcomingIcon />,
      color: '#FA8C16',
      bgcolor: '#FFF7E6',
    },
    {
      title: 'Completed',
      value: stats.completedBookings || 0,
      desc: 'Successfully served',
      icon: <CompletedIcon />,
      color: '#52C41A',
      bgcolor: '#F6FFED',
    },
    {
      title: 'Cancelled',
      value: stats.cancelledBookings || 0,
      desc: 'Total cancellations',
      icon: <CancelledIcon />,
      color: '#FF4D4F',
      bgcolor: '#FFF1F0',
    },
    {
      title: 'Active Services',
      value: stats.activeServices || 0,
      desc: `${stats.totalServices || 0} total in catalog`,
      icon: <ServicesIcon />,
      color: '#13C2C2',
      bgcolor: '#E6FFFB',
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#1A1A1A' }}>
            Executive Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>
            Welcome back, Admin. Real-time overview of salon operations & revenue.
          </Typography>
        </Box>

        <Button
          component={RouterLink}
          to="/admin/bookings"
          variant="contained"
          color="primary"
          endIcon={<ArrowForwardIcon />}
          sx={{ borderRadius: 2.5, fontWeight: 700 }}
        >
          Manage All Bookings
        </Button>
      </Box>

      {/* KPI Stat Cards Grid */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {statCards.map((card, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3.5,
                bgcolor: '#FFFFFF',
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-2px)' },
              }}
            >
              <Avatar
                sx={{
                  bgcolor: card.bgcolor,
                  color: card.color,
                  width: 52,
                  height: 52,
                  borderRadius: 3,
                }}
              >
                {card.icon}
              </Avatar>
              <Box>
                <Typography variant="caption" sx={{ color: '#888', fontWeight: 700, display: 'block' }}>
                  {card.title.toUpperCase()}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 900, color: '#1A1A1A', my: 0.2 }}>
                  {card.value}
                </Typography>
                <Typography variant="caption" sx={{ color: '#999', fontSize: '0.7rem' }}>
                  {card.desc}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Bookings Table */}
        <Grid item xs={12} lg={8}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              bgcolor: '#FFFFFF',
              border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#1A1A1A' }}>
                Recent Appointments
              </Typography>
              <Button
                component={RouterLink}
                to="/admin/bookings"
                size="small"
                endIcon={<ArrowForwardIcon />}
                sx={{ color: '#FF6B00', fontWeight: 700 }}
              >
                View All
              </Button>
            </Box>

            {recentBookings.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                No recent appointments found.
              </Typography>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 800, color: '#666' }}>BOOKING ID</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#666' }}>CUSTOMER</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#666' }}>SERVICE</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#666' }}>DATE & TIME</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#666' }}>STATUS</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 800, color: '#666' }}>ACTION</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentBookings.map((b) => (
                      <TableRow key={b.id} hover>
                        <TableCell sx={{ fontWeight: 700, color: '#FF6B00' }}>
                          {b.bookingNumber}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {b.user?.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {b.user?.email}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {b.service?.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#FF6B00', fontWeight: 700 }}>
                            ₹{b.totalAmount}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {dayjs(b.date).format('MMM D, YYYY')}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#555' }}>
                            {b.timeSlot}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={b.status}
                            size="small"
                            sx={{
                              fontWeight: 800,
                              fontSize: '0.7rem',
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
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                            {b.status !== 'COMPLETED' && b.status !== 'CANCELLED' && (
                              <Tooltip title="Mark as Completed">
                                <IconButton
                                  size="small"
                                  onClick={() => handleUpdateStatus(b.id, 'COMPLETED')}
                                  sx={{ color: '#52C41A', bgcolor: '#F6FFED' }}
                                >
                                  <CheckActionIcon fontSize="small" />
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
                                  <CloseActionIcon fontSize="small" />
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
        </Grid>

        {/* Popular Services & Quick Actions */}
        <Grid item xs={12} lg={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              bgcolor: '#FFFFFF',
              border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              mb: 3,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#1A1A1A', mb: 2 }}>
              Most Popular Services
            </Typography>

            {popularServices.map((service, idx) => {
              const bookingCount = service._count?.bookings || 0;
              const maxCount = popularServices[0]?._count?.bookings || 1;
              const percentage = Math.round((bookingCount / (maxCount || 1)) * 100);

              return (
                <Box key={service.id} sx={{ mb: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {service.name}
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#FF6B00' }}>
                      {bookingCount} bookings
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={percentage}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: '#FFF1E6',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: '#FF6B00',
                        borderRadius: 4,
                      },
                    }}
                  />
                </Box>
              );
            })}
          </Paper>

          {/* Quick Shortcuts */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              bgcolor: '#1A1A1A',
              color: '#FFFFFF',
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1.5 }}>
              Quick Management
            </Typography>
            <Stack spacing={1.5}>
              <Button
                component={RouterLink}
                to="/admin/services"
                variant="contained"
                color="primary"
                fullWidth
                startIcon={<ServicesIcon />}
                sx={{ borderRadius: 2, fontWeight: 700 }}
              >
                Add New Barber Service
              </Button>
              <Button
                component={RouterLink}
                to="/admin/time-slots"
                variant="outlined"
                fullWidth
                sx={{
                  borderRadius: 2,
                  borderColor: 'rgba(255,255,255,0.2)',
                  color: '#FFF',
                  fontWeight: 600,
                  '&:hover': { borderColor: '#FF6B00', color: '#FF6B00' },
                }}
              >
                Configure Working Hours
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;

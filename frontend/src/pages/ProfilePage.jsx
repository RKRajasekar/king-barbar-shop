import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Avatar,
  TextField,
  Button,
  Divider,
  Stack,
  Chip,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  WorkspacePremium as CrownIcon,
  Save as SaveIcon,
  CalendarMonth as CalendarIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import api from '../services/api';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { showSuccess, showError } = useNotification();

  // Profile Form State
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [savingProfile, setSavingProfile] = useState(false);

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [changingPass, setChangingPass] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const response = await api.put('/auth/profile', { name, phone });
      if (response.data.success) {
        updateUser(response.data.user);
        showSuccess('Profile updated successfully!');
      }
    } catch (err) {
      showError(err.message || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showError('New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      showError('New password must be at least 6 characters.');
      return;
    }

    setChangingPass(true);
    try {
      const response = await api.put('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      if (response.data.success) {
        showSuccess('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      showError(err.message || 'Failed to change password.');
    } finally {
      setChangingPass(false);
    }
  };

  return (
    <Box sx={{ bgcolor: '#FFF8F2', minHeight: '90vh', py: { xs: 5, md: 8 } }}>
      <Container maxWidth="md">
        {/* Profile Card Header */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            bgcolor: '#FFFFFF',
            border: '1px solid rgba(255, 107, 0, 0.15)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.03)',
            mb: 4,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 3 }}>
            <Avatar
              src={user?.avatar}
              sx={{
                width: 90,
                height: 90,
                bgcolor: '#FF6B00',
                fontSize: '2rem',
                border: '3px solid #FF8E53',
                boxShadow: '0 6px 18px rgba(255, 107, 0, 0.3)',
              }}
            >
              {user?.name?.charAt(0)}
            </Avatar>

            <Box sx={{ textAlign: { xs: 'center', sm: 'left' }, flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: { xs: 'center', sm: 'flex-start' }, mb: 0.5 }}>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#1A1A1A' }}>
                  {user?.name}
                </Typography>
                <Chip
                  label={user?.role === 'ADMIN' ? '👑 Admin' : 'Gentleman Member'}
                  size="small"
                  sx={{
                    bgcolor: user?.role === 'ADMIN' ? '#1A1A1A' : '#FFF1E6',
                    color: user?.role === 'ADMIN' ? '#FFF' : '#FF6B00',
                    fontWeight: 800,
                  }}
                />
              </Box>

              <Typography variant="body2" sx={{ color: '#666', mb: 1.5 }}>
                {user?.email}
              </Typography>

              {/* Stats badges */}
              <Stack direction="row" spacing={3} sx={{ justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#888', fontWeight: 600 }}>
                    TOTAL BOOKINGS
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#FF6B00' }}>
                    {user?.totalBookings || 0}
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box>
                  <Typography variant="caption" sx={{ color: '#888', fontWeight: 600 }}>
                    UPCOMING
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#52C41A' }}>
                    {user?.upcomingBookings || 0}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Paper>

        <Grid container spacing={4}>
          {/* Edit Profile Form */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3.5,
                borderRadius: 4,
                bgcolor: '#FFFFFF',
                border: '1px solid rgba(255, 107, 0, 0.12)',
                height: '100%',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#1A1A1A', mb: 3 }}>
                Personal Information
              </Typography>

              <form onSubmit={handleUpdateProfile}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: '#FF6B00' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2.5 }}
                />

                <TextField
                  fullWidth
                  label="Email Address"
                  value={user?.email}
                  disabled
                  helperText="Email address cannot be changed."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: '#999' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2.5 }}
                />

                <TextField
                  fullWidth
                  label="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon sx={{ color: '#FF6B00' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 3 }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={savingProfile}
                  startIcon={savingProfile ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
                  sx={{ py: 1.3, borderRadius: 2.5, fontWeight: 700 }}
                >
                  {savingProfile ? 'Saving...' : 'Save Profile Changes'}
                </Button>
              </form>
            </Paper>
          </Grid>

          {/* Change Password Form */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3.5,
                borderRadius: 4,
                bgcolor: '#FFFFFF',
                border: '1px solid rgba(255, 107, 0, 0.12)',
                height: '100%',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#1A1A1A', mb: 3 }}>
                Change Password
              </Typography>

              <form onSubmit={handleChangePassword}>
                <TextField
                  fullWidth
                  label="Current Password"
                  type={showCurrentPass ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: '#FF6B00' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowCurrentPass(!showCurrentPass)} edge="end">
                          {showCurrentPass ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2.5 }}
                />

                <TextField
                  fullWidth
                  label="New Password"
                  type={showNewPass ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: '#FF6B00' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowNewPass(!showNewPass)} edge="end">
                          {showNewPass ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2.5 }}
                />

                <TextField
                  fullWidth
                  label="Confirm New Password"
                  type={showNewPass ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  sx={{ mb: 3 }}
                />

                <Button
                  type="submit"
                  variant="outlined"
                  color="primary"
                  fullWidth
                  disabled={changingPass}
                  startIcon={changingPass ? <CircularProgress size={18} color="inherit" /> : <LockIcon />}
                  sx={{ py: 1.3, borderRadius: 2.5, fontWeight: 700 }}
                >
                  {changingPass ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProfilePage;

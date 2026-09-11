import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  Stack,
  Chip,
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  WorkspacePremium as CrownIcon,
  Login as LoginIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const LoginPage = () => {
  const { login } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const getRedirectDestination = () => {
    const fromState = location.state?.from;
    if (!fromState) return '/';
    if (typeof fromState === 'string') return fromState;
    if (fromState.pathname) {
      return `${fromState.pathname}${fromState.search || ''}${fromState.hash || ''}`;
    }
    return '/';
  };

  const from = getRedirectDestination();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const loggedInUser = await login(email, password);
      showSuccess(`Welcome back, ${loggedInUser.name}!`);

      if (loggedInUser.role === 'ADMIN') {
        navigate(from === '/' ? '/admin' : from, { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setErrorMessage(err.message || 'Invalid email or password.');
      showError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <Box
      sx={{
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#FFF8F2',
        py: { xs: 6, md: 10 },
        position: 'relative',
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3.5, md: 4.5 },
            borderRadius: 4,
            bgcolor: '#FFFFFF',
            border: '1px solid rgba(255, 107, 0, 0.15)',
            boxShadow: '0 16px 48px rgba(255, 107, 0, 0.08)',
          }}
        >
          {/* Brand Logo Header */}
          <Box sx={{ textAlign: 'center', mb: 3.5 }}>
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #FF6B00 0%, #FF9040 100%)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFF',
                mb: 1.5,
                boxShadow: '0 6px 18px rgba(255, 107, 0, 0.35)',
              }}
            >
              <CrownIcon sx={{ fontSize: 30 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#1A1A1A' }}>
              Welcome Back
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Sign in to manage your appointments & profile
            </Typography>
          </Box>

          {errorMessage && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2.5 }}>
              {errorMessage}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: '#FF6B00' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2.5 }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: '#FF6B00' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
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
              size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
              sx={{
                py: 1.5,
                borderRadius: 2.5,
                fontWeight: 800,
                fontSize: '1rem',
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>


          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Don't have an account yet?{' '}
              <RouterLink
                to="/register"
                state={{ from }}
                style={{ color: '#FF6B00', fontWeight: 800, textDecoration: 'none' }}
              >
                Register here
              </RouterLink>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;

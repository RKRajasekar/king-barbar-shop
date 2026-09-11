import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  IconButton,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Lock as LockIcon,
  Close as CloseIcon,
  Login as LoginIcon,
  AppRegistration as RegisterIcon,
  WorkspacePremium as CrownIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const LoginRequiredDialog = ({ open, onClose, redirectUrl = '/book' }) => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    onClose();
    navigate('/login', { state: { from: redirectUrl } });
  };

  const handleRegisterClick = () => {
    onClose();
    navigate('/register', { state: { from: redirectUrl } });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          bgcolor: '#FFFFFF',
          border: '1px solid rgba(255, 107, 0, 0.2)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.18)',
          overflow: 'hidden',
          p: { xs: 1, sm: 1.5 },
        },
      }}
    >
      {/* Top Banner Accent with Crown */}
      <Box
        sx={{
          bgcolor: '#FFF8F2',
          p: 2.5,
          pb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 107, 0, 0.12)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            sx={{
              width: 44,
              height: 44,
              background: 'linear-gradient(135deg, #FF6B00 0%, #FF9040 100%)',
              color: '#FFFFFF',
              boxShadow: '0 4px 14px rgba(255, 107, 0, 0.4)',
            }}
          >
            <CrownIcon sx={{ fontSize: 24 }} />
          </Avatar>
          <Box>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 900,
                color: '#1A1A1A',
                letterSpacing: '0.02em',
                lineHeight: 1.1,
              }}
            >
              KING BARBAR SHOP
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: '#FF6B00',
                fontWeight: 700,
                letterSpacing: '0.1em',
                fontSize: '0.65rem',
              }}
            >
              LUXURY SALON & SPA
            </Typography>
          </Box>
        </Box>

        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: '#777',
            '&:hover': { color: '#1A1A1A', bgcolor: 'rgba(0,0,0,0.05)' },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Main Content */}
      <DialogContent sx={{ textAlign: 'center', pt: 3.5, pb: 2, px: { xs: 2.5, sm: 3.5 } }}>
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            bgcolor: 'rgba(255, 107, 0, 0.12)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
            border: '2px solid rgba(255, 107, 0, 0.25)',
          }}
        >
          <LockIcon sx={{ fontSize: 32, color: '#FF6B00' }} />
        </Box>

        <Typography
          variant="h5"
          component="h2"
          sx={{
            fontWeight: 900,
            color: '#1A1A1A',
            mb: 1.5,
            fontSize: { xs: '1.25rem', sm: '1.45rem' },
          }}
        >
          Login Required
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: '#4A4A4A',
            lineHeight: 1.6,
            fontWeight: 500,
            mb: 1,
          }}
        >
          Please login first to book an appointment at <strong>KING BARBAR SHOP</strong>.
        </Typography>

        <Typography
          variant="caption"
          sx={{
            color: '#888',
            display: 'block',
            lineHeight: 1.5,
          }}
        >
          An active customer account is required to reserve your master barber chair and manage your appointment schedule.
        </Typography>
      </DialogContent>

      <Divider sx={{ mx: 2, borderColor: 'rgba(0,0,0,0.06)' }} />

      {/* Action Buttons: Register & Login */}
      <DialogActions sx={{ p: { xs: 2, sm: 2.5 }, gap: 1.5, display: 'flex' }}>
        <Button
          onClick={handleRegisterClick}
          variant="outlined"
          fullWidth
          size="large"
          startIcon={<RegisterIcon />}
          sx={{
            py: 1.3,
            borderRadius: 2.5,
            fontWeight: 700,
            borderColor: '#1A1A1A',
            color: '#1A1A1A',
            borderWidth: 1.5,
            '&:hover': {
              borderWidth: 1.5,
              borderColor: '#FF6B00',
              color: '#FF6B00',
              bgcolor: 'rgba(255, 107, 0, 0.04)',
            },
          }}
        >
          Register
        </Button>

        <Button
          onClick={handleLoginClick}
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          startIcon={<LoginIcon />}
          sx={{
            py: 1.3,
            borderRadius: 2.5,
            fontWeight: 800,
            boxShadow: '0 6px 20px rgba(255, 107, 0, 0.35)',
            '&:hover': {
              bgcolor: '#E65D00',
            },
          }}
        >
          Login
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoginRequiredDialog;

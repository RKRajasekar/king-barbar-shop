import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#FF6B00',
      light: '#FF8E53',
      dark: '#D95500',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#1A1A1A',
      light: '#333333',
      dark: '#000000',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FFF8F2',
      paper: '#FFFFFF',
      subtle: '#FFF1E6',
      dark: '#121212',
    },
    text: {
      primary: '#1A1A1A',
      secondary: '#666666',
      muted: '#8C8C8C',
    },
    status: {
      pending: '#FAAD14',
      confirmed: '#52C41A',
      completed: '#1890FF',
      cancelled: '#FF4D4F',
    },
    orangeGradient: 'linear-gradient(135deg, #FF6B00 0%, #FF9040 100%)',
    goldGradient: 'linear-gradient(135deg, #FFA000 0%, #FFD54F 100%)',
    darkGradient: 'linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%)',
  },
  typography: {
    fontFamily: '"Outfit", "Plus Jakarta Sans", "Segoe UI", sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 22px',
          boxShadow: 'none',
          transition: 'all 0.25s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(255, 107, 0, 0.25)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #FF6B00 0%, #FF8533 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #E65100 0%, #FF6B00 100%)',
          },
        },
        containedSecondary: {
          background: '#1A1A1A',
          color: '#FFFFFF',
          '&:hover': {
            background: '#333333',
          },
        },
        outlinedPrimary: {
          borderColor: '#FF6B00',
          borderWidth: 1.5,
          '&:hover': {
            borderWidth: 1.5,
            backgroundColor: 'rgba(255, 107, 0, 0.08)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(255, 107, 0, 0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 16,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            '&:hover fieldset': {
              borderColor: '#FF8E53',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#FF6B00',
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        },
      },
    },
  },
});

export default theme;

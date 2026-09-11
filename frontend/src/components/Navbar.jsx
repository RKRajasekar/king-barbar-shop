import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Container,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  ContentCut as BarberIcon,
  EventNote as BookingsIcon,
  Person as PersonIcon,
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
  Login as LoginIcon,
  AppRegistration as RegisterIcon,
  WorkspacePremium as CrownIcon,
  People as CustomersIcon,
  AccessTime as TimeIcon,
  Info as InfoIcon,
  Phone as ContactIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout, promptLogin } = useAuth();
  const { showSuccess } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleOpenUserMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorEl(null);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogout = () => {
    handleCloseUserMenu();
    logout();
    showSuccess('Logged out successfully.');
    navigate('/');
  };

  const handleSectionScroll = (sectionId) => {
    if (mobileOpen) setMobileOpen(false);
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`/#${sectionId}`);
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  // 1. Guest Nav Items
  const guestNavItems = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'Hairstyles', path: '/hairstyles' },
    { label: 'About', sectionId: 'about' },
    { label: 'Contact', sectionId: 'contact' },
  ];

  // 2. Logged-in Customer Nav Items
  const customerNavItems = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'Hairstyles', path: '/hairstyles' },
    { label: 'About', sectionId: 'about' },
    { label: 'Contact', sectionId: 'contact' },
    { label: 'My Bookings', path: '/my-bookings' },
  ];

  // 3. Admin Nav Items
  const adminNavItems = [
    { label: 'Admin Dashboard', path: '/admin', icon: <DashboardIcon sx={{ fontSize: 18, mr: 0.5 }} /> },
    { label: 'Bookings', path: '/admin/bookings', icon: <BookingsIcon sx={{ fontSize: 18, mr: 0.5 }} /> },
    { label: 'Services', path: '/admin/services', icon: <BarberIcon sx={{ fontSize: 18, mr: 0.5 }} /> },
    { label: 'Customers', path: '/admin/customers', icon: <CustomersIcon sx={{ fontSize: 18, mr: 0.5 }} /> },
    { label: 'Time Slots', path: '/admin/time-slots', icon: <TimeIcon sx={{ fontSize: 18, mr: 0.5 }} /> },
  ];

  const currentNavItems = isAdmin ? adminNavItems : isAuthenticated ? customerNavItems : guestNavItems;

  const isActive = (item) => {
    if (item.sectionId) return false;
    if (item.path === '/') return location.pathname === '/';
    return location.pathname.startsWith(item.path);
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 107, 0, 0.15)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
        color: '#1A1A1A',
        zIndex: 1100,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: { xs: 70, md: 80 } }}>
          {/* Logo & Brand */}
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit',
              mr: { xs: 2, md: 3 },
            }}
          >
            <Box
              sx={{
                width: { xs: 38, md: 44 },
                height: { xs: 38, md: 44 },
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #FF6B00 0%, #FF9040 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFF',
                mr: 1.5,
                boxShadow: '0 4px 14px rgba(255, 107, 0, 0.35)',
              }}
            >
              <CrownIcon sx={{ fontSize: { xs: 22, md: 26 } }} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '1.05rem', md: '1.25rem' },
                  letterSpacing: '0.04em',
                  lineHeight: 1.1,
                  background: 'linear-gradient(135deg, #1A1A1A 30%, #FF6B00 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                KING BARBAR
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  letterSpacing: '0.22em',
                  color: '#FF6B00',
                  fontSize: '0.62rem',
                  display: 'block',
                }}
              >
                {isAdmin ? 'ADMIN CONTROL' : 'LUXURY SALON'}
              </Typography>
            </Box>
          </Box>

          {/* Desktop Navigation Links */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexGrow: 1, ml: 1 }}>
              {currentNavItems.map((item) => {
                const active = isActive(item);
                if (item.sectionId) {
                  return (
                    <Button
                      key={item.label}
                      onClick={() => handleSectionScroll(item.sectionId)}
                      sx={{
                        color: '#333333',
                        fontWeight: 600,
                        fontSize: '0.92rem',
                        px: 1.8,
                        py: 0.8,
                        borderRadius: 2,
                        '&:hover': {
                          backgroundColor: 'rgba(255, 107, 0, 0.08)',
                          color: '#FF6B00',
                        },
                      }}
                    >
                      {item.label}
                    </Button>
                  );
                }

                return (
                  <Button
                    key={item.label}
                    component={RouterLink}
                    to={item.path}
                    sx={{
                      color: active ? '#FF6B00' : '#333333',
                      fontWeight: active ? 700 : 600,
                      fontSize: '0.92rem',
                      px: 1.8,
                      py: 0.8,
                      borderRadius: 2,
                      backgroundColor: active ? 'rgba(255, 107, 0, 0.08)' : 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 107, 0, 0.08)',
                        color: '#FF6B00',
                      },
                    }}
                  >
                    {item.icon}
                    {item.label}
                  </Button>
                );
              })}
            </Box>
          )}

          <Box sx={{ flexGrow: isMobile ? 1 : 0 }} />

          {/* Right Actions / Auth buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {isAuthenticated ? (
              <>
                {/* User Avatar + Name (Dropdown trigger) */}
                <Box
                  onClick={handleOpenUserMenu}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.2,
                    cursor: 'pointer',
                    p: '4px 10px',
                    borderRadius: 3,
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 107, 0, 0.08)',
                    },
                  }}
                >
                  <Avatar
                    src={user?.avatar}
                    alt={user?.name}
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: '#FF6B00',
                      border: '2px solid #FF8E53',
                      fontWeight: 800,
                      fontSize: '1rem',
                    }}
                  >
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </Avatar>
                  {!isMobile && (
                    <Box sx={{ textAlign: 'left' }}>
                      <Typography variant="body2" sx={{ fontWeight: 800, lineHeight: 1.2, color: '#1A1A1A' }}>
                        {user?.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#FF6B00', fontWeight: 700 }}>
                        {user?.role === 'ADMIN' ? '👑 Administrator' : 'Gentleman Client'}
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Direct Logout Button on Desktop */}
                {!isMobile && (
                  <Button
                    onClick={handleLogout}
                    variant="outlined"
                    size="small"
                    startIcon={<LogoutIcon sx={{ fontSize: 18 }} />}
                    sx={{
                      borderRadius: 2,
                      borderColor: 'rgba(0,0,0,0.15)',
                      color: '#d32f2f',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      px: 1.8,
                      py: 0.6,
                      '&:hover': {
                        borderColor: '#d32f2f',
                        bgcolor: 'rgba(211, 47, 47, 0.04)',
                      },
                    }}
                  >
                    Logout
                  </Button>
                )}

                {/* User Dropdown Menu */}
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleCloseUserMenu}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      minWidth: 240,
                      borderRadius: 3,
                      boxShadow: '0 12px 36px rgba(0,0,0,0.12)',
                      p: 1,
                      border: '1px solid rgba(255, 107, 0, 0.15)',
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      {user?.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      {user?.email}
                    </Typography>
                    <Chip
                      size="small"
                      label={user?.role === 'ADMIN' ? 'Admin Access' : 'Loyal Customer'}
                      sx={{
                        mt: 1,
                        bgcolor: user?.role === 'ADMIN' ? '#1A1A1A' : '#FFF1E6',
                        color: user?.role === 'ADMIN' ? '#FFF' : '#FF6B00',
                        fontWeight: 700,
                        fontSize: '0.7rem',
                      }}
                    />
                  </Box>
                  <Divider sx={{ my: 1 }} />

                  {isAdmin ? (
                    <>
                      <MenuItem
                        component={RouterLink}
                        to="/admin"
                        onClick={handleCloseUserMenu}
                        sx={{ borderRadius: 1.5, py: 1 }}
                      >
                        <ListItemIcon>
                          <DashboardIcon sx={{ color: '#FF6B00' }} />
                        </ListItemIcon>
                        <ListItemText primary="Admin Dashboard" primaryTypographyProps={{ fontWeight: 600 }} />
                      </MenuItem>
                      <MenuItem
                        component={RouterLink}
                        to="/admin/bookings"
                        onClick={handleCloseUserMenu}
                        sx={{ borderRadius: 1.5, py: 1 }}
                      >
                        <ListItemIcon>
                          <BookingsIcon sx={{ color: '#FF6B00' }} />
                        </ListItemIcon>
                        <ListItemText primary="Manage Bookings" primaryTypographyProps={{ fontWeight: 500 }} />
                      </MenuItem>
                    </>
                  ) : (
                    <>
                      <MenuItem
                        component={RouterLink}
                        to="/my-bookings"
                        onClick={handleCloseUserMenu}
                        sx={{ borderRadius: 1.5, py: 1 }}
                      >
                        <ListItemIcon>
                          <BookingsIcon sx={{ color: '#FF6B00' }} />
                        </ListItemIcon>
                        <ListItemText primary="My Bookings" primaryTypographyProps={{ fontWeight: 600 }} />
                      </MenuItem>

                      <MenuItem
                        component={RouterLink}
                        to="/profile"
                        onClick={handleCloseUserMenu}
                        sx={{ borderRadius: 1.5, py: 1 }}
                      >
                        <ListItemIcon>
                          <PersonIcon sx={{ color: '#666' }} />
                        </ListItemIcon>
                        <ListItemText primary="My Profile" primaryTypographyProps={{ fontWeight: 500 }} />
                      </MenuItem>
                    </>
                  )}

                  <Divider sx={{ my: 1 }} />

                  <MenuItem
                    onClick={handleLogout}
                    sx={{ borderRadius: 1.5, py: 1, color: '#d32f2f' }}
                  >
                    <ListItemIcon>
                      <LogoutIcon sx={{ color: '#d32f2f' }} />
                    </ListItemIcon>
                    <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 700 }} />
                  </MenuItem>
                </Menu>
              </>
            ) : (
              /* Guest Actions: [Login] [Register] */
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="outlined"
                  size="small"
                  sx={{
                    borderRadius: 2,
                    fontWeight: 700,
                    borderColor: '#1A1A1A',
                    color: '#1A1A1A',
                    borderWidth: 1.5,
                    px: { xs: 1.5, sm: 2.2 },
                    '&:hover': {
                      borderWidth: 1.5,
                      borderColor: '#FF6B00',
                      color: '#FF6B00',
                      bgcolor: 'rgba(255, 107, 0, 0.04)',
                    },
                  }}
                >
                  Login
                </Button>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<RegisterIcon />}
                  sx={{
                    borderRadius: 2,
                    fontWeight: 800,
                    px: { xs: 1.8, sm: 2.5 },
                    boxShadow: '0 4px 14px rgba(255, 107, 0, 0.3)',
                  }}
                >
                  Register
                </Button>
              </Box>
            )}

            {/* Mobile Hamburger Toggle */}
            {isMobile && (
              <IconButton
                onClick={handleDrawerToggle}
                sx={{
                  color: '#1A1A1A',
                  p: 1,
                  ml: 0.5,
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        PaperProps={{
          sx: {
            width: 290,
            bgcolor: '#FFFFFF',
            p: 2.5,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #FF6B00 0%, #FF9040 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFF',
              }}
            >
              <CrownIcon sx={{ fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
                KING BARBAR
              </Typography>
              <Typography variant="caption" sx={{ color: '#FF6B00', fontWeight: 700, fontSize: '0.62rem' }}>
                {isAdmin ? 'ADMIN CONSOLE' : 'LUXURY SALON'}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={handleDrawerToggle}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <List sx={{ pt: 0 }}>
          {currentNavItems.map((item) => {
            if (item.sectionId) {
              return (
                <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
                  <ListItemButton
                    onClick={() => handleSectionScroll(item.sectionId)}
                    sx={{
                      borderRadius: 2,
                      color: '#1A1A1A',
                      fontWeight: 600,
                    }}
                  >
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              );
            }

            const active = isActive(item);
            return (
              <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  component={RouterLink}
                  to={item.path}
                  onClick={handleDrawerToggle}
                  sx={{
                    borderRadius: 2,
                    bgcolor: active ? 'rgba(255, 107, 0, 0.1)' : 'transparent',
                    color: active ? '#FF6B00' : '#1A1A1A',
                    fontWeight: active ? 700 : 500,
                  }}
                >
                  {item.icon && <ListItemIcon sx={{ minWidth: 32, color: active ? '#FF6B00' : '#777' }}>{item.icon}</ListItemIcon>}
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            );
          })}

          <Divider sx={{ my: 2 }} />

          {isAuthenticated ? (
            <>
              <ListItem disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  component={RouterLink}
                  to="/profile"
                  onClick={handleDrawerToggle}
                  sx={{ borderRadius: 2 }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <PersonIcon sx={{ color: '#FF6B00' }} />
                  </ListItemIcon>
                  <ListItemText primary="My Profile" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    handleDrawerToggle();
                    handleLogout();
                  }}
                  sx={{ borderRadius: 2, color: '#d32f2f' }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: '#d32f2f' }}>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 700 }} />
                </ListItemButton>
              </ListItem>
            </>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
              <Button
                component={RouterLink}
                to="/login"
                variant="outlined"
                fullWidth
                onClick={handleDrawerToggle}
                startIcon={<LoginIcon />}
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  fontWeight: 700,
                  borderColor: '#1A1A1A',
                  color: '#1A1A1A',
                }}
              >
                Login
              </Button>
              <Button
                component={RouterLink}
                to="/register"
                variant="contained"
                fullWidth
                onClick={handleDrawerToggle}
                startIcon={<RegisterIcon />}
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  fontWeight: 800,
                }}
              >
                Register
              </Button>
            </Box>
          )}
        </List>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;

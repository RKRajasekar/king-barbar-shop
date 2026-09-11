import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Chip,
  Button,
  useTheme,
  useMediaQuery,
  Container,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  EventNote as BookingsIcon,
  ContentCut as ServicesIcon,
  AccessTime as TimeIcon,
  People as CustomersIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Logout as LogoutIcon,
  WorkspacePremium as CrownIcon,
  Storefront as StoreIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const DRAWER_WIDTH = 260;

const adminMenuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
  { text: 'Bookings & Calendar', icon: <BookingsIcon />, path: '/admin/bookings' },
  { text: 'Services Catalog', icon: <ServicesIcon />, path: '/admin/services' },
  { text: 'Time Slots & Hours', icon: <TimeIcon />, path: '/admin/time-slots' },
  { text: 'Customer Directory', icon: <CustomersIcon />, path: '/admin/customers' },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const { showSuccess } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleOpenMenu = (e) => setAnchorEl(e.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleLogout = () => {
    handleCloseMenu();
    logout();
    showSuccess('Logged out of Admin Portal.');
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#161616', color: '#FFFFFF' }}>
      {/* Brand Header */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #FF6B00 0%, #FF9040 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFF',
          }}
        >
          <CrownIcon sx={{ fontSize: 24 }} />
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 900, letterSpacing: '0.04em', lineHeight: 1.1 }}>
            KING BARBAR
          </Typography>
          <Chip
            size="small"
            label="ADMIN CONSOLE"
            sx={{
              bgcolor: 'rgba(255, 107, 0, 0.2)',
              color: '#FFA04D',
              fontWeight: 800,
              fontSize: '0.62rem',
              height: 18,
              mt: 0.3,
            }}
          />
        </Box>
      </Box>

      {/* Navigation List */}
      <List sx={{ px: 2, py: 3, flexGrow: 1 }}>
        {adminMenuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={RouterLink}
                to={item.path}
                onClick={isMobile ? handleDrawerToggle : undefined}
                sx={{
                  borderRadius: 2.5,
                  py: 1.2,
                  px: 2,
                  bgcolor: active ? 'linear-gradient(135deg, #FF6B00 0%, #FF8533 100%)' : 'transparent',
                  color: active ? '#FFFFFF' : '#A5A5A5',
                  boxShadow: active ? '0 6px 18px rgba(255, 107, 0, 0.35)' : 'none',
                  '&:hover': {
                    bgcolor: active ? 'linear-gradient(135deg, #FF6B00 0%, #FF8533 100%)' : 'rgba(255,255,255,0.05)',
                    color: '#FFFFFF',
                  },
                }}
              >
                <ListItemIcon sx={{ color: active ? '#FFFFFF' : '#FF6B00', minWidth: 38 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: active ? 800 : 600,
                    fontSize: '0.9rem',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Switch to Customer Website button */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <Button
          component={RouterLink}
          to="/"
          variant="outlined"
          fullWidth
          startIcon={<StoreIcon />}
          sx={{
            borderRadius: 2,
            borderColor: 'rgba(255,255,255,0.2)',
            color: '#FFF',
            fontSize: '0.85rem',
            py: 1,
            '&:hover': {
              borderColor: '#FF6B00',
              color: '#FF6B00',
            },
          }}
        >
          Customer Website
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8F9FA' }}>
      {/* Top AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { lg: `${DRAWER_WIDTH}px` },
          bgcolor: '#FFFFFF',
          color: '#1A1A1A',
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isMobile && (
              <IconButton onClick={handleDrawerToggle} edge="start" sx={{ mr: 2, color: '#1A1A1A' }}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#1A1A1A' }}>
              Salon Management System
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              onClick={handleOpenMenu}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.2,
                cursor: 'pointer',
                p: '4px 10px',
                borderRadius: 3,
                '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' },
              }}
            >
              <Avatar
                src={user?.avatar}
                sx={{
                  width: 38,
                  height: 38,
                  bgcolor: '#1A1A1A',
                  border: '2px solid #FF6B00',
                }}
              >
                A
              </Avatar>
              <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'left' }}>
                <Typography variant="body2" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                  {user?.name}
                </Typography>
                <Typography variant="caption" sx={{ color: '#FF6B00', fontWeight: 700 }}>
                  Administrator
                </Typography>
              </Box>
            </Box>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
              PaperProps={{ sx: { minWidth: 200, borderRadius: 3, mt: 1 } }}
            >
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                  {user?.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email}
                </Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <MenuItem component={RouterLink} to="/" onClick={handleCloseMenu}>
                <ListItemIcon><StoreIcon fontSize="small" /></ListItemIcon>
                <ListItemText primary="View Customer Site" />
              </MenuItem>
              <MenuItem onClick={handleLogout} sx={{ color: '#d32f2f' }}>
                <ListItemIcon><LogoutIcon fontSize="small" sx={{ color: '#d32f2f' }} /></ListItemIcon>
                <ListItemText primary="Logout" />
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Navigation */}
      <Box component="nav" sx={{ width: { lg: DRAWER_WIDTH }, flexShrink: { lg: 0 } }}>
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
            }}
          >
            {drawerContent}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH, border: 'none' },
            }}
            open
          >
            {drawerContent}
          </Drawer>
        )}
      </Box>

      {/* Main Admin Page Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2.5, sm: 4 },
          width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: '64px',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Tabs,
  Tab,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Skeleton,
} from '@mui/material';
import {
  Close as CloseIcon,
  ContentCut as BarberIcon,
  WorkspacePremium as CrownIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const categories = ['All', 'Trending', 'Classic', 'Fade', 'Undercut', 'Beard Styles', 'Premium Styles'];

const HairstylesPage = () => {
  const navigate = useNavigate();
  const { requireAuth } = useAuth();
  const [hairstyles, setHairstyles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeModalStyle, setActiveModalStyle] = useState(null);

  const handleBookStyle = (serviceId) => {
    const target = serviceId ? `/book?serviceId=${serviceId}` : '/book';
    requireAuth(() => navigate(target), target);
  };

  useEffect(() => {
    fetchHairstyles();
  }, [selectedCategory]);

  const fetchHairstyles = async () => {
    setLoading(true);
    try {
      const catParam = selectedCategory === 'All' ? '' : `?category=${encodeURIComponent(selectedCategory)}`;
      const response = await api.get(`/hairstyles${catParam}`);
      if (response.data.success) {
        setHairstyles(response.data.hairstyles);
      }
    } catch (err) {
      console.error('Error fetching hairstyles:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: '#121212', color: '#FFFFFF', minHeight: '90vh', py: { xs: 5, md: 8 } }}>
      <Container maxWidth="lg">
        {/* Header Title */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Chip
            icon={<CrownIcon sx={{ fontSize: '18px !important', color: '#FFA04D !important' }} />}
            label="HAIRSTYLE LOOKBOOK"
            sx={{
              bgcolor: 'rgba(255, 107, 0, 0.18)',
              color: '#FFA04D',
              fontWeight: 800,
              fontSize: '0.8rem',
              mb: 1.5,
              px: 1.5,
            }}
          />
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              color: '#FFFFFF',
              mb: 1.5,
              fontSize: { xs: '2rem', md: '3rem' },
            }}
          >
            Signature Hairstyles & Cuts
          </Typography>
          <Typography variant="body1" sx={{ color: '#A0A0A0', maxWidth: 620, mx: 'auto' }}>
            Browse through our curated collection of haircut silhouettes, tapers, beard lines, and modern gentleman styles.
          </Typography>
        </Box>

        {/* Category Tabs */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 6,
          }}
        >
          <Tabs
            value={selectedCategory}
            onChange={(e, val) => setSelectedCategory(val)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              bgcolor: '#1E1E1E',
              p: 1,
              borderRadius: 3.5,
              border: '1px solid rgba(255, 107, 0, 0.2)',
              '& .MuiTabs-indicator': {
                bgcolor: '#FF6B00',
                height: '100%',
                borderRadius: 2.5,
                zIndex: 0,
              },
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.9rem',
                minWidth: 'auto',
                px: 2.5,
                py: 1,
                borderRadius: 2.5,
                color: '#AAA',
                zIndex: 1,
                transition: 'all 0.2s',
                '&.Mui-selected': {
                  color: '#FFFFFF',
                },
              },
            }}
          >
            {categories.map((cat) => (
              <Tab key={cat} label={cat} value={cat} />
            ))}
          </Tabs>
        </Box>

        {/* Hairstyles Grid */}
        {loading ? (
          <Grid container spacing={3.5}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Skeleton variant="rectangular" height={360} sx={{ bgcolor: '#222', borderRadius: 4 }} />
              </Grid>
            ))}
          </Grid>
        ) : hairstyles.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography variant="h6" color="text.secondary">
              No hairstyles found in this category.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3.5}>
            {hairstyles.map((style) => (
              <Grid item xs={12} sm={6} md={3} key={style.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 4,
                    bgcolor: '#1C1C1C',
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 107, 0, 0.15)',
                    transition: 'all 0.35s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      borderColor: '#FF6B00',
                      boxShadow: '0 16px 36px rgba(255, 107, 0, 0.25)',
                    },
                  }}
                >
                  <Box sx={{ position: 'relative', height: 280, cursor: 'pointer' }} onClick={() => setActiveModalStyle(style)}>
                    <CardMedia
                      component="img"
                      image={style.image}
                      alt={style.name}
                      sx={{ height: '100%', objectFit: 'cover' }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
                      }}
                    />
                    <Chip
                      label={style.category}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        bgcolor: '#FF6B00',
                        color: '#FFF',
                        fontWeight: 700,
                        fontSize: '0.7rem',
                      }}
                    />
                    <Box sx={{ position: 'absolute', bottom: 14, left: 14, right: 14 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#FFF', lineHeight: 1.2 }}>
                        {style.name}
                      </Typography>
                    </Box>
                  </Box>

                  <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#A0A0A0',
                        flexGrow: 1,
                        mb: 2,
                        lineHeight: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {style.description}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setActiveModalStyle(style)}
                        sx={{
                          borderColor: 'rgba(255,255,255,0.2)',
                          color: '#FFF',
                          minWidth: 40,
                          px: 1,
                        }}
                      >
                        <ViewIcon fontSize="small" />
                      </Button>
                      <Button
                        onClick={() => handleBookStyle(style.recommendedServiceId)}
                        variant="contained"
                        color="primary"
                        size="small"
                        fullWidth
                        startIcon={<BarberIcon />}
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          borderRadius: 2,
                        }}
                      >
                        Book This Style
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Modal Dialog for Hairstyle Details */}
        <Dialog
          open={Boolean(activeModalStyle)}
          onClose={() => setActiveModalStyle(null)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: '#1C1C1C',
              color: '#FFF',
              border: '1px solid rgba(255, 107, 0, 0.3)',
              borderRadius: 4,
            },
          }}
        >
          {activeModalStyle && (
            <>
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="340"
                  image={activeModalStyle.image}
                  alt={activeModalStyle.name}
                  sx={{ objectFit: 'cover' }}
                />
                <IconButton
                  onClick={() => setActiveModalStyle(null)}
                  sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    bgcolor: 'rgba(0,0,0,0.6)',
                    color: '#FFF',
                    '&:hover': { bgcolor: '#FF6B00' },
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>

              <DialogTitle sx={{ pb: 1 }}>
                <Chip
                  label={activeModalStyle.category}
                  size="small"
                  sx={{ bgcolor: '#FF6B00', color: '#FFF', fontWeight: 700, mb: 1 }}
                />
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#FFF' }}>
                  {activeModalStyle.name}
                </Typography>
              </DialogTitle>

              <DialogContent>
                <Typography variant="body1" sx={{ color: '#CCC', lineHeight: 1.7, mb: 2 }}>
                  {activeModalStyle.description}
                </Typography>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: 'rgba(255, 107, 0, 0.1)',
                    border: '1px solid rgba(255, 107, 0, 0.25)',
                    borderRadius: 3,
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#FFA04D', fontWeight: 700, display: 'block', mb: 0.5 }}>
                    PRO STYLING TIP
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#E0E0E0' }}>
                    Maintain this sharp silhouette with a touch-up visit every 2–3 weeks. Use matte styling clay for flexible all-day hold.
                  </Typography>
                </Box>
              </DialogContent>

              <DialogActions sx={{ p: 2.5, pt: 0 }}>
                <Button
                  onClick={() => {
                    const recId = activeModalStyle.recommendedServiceId;
                    setActiveModalStyle(null);
                    handleBookStyle(recId);
                  }}
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  startIcon={<BarberIcon />}
                  sx={{ borderRadius: 2.5, fontWeight: 700 }}
                >
                  Book Appointment For This Cut
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </Box>
  );
};

export default HairstylesPage;

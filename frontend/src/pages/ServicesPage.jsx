import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Chip,
  Skeleton,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  ContentCut as BarberIcon,
  AccessTime as TimeIcon,
  WorkspacePremium as CrownIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const categories = ['All', 'Haircut', 'Fade', 'Beard', 'Spa & Care', 'Combos'];

const ServicesPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { requireAuth } = useAuth();
  const initialCategory = searchParams.get('category') || 'All';

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');

  const handleBookService = (serviceId) => {
    requireAuth(() => navigate(`/book?serviceId=${serviceId}`), `/book?serviceId=${serviceId}`);
  };

  useEffect(() => {
    fetchServices();
  }, [selectedCategory]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const categoryParam = selectedCategory === 'All' ? '' : `?category=${selectedCategory}`;
      const response = await api.get(`/services${categoryParam}`);
      if (response.data.success) {
        setServices(response.data.services);
      }
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <Box sx={{ bgcolor: '#FFF8F2', minHeight: '90vh', py: { xs: 5, md: 8 } }}>
      <Container maxWidth="lg">
        {/* Header Title */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Chip
            icon={<CrownIcon sx={{ fontSize: '18px !important' }} />}
            label="KING BARBAR MENU"
            sx={{
              bgcolor: 'rgba(255, 107, 0, 0.12)',
              color: '#FF6B00',
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
              color: '#1A1A1A',
              mb: 1.5,
              fontSize: { xs: '2rem', md: '3rem' },
            }}
          >
            Our Barber & Salon Services
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', maxWidth: 650, mx: 'auto' }}>
            Choose from our extensive selection of signature haircuts, precision beard trims, revitalizing hair spas, and royal combos.
          </Typography>
        </Box>

        {/* Filter Bar & Search */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            mb: 5,
            p: 1.5,
            bgcolor: '#FFFFFF',
            borderRadius: 3.5,
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            border: '1px solid rgba(255, 107, 0, 0.1)',
          }}
        >
          {/* Category Tabs */}
          <Tabs
            value={selectedCategory}
            onChange={(e, val) => setSelectedCategory(val)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTabs-indicator': {
                bgcolor: '#FF6B00',
                height: 3,
                borderRadius: 1.5,
              },
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.95rem',
                minWidth: 'auto',
                px: 2.5,
                color: '#666',
                '&.Mui-selected': {
                  color: '#FF6B00',
                },
              },
            }}
          >
            {categories.map((cat) => (
              <Tab key={cat} label={cat} value={cat} />
            ))}
          </Tabs>

          {/* Search Box */}
          <TextField
            size="small"
            placeholder="Search service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#FF6B00' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              width: { xs: '100%', md: 280 },
              bgcolor: '#FFF8F2',
              borderRadius: 2,
            }}
          />
        </Box>

        {/* Services Grid */}
        {loading ? (
          <Grid container spacing={3.5}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Skeleton variant="rectangular" height={360} sx={{ borderRadius: 4 }} />
              </Grid>
            ))}
          </Grid>
        ) : filteredServices.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 10,
              bgcolor: '#FFF',
              borderRadius: 4,
              border: '1px dashed rgba(255, 107, 0, 0.3)',
            }}
          >
            <BarberIcon sx={{ fontSize: 60, color: '#FF8E53', mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1A1A1A', mb: 1 }}>
              No services found
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
              Try searching with another keyword or pick a different category.
            </Typography>
            <Button variant="outlined" color="primary" onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}>
              Reset Filters
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3.5}>
            {filteredServices.map((service) => (
              <Grid item xs={12} sm={6} md={4} key={service.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 4,
                    bgcolor: '#FFFFFF',
                    overflow: 'hidden',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.04)',
                    border: '1px solid rgba(255, 107, 0, 0.1)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 16px 36px rgba(255, 107, 0, 0.16)',
                      borderColor: '#FF6B00',
                    },
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="220"
                      image={service.image || 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80'}
                      alt={service.name}
                      sx={{ objectFit: 'cover' }}
                    />
                    <Chip
                      label={service.category}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 14,
                        left: 14,
                        bgcolor: 'rgba(26, 26, 26, 0.88)',
                        color: '#FFF',
                        fontWeight: 700,
                        backdropFilter: 'blur(6px)',
                      }}
                    />
                  </Box>

                  <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#1A1A1A', mb: 1 }}>
                      {service.name}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: '#666',
                        mb: 2.5,
                        flexGrow: 1,
                        lineHeight: 1.6,
                      }}
                    >
                      {service.description}
                    </Typography>

                    <Divider sx={{ my: 1.5, borderColor: 'rgba(0,0,0,0.06)' }} />

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#888', display: 'block', fontWeight: 600 }}>
                          PRICE
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 900, color: '#FF6B00' }}>
                          ₹{service.price}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" sx={{ color: '#888', display: 'block', fontWeight: 600 }}>
                          DURATION
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <TimeIcon sx={{ fontSize: 16, color: '#777' }} />
                          <Typography variant="body2" sx={{ fontWeight: 700, color: '#333' }}>
                            {service.duration} mins
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Button
                      onClick={() => handleBookService(service.id)}
                      variant="contained"
                      color="primary"
                      fullWidth
                      startIcon={<BarberIcon />}
                      sx={{
                        borderRadius: 2.5,
                        fontWeight: 700,
                        py: 1.2,
                      }}
                    >
                      Book Now
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default ServicesPage;

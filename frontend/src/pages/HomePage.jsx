import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Rating,
  Avatar,
  Skeleton,
  IconButton,
  Paper,
  Divider,
} from '@mui/material';
import {
  ContentCut as BarberIcon,
  CalendarMonth as CalendarIcon,
  WorkspacePremium as CrownIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  Shield as ShieldIcon,
  Spa as SpaIcon,
  ArrowForward as ArrowForwardIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  LocalOffer as PriceIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const HomePage = () => {
  const navigate = useNavigate();
  const { requireAuth } = useAuth();
  const [featuredServices, setFeaturedServices] = useState([]);
  const [trendingStyles, setTrendingStyles] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleBookingNavigation = (targetUrl = '/book') => {
    requireAuth(() => navigate(targetUrl), targetUrl);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, hairstylesRes] = await Promise.all([
          api.get('/services'),
          api.get('/hairstyles?category=Trending'),
        ]);

        if (servicesRes.data.success) {
          setFeaturedServices(servicesRes.data.services.slice(0, 6));
        }
        if (hairstylesRes.data.success) {
          setTrendingStyles(hairstylesRes.data.hairstyles.slice(0, 4));
        }
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const testimonials = [
    {
      name: 'Arjun Singhania',
      role: 'Regular Client',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      comment: 'King Barbar is by far the most premium grooming experience in the city. The skin fade was millimeter perfect and the hot towel finish was ultra relaxing!',
    },
    {
      name: 'Rohan Mehra',
      role: 'Executive Member',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      comment: 'The King’s Combo package is worth every rupee. Master barber listened carefully to what style I wanted and executed it flawlessly.',
    },
    {
      name: 'Devendra Nair',
      role: 'Gentleman Member',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      comment: 'Online slot booking made it super easy. Arrived on time, zero waiting, and walked out feeling like royalty.',
    },
  ];

  return (
    <Box sx={{ overflowX: 'hidden' }}>
      {/* 1. HERO SECTION */}
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: '85vh', md: '90vh' },
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #1A1A1A 0%, #291C14 50%, #151515 100%)',
          color: '#FFFFFF',
          pt: { xs: 4, md: 6 },
          pb: { xs: 8, md: 10 },
          overflow: 'hidden',
        }}
      >
        {/* Glow ambient background circles */}
        <Box
          sx={{
            position: 'absolute',
            top: '-10%',
            right: '-5%',
            width: { xs: 300, md: 600 },
            height: { xs: 300, md: 600 },
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 107, 0, 0.25) 0%, rgba(0,0,0,0) 70%)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={6} alignItems="center">
            {/* Left Hero Text */}
            <Grid item xs={12} md={6.5}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  bgcolor: 'rgba(255, 107, 0, 0.15)',
                  border: '1px solid rgba(255, 107, 0, 0.35)',
                  borderRadius: 5,
                  px: 2,
                  py: 0.8,
                  mb: 3,
                }}
              >
                <CrownIcon sx={{ color: '#FF6B00', fontSize: 20 }} />
                <Typography variant="caption" sx={{ color: '#FFA04D', fontWeight: 700, letterSpacing: '0.12em' }}>
                  THE PREMIER GENTLEMEN'S SANCTUARY
                </Typography>
              </Box>

              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.2rem' },
                  fontWeight: 900,
                  lineHeight: 1.08,
                  mb: 2.5,
                  letterSpacing: '-0.02em',
                }}
              >
                Your Style.{' '}
                <Box
                  component="span"
                  sx={{
                    background: 'linear-gradient(135deg, #FF6B00 0%, #FFA86B 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'inline-block',
                  }}
                >
                  Your King.
                </Box>
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  color: '#C7C7C7',
                  fontWeight: 400,
                  lineHeight: 1.6,
                  maxWidth: 540,
                  mb: 4,
                  fontSize: { xs: '1rem', md: '1.2rem' },
                }}
              >
                Premium grooming, signature fades, precision beard sculpting, and luxury spa treatments tailored specifically for the modern gentleman.
              </Typography>

              {/* Action Buttons */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 5 }}>
                <Button
                  onClick={() => handleBookingNavigation('/book')}
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<CalendarIcon />}
                  sx={{
                    py: 1.8,
                    px: 3.5,
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    borderRadius: 3,
                    boxShadow: '0 10px 30px rgba(255, 107, 0, 0.4)',
                  }}
                >
                  Book Appointment
                </Button>

                <Button
                  component={RouterLink}
                  to="/services"
                  variant="outlined"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    py: 1.8,
                    px: 3,
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderRadius: 3,
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: '#FFFFFF',
                    '&:hover': {
                      borderColor: '#FF6B00',
                      bgcolor: 'rgba(255, 107, 0, 0.1)',
                      color: '#FF6B00',
                    },
                  }}
                >
                  Explore Services
                </Button>
              </Stack>

              {/* Trust badges */}
              <Stack direction="row" spacing={3} alignItems="center">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <StarIcon sx={{ color: '#FFB800', fontSize: 24 }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, lineHeight: 1 }}>
                      4.9 / 5.0
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#888' }}>
                      2,500+ Reviews
                    </Typography>
                  </Box>
                </Box>
                <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.15)', height: 30 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ShieldIcon sx={{ color: '#FF6B00', fontSize: 24 }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, lineHeight: 1 }}>
                      100% Sterile
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#888' }}>
                      Hospital Grade Tools
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Grid>

            {/* Right Hero Image Card */}
            <Grid item xs={12} md={5.5}>
              <Box
                sx={{
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: '-10px',
                    borderRadius: 6,
                    background: 'linear-gradient(135deg, rgba(255, 107, 0, 0.4) 0%, rgba(255, 142, 83, 0.1) 100%)',
                    filter: 'blur(20px)',
                    zIndex: 0,
                  },
                }}
              >
                <Card
                  sx={{
                    position: 'relative',
                    zIndex: 1,
                    borderRadius: 5,
                    border: '1px solid rgba(255, 107, 0, 0.3)',
                    overflow: 'hidden',
                    bgcolor: '#1E1E1E',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
                  }}
                >
                  <CardMedia
                    component="img"
                    image="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1000&q=80"
                    alt="Master Barber Styling"
                    sx={{
                      height: { xs: 340, sm: 440, md: 500 },
                      objectFit: 'cover',
                      filter: 'brightness(0.92)',
                      transition: 'transform 0.5s ease',
                      '&:hover': {
                        transform: 'scale(1.03)',
                      },
                    }}
                  />

                  {/* Floating Experience Badge */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 20,
                      left: 20,
                      right: 20,
                      p: 2,
                      borderRadius: 3,
                      bgcolor: 'rgba(20, 20, 20, 0.88)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 107, 0, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar
                        sx={{
                          bgcolor: '#FF6B00',
                          width: 44,
                          height: 44,
                          boxShadow: '0 4px 12px rgba(255, 107, 0, 0.4)',
                        }}
                      >
                        <BarberIcon sx={{ color: '#FFF' }} />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#FFF' }}>
                          Master Artisans
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#FFA04D' }}>
                          10+ Years Craft Experience
                        </Typography>
                      </Box>
                    </Box>

                    <Button
                      onClick={() => handleBookingNavigation('/book')}
                      size="small"
                      variant="contained"
                      sx={{
                        borderRadius: 2,
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        px: 2,
                      }}
                    >
                      Book Now
                    </Button>
                  </Box>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 2. STATS BANNER */}
      <Box
        sx={{
          bgcolor: '#FFF',
          py: 4,
          borderBottom: '1px solid rgba(255, 107, 0, 0.12)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={3} justifyContent="space-between">
            {[
              { number: '10+', label: 'Master Barbers', desc: 'Certified & Award-winning' },
              { number: '15,000+', label: 'Happy Gentlemen', desc: 'Satisfied clients styled' },
              { number: '4.9 ★', label: 'Client Rating', desc: 'Based on 2,500+ reviews' },
              { number: '100%', label: 'Hygiene Assured', desc: 'UV Sterilized Instruments' },
            ].map((stat, idx) => (
              <Grid item xs={6} md={3} key={idx}>
                <Box sx={{ textAlign: { xs: 'left', sm: 'center' }, p: 1 }}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 900,
                      color: '#FF6B00',
                      mb: 0.5,
                      fontSize: { xs: '1.8rem', md: '2.3rem' },
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1A1A1A' }}>
                    {stat.label}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#777' }}>
                    {stat.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 3. FEATURED SERVICES SECTION */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#FFF8F2' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Chip
              label="SIGNATURE CRAFTSMANSHIP"
              sx={{
                bgcolor: 'rgba(255, 107, 0, 0.12)',
                color: '#FF6B00',
                fontWeight: 800,
                fontSize: '0.75rem',
                mb: 1.5,
                px: 1,
              }}
            />
            <Typography variant="h2" sx={{ fontWeight: 800, color: '#1A1A1A', mb: 1.5 }}>
              Featured Barber Services
            </Typography>
            <Typography variant="body1" sx={{ color: '#666', maxWidth: 600, mx: 'auto' }}>
              Every service includes a personalized consultation, hot towel neck treatment, and expert styling with premium grooming essentials.
            </Typography>
          </Box>

          {loading ? (
            <Grid container spacing={3}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <Skeleton variant="rectangular" height={320} sx={{ borderRadius: 4 }} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Grid container spacing={3.5}>
              {featuredServices.map((service) => (
                <Grid item xs={12} sm={6} md={4} key={service.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 4,
                      bgcolor: '#FFFFFF',
                      overflow: 'hidden',
                      boxShadow: '0 6px 24px rgba(0,0,0,0.04)',
                      border: '1px solid rgba(255, 107, 0, 0.1)',
                      transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 16px 36px rgba(255, 107, 0, 0.18)',
                        borderColor: '#FF6B00',
                      },
                    }}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="200"
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
                          bgcolor: 'rgba(26, 26, 26, 0.85)',
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
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
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
                          <Typography variant="h5" sx={{ fontWeight: 800, color: '#FF6B00' }}>
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
                        onClick={() => handleBookingNavigation(`/book?serviceId=${service.id}`)}
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

          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button
              component={RouterLink}
              to="/services"
              variant="outlined"
              color="primary"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontWeight: 700,
              }}
            >
              View All Services & Packages
            </Button>
          </Box>
        </Container>
      </Box>

      {/* 4. HAIRSTYLE LOOKBOOK PREVIEW */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#191919', color: '#FFF' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'flex-end' }, mb: 6, gap: 2 }}>
            <Box>
              <Chip
                label="STYLE INSPIRATION"
                sx={{
                  bgcolor: 'rgba(255, 107, 0, 0.2)',
                  color: '#FFA04D',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  mb: 1.5,
                }}
              />
              <Typography variant="h2" sx={{ fontWeight: 800, color: '#FFF' }}>
                Trending Hairstyle Lookbook
              </Typography>
              <Typography variant="body1" sx={{ color: '#A0A0A0', maxWidth: 500, mt: 1 }}>
                Explore modern fades, executive cuts, and signature beard styles crafted by our master stylists.
              </Typography>
            </Box>

            <Button
              component={RouterLink}
              to="/hairstyles"
              variant="contained"
              color="primary"
              endIcon={<ArrowForwardIcon />}
              sx={{ borderRadius: 2.5, px: 3, py: 1.3, fontWeight: 700 }}
            >
              Explore Full Lookbook
            </Button>
          </Box>

          <Grid container spacing={3}>
            {trendingStyles.map((style) => (
              <Grid item xs={12} sm={6} md={3} key={style.id}>
                <Card
                  sx={{
                    bgcolor: '#242424',
                    borderRadius: 4,
                    border: '1px solid rgba(255, 107, 0, 0.15)',
                    overflow: 'hidden',
                    transition: 'all 0.35s ease',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      borderColor: '#FF6B00',
                      boxShadow: '0 12px 30px rgba(255, 107, 0, 0.25)',
                    },
                  }}
                >
                  <Box sx={{ position: 'relative', height: 260 }}>
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
                        background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
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
                  <CardContent sx={{ p: 2 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#BBB',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.5,
                        mb: 1.5,
                      }}
                    >
                      {style.description}
                    </Typography>
                    <Button
                      onClick={() => handleBookingNavigation(style.recommendedServiceId ? `/book?serviceId=${style.recommendedServiceId}` : '/book')}
                      size="small"
                      variant="outlined"
                      fullWidth
                      sx={{
                        borderColor: 'rgba(255, 107, 0, 0.4)',
                        color: '#FFA04D',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        '&:hover': {
                          borderColor: '#FF6B00',
                          bgcolor: '#FF6B00',
                          color: '#FFF',
                        },
                      }}
                    >
                      Book This Style
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 5. WHY CHOOSE KING BARBAR / ABOUT */}
      <Box id="about" sx={{ py: { xs: 8, md: 12 }, bgcolor: '#FFF' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Chip
              label="THE ROYAL ADVANTAGE"
              sx={{
                bgcolor: 'rgba(255, 107, 0, 0.12)',
                color: '#FF6B00',
                fontWeight: 800,
                fontSize: '0.75rem',
                mb: 1.5,
              }}
            />
            <Typography variant="h2" sx={{ fontWeight: 800, color: '#1A1A1A', mb: 1.5 }}>
              Why Gentlemen Choose King Barbar
            </Typography>
            <Typography variant="body1" sx={{ color: '#666', maxWidth: 620, mx: 'auto' }}>
              We don’t just cut hair — we craft an unhurried, luxury grooming ritual that restores your confidence and sharpens your look.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {[
              {
                icon: <BarberIcon sx={{ fontSize: 32, color: '#FF6B00' }} />,
                title: 'Master Artisans & Stylists',
                desc: 'Every barber in our salon undergoes rigorous training in classic scissors work, razor sharp tapers, and modern textured styling.',
              },
              {
                icon: <ShieldIcon sx={{ fontSize: 32, color: '#FF6B00' }} />,
                title: 'Hospital-Grade Sanitization',
                desc: 'All blades are single-use disposable. Clippers, scissors, and combs are sanitized in medical-grade UV sterilizers before every client.',
              },
              {
                icon: <SpaIcon sx={{ fontSize: 32, color: '#FF6B00' }} />,
                title: 'Bespoke Royal Spa & Lounge',
                desc: 'Enjoy complimentary freshly brewed espresso, luxury leather chairs, soothing aromatherapy steam, and hot towel treatments.',
              },
              {
                icon: <CalendarIcon sx={{ fontSize: 32, color: '#FF6B00' }} />,
                title: 'Zero Wait Online Booking',
                desc: 'Select your preferred service, barber, date and exact time slot. Walk in directly at your scheduled time with guaranteed chair availability.',
              },
            ].map((feature, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3.5,
                    height: '100%',
                    borderRadius: 4,
                    bgcolor: '#FFF8F2',
                    border: '1px solid rgba(255, 107, 0, 0.12)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 12px 30px rgba(255, 107, 0, 0.12)',
                      borderColor: '#FF6B00',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 3,
                      bgcolor: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2.5,
                      boxShadow: '0 4px 14px rgba(255, 107, 0, 0.15)',
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#1A1A1A', mb: 1.5 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.6 }}>
                    {feature.desc}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 6. TESTIMONIALS SECTION */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: '#FFF8F2' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h2" sx={{ fontWeight: 800, color: '#1A1A1A', mb: 1.5 }}>
              What Our Gentlemen Say
            </Typography>
            <Typography variant="body1" sx={{ color: '#666' }}>
              Real reviews from real clients who experienced the King treatment.
            </Typography>
          </Box>

          <Grid container spacing={3.5}>
            {testimonials.map((t, idx) => (
              <Grid item xs={12} md={4} key={idx}>
                <Card
                  sx={{
                    p: 3.5,
                    height: '100%',
                    borderRadius: 4,
                    bgcolor: '#FFFFFF',
                    border: '1px solid rgba(255, 107, 0, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Rating value={t.rating} readOnly sx={{ color: '#FFB800', mb: 2 }} />
                    <Typography variant="body1" sx={{ color: '#333', fontStyle: 'italic', lineHeight: 1.7, mb: 3 }}>
                      "{t.comment}"
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar src={t.avatar} sx={{ width: 48, height: 48, border: '2px solid #FF6B00' }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1A1A1A' }}>
                        {t.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#FF6B00', fontWeight: 600 }}>
                        {t.role}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 7. FINAL CALL TO ACTION / CONTACT */}
      <Box
        id="contact"
        sx={{
          py: { xs: 8, md: 10 },
          background: 'linear-gradient(135deg, #FF6B00 0%, #FF8533 100%)',
          color: '#FFFFFF',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <Container maxWidth="md">
          <CrownIcon sx={{ fontSize: 48, color: '#FFF', mb: 2, filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.2))' }} />
          <Typography variant="h2" sx={{ fontWeight: 900, mb: 2, letterSpacing: '-0.01em' }}>
            Ready to Look Like a King?
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 400, color: 'rgba(255,255,255,0.9)', mb: 4, maxWidth: 600, mx: 'auto' }}>
            Book your appointment now. Select your service, pick an open slot, and step into our luxury chair.
          </Typography>
          <Button
            onClick={() => handleBookingNavigation('/book')}
            variant="contained"
            size="large"
            sx={{
              bgcolor: '#1A1A1A',
              color: '#FFFFFF',
              py: 2,
              px: 4.5,
              fontSize: '1.1rem',
              fontWeight: 800,
              borderRadius: 3,
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              '&:hover': {
                bgcolor: '#000000',
              },
            }}
          >
            Book Your Appointment Now
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;

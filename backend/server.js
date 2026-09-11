require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const hairstyleRoutes = require('./routes/hairstyleRoutes');
const timeSlotRoutes = require('./routes/timeSlotRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// API Root Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    name: 'KING BARBAR SHOP API',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/hairstyles', hairstyleRoutes);
app.use('/api/timeslots', timeSlotRoutes);
app.use('/api/admin', adminRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.url}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error.',
  });
});

// Start Server
const startServer = async () => {
  try {
    const { testConnection, startEmbeddedPostgres } = require('./db-setup');
    const databaseUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/king_barbar_shop';
    const isConnected = await testConnection(databaseUrl);
    if (!isConnected) {
      console.log('⚡ Initializing Database Engine on startup...');
      await startEmbeddedPostgres();
    }
  } catch (dbErr) {
    console.warn('⚠️ DB Connection check warning:', dbErr.message);
  }

  app.listen(PORT, () => {
    console.log(`💈 KING BARBAR SHOP Server running on port ${PORT}`);
    console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  });
};

startServer();

module.exports = app;

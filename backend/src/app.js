const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();

// ✅ FIXED CORS (supports all Vercel deployments)
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);

    // Allow all Vercel frontend URLs
    if (origin.includes('vercel.app')) {
      return callback(null, true);
    }

    // Optional: allow localhost for development
    if (origin.includes('localhost')) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// Security + Logging
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Rate Limiting
app.use('/api', apiLimiter);

// Routes
const authRoutes = require('./routes/authRoutes');
const listingRoutes = require('./routes/listingRoutes');
const interestRoutes = require('./routes/interestRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/interests', interestRoutes);

// Health Check
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Roomie API 🚀' });
});

// Error Handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();

// Security & CORS Middleware
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());

// Application-wide Rate Limiting
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
    res.json({ message: 'Welcome to Roomie API - Institutional Backend' });
});

// Middleware for 404 and Global Error Handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;

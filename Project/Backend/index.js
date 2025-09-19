const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const db = require('./src/Config/db');

dotenv.config();

const routes = require('./src/routes/authRoutes');
const documentRoutes = require('./src/routes/documentRoutes');
const creditsRoutes = require('./src/routes/creditRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const cron = require('node-cron');
const { resetDailycredits } = require('./src/Controllers/creditController');

// Enhanced CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'http://localhost:8000',
    'https://doc-scanning-matching-site.onrender.com', // Add your production frontend URL here
    'file://' // For local HTML files
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'X-Access-Token'
  ],
  credentials: true,
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/auth', routes);
app.use('/api/documents', documentRoutes);
app.use('/api/credits', creditsRoutes);
app.use('/api/admin', adminRoutes);

// Reset credits every midnight
cron.schedule("0 0 * * *", resetDailycredits);

// Default route (just a health check for API)
app.get('/', (req, res) => {
  res.json({ message: "API is running 🚀" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

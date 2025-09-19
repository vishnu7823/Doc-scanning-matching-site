const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

// Import route files (adjust paths based on your actual file structure)
const authRoutes = require('./authRoutes'); // Updated path
const documentRoutes = require('./documentRoutes'); // Updated path  
const creditsRoutes = require('./creditRoutes'); // Updated path
const adminRoutes = require('./adminRoutes'); // Updated path

// Enhanced CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5500', 
    'http://127.0.0.1:5500',
    'http://localhost:8000',
    'file://'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With', 
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Request body:', req.body);
  next();
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);  
app.use('/api/credits', creditsRoutes);
app.use('/api/admin', adminRoutes);

// Default route (health check)
app.get('/', (req, res) => {
  res.json({ 
    message: "API is running 🚀",
    timestamp: new Date().toISOString(),
    availableRoutes: {
      auth: '/api/auth (POST /register, POST /login, GET /profile)',
      documents: '/api/documents',
      credits: '/api/credits', 
      admin: '/api/admin'
    }
  });
});

// Test route for debugging
app.get('/api/test', (req, res) => {
  res.json({ message: "API test route working!" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler - this was missing in your original code
app.use('*', (req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    message: "Route not found",
    requestedRoute: req.originalUrl,
    availableRoutes: ['/api/auth', '/api/documents', '/api/credits', '/api/admin']
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Base URL: http://localhost:${PORT}`);
});

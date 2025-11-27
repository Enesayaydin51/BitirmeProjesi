const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');
require('dotenv').config();

// Set default environment variables if not provided
process.env.PORT = process.env.PORT || 3000;
process.env.DB_HOST = process.env.DB_HOST || 'localhost';
process.env.DB_PORT = process.env.DB_PORT || 5432;
process.env.DB_NAME = process.env.DB_NAME || 'gym_app_db';
process.env.DB_USER = process.env.DB_USER || 'postgres';
process.env.DB_PASSWORD = process.env.DB_PASSWORD || 'postgres';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'gym_app_jwt_secret_key_2024_very_secure';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

const authRoutes = require('./presentation/routes/authRoutes');
const { errorHandler } = require('./presentation/middleware/errorHandler');
const dbConnection = require('./infrastructure/database/connection');

// Swagger configuration (FIXED)
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Gym App API',
      version: '1.0.0',
      description: 'Gym App Backend API Documentation',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Development server' },
      { url: 'http://10.152.173.189:3000', description: 'Production server' },
    ],
  },
  // 🔧 Path fix — uses __dirname to always find correct route files
  apis: [
    path.join(__dirname, './presentation/routes/*.js'),
    path.join(__dirname, './presentation/controllers/*.js'),
  ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Gym App Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Database test endpoint
app.get('/api/test-db', async (req, res) => {
  try {
    const dbConnection = require('./infrastructure/database/connection');
    const db = dbConnection.connect();
    const result = await db.query('SELECT NOW() as current_time');
    res.status(200).json({
      success: true,
      message: 'Database connection successful',
      data: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Start server
const startServer = async () => {
  try {
    console.log('🔌 Connecting to database...');
    await dbConnection.connect();
    console.log('✅ Database connected successfully');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📱 Health check: http://localhost:${PORT}/health`);
      console.log(`📱 Swagger UI: http://localhost:${PORT}/api-docs`);
      console.log(`📱 Network access: http://0.0.0.0:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;

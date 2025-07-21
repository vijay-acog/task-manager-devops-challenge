const express = require('express');
const { Pool } = require('pg');
const { getRedisClient } = require('../config/redis');

const router = express.Router();

// Database connection for health checks
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'taskdb',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

// GET /api/health - Basic health check
router.get('/', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    services: {
      database: 'unknown',
      redis: 'unknown'
    }
  };

  let statusCode = 200;

  // Check database connection
  try {
    await pool.query('SELECT 1');
    health.services.database = 'healthy';
  } catch (error) {
    health.services.database = 'unhealthy';
    health.status = 'degraded';
    statusCode = 503;
    console.error('❌ Database health check failed:', error.message);
  }

  // Check Redis connection
  const redis = getRedisClient();
  if (redis) {
    try {
      await redis.ping();
      health.services.redis = 'healthy';
    } catch (error) {
      health.services.redis = 'unhealthy';
      health.status = 'degraded';
      statusCode = 503;
      console.error('❌ Redis health check failed:', error.message);
    }
  } else {
    health.services.redis = 'not_connected';
    health.status = 'degraded';
  }

  res.status(statusCode).json(health);
});

// GET /api/health/ready - Readiness probe
router.get('/ready', async (req, res) => {
  try {
    // Check if all critical services are available
    await pool.query('SELECT 1');
    
    res.json({
      status: 'ready',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'not_ready',
      timestamp: new Date().toISOString(),
      error: 'Database not available'
    });
  }
});

// GET /api/health/live - Liveness probe
router.get('/live', (req, res) => {
  res.json({
    status: 'alive',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

module.exports = router;


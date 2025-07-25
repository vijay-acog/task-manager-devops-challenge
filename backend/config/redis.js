const redis = require('redis');

let redisClient = null;

const initRedis = async () => {
  try {
    // Use REDIS_URL if provided, otherwise fall back to individual env vars
    const clientConfig = process.env.REDIS_URL ? 
      { url: process.env.REDIS_URL } : 
      {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
      };
    
    redisClient = redis.createClient({
      ...clientConfig,
      retry_strategy: (options) => {
        if (options.error && options.error.code === 'ECONNREFUSED') {
          console.warn('⚠️  Redis server refused connection');
          return undefined; // Don't retry
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
          console.warn('⚠️  Redis retry time exhausted');
          return undefined;
        }
        if (options.attempt > 10) {
          console.warn('⚠️  Redis max retry attempts reached');
          return undefined;
        }
        return Math.min(options.attempt * 100, 3000);
      }
    });

    redisClient.on('error', (err) => {
      console.warn('⚠️  Redis client error:', err.message);
      redisClient = null; // Reset client on error
    });

    redisClient.on('connect', () => {
      console.log('🔗 Redis client connected');
    });

    redisClient.on('ready', () => {
      console.log('✅ Redis client ready');
    });

    redisClient.on('end', () => {
      console.log('📤 Redis client disconnected');
    });

    await redisClient.connect();
    console.log('✅ Redis initialized successfully');
    
    return redisClient;
  } catch (error) {
    console.warn('⚠️  Redis initialization failed:', error.message);
    console.warn('⚠️  Application will continue without Redis caching');
    redisClient = null;
    return null;
  }
};

const getRedisClient = () => {
  return redisClient;
};

module.exports = {
  initRedis,
  getRedisClient
};

const { Pool } = require('pg');

let pool;

const initDatabase = async () => {
  try {
    // Use DATABASE_URL if provided, otherwise fall back to individual env vars
    if (process.env.DATABASE_URL) {
      pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });
    } else {
      pool = new Pool({
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'taskdb',
        password: process.env.DB_PASSWORD || 'password',
        port: process.env.DB_PORT || 5432,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });
    }

    // Test the connection
    await pool.query('SELECT NOW()');
    console.log('✅ Database connected successfully');

    // Create tables if they don't exist
    await createTables();
    
    return pool;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
};

const createTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✅ Database tables verified/created');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  }
};

const getPool = () => {
  if (!pool) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return pool;
};

module.exports = {
  initDatabase,
  getPool
};

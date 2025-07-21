const express = require('express');
const { Pool } = require('pg');
const { getRedisClient } = require('../config/redis');

const router = express.Router();

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'taskdb',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

// GET /api/tasks - Get all tasks
router.get('/', async (req, res) => {
  try {
    const redis = getRedisClient();
    const cacheKey = 'all_tasks';
    
    // Try to get from cache first
    if (redis) {
      try {
        const cached = await redis.get(cacheKey);
        if (cached) {
          console.log('📦 Returning tasks from cache');
          return res.json(JSON.parse(cached));
        }
      } catch (cacheError) {
        console.warn('⚠️  Cache read error:', cacheError.message);
      }
    }
    
    // Get from database
    const result = await pool.query(
      'SELECT * FROM tasks ORDER BY created_at DESC'
    );
    
    // Cache the result
    if (redis) {
      try {
        await redis.setex(cacheKey, 60, JSON.stringify(result.rows)); // Cache for 1 minute
      } catch (cacheError) {
        console.warn('⚠️  Cache write error:', cacheError.message);
      }
    }
    
    console.log(`📋 Retrieved ${result.rows.length} tasks from database`);
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// POST /api/tasks - Create a new task
router.post('/', async (req, res) => {
  try {
    const { title, description } = req.body;
    
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const result = await pool.query(
      'INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *',
      [title.trim(), description || '']
    );
    
    // Clear cache
    const redis = getRedisClient();
    if (redis) {
      try {
        await redis.del('all_tasks');
      } catch (cacheError) {
        console.warn('⚠️  Cache clear error:', cacheError.message);
      }
    }
    
    console.log(`✅ Created new task: ${title}`);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// PUT /api/tasks/:id - Update a task
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    
    // Build dynamic query based on provided fields
    const updates = [];
    const values = [];
    let paramCount = 1;
    
    if (title !== undefined) {
      updates.push(`title = $${paramCount++}`);
      values.push(title.trim());
    }
    
    if (description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(description);
    }
    
    if (completed !== undefined) {
      updates.push(`completed = $${paramCount++}`);
      values.push(completed);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    values.push(id);
    const query = `
      UPDATE tasks 
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $${paramCount} 
      RETURNING *
    `;
    
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // Clear cache
    const redis = getRedisClient();
    if (redis) {
      try {
        await redis.del('all_tasks');
      } catch (cacheError) {
        console.warn('⚠️  Cache clear error:', cacheError.message);
      }
    }
    
    console.log(`✏️  Updated task ID: ${id}`);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // Clear cache
    const redis = getRedisClient();
    if (redis) {
      try {
        await redis.del('all_tasks');
      } catch (cacheError) {
        console.warn('⚠️  Cache clear error:', cacheError.message);
      }
    }
    
    console.log(`🗑️  Deleted task ID: ${id}`);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// GET /api/tasks/:id - Get a specific task
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM tasks WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error fetching task:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

module.exports = router;


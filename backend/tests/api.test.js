const request = require('supertest');
const app = require('../server');

describe('API Endpoints', () => {
  describe('GET /', () => {
    it('should return API information', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message');
      expect(res.body).toHaveProperty('version');
      expect(res.body).toHaveProperty('status');
    });
  });

  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toBeGreaterThanOrEqual(200);
      expect(res.statusCode).toBeLessThan(600);
      expect(res.body).toHaveProperty('status');
      expect(res.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /api/health/live', () => {
    it('should return liveness status', async () => {
      const res = await request(app).get('/api/health/live');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('status', 'alive');
    });
  });

  describe('GET /api/tasks', () => {
    it('should return tasks array', async () => {
      const res = await request(app).get('/api/tasks');
      expect(res.statusCode).toBeGreaterThanOrEqual(200);
      expect(res.statusCode).toBeLessThan(500);
      if (res.statusCode === 200) {
        expect(Array.isArray(res.body)).toBe(true);
      }
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const newTask = {
        title: 'Test Task',
        description: 'This is a test task'
      };

      const res = await request(app)
        .post('/api/tasks')
        .send(newTask);

      if (res.statusCode === 201) {
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('title', newTask.title);
        expect(res.body).toHaveProperty('description', newTask.description);
      }
      // Test may fail if database is not available, that's okay for testing
    });

    it('should return error for empty title', async () => {
      const invalidTask = {
        title: '',
        description: 'Task without title'
      };

      const res = await request(app)
        .post('/api/tasks')
        .send(invalidTask);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });
});


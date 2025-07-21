# Task Manager API Documentation

## Base URL
- **Development**: `http://localhost:3001`
- **Production**: `https://your-domain.com`

## API Endpoints

### Health Check Endpoints

#### GET /api/health
Returns the overall health status of the application and its dependencies.

**Response:**
```json
{
  "status": "healthy", // "healthy", "degraded", or "unhealthy"
  "timestamp": "2024-01-20T10:30:00.000Z",
  "uptime": 3600.5,
  "version": "1.0.0",
  "environment": "development",
  "services": {
    "database": "healthy", // "healthy", "unhealthy", or "unknown"
    "redis": "healthy"     // "healthy", "unhealthy", "not_connected", or "unknown"
  }
}
```

#### GET /api/health/ready
Readiness probe endpoint for container orchestration.

**Response:**
```json
{
  "status": "ready",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

#### GET /api/health/live
Liveness probe endpoint for container orchestration.

**Response:**
```json
{
  "status": "alive",
  "timestamp": "2024-01-20T10:30:00.000Z",
  "uptime": 3600.5
}
```

### Task Management Endpoints

#### GET /api/tasks
Retrieve all tasks, ordered by creation date (newest first).

**Response:**
```json
[
  {
    "id": 1,
    "title": "Sample Task",
    "description": "This is a sample task",
    "completed": false,
    "created_at": "2024-01-20T10:00:00.000Z",
    "updated_at": "2024-01-20T10:00:00.000Z"
  }
]
```

#### POST /api/tasks
Create a new task.

**Request Body:**
```json
{
  "title": "Task Title",        // Required: string, max 255 characters
  "description": "Task details" // Optional: string
}
```

**Response (201 Created):**
```json
{
  "id": 2,
  "title": "Task Title",
  "description": "Task details",
  "completed": false,
  "created_at": "2024-01-20T10:30:00.000Z",
  "updated_at": "2024-01-20T10:30:00.000Z"
}
```

#### GET /api/tasks/:id
Retrieve a specific task by ID.

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Sample Task",
  "description": "This is a sample task",
  "completed": false,
  "created_at": "2024-01-20T10:00:00.000Z",
  "updated_at": "2024-01-20T10:00:00.000Z"
}
```

**Response (404 Not Found):**
```json
{
  "error": "Task not found"
}
```

#### PUT /api/tasks/:id
Update an existing task. You can update any combination of fields.

**Request Body (all fields optional):**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "completed": true
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Updated Title",
  "description": "Updated description",
  "completed": true,
  "created_at": "2024-01-20T10:00:00.000Z",
  "updated_at": "2024-01-20T10:35:00.000Z"
}
```

#### DELETE /api/tasks/:id
Delete a task by ID.

**Response (200 OK):**
```json
{
  "message": "Task deleted successfully"
}
```

**Response (404 Not Found):**
```json
{
  "error": "Task not found"
}
```

## Error Responses

All endpoints may return these error responses:

### 400 Bad Request
```json
{
  "error": "Validation error message"
}
```

### 500 Internal Server Error
```json
{
  "error": "Something went wrong!",
  "message": "Detailed error message (in development only)"
}
```

### 503 Service Unavailable
```json
{
  "status": "not_ready",
  "timestamp": "2024-01-20T10:30:00.000Z",
  "error": "Database not available"
}
```

## Caching

The API uses Redis for caching:
- **GET /api/tasks**: Results cached for 60 seconds
- Cache is automatically invalidated when tasks are created, updated, or deleted
- If Redis is unavailable, the API continues to work without caching

## Rate Limiting

Currently, no rate limiting is implemented. Consider adding rate limiting for production deployments.

## CORS

The API accepts requests from:
- Development: `http://localhost:3000`
- Production: Configurable via `FRONTEND_URL` environment variable

## Environment Variables

See `.env.example` for all available configuration options.

## Testing the API

### Using curl:

```bash
# Get all tasks
curl http://localhost:3001/api/tasks

# Create a task
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Task","description":"Created via curl"}'

# Update a task
curl -X PUT http://localhost:3001/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'

# Delete a task
curl -X DELETE http://localhost:3001/api/tasks/1

# Check health
curl http://localhost:3001/api/health
```

### Using the Frontend:
The React frontend provides a user-friendly interface to interact with all API endpoints.

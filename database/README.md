# Database Setup

## Manual Setup
1. Create PostgreSQL database: `taskdb`
2. Run: `psql -U postgres -d taskdb -f init.sql`

## Docker Setup
Database will be automatically initialized when using Docker Compose.

## Schema
- **tasks**: Main tasks table with auto-incrementing ID
- Includes sample data for testing
- Automatic timestamp updates via triggers

# Local Development Setup

## Prerequisites
- Node.js 18+ 
- PostgreSQL 13+
- Redis 6+
- Git

## Quick Start (Without Docker)

### 1. Database Setup
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE taskdb;

# Run initialization script
\i database/init.sql

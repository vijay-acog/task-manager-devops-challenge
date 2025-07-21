-- Create database if it doesn't exist
-- Note: This file is for manual setup, Docker will handle database creation

-- Create the tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on created_at for better query performance
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at DESC);

-- Create an index on completed status
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);

-- Insert some sample data for testing
INSERT INTO tasks (title, description) VALUES 
    ('Welcome Task', 'This is your first task in the system!'),
    ('Setup Development Environment', 'Configure Docker and Docker Compose for local development'),
    ('Review API Documentation', 'Familiarize yourself with the task management API endpoints'),
    ('Test Application Features', 'Try creating, updating, and deleting tasks through the UI')
ON CONFLICT DO NOTHING;

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();


-- PostgreSQL Setup Script
-- Run this if you want to manually set up PostgreSQL

-- Create database (run this connected to postgres database)
CREATE DATABASE user_management;

-- Connect to the database
\c user_management;

-- Create users table (Prisma will do this, but this is for reference)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'User',
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE
ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO users (name, email, role, status) VALUES
    ('John Doe', 'john@example.com', 'Admin', 'Active'),
    ('Jane Smith', 'jane@example.com', 'User', 'Active'),
    ('Bob Johnson', 'bob@example.com', 'Manager', 'Inactive');

-- Verify
SELECT * FROM users;


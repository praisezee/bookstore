-- Create default admin user
-- Username: admin
-- Password: admin123
INSERT INTO admin_users (username, password_hash, email) VALUES 
('admin', '$2b$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQ', 'admin@bookstore.com')
ON CONFLICT (username) DO NOTHING;

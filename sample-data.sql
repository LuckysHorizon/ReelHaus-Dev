-- Sample Data for ReelHaus Events Portal
-- Run this in your Supabase SQL Editor

-- 1. Insert sample profiles
INSERT INTO profiles (id, name, email, phone, role, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'John Doe', 'john.doe@example.com', '+919876543210', 'student', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'Jane Smith', 'jane.smith@example.com', '+919876543211', 'student', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'Mike Johnson', 'mike.johnson@example.com', '+919876543212', 'student', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'Sarah Wilson', 'sarah.wilson@example.com', '+919876543213', 'student', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'Alex Brown', 'alex.brown@example.com', '+919876543214', 'student', NOW(), NOW());

-- 2. Insert sample events
INSERT INTO events (id, title, description, cover_image_url, start_datetime, end_datetime, seats_total, seats_available, price_cents, currency, is_active, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440010', 'Neon Nights', 'An electrifying night of electronic music and neon lights', '/placeholder.jpg', '2024-11-15T21:00:00Z', '2024-11-16T03:00:00Z', 100, 45, 150000, 'INR', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440011', 'Sunset Sessions', 'Chill vibes and sunset views with acoustic performances', '/placeholder.jpg', '2024-11-20T18:00:00Z', '2024-11-20T22:00:00Z', 80, 70, 80000, 'INR', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440012', 'Retro Rewind', 'A blast from the past with 80s and 90s hits', '/placeholder.jpg', '2024-12-01T20:00:00Z', '2024-12-02T02:00:00Z', 120, 120, 120000, 'INR', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440013', 'Silent Disco', 'Three DJs, three channels, one unforgettable night', '/placeholder.jpg', '2024-12-10T22:00:00Z', '2024-12-11T04:00:00Z', 60, 30, 180000, 'INR', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440014', 'New Year''s Eve Bash', 'Ring in the new year with the biggest party in town!', '/placeholder.jpg', '2024-12-31T20:00:00Z', '2025-01-01T06:00:00Z', 200, 200, 500000, 'INR', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440015', 'Winter Wonderland', 'A magical evening with themed decor and special cocktails', '/placeholder.jpg', '2025-01-20T19:00:00Z', '2025-01-21T01:00:00Z', 90, 90, 100000, 'INR', false, NOW(), NOW());

-- 3. Insert sample registrations
INSERT INTO registrations (id, event_id, user_id, name, email, phone, tickets, status, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440001', 'John Doe', 'john.doe@example.com', '+919876543210', 2, 'paid', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440002', 'Jane Smith', 'jane.smith@example.com', '+919876543211', 1, 'paid', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440003', 'Mike Johnson', 'mike.johnson@example.com', '+919876543212', 3, 'paid', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440004', 'Sarah Wilson', 'sarah.wilson@example.com', '+919876543213', 1, 'pending', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440024', '550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440005', 'Alex Brown', 'alex.brown@example.com', '+919876543214', 2, 'paid', NOW(), NOW());

-- 4. Insert sample payments
INSERT INTO payments (id, registration_id, provider, provider_order_id, provider_payment_id, amount_cents, currency, status, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440020', 'razorpay', 'order_001', 'pay_001', 300000, 'INR', 'succeeded', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440021', 'razorpay', 'order_002', 'pay_002', 150000, 'INR', 'succeeded', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440022', 'razorpay', 'order_003', 'pay_003', 240000, 'INR', 'succeeded', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440033', '550e8400-e29b-41d4-a716-446655440023', 'razorpay', 'order_004', NULL, 80000, 'INR', 'initiated', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440034', '550e8400-e29b-41d4-a716-446655440024', 'razorpay', 'order_005', 'pay_005', 360000, 'INR', 'succeeded', NOW(), NOW());

-- 5. Insert sample audit logs
INSERT INTO audit_log (id, admin_id, action, resource_type, resource_id, details, ip_address, user_agent, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440000', 'create_event', 'event', '550e8400-e29b-41d4-a716-446655440010', '{"event_title": "Neon Nights"}', '192.168.1.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', NOW()),
('550e8400-e29b-41d4-a716-446655440041', '550e8400-e29b-41d4-a716-446655440000', 'create_event', 'event', '550e8400-e29b-41d4-a716-446655440011', '{"event_title": "Sunset Sessions"}', '192.168.1.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', NOW()),
('550e8400-e29b-41d4-a716-446655440042', '550e8400-e29b-41d4-a716-446655440000', 'create_event', 'event', '550e8400-e29b-41d4-a716-446655440012', '{"event_title": "Retro Rewind"}', '192.168.1.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', NOW()),
('550e8400-e29b-41d4-a716-446655440043', '550e8400-e29b-41d4-a716-446655440000', 'create_event', 'event', '550e8400-e29b-41d4-a716-446655440013', '{"event_title": "Silent Disco"}', '192.168.1.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', NOW()),
('550e8400-e29b-41d4-a716-446655440044', '550e8400-e29b-41d4-a716-446655440000', 'create_event', 'event', '550e8400-e29b-41d4-a716-446655440014', '{"event_title": "New Year''s Eve Bash"}', '192.168.1.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', NOW()),
('550e8400-e29b-41d4-a716-446655440045', '550e8400-e29b-41d4-a716-446655440000', 'create_event', 'event', '550e8400-e29b-41d4-a716-446655440015', '{"event_title": "Winter Wonderland"}', '192.168.1.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', NOW());

-- 6. Insert sample exports
INSERT INTO exports (id, event_id, file_url, generated_at, generated_by) VALUES
('550e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440010', 'exports/registrations_event-001_2024-10-12.xlsx', NOW(), '550e8400-e29b-41d4-a716-446655440000'),
('550e8400-e29b-41d4-a716-446655440051', '550e8400-e29b-41d4-a716-446655440011', 'exports/registrations_october_2024.xlsx', NOW(), '550e8400-e29b-41d4-a716-446655440000');

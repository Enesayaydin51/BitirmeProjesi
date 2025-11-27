-- Initialize gym app database
-- This script runs after all tables are created by Docker

-- Insert sample data
INSERT INTO gyms (name, address, phone_number, email, description, opening_hours, facilities) VALUES
('FitLife Gym', 'Kadıköy, İstanbul', '+90 216 123 45 67', 'info@fitlifegym.com', 'Modern fitness center with latest equipment', 
 '{"monday": "06:00-23:00", "tuesday": "06:00-23:00", "wednesday": "06:00-23:00", "thursday": "06:00-23:00", "friday": "06:00-23:00", "saturday": "08:00-22:00", "sunday": "08:00-22:00"}',
 '["Cardio Equipment", "Weight Training", "Group Classes", "Personal Training", "Sauna", "Locker Rooms"]'),
('PowerGym', 'Beşiktaş, İstanbul', '+90 212 987 65 43', 'contact@powergym.com', 'Heavy lifting and powerlifting focused gym',
 '{"monday": "05:00-24:00", "tuesday": "05:00-24:00", "wednesday": "05:00-24:00", "thursday": "05:00-24:00", "friday": "05:00-24:00", "saturday": "06:00-23:00", "sunday": "06:00-23:00"}',
 '["Powerlifting Equipment", "Olympic Lifting", "Strongman Equipment", "Cardio", "Locker Rooms"]');

-- Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gyms_updated_at BEFORE UPDATE ON gyms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_memberships_updated_at BEFORE UPDATE ON memberships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workouts_updated_at BEFORE UPDATE ON workouts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
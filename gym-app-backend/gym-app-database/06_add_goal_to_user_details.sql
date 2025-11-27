-- Add goal column to user_details table
ALTER TABLE user_details 
ADD COLUMN IF NOT EXISTS goal VARCHAR(50);


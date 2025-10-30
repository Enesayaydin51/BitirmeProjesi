-- Create gyms table
CREATE TABLE IF NOT EXISTS gyms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    phone_number VARCHAR(20),
    email VARCHAR(255),
    description TEXT,
    opening_hours JSONB,
    facilities JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create memberships table
CREATE TABLE IF NOT EXISTS memberships (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    gym_id INTEGER NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    membership_type VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create workouts table
CREATE TABLE IF NOT EXISTS workouts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    gym_id INTEGER NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    workout_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create workout_exercises table
CREATE TABLE IF NOT EXISTS workout_exercises (
    id SERIAL PRIMARY KEY,
    workout_id INTEGER NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
    exercise_name VARCHAR(255) NOT NULL,
    sets INTEGER,
    reps INTEGER,
    weight DECIMAL(8,2),
    duration INTEGER, -- in seconds
    rest_time INTEGER, -- in seconds
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- Create diets table
CREATE TABLE IF NOT EXISTS diets (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    total_calories INTEGER,
    protein_grams DECIMAL(6,2),
    carbs_grams DECIMAL(6,2),
    fats_grams DECIMAL(6,2),
    meals JSONB, -- örnek: [{"meal": "Breakfast", "items": ["Eggs", "Oatmeal"]}, ...]
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);



-- Create user_diets table
CREATE TABLE IF NOT EXISTS user_diets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    diet_id INTEGER NOT NULL REFERENCES diets(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'active', -- örnek: active, completed, paused
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_memberships_user_id ON memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_gym_id ON memberships(gym_id);
CREATE INDEX IF NOT EXISTS idx_memberships_status ON memberships(status);
CREATE INDEX IF NOT EXISTS idx_workouts_user_id ON workouts(user_id);
CREATE INDEX IF NOT EXISTS idx_workouts_gym_id ON workouts(gym_id);
CREATE INDEX IF NOT EXISTS idx_workouts_date ON workouts(workout_date);
CREATE INDEX IF NOT EXISTS idx_workout_exercises_workout_id ON workout_exercises(workout_id);
CREATE INDEX IF NOT EXISTS idx_user_diets_user_id ON user_diets(user_id);
CREATE INDEX IF NOT EXISTS idx_user_diets_diet_id ON user_diets(diet_id);
CREATE INDEX IF NOT EXISTS idx_user_diets_status ON user_diets(status);


-- Add comments
COMMENT ON TABLE gyms IS 'Gym locations and information';
COMMENT ON TABLE memberships IS 'User gym memberships';
COMMENT ON TABLE workouts IS 'User workout sessions';
COMMENT ON TABLE workout_exercises IS 'Individual exercises within workouts';
COMMENT ON TABLE diets IS 'Predefined diet plans and nutritional breakdowns';
COMMENT ON TABLE user_diets IS 'User-specific diet tracking and assignments';

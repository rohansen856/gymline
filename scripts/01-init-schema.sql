-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  age INT,
  height_cm INT,
  weight_kg DECIMAL(5, 2),
  goal VARCHAR(100),
  protein_target INT DEFAULT 140,
  water_target_liters DECIMAL(3, 1) DEFAULT 3,
  steps_target INT DEFAULT 8000,
  sleep_target_hours DECIMAL(2, 1) DEFAULT 7.5,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create workout plans table
CREATE TABLE IF NOT EXISTS workout_plans (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL,
  -- removed invalid constraint syntax from day_of_week column
  day_name VARCHAR(20) NOT NULL,
  workout_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create exercises table
CREATE TABLE IF NOT EXISTS exercises (
  id SERIAL PRIMARY KEY,
  workout_plan_id INT REFERENCES workout_plans(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  sets_target INT,
  reps_target VARCHAR(20),
  notes TEXT,
  order_index INT DEFAULT 0
);

-- Create workout logs table
CREATE TABLE IF NOT EXISTS workout_logs (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  day_type VARCHAR(50),
  cardio_done BOOLEAN DEFAULT FALSE,
  cardio_duration_min INT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, log_date)
);

-- Create exercise set logs table
CREATE TABLE IF NOT EXISTS exercise_set_logs (
  id SERIAL PRIMARY KEY,
  workout_log_id INT REFERENCES workout_logs(id) ON DELETE CASCADE,
  exercise_name VARCHAR(255) NOT NULL,
  set_number INT,
  weight DECIMAL(5, 2),
  reps INT,
  rir INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create daily habit logs table
CREATE TABLE IF NOT EXISTS daily_habit_logs (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  body_weight_kg DECIMAL(5, 2),
  protein_done BOOLEAN DEFAULT FALSE,
  water_done BOOLEAN DEFAULT FALSE,
  steps_done BOOLEAN DEFAULT FALSE,
  cardio_done BOOLEAN DEFAULT FALSE,
  sleep_hours DECIMAL(3, 1),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, log_date)
);

-- Create food quality checklist table
CREATE TABLE IF NOT EXISTS food_quality_checklist (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  eggs_chicken_done BOOLEAN DEFAULT FALSE,
  fruits_done BOOLEAN DEFAULT FALSE,
  veggies_done BOOLEAN DEFAULT FALSE,
  soft_drink_avoided BOOLEAN DEFAULT FALSE,
  junk_controlled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, log_date)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_id ON users(id);
CREATE INDEX IF NOT EXISTS idx_workout_logs_user_date ON workout_logs(user_id, log_date);
CREATE INDEX IF NOT EXISTS idx_daily_habit_logs_user_date ON daily_habit_logs(user_id, log_date);
CREATE INDEX IF NOT EXISTS idx_food_quality_user_date ON food_quality_checklist(user_id, log_date);

-- Create body measurements table
CREATE TABLE IF NOT EXISTS body_measurements (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  measurement_date DATE NOT NULL,
  weight_kg DECIMAL(5, 2),
  chest_cm DECIMAL(5, 2),
  waist_cm DECIMAL(5, 2),
  hips_cm DECIMAL(5, 2),
  bicep_left_cm DECIMAL(5, 2),
  bicep_right_cm DECIMAL(5, 2),
  forearm_left_cm DECIMAL(5, 2),
  forearm_right_cm DECIMAL(5, 2),
  thigh_left_cm DECIMAL(5, 2),
  thigh_right_cm DECIMAL(5, 2),
  calf_left_cm DECIMAL(5, 2),
  calf_right_cm DECIMAL(5, 2),
  neck_cm DECIMAL(5, 2),
  shoulders_cm DECIMAL(5, 2),
  body_fat_percentage DECIMAL(4, 2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, measurement_date)
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_body_measurements_user_date ON body_measurements(user_id, measurement_date);

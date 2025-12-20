/*
  # User Levels and Achievements System

  ## New Tables
  
  1. `user_stats`
    - `id` (uuid, primary key)
    - `user_id` (uuid, foreign key to users)
    - `level` (integer) - User's current level
    - `xp` (integer) - Experience points
    - `total_courses_completed` (integer)
    - `total_lessons_completed` (integer)
    - `current_streak` (integer) - Days in a row
    - `longest_streak` (integer)
    - `last_activity_date` (date)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)
    
  2. `achievements`
    - `id` (uuid, primary key)
    - `name` (text)
    - `description` (text)
    - `icon` (text)
    - `requirement_type` (text) - 'courses_completed', 'lessons_completed', 'streak', 'level'
    - `requirement_value` (integer)
    - `xp_reward` (integer)
    - `created_at` (timestamptz)
    
  3. `user_achievements`
    - `id` (uuid, primary key)
    - `user_id` (uuid, foreign key to users)
    - `achievement_id` (uuid, foreign key to achievements)
    - `unlocked_at` (timestamptz)

  ## Functions
  - Auto-create user_stats when user is created
  - Calculate level from XP
  - Update streak on activity

  ## Security
  - Enable RLS on all tables
  - Users can view their own stats and achievements
  - System can update stats automatically
*/

-- Create user_stats table
CREATE TABLE IF NOT EXISTS user_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  level integer DEFAULT 1 CHECK (level > 0),
  xp integer DEFAULT 0 CHECK (xp >= 0),
  total_courses_completed integer DEFAULT 0 CHECK (total_courses_completed >= 0),
  total_lessons_completed integer DEFAULT 0 CHECK (total_lessons_completed >= 0),
  current_streak integer DEFAULT 0 CHECK (current_streak >= 0),
  longest_streak integer DEFAULT 0 CHECK (longest_streak >= 0),
  last_activity_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own stats"
  ON user_stats FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own stats"
  ON user_stats FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can insert user stats"
  ON user_stats FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  icon text,
  requirement_type text NOT NULL CHECK (requirement_type IN ('courses_completed', 'lessons_completed', 'streak', 'level', 'enrollment')),
  requirement_value integer NOT NULL,
  xp_reward integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view achievements"
  ON achievements FOR SELECT
  TO authenticated
  USING (true);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  achievement_id uuid REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at timestamptz DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own achievements"
  ON user_achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can unlock achievements"
  ON user_achievements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Function to create user stats when user is created
CREATE OR REPLACE FUNCTION create_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_stats (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create user stats
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_create_user_stats'
  ) THEN
    CREATE TRIGGER trigger_create_user_stats
      AFTER INSERT ON users
      FOR EACH ROW
      EXECUTE FUNCTION create_user_stats();
  END IF;
END $$;

-- Insert default achievements
INSERT INTO achievements (name, description, icon, requirement_type, requirement_value, xp_reward)
VALUES
  ('First Steps', 'Complete your first lesson', '🎯', 'lessons_completed', 1, 10),
  ('Getting Started', 'Complete 5 lessons', '⭐', 'lessons_completed', 5, 25),
  ('Dedicated Learner', 'Complete 25 lessons', '🌟', 'lessons_completed', 25, 100),
  ('Course Master', 'Complete 50 lessons', '💎', 'lessons_completed', 50, 250),
  ('First Course', 'Complete your first course', '🎓', 'courses_completed', 1, 50),
  ('Course Collector', 'Complete 3 courses', '📚', 'courses_completed', 3, 150),
  ('Knowledge Seeker', 'Complete 5 courses', '🏆', 'courses_completed', 5, 300),
  ('Week Warrior', 'Maintain a 7-day streak', '🔥', 'streak', 7, 100),
  ('Month Champion', 'Maintain a 30-day streak', '💪', 'streak', 30, 500),
  ('Welcome Aboard', 'Join the platform', '👋', 'enrollment', 1, 5)
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON user_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON user_achievements(achievement_id);
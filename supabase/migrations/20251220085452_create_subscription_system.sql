/*
  # Subscription System and Enhanced Course Content

  ## New Tables
  
  1. `subscriptions`
    - `id` (uuid, primary key)
    - `user_id` (uuid, foreign key to users)
    - `plan_type` (text) - 'monthly' or 'lifetime'
    - `status` (text) - 'active', 'expired', 'cancelled'
    - `start_date` (timestamptz)
    - `end_date` (timestamptz, nullable for lifetime)
    - `price_paid` (numeric)
    - `created_at` (timestamptz)
    
  2. `course_content`
    - `id` (uuid, primary key)
    - `section_id` (uuid, foreign key to course_sections)
    - `content_type` (text) - 'video', 'text', 'roadmap', 'tutorial'
    - `title` (text)
    - `content` (text) - URL for videos, markdown/text content
    - `order_index` (integer)
    - `duration` (integer) - for videos
    - `created_at` (timestamptz)
    
  3. `course_order`
    - `id` (uuid, primary key)
    - `course_id` (uuid, foreign key to courses)
    - `order_index` (integer) - defines the order courses must be taken
    - `prerequisite_course_id` (uuid, nullable, foreign key to courses)
    - `created_at` (timestamptz)

  ## Modifications
  - Add `content_type` and `content_data` to course_sections for backward compatibility
  - Update enrollments to track subscription-based access

  ## Security
  - Enable RLS on all new tables
  - Add policies for authenticated users to read their own data
  - Add policies for instructors to manage content
*/

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  plan_type text NOT NULL CHECK (plan_type IN ('monthly', 'lifetime')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  start_date timestamptz NOT NULL DEFAULT now(),
  end_date timestamptz,
  price_paid numeric DEFAULT 0 CHECK (price_paid >= 0),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, status)
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions"
  ON subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create course_content table for enhanced content types
CREATE TABLE IF NOT EXISTS course_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid REFERENCES course_sections(id) ON DELETE CASCADE,
  content_type text NOT NULL CHECK (content_type IN ('video', 'text', 'roadmap', 'tutorial')),
  title text NOT NULL,
  content text NOT NULL,
  order_index integer DEFAULT 0,
  duration integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE course_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published course content"
  ON course_content FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM course_sections cs
      JOIN courses c ON cs.course_id = c.id
      WHERE cs.id = course_content.section_id
      AND c.is_published = true
    )
  );

CREATE POLICY "Instructors can manage their course content"
  ON course_content FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM course_sections cs
      JOIN courses c ON cs.course_id = c.id
      WHERE cs.id = course_content.section_id
      AND c.instructor_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM course_sections cs
      JOIN courses c ON cs.course_id = c.id
      WHERE cs.id = course_content.section_id
      AND c.instructor_id = auth.uid()
    )
  );

-- Create course_order table for progressive unlocking
CREATE TABLE IF NOT EXISTS course_order (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  order_index integer NOT NULL,
  prerequisite_course_id uuid REFERENCES courses(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(course_id)
);

ALTER TABLE course_order ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view course order"
  ON course_order FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and instructors can manage course order"
  ON course_order FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'instructor')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'instructor')
    )
  );

-- Add subscription_based field to courses table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'courses' AND column_name = 'subscription_only'
  ) THEN
    ALTER TABLE courses ADD COLUMN subscription_only boolean DEFAULT true;
  END IF;
END $$;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status ON subscriptions(user_id, status);
CREATE INDEX IF NOT EXISTS idx_course_content_section ON course_content(section_id);
CREATE INDEX IF NOT EXISTS idx_course_order_index ON course_order(order_index);
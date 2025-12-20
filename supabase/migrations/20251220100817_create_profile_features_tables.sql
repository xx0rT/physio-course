/*
  # Create Profile Features Tables

  1. New Tables
    - `user_notes` - Personal notes and goals
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `title` (text)
      - `content` (text)
      - `note_type` (text) - 'note' or 'goal'
      - `is_completed` (boolean) - for goals
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `certificates` - Course completion certificates
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `course_id` (uuid, foreign key to courses)
      - `certificate_number` (text, unique)
      - `issue_date` (timestamptz)
      - `completion_date` (timestamptz)
      - `certificate_url` (text) - link to certificate file/image
      - `created_at` (timestamptz)
    
    - `messages` - Communication between users and instructors
      - `id` (uuid, primary key)
      - `sender_id` (uuid, foreign key to users)
      - `receiver_id` (uuid, foreign key to users)
      - `subject` (text)
      - `content` (text)
      - `is_read` (boolean)
      - `parent_message_id` (uuid) - for threading
      - `created_at` (timestamptz)
    
    - `community_posts` - Community discussions and activities
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `title` (text)
      - `content` (text)
      - `post_type` (text) - 'discussion', 'challenge', 'achievement'
      - `likes_count` (integer)
      - `comments_count` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `community_comments` - Comments on community posts
      - `id` (uuid, primary key)
      - `post_id` (uuid, foreign key to community_posts)
      - `user_id` (uuid, foreign key to users)
      - `content` (text)
      - `created_at` (timestamptz)
    
    - `notifications` - User notifications
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `title` (text)
      - `message` (text)
      - `notification_type` (text) - 'course', 'achievement', 'message', 'reminder', 'system'
      - `is_read` (boolean)
      - `action_url` (text) - link to relevant page
      - `created_at` (timestamptz)
    
    - `user_health_preferences` - Health information and preferences (optional)
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users, unique)
      - `health_notes` (text)
      - `allergies` (text array)
      - `physical_limitations` (text array)
      - `preferences` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `recommended_materials` - Recommended learning materials
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `title` (text)
      - `description` (text)
      - `material_type` (text) - 'book', 'video', 'article', 'course'
      - `url` (text)
      - `is_completed` (boolean)
      - `created_at` (timestamptz)
    
    - `lesson_schedule` - Scheduled lessons and consultations
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `instructor_id` (uuid, foreign key to users)
      - `course_id` (uuid, foreign key to courses)
      - `title` (text)
      - `description` (text)
      - `scheduled_at` (timestamptz)
      - `duration_minutes` (integer)
      - `status` (text) - 'scheduled', 'completed', 'cancelled'
      - `meeting_url` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for instructors to view their students' relevant data
*/

-- User Notes Table
CREATE TABLE IF NOT EXISTS user_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text,
  note_type text NOT NULL DEFAULT 'note' CHECK (note_type IN ('note', 'goal')),
  is_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notes"
  ON user_notes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notes"
  ON user_notes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notes"
  ON user_notes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own notes"
  ON user_notes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Certificates Table
CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  certificate_number text UNIQUE NOT NULL,
  issue_date timestamptz DEFAULT now(),
  completion_date timestamptz,
  certificate_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own certificates"
  ON certificates FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Certificates are publicly viewable"
  ON certificates FOR SELECT
  TO anon
  USING (true);

-- Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES users(id) ON DELETE CASCADE,
  receiver_id uuid REFERENCES users(id) ON DELETE CASCADE,
  subject text NOT NULL,
  content text NOT NULL,
  is_read boolean DEFAULT false,
  parent_message_id uuid REFERENCES messages(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their messages"
  ON messages FOR SELECT
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their received messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (auth.uid() = receiver_id)
  WITH CHECK (auth.uid() = receiver_id);

-- Community Posts Table
CREATE TABLE IF NOT EXISTS community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  post_type text NOT NULL DEFAULT 'discussion' CHECK (post_type IN ('discussion', 'challenge', 'achievement')),
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view community posts"
  ON community_posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create posts"
  ON community_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON community_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON community_posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Community Comments Table
CREATE TABLE IF NOT EXISTS community_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view comments"
  ON community_comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON community_comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON community_comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON community_comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  notification_type text NOT NULL CHECK (notification_type IN ('course', 'achievement', 'message', 'reminder', 'system')),
  is_read boolean DEFAULT false,
  action_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- User Health Preferences Table
CREATE TABLE IF NOT EXISTS user_health_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  health_notes text,
  allergies text[] DEFAULT ARRAY[]::text[],
  physical_limitations text[] DEFAULT ARRAY[]::text[],
  preferences jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_health_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own health preferences"
  ON user_health_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health preferences"
  ON user_health_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own health preferences"
  ON user_health_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Recommended Materials Table
CREATE TABLE IF NOT EXISTS recommended_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  material_type text NOT NULL CHECK (material_type IN ('book', 'video', 'article', 'course')),
  url text,
  is_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE recommended_materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own materials"
  ON recommended_materials FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own materials"
  ON recommended_materials FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own materials"
  ON recommended_materials FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Lesson Schedule Table
CREATE TABLE IF NOT EXISTS lesson_schedule (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  instructor_id uuid REFERENCES users(id) ON DELETE SET NULL,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  scheduled_at timestamptz NOT NULL,
  duration_minutes integer DEFAULT 60,
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  meeting_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE lesson_schedule ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own scheduled lessons"
  ON lesson_schedule FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = instructor_id);

CREATE POLICY "Users can create own scheduled lessons"
  ON lesson_schedule FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users and instructors can update scheduled lessons"
  ON lesson_schedule FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = instructor_id)
  WITH CHECK (auth.uid() = user_id OR auth.uid() = instructor_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_notes_user_id ON user_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_user_id ON certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_post_id ON community_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_schedule_user_id ON lesson_schedule(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_schedule_instructor_id ON lesson_schedule(instructor_id);
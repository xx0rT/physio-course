/*
  # Enhanced User Profiles System

  1. New Tables
    - `user_profiles_extended`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `bio` (text)
      - `profile_picture_url` (text)
      - `banner_image_url` (text)
      - `theme_preference` (text, default: 'default')
      - `color_scheme` (jsonb)
      - `layout_preference` (text, default: 'grid')
      - `social_links` (jsonb)
      - `interests` (text array)
      - `location` (text)
      - `website` (text)
      - `updated_at` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `user_profiles_extended` table
    - Add policies for authenticated users to manage their own profiles
*/

CREATE TABLE IF NOT EXISTS user_profiles_extended (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  bio text DEFAULT '',
  profile_picture_url text,
  banner_image_url text,
  theme_preference text DEFAULT 'default',
  color_scheme jsonb DEFAULT '{"primary": "#8b5cf6", "secondary": "#06b6d4"}'::jsonb,
  layout_preference text DEFAULT 'grid',
  social_links jsonb DEFAULT '{}'::jsonb,
  interests text[] DEFAULT ARRAY[]::text[],
  location text,
  website text,
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles_extended ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own extended profile"
  ON user_profiles_extended
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own extended profile"
  ON user_profiles_extended
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own extended profile"
  ON user_profiles_extended
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own extended profile"
  ON user_profiles_extended
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to automatically create extended profile
CREATE OR REPLACE FUNCTION create_extended_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles_extended (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-create extended profile
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created_extended_profile'
  ) THEN
    CREATE TRIGGER on_auth_user_created_extended_profile
      AFTER INSERT ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION create_extended_profile_for_user();
  END IF;
END $$;

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_extended_updated_at
  BEFORE UPDATE ON user_profiles_extended
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

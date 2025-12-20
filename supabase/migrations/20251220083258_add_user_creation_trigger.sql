/*
  # Add User Profile Creation Trigger

  ## Purpose
  Automatically creates a user profile in the users table when a new user signs up via Supabase Auth.

  ## Changes
  1. Creates a function to handle new user creation
  2. Adds a trigger on auth.users that fires after insert
  3. Automatically populates the users table with data from auth metadata

  ## Security
  - Function runs with security definer to bypass RLS
  - Only triggers on new user creation
  - Safely handles metadata extraction
*/

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, first_name, last_name, role, bio, title, social_links)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'firstName', ''),
    COALESCE(NEW.raw_user_meta_data->>'lastName', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    COALESCE(NEW.raw_user_meta_data->>'bio', ''),
    COALESCE(NEW.raw_user_meta_data->>'title', ''),
    COALESCE(NEW.raw_user_meta_data->'socialLinks', '{}')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
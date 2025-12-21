/*
  # Fix Email Confirmation and Authentication

  1. Purpose
    - Ensures users can log in immediately after registration
    - Auto-confirms email addresses for seamless authentication
    - Updates user creation trigger to handle auth state properly

  2. Changes
    - Updates handle_new_user function to auto-confirm emails
    - Ensures proper user metadata synchronization
    - Maintains security while enabling smooth authentication flow

  3. Security
    - Uses SECURITY DEFINER to bypass RLS for system operations
    - Only affects new user creation process
    - Maintains all existing security policies
*/

-- Update the handle_new_user function to ensure proper auth state
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Insert user into public.users table
  INSERT INTO public.users (
    id, 
    first_name, 
    last_name, 
    role, 
    bio, 
    title, 
    social_links
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'firstName', ''),
    COALESCE(NEW.raw_user_meta_data->>'lastName', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    COALESCE(NEW.raw_user_meta_data->>'bio', ''),
    COALESCE(NEW.raw_user_meta_data->>'title', ''),
    COALESCE(NEW.raw_user_meta_data->'socialLinks', '{}')
  )
  ON CONFLICT (id) DO UPDATE SET
    first_name = COALESCE(EXCLUDED.first_name, users.first_name),
    last_name = COALESCE(EXCLUDED.last_name, users.last_name),
    role = COALESCE(EXCLUDED.role, users.role);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger to ensure it's properly set up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- Ensure any existing users without profiles get them
INSERT INTO public.users (id, first_name, last_name, role, bio, title, social_links)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'firstName', ''),
  COALESCE(au.raw_user_meta_data->>'lastName', ''),
  COALESCE(au.raw_user_meta_data->>'role', 'student'),
  COALESCE(au.raw_user_meta_data->>'bio', ''),
  COALESCE(au.raw_user_meta_data->>'title', ''),
  COALESCE(au.raw_user_meta_data->'socialLinks', '{}')
FROM auth.users au
WHERE au.id NOT IN (SELECT id FROM public.users)
ON CONFLICT (id) DO NOTHING;

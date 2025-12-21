/*
  # Auto-Confirm User Emails on Signup

  ## Purpose
  This migration ensures that all new user registrations are automatically email-confirmed,
  allowing users to login immediately without needing to verify their email address.

  ## Changes
  1. Updates the user creation trigger to auto-confirm emails
  2. Confirms any existing unconfirmed users
  3. Properly handles the generated confirmed_at column

  ## Security
  - Uses SECURITY DEFINER to allow system-level auth updates
  - Only affects email confirmation status
  - All other security policies remain intact
*/

-- Create or replace the trigger function to auto-confirm emails
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert user into public.users table
  INSERT INTO public.users (
    id, 
    first_name, 
    last_name, 
    role, 
    bio, 
    title, 
    social_links,
    email_confirmed
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'firstName', ''),
    COALESCE(NEW.raw_user_meta_data->>'lastName', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    COALESCE(NEW.raw_user_meta_data->>'bio', ''),
    COALESCE(NEW.raw_user_meta_data->>'title', ''),
    COALESCE(NEW.raw_user_meta_data->'socialLinks', '{}'),
    true
  )
  ON CONFLICT (id) DO UPDATE SET
    first_name = COALESCE(EXCLUDED.first_name, users.first_name),
    last_name = COALESCE(EXCLUDED.last_name, users.last_name),
    role = COALESCE(EXCLUDED.role, users.role),
    email_confirmed = true;

  -- Auto-confirm the user's email in auth.users
  -- Note: confirmed_at is a generated column, so we only set email_confirmed_at
  UPDATE auth.users
  SET email_confirmed_at = COALESCE(email_confirmed_at, now())
  WHERE id = NEW.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- Confirm all existing unconfirmed users
UPDATE auth.users 
SET email_confirmed_at = COALESCE(email_confirmed_at, now())
WHERE email_confirmed_at IS NULL;

-- Update public.users to reflect confirmed status
UPDATE public.users 
SET email_confirmed = true
WHERE email_confirmed = false OR email_confirmed IS NULL;

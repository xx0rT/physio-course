/*
  # Enable Email Confirmation on Signup

  ## Purpose
  This migration re-enables email confirmation for new user registrations,
  requiring users to verify their email address before they can log in.

  ## Changes
  1. Updates the user creation trigger to NOT auto-confirm emails
  2. Removes auto-confirmation from the trigger function
  3. Users will now need to confirm their email via the confirmation link sent to their inbox

  ## Security
  - Uses SECURITY DEFINER to allow system-level operations
  - Email confirmation provides better security and validation
  - All other security policies remain intact
*/

-- Update the trigger function to remove auto-confirmation
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
    COALESCE(NEW.email_confirmed_at IS NOT NULL, false)
  )
  ON CONFLICT (id) DO UPDATE SET
    first_name = COALESCE(EXCLUDED.first_name, users.first_name),
    last_name = COALESCE(EXCLUDED.last_name, users.last_name),
    role = COALESCE(EXCLUDED.role, users.role),
    email_confirmed = COALESCE(NEW.email_confirmed_at IS NOT NULL, users.email_confirmed);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

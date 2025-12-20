/*
  # Fix User Creation Trigger

  ## Purpose
  Fixes the user creation trigger to properly create user records in public.users when auth.users records are created.

  ## Changes
  1. Drops the incorrectly placed trigger
  2. Recreates trigger on auth.users table (where it should be)
  3. Migrates existing auth.users to public.users

  ## Security
  - Maintains RLS policies
  - Ensures data consistency between auth.users and public.users
*/

-- Drop the incorrectly placed trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON public.users;

-- Recreate trigger on auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Migrate existing auth users to public.users
INSERT INTO public.users (id, first_name, last_name, role, bio, title, social_links)
SELECT 
  id,
  COALESCE(raw_user_meta_data->>'firstName', ''),
  COALESCE(raw_user_meta_data->>'lastName', ''),
  COALESCE(raw_user_meta_data->>'role', 'student'),
  COALESCE(raw_user_meta_data->>'bio', ''),
  COALESCE(raw_user_meta_data->>'title', ''),
  COALESCE(raw_user_meta_data->'socialLinks', '{}')
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users)
ON CONFLICT (id) DO NOTHING;

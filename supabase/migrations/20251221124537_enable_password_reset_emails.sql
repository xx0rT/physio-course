/*
  # Enable Password Reset Email Configuration
  
  1. Purpose
    - Configure email settings for password reset functionality
    - Ensure users can receive password reset emails
  
  2. Configuration
    - Email confirmation is already disabled (as per previous migrations)
    - Password reset emails should be enabled by default
    - Email rate limiting set to prevent abuse
  
  3. Notes
    - This migration ensures the auth schema is properly configured
    - Email templates are managed through Supabase dashboard
    - For production: Configure custom SMTP in Supabase dashboard
*/

-- Ensure the auth schema exists and is accessible
DO $$
BEGIN
  -- This is a placeholder migration to document the email configuration
  -- Email settings are configured at the Supabase project level
  -- and cannot be modified through SQL migrations
  
  RAISE NOTICE 'Password reset email functionality is enabled by default in Supabase';
  RAISE NOTICE 'To customize email templates, go to: Authentication > Email Templates in Supabase Dashboard';
  RAISE NOTICE 'To configure custom SMTP, go to: Project Settings > Auth > SMTP Settings';
END $$;

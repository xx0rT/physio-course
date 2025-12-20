/*
  # Allow Public Course Viewing

  ## Purpose
  Updates RLS policies to allow unauthenticated users to browse and view courses.
  This enables visitors to explore the platform before signing up.

  ## Changes
  1. Updates course viewing policies to allow anonymous access
  2. Updates course sections viewing for public access
  3. Updates services viewing for public access
  4. Updates instructors (users with role='instructor') viewing for public access

  ## Security
  - Read-only access for unauthenticated users
  - Write operations still require authentication
  - User-specific data remains protected
*/

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Anyone can view active courses" ON courses;
DROP POLICY IF EXISTS "Anyone can view active services" ON services;
DROP POLICY IF EXISTS "Users can view all courses" ON courses;
DROP POLICY IF EXISTS "Users can view course sections" ON course_sections;

-- Courses: Allow anyone (including anonymous) to view courses
CREATE POLICY "Anyone can view courses"
  ON courses FOR SELECT
  TO anon, authenticated
  USING (true);

-- Course Sections: Allow anyone to view course sections
CREATE POLICY "Anyone can view course sections"
  ON course_sections FOR SELECT
  TO anon, authenticated
  USING (true);

-- Services: Allow anyone to view active services
CREATE POLICY "Anyone can view active services"
  ON services FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Users/Instructors: Allow anyone to view instructor profiles
DROP POLICY IF EXISTS "Users can view instructor profiles" ON users;
CREATE POLICY "Anyone can view instructor profiles"
  ON users FOR SELECT
  TO anon, authenticated
  USING (role = 'instructor');
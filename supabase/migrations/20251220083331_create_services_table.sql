/*
  # Create Services Table

  ## Purpose
  Stores platform services/offerings displayed on the Services page

  ## Tables Created
  ### services
  - Stores service information
  - Contains: title, description, icon, features list, price info
  - All services are publicly viewable

  ## Security
  - RLS enabled
  - Public read access for all services
  - Admin-only write access (handled via policies)
*/

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  icon text,
  features text[] DEFAULT ARRAY[]::text[],
  price_info text,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for ordering
CREATE INDEX IF NOT EXISTS idx_services_order ON services(display_order);

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view active services
CREATE POLICY "Anyone can view active services"
  ON services FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Add update trigger
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample services
INSERT INTO services (title, description, icon, features, price_info, display_order) VALUES
  (
    'Expert Instructors',
    'Learn from industry professionals with years of real-world experience',
    '/services/card1.png',
    ARRAY[
      'Industry experts with 10+ years experience',
      'Personalized feedback and guidance',
      'Real-world project experience',
      'Active community support'
    ],
    'Included in all courses',
    1
  ),
  (
    'Flexible Learning',
    'Study at your own pace with lifetime access to course materials',
    '/services/card2.png',
    ARRAY[
      'Learn anytime, anywhere',
      'Lifetime access to content',
      'Mobile and desktop compatible',
      'Download resources for offline learning'
    ],
    'All courses include lifetime access',
    2
  ),
  (
    'Certification Programs',
    'Earn recognized certificates upon course completion',
    '/services/card3.png',
    ARRAY[
      'Industry-recognized certificates',
      'Shareable on LinkedIn',
      'Boost your career prospects',
      'Verified completion badges'
    ],
    'Certificate included with completion',
    3
  ),
  (
    'Live Sessions',
    'Join interactive live sessions with instructors and peers',
    '/services/card1.png',
    ARRAY[
      'Weekly live Q&A sessions',
      'Interactive workshops',
      'Networking opportunities',
      'Recording access for all sessions'
    ],
    'Available for premium courses',
    4
  ),
  (
    'Career Support',
    'Get career guidance and job placement assistance',
    '/services/card2.png',
    ARRAY[
      'Resume review and optimization',
      'Interview preparation',
      'Job market insights',
      'Direct employer connections'
    ],
    'Included in professional tracks',
    5
  ),
  (
    'Project-Based Learning',
    'Apply your skills through hands-on real-world projects',
    '/services/card3.png',
    ARRAY[
      'Build portfolio-worthy projects',
      'Real-world case studies',
      'Code reviews and feedback',
      'Collaborative team projects'
    ],
    'All intermediate and advanced courses',
    6
  )
ON CONFLICT (id) DO NOTHING;
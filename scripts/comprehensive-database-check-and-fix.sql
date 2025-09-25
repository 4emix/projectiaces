-- Comprehensive Database Check and Fix Script
-- This script will clear incorrect data and populate all tables with proper structure

-- Clear all existing data that might have incorrect structure
DELETE FROM hero_content;
DELETE FROM about_content;
DELETE FROM board_members;
DELETE FROM local_committees;
DELETE FROM magazine_articles;
DELETE FROM events;
DELETE FROM contact_info;
DELETE FROM site_settings;

-- Insert proper Hero Content
INSERT INTO hero_content (
  id,
  title,
  subtitle,
  description,
  cta_text,
  cta_link,
  background_image_url,
  is_active,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'International Association of Civil Engineering Students',
  'Connecting Future Engineers Worldwide',
  'Join a global community of civil engineering students and young professionals. Build your network, develop your skills, and shape the future of infrastructure.',
  'Join IACES Today',
  '/join',
  '/placeholder.svg?height=600&width=1200',
  true,
  NOW(),
  NOW()
);

-- Insert proper About Content
INSERT INTO about_content (
  id,
  title,
  content,
  mission_statement,
  vision_statement,
  image_url,
  is_active,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'About IACES',
  'The International Association of Civil Engineering Students (IACES) is a global non-profit organization that connects civil engineering students and young professionals from around the world.',
  'To provide a platform for civil engineering students to exchange knowledge, develop professional skills, and build international networks that will benefit their careers and contribute to the advancement of civil engineering.',
  'To be the leading global network of civil engineering students and young professionals, fostering innovation, sustainability, and excellence in civil engineering education and practice.',
  '/placeholder.svg?height=400&width=600',
  true,
  NOW(),
  NOW()
);

-- Insert proper Board Members
INSERT INTO board_members (
  id,
  name,
  position,
  bio,
  email,
  linkedin_url,
  image_url,
  display_order,
  is_active,
  created_at,
  updated_at
) VALUES 
(
  gen_random_uuid(),
  'Dr. Sarah Johnson',
  'President',
  'Dr. Sarah Johnson is a distinguished civil engineer with over 15 years of experience in structural engineering and sustainable construction. She holds a PhD from MIT and has led numerous international infrastructure projects.',
  'sarah.johnson@iaces.org',
  'https://linkedin.com/in/sarahjohnson',
  '/placeholder.svg?height=300&width=300',
  1,
  true,
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Eng. Michael Chen',
  'Vice President',
  'Michael Chen is a transportation engineer specializing in smart city infrastructure. He has worked on major urban planning projects across Asia and holds a Master''s degree from Stanford University.',
  'michael.chen@iaces.org',
  'https://linkedin.com/in/michaelchen',
  '/placeholder.svg?height=300&width=300',
  2,
  true,
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Dr. Elena Rodriguez',
  'Secretary General',
  'Dr. Elena Rodriguez is an environmental engineer focused on water resources management and climate resilience. She has published over 50 research papers and serves on multiple international committees.',
  'elena.rodriguez@iaces.org',
  'https://linkedin.com/in/elenarodriguez',
  '/placeholder.svg?height=300&width=300',
  3,
  true,
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Eng. David Thompson',
  'Treasurer',
  'David Thompson is a geotechnical engineer with expertise in foundation design and soil mechanics. He has managed multi-million dollar construction projects and holds certifications in project management.',
  'david.thompson@iaces.org',
  'https://linkedin.com/in/davidthompson',
  '/placeholder.svg?height=300&width=300',
  4,
  true,
  NOW(),
  NOW()
);

-- Insert proper Local Committees
INSERT INTO local_committees (
  id,
  name,
  country,
  description,
  website_url,
  logo_url,
  display_order,
  is_active,
  created_at,
  updated_at
) VALUES 
(
  gen_random_uuid(),
  'IACES Germany',
  'Germany',
  'The German chapter of IACES, connecting civil engineering students across major German universities and technical institutes.',
  'https://iaces-germany.org',
  '/placeholder.svg?height=100&width=100',
  1,
  true,
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'IACES Brazil',
  'Brazil',
  'Representing civil engineering students throughout Brazil, focusing on sustainable infrastructure and urban development.',
  'https://iaces-brasil.org',
  '/placeholder.svg?height=100&width=100',
  2,
  true,
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'IACES Japan',
  'Japan',
  'The Japanese chapter promoting innovation in earthquake-resistant design and smart infrastructure technologies.',
  'https://iaces-japan.org',
  '/placeholder.svg?height=100&width=100',
  3,
  true,
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'IACES Canada',
  'Canada',
  'Canadian civil engineering students network focusing on cold climate engineering and sustainable construction practices.',
  'https://iaces-canada.org',
  '/placeholder.svg?height=100&width=100',
  4,
  true,
  NOW(),
  NOW()
);

-- Insert proper Magazine Articles
INSERT INTO magazine_articles (
  id,
  title,
  description,
  issue_number,
  publication_date,
  cover_image_url,
  pdf_url,
  publication_type,
  is_featured,
  is_active,
  created_at,
  updated_at
) VALUES
(
  gen_random_uuid(),
  'Sustainable Infrastructure for the Future',
  'Exploring innovative approaches to sustainable civil engineering and green construction practices.',
  'Vol. 15, Issue 1',
  '2024-03-01',
  '/placeholder.svg?height=400&width=300',
  '/placeholder-pdf.pdf',
  'magazine',
  true,
  true,
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Smart Cities and IoT Integration',
  'How Internet of Things technology is revolutionizing urban infrastructure management.',
  'Vol. 14, Issue 4',
  '2023-12-01',
  '/placeholder.svg?height=400&width=300',
  '/placeholder-pdf.pdf',
  'magazine',
  false,
  true,
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Climate Resilient Design',
  'Engineering solutions for climate change adaptation in civil infrastructure.',
  'Vol. 14, Issue 3',
  '2023-09-01',
  '/placeholder.svg?height=400&width=300',
  '/placeholder-pdf.pdf',
  'magazine',
  false,
  true,
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Monthly Newsletter - September 2024',
  'Conference highlights, new partnerships, and student achievement recognitions.',
  'Newsletter #9',
  '2024-09-01',
  '/placeholder.svg?height=400&width=300',
  '/placeholder-pdf.pdf',
  'newsletter',
  false,
  true,
  NOW(),
  NOW()
);

-- Insert proper Events
INSERT INTO events (
  id,
  title,
  description,
  date,
  time,
  location,
  organizer,
  contact_email,
  contact_phone,
  image_url,
  created_at,
  updated_at
) VALUES 
(
  gen_random_uuid(),
  'Global Civil Engineering Summit 2024',
  'Annual international conference bringing together civil engineering students, professionals, and researchers from around the world.',
  '2024-07-15',
  '09:00:00',
  'Berlin, Germany',
  'IACES Germany',
  'summit2024@iaces.org',
  '+49-30-12345678',
  '/placeholder.svg?height=300&width=500',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Sustainable Construction Workshop',
  'Hands-on workshop focusing on green building techniques and sustainable construction materials.',
  '2024-05-20',
  '14:00:00',
  'São Paulo, Brazil',
  'IACES Brazil',
  'workshop@iaces-brasil.org',
  '+55-11-98765432',
  '/placeholder.svg?height=300&width=500',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Earthquake Engineering Symposium',
  'Technical symposium on seismic design and earthquake-resistant construction methods.',
  '2024-09-10',
  '10:00:00',
  'Tokyo, Japan',
  'IACES Japan',
  'symposium@iaces-japan.org',
  '+81-3-12345678',
  '/placeholder.svg?height=300&width=500',
  NOW(),
  NOW()
);

-- Insert proper Contact Info
INSERT INTO contact_info (
  id,
  address,
  phone,
  email,
  office_hours,
  map_embed_url,
  is_active,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'IACES International Headquarters, 123 Engineering Plaza, Suite 456, Global City, GC 12345',
  '+1-555-IACES-01',
  'info@iaces.org',
  'Monday - Friday: 9:00 AM - 5:00 PM (UTC)',
  'https://maps.google.com/embed?pb=!1m18!1m12!1m3!1d3024.123456789!2d-74.0059413!3d40.7127753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQyJzQ2LjAiTiA3NMKwMDAnMjEuNCJX!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus',
  true,
  NOW(),
  NOW()
);

-- Insert proper Site Settings
INSERT INTO site_settings (
  id,
  key,
  value,
  description,
  created_at,
  updated_at
) VALUES 
(
  gen_random_uuid(),
  'site_title',
  'IACES - International Association of Civil Engineering Students',
  'Main site title',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'site_description',
  'Connecting civil engineering students and young professionals worldwide through education, networking, and professional development.',
  'Site meta description',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'contact_email',
  'info@iaces.org',
  'Primary contact email',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'social_facebook',
  'https://facebook.com/iaces.org',
  'Facebook page URL',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'social_twitter',
  'https://twitter.com/iaces_org',
  'Twitter profile URL',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'social_linkedin',
  'https://linkedin.com/company/iaces',
  'LinkedIn company page URL',
  NOW(),
  NOW()
);

-- Verify data insertion
SELECT 'hero_content' as table_name, COUNT(*) as record_count FROM hero_content
UNION ALL
SELECT 'about_content', COUNT(*) FROM about_content
UNION ALL
SELECT 'board_members', COUNT(*) FROM board_members
UNION ALL
SELECT 'local_committees', COUNT(*) FROM local_committees
UNION ALL
SELECT 'magazine_articles', COUNT(*) FROM magazine_articles
UNION ALL
SELECT 'events', COUNT(*) FROM events
UNION ALL
SELECT 'contact_info', COUNT(*) FROM contact_info
UNION ALL
SELECT 'site_settings', COUNT(*) FROM site_settings;

-- Insert proper hero content for IACES (Civil Engineering)
INSERT INTO hero_content (
  title,
  subtitle,
  description,
  cta_text,
  cta_link,
  is_active,
  user_id
) VALUES (
  'International Association of Civil Engineering Students',
  'Connecting Future Engineers Worldwide',
  'Join a global community of civil engineering students and professionals dedicated to innovation, collaboration, and excellence in sustainable infrastructure development.',
  'Learn More',
  '#about',
  true,
  '00000000-0000-0000-0000-000000000000'
) ON CONFLICT DO NOTHING;

-- Ensure only one active hero content exists
UPDATE hero_content SET is_active = false WHERE is_active = true;
UPDATE hero_content SET is_active = true WHERE title = 'International Association of Civil Engineering Students';

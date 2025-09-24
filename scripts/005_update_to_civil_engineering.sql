-- Update content from Computer Engineering to Civil Engineering
-- This script updates all references to computer engineering to civil engineering

-- Update hero section
UPDATE hero_content SET 
  title = 'International Association of Civil Engineering Students',
  subtitle = 'Join a global community of civil engineering students and professionals dedicated to innovation, collaboration, and excellence in infrastructure and construction.',
  updated_at = NOW()
WHERE title LIKE '%Computer Engineering%';

-- Update about section
UPDATE about_content SET 
  description = 'The International Association of Civil Engineering Students (IACES) is a global organization that brings together students, educators, and professionals in the field of civil engineering. We foster collaboration, innovation, and knowledge sharing across borders.',
  mission = 'To connect and empower civil engineering students worldwide through education, collaboration, and professional development opportunities.',
  vision = 'To be the leading global platform for civil engineering students, driving innovation and excellence in infrastructure and construction education.',
  updated_at = NOW()
WHERE description LIKE '%computer engineering%';

-- Update board members
UPDATE board_members SET 
  bio = 'Renowned researcher in structural engineering and earthquake-resistant design, published author of numerous technical papers.',
  updated_at = NOW()
WHERE name = 'Prof. Michael Chen';

UPDATE board_members SET 
  bio = 'Specialist in sustainable construction and environmental engineering, passionate about green building design and climate resilience.',
  updated_at = NOW()
WHERE name = 'Dr. Emily Rodriguez';

-- Update magazine articles
UPDATE magazine_articles SET 
  title = 'The Future of Smart Infrastructure',
  description = 'Exploring the latest developments in smart cities and IoT integration in civil engineering projects.',
  updated_at = NOW()
WHERE title LIKE '%Quantum Computing%';

UPDATE magazine_articles SET 
  title = 'Sustainable Construction Practices',
  description = 'How civil engineers can contribute to environmental sustainability through green building and eco-friendly construction methods.',
  updated_at = NOW()
WHERE title LIKE '%Sustainable Computing%';

-- Update events
UPDATE events SET 
  title = 'Global Civil Engineering Summit 2024',
  updated_at = NOW()
WHERE title LIKE '%Computer Engineering Summit%';

UPDATE events SET 
  description = 'Annual competition showcasing innovative projects from civil engineering students worldwide.',
  updated_at = NOW()
WHERE description LIKE '%computer engineering students%';

-- Update site settings
UPDATE site_settings SET 
  value = 'IACES - International Association of Civil Engineering Students',
  updated_at = NOW()
WHERE key = 'site_title';

UPDATE site_settings SET 
  value = 'Connecting civil engineering students worldwide',
  updated_at = NOW()
WHERE key = 'site_description';

-- Update committees
UPDATE local_committees SET 
  description = 'Leading civil engineering education and research initiatives across German universities.',
  updated_at = NOW()
WHERE name = 'IACES Germany';

UPDATE local_committees SET 
  description = 'Promoting excellence in civil engineering education and fostering international collaboration.',
  updated_at = NOW()
WHERE name = 'IACES France';

UPDATE local_committees SET 
  description = 'Connecting Spanish civil engineering students and professionals with global opportunities.',
  updated_at = NOW()
WHERE name = 'IACES Spain';

UPDATE local_committees SET 
  description = 'Advancing civil engineering education and research throughout Italian institutions.',
  updated_at = NOW()
WHERE name = 'IACES Italy';

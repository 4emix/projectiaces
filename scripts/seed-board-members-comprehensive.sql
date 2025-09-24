-- Comprehensive seed data for board members
-- This script adds realistic board member data with proper UUIDs

INSERT INTO board_members (
  id,
  name,
  position,
  bio,
  image_url,
  email,
  linkedin_url,
  display_order,
  is_active,
  user_id,
  created_at,
  updated_at
) VALUES 
-- President
(
  gen_random_uuid(),
  'Dr. Sarah Johnson',
  'President',
  'Dr. Sarah Johnson is a distinguished civil engineer with over 15 years of experience in structural engineering and sustainable construction. She holds a PhD from MIT and has led numerous international infrastructure projects. Her expertise in earthquake-resistant design and green building technologies has made her a sought-after consultant worldwide.',
  '/placeholder.svg?height=300&width=300',
  'sarah.johnson@iaces.org',
  'https://linkedin.com/in/sarahjohnson',
  1,
  true,
  gen_random_uuid(),
  NOW(),
  NOW()
),

-- Vice President
(
  gen_random_uuid(),
  'Prof. Ahmed Hassan',
  'Vice President',
  'Professor Ahmed Hassan brings over 20 years of academic and industry experience in transportation engineering. He currently serves as the Head of Civil Engineering at Cairo University and has published over 50 research papers on smart transportation systems. His work on traffic optimization has been implemented in major cities across the Middle East.',
  '/placeholder.svg?height=300&width=300',
  'ahmed.hassan@iaces.org',
  'https://linkedin.com/in/ahmedhassan',
  2,
  true,
  gen_random_uuid(),
  NOW(),
  NOW()
),

-- Secretary
(
  gen_random_uuid(),
  'Eng. Maria Rodriguez',
  'Secretary',
  'Maria Rodriguez is a project management expert specializing in large-scale infrastructure development. With her PMP certification and 12 years of experience managing multi-million dollar projects, she has successfully delivered bridges, highways, and urban development projects across Latin America. She is fluent in Spanish, English, and Portuguese.',
  '/placeholder.svg?height=300&width=300',
  'maria.rodriguez@iaces.org',
  'https://linkedin.com/in/mariarodriguez',
  3,
  true,
  gen_random_uuid(),
  NOW(),
  NOW()
),

-- Treasurer
(
  gen_random_uuid(),
  'Dr. James Chen',
  'Treasurer',
  'Dr. James Chen is a geotechnical engineer with extensive experience in foundation design and soil mechanics. He holds a PhD from Stanford University and has worked on major infrastructure projects including the Hong Kong-Zhuhai-Macao Bridge. His research on deep foundation systems has been recognized internationally with multiple awards.',
  '/placeholder.svg?height=300&width=300',
  'james.chen@iaces.org',
  'https://linkedin.com/in/jameschen',
  4,
  true,
  gen_random_uuid(),
  NOW(),
  NOW()
),

-- Board Members
(
  gen_random_uuid(),
  'Dr. Elena Petrov',
  'Board Member',
  'Dr. Elena Petrov is a water resources engineer specializing in hydraulic modeling and flood management. She has led disaster response teams and developed innovative flood control systems for coastal cities. Her work has been crucial in climate change adaptation strategies for vulnerable communities worldwide.',
  '/placeholder.svg?height=300&width=300',
  'elena.petrov@iaces.org',
  'https://linkedin.com/in/elenapetrov',
  5,
  true,
  gen_random_uuid(),
  NOW(),
  NOW()
),

(
  gen_random_uuid(),
  'Eng. David Thompson',
  'Board Member',
  'David Thompson is a construction management specialist with over 18 years of experience in commercial and residential construction. He has managed construction teams of over 200 people and has been instrumental in implementing sustainable building practices. His expertise includes BIM technology and lean construction methodologies.',
  '/placeholder.svg?height=300&width=300',
  'david.thompson@iaces.org',
  'https://linkedin.com/in/davidthompson',
  6,
  true,
  gen_random_uuid(),
  NOW(),
  NOW()
),

(
  gen_random_uuid(),
  'Dr. Priya Sharma',
  'Board Member',
  'Dr. Priya Sharma is an environmental engineer focused on sustainable infrastructure and green technology integration. She has developed innovative solutions for waste management and renewable energy systems in urban environments. Her research on smart cities has been published in top-tier journals and implemented in several pilot projects.',
  '/placeholder.svg?height=300&width=300',
  'priya.sharma@iaces.org',
  'https://linkedin.com/in/priyasharma',
  7,
  true,
  gen_random_uuid(),
  NOW(),
  NOW()
),

(
  gen_random_uuid(),
  'Eng. Michael O''Connor',
  'Board Member',
  'Michael O''Connor is a structural engineer specializing in high-rise buildings and complex architectural structures. He has worked on iconic buildings in major cities and is known for his innovative approach to combining aesthetic design with structural integrity. His portfolio includes several award-winning skyscrapers and cultural landmarks.',
  '/placeholder.svg?height=300&width=300',
  'michael.oconnor@iaces.org',
  'https://linkedin.com/in/michaeloconnor',
  8,
  true,
  gen_random_uuid(),
  NOW(),
  NOW()
);

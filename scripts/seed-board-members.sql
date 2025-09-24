-- Seed board members table with fresh sample data
-- This script adds sample board members with proper UUIDs

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
    user_id,
    created_at,
    updated_at
) VALUES 
(
    gen_random_uuid(),
    'Dr. Sarah Johnson',
    'President',
    'Dr. Sarah Johnson is a distinguished leader in international affairs with over 15 years of experience in diplomatic relations and cross-cultural communication.',
    'sarah.johnson@iaces.org',
    'https://linkedin.com/in/sarahjohnson',
    '/placeholder.svg?height=300&width=300',
    1,
    true,
    gen_random_uuid(),
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'Prof. Michael Chen',
    'Vice President',
    'Professor Michael Chen brings extensive academic and research experience in international economics and sustainable development to the board.',
    'michael.chen@iaces.org',
    'https://linkedin.com/in/michaelchen',
    '/placeholder.svg?height=300&width=300',
    2,
    true,
    gen_random_uuid(),
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'Ms. Elena Rodriguez',
    'Secretary',
    'Elena Rodriguez is a seasoned communications professional with expertise in international outreach and community engagement.',
    'elena.rodriguez@iaces.org',
    'https://linkedin.com/in/elenarodriguez',
    '/placeholder.svg?height=300&width=300',
    3,
    true,
    gen_random_uuid(),
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'Mr. David Kim',
    'Treasurer',
    'David Kim is a certified public accountant with extensive experience in non-profit financial management and international funding.',
    'david.kim@iaces.org',
    'https://linkedin.com/in/davidkim',
    '/placeholder.svg?height=300&width=300',
    4,
    true,
    gen_random_uuid(),
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'Dr. Amara Okafor',
    'Board Member',
    'Dr. Amara Okafor is a renowned researcher in international development and cultural studies, bringing valuable insights to our mission.',
    'amara.okafor@iaces.org',
    'https://linkedin.com/in/amaraokafor',
    '/placeholder.svg?height=300&width=300',
    5,
    true,
    gen_random_uuid(),
    NOW(),
    NOW()
);

-- Verify the data was inserted
SELECT COUNT(*) as total_board_members FROM board_members;
SELECT name, position, display_order FROM board_members ORDER BY display_order;

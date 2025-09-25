-- Seed initial content for IACES website

-- Insert default hero content
INSERT INTO public.hero_content (title, subtitle, description, cta_text, cta_link, user_id) VALUES
('International Association of Computer Engineering Students', 
 'Connecting Future Engineers Worldwide', 
 'Join a global community of computer engineering students and professionals dedicated to innovation, collaboration, and excellence in technology.',
 'Learn More',
 '#about',
 '00000000-0000-0000-0000-000000000000'
) ON CONFLICT DO NOTHING;

-- Insert default about content
INSERT INTO public.about_content (title, content, mission_statement, vision_statement, user_id) VALUES
('About IACES',
'The International Association of Computer Engineering Students (IACES) is a global organization that brings together students, educators, and professionals in the field of computer engineering. We foster collaboration, innovation, and knowledge sharing across borders.',
'To connect and empower computer engineering students worldwide through education, collaboration, and professional development opportunities.',
'To be the leading global platform for computer engineering students, driving innovation and excellence in technology education.',
'00000000-0000-0000-0000-000000000000'
) ON CONFLICT DO NOTHING;

-- Insert sample board members
INSERT INTO public.board_members (name, position, bio, display_order, user_id) VALUES
('Dr. Sarah Johnson', 'President', 'Leading expert in artificial intelligence and machine learning with over 15 years of experience in academia and industry.', 1, '00000000-0000-0000-0000-000000000000'),
('Prof. Michael Chen', 'Vice President', 'Renowned researcher in computer networks and cybersecurity, published author of numerous technical papers.', 2, '00000000-0000-0000-0000-000000000000'),
('Dr. Emily Rodriguez', 'Secretary', 'Specialist in software engineering and human-computer interaction, passionate about inclusive technology design.', 3, '00000000-0000-0000-0000-000000000000'),
('James Wilson', 'Treasurer', 'Financial expert with background in technology startups and venture capital, supporting student entrepreneurship.', 4, '00000000-0000-0000-0000-000000000000')
ON CONFLICT DO NOTHING;

-- Insert sample magazine articles
INSERT INTO public.magazine_articles (title, description, issue_number, publication_date, publication_type, is_featured, user_id) VALUES
('The Future of Quantum Computing', 'Exploring the latest developments in quantum computing and its implications for computer engineering.', 'Vol. 15, Issue 3', '2024-09-01', 'magazine', true, '00000000-0000-0000-0000-000000000000'),
('AI Ethics in Engineering Education', 'Discussing the importance of ethical considerations in artificial intelligence curriculum.', 'Vol. 15, Issue 2', '2024-06-01', 'magazine', false, '00000000-0000-0000-0000-000000000000'),
('Monthly Newsletter - March 2024', 'Highlights from the March 2024 activities, events, and member achievements.', 'Newsletter #3', '2024-03-15', 'newsletter', false, '00000000-0000-0000-0000-000000000000')
ON CONFLICT DO NOTHING;

-- Insert default contact information
INSERT INTO public.contact_info (address, phone, email, office_hours, user_id) VALUES
('123 Technology Drive, Innovation City, IC 12345',
'+1 (555) 123-4567',
'info@iaces.network',
'Monday - Friday: 9:00 AM - 5:00 PM EST',
'00000000-0000-0000-0000-000000000000'
) ON CONFLICT DO NOTHING;

-- Insert default site settings
INSERT INTO public.site_settings (key, value, description, user_id) VALUES
('site_title', 'IACES - International Association of Computer Engineering Students', 'Main site title', '00000000-0000-0000-0000-000000000000'),
('site_description', 'Connecting computer engineering students worldwide', 'Site meta description', '00000000-0000-0000-0000-000000000000'),
('contact_email', 'info@iaces.network', 'Primary contact email', '00000000-0000-0000-0000-000000000000'),
('social_facebook', 'https://facebook.com/iaces', 'Facebook page URL', '00000000-0000-0000-0000-000000000000'),
('social_twitter', 'https://twitter.com/iaces', 'Twitter profile URL', '00000000-0000-0000-0000-000000000000'),
('social_linkedin', 'https://linkedin.com/company/iaces', 'LinkedIn company page URL', '00000000-0000-0000-0000-000000000000')
ON CONFLICT (key) DO NOTHING;

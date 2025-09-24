-- Clear existing incorrect data from local_committees table
DELETE FROM local_committees;

-- Insert proper local committees data that matches the schema
INSERT INTO local_committees (name, country, website_url, logo_url, description, display_order, is_active) VALUES
('IACES Germany', 'Germany', 'https://iaces-germany.org', '/iaces-germany-logo.jpg', 'Leading civil engineering education and research initiatives across German universities.', 1, true),
('IACES France', 'France', 'https://iaces-france.org', '/iaces-france-logo.jpg', 'Promoting excellence in civil engineering education and fostering international collaboration.', 2, true),
('IACES Spain', 'Spain', 'https://iaces-spain.org', '/iaces-spain-logo.jpg', 'Connecting Spanish civil engineering students and professionals with global opportunities.', 3, true),
('IACES Italy', 'Italy', 'https://iaces-italy.org', '/iaces-italy-logo.jpg', 'Advancing civil engineering education and research throughout Italian institutions.', 4, true),
('IACES Netherlands', 'Netherlands', 'https://iaces-netherlands.org', '/iaces-netherlands-logo.jpg', 'Supporting Dutch civil engineering students and promoting international exchange programs.', 5, true),
('IACES Poland', 'Poland', 'https://iaces-poland.org', '/iaces-poland-logo.jpg', 'Fostering innovation and collaboration in civil engineering across Polish universities.', 6, true),
('IACES Turkey', 'Turkey', 'https://iaces-turkey.org', '/iaces-turkey-logo.jpg', 'Connecting Turkish civil engineering students with international opportunities and best practices.', 7, true),
('IACES United Kingdom', 'United Kingdom', 'https://iaces-uk.org', '/iaces-uk-logo.jpg', 'Supporting civil engineering education excellence across UK universities and institutions.', 8, true);

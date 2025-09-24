-- Create local_committees table
CREATE TABLE IF NOT EXISTS local_committees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  country VARCHAR(100) NOT NULL,
  website_url VARCHAR(500),
  logo_url VARCHAR(500),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE local_committees ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to active committees" ON local_committees
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow authenticated users to manage committees" ON local_committees
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert some sample data
INSERT INTO local_committees (name, country, website_url, logo_url, description, display_order) VALUES
('IACES Germany', 'Germany', 'https://iaces-germany.org', '/placeholder.svg?height=80&width=120', 'German local committee of IACES promoting computer engineering education', 1),
('IACES France', 'France', 'https://iaces-france.org', '/placeholder.svg?height=80&width=120', 'French local committee of IACES advancing technology education', 2),
('IACES Italy', 'Italy', 'https://iaces-italy.org', '/placeholder.svg?height=80&width=120', 'Italian local committee of IACES fostering innovation in engineering', 3),
('IACES Spain', 'Spain', 'https://iaces-spain.org', '/placeholder.svg?height=80&width=120', 'Spanish local committee of IACES supporting student development', 4);

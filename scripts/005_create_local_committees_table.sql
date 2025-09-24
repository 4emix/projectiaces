-- Create local_committees table for managing local IACES committees
CREATE TABLE IF NOT EXISTS public.local_committees (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    name TEXT NOT NULL,
    country TEXT NOT NULL,
    website_url TEXT,
    logo_url TEXT,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true
);

-- Enable Row Level Security
ALTER TABLE public.local_committees ENABLE ROW LEVEL SECURITY;

-- Create policies for local_committees
CREATE POLICY "Allow public read access to active local committees" ON public.local_committees
    FOR SELECT USING (is_active = true);

CREATE POLICY "Allow authenticated users to manage local committees" ON public.local_committees
    FOR ALL USING (auth.role() = 'authenticated');

-- Insert sample local committees data
INSERT INTO public.local_committees (name, country, website_url, logo_url, description, display_order, is_active) VALUES
('IACES Germany', 'Germany', 'https://iaces-germany.org', '/placeholder.svg?height=80&width=120', 'The German chapter of IACES, promoting civil engineering excellence across Germany.', 1, true),
('IACES France', 'France', 'https://iaces-france.org', '/placeholder.svg?height=80&width=120', 'French association of civil engineering students and professionals.', 2, true),
('IACES Spain', 'Spain', 'https://iaces-spain.org', '/placeholder.svg?height=80&width=120', 'Spanish committee fostering innovation in civil engineering education.', 3, true),
('IACES Italy', 'Italy', 'https://iaces-italy.org', '/placeholder.svg?height=80&width=120', 'Italian chapter connecting civil engineering students and industry.', 4, true);

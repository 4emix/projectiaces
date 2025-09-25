-- Create content management tables for IACES website

-- Site settings table for general website configuration
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Hero section content
CREATE TABLE IF NOT EXISTS public.hero_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  background_image_url TEXT,
  cta_text TEXT,
  cta_link TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- About section content
CREATE TABLE IF NOT EXISTS public.about_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  mission_statement TEXT,
  vision_statement TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Board members table
CREATE TABLE IF NOT EXISTS public.board_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  email TEXT,
  linkedin_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Magazine articles table
CREATE TABLE IF NOT EXISTS public.magazine_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  pdf_url TEXT,
  issue_number TEXT,
  publication_date DATE,
  publication_type TEXT NOT NULL DEFAULT 'magazine',
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Contact information table
CREATE TABLE IF NOT EXISTS public.contact_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  address TEXT,
  phone TEXT,
  email TEXT,
  office_hours TEXT,
  map_embed_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security on all tables
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.board_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.magazine_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for site_settings
CREATE POLICY "Allow authenticated users to view site_settings" ON public.site_settings FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow users to manage their own site_settings" ON public.site_settings FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for hero_content
CREATE POLICY "Allow everyone to view active hero_content" ON public.hero_content FOR SELECT USING (is_active = true);
CREATE POLICY "Allow authenticated users to view all hero_content" ON public.hero_content FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow users to manage their own hero_content" ON public.hero_content FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for about_content
CREATE POLICY "Allow everyone to view active about_content" ON public.about_content FOR SELECT USING (is_active = true);
CREATE POLICY "Allow authenticated users to view all about_content" ON public.about_content FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow users to manage their own about_content" ON public.about_content FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for board_members
CREATE POLICY "Allow everyone to view active board_members" ON public.board_members FOR SELECT USING (is_active = true);
CREATE POLICY "Allow authenticated users to view all board_members" ON public.board_members FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow users to manage their own board_members" ON public.board_members FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for magazine_articles
CREATE POLICY "Allow everyone to view active magazine_articles" ON public.magazine_articles FOR SELECT USING (is_active = true);
CREATE POLICY "Allow authenticated users to view all magazine_articles" ON public.magazine_articles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow users to manage their own magazine_articles" ON public.magazine_articles FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for contact_info
CREATE POLICY "Allow everyone to view active contact_info" ON public.contact_info FOR SELECT USING (is_active = true);
CREATE POLICY "Allow authenticated users to view all contact_info" ON public.contact_info FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow users to manage their own contact_info" ON public.contact_info FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for existing events table
CREATE POLICY "Allow everyone to view events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to manage events" ON public.events FOR ALL USING (auth.role() = 'authenticated');

-- Create RLS policies for existing committees table  
CREATE POLICY "Allow everyone to view committees" ON public.committees FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to manage committees" ON public.committees FOR ALL USING (auth.role() = 'authenticated');

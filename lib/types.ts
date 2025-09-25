export interface HeroContent {
  id: string
  title: string
  subtitle: string | null
  description: string | null
  background_image_url: string | null
  cta_text: string | null
  cta_link: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  user_id: string
}

export interface AboutContent {
  id: string
  title: string
  content: string
  image_url: string | null
  mission_statement: string | null
  vision_statement: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  user_id: string
}

export interface BoardMember {
  id: string
  name: string
  position: string
  bio: string | null
  image_url: string | null
  email: string | null
  linkedin_url: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
  user_id: string
}

export interface MagazineArticle {
  id: string
  title: string
  description: string | null
  cover_image_url: string | null
  pdf_url: string | null
  issue_number: string | null
  publication_date: string | null
  publication_type: "magazine" | "newsletter"
  is_featured: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  user_id: string
}

export interface ContactInfo {
  id: string
  address: string | null
  phone: string | null
  email: string | null
  office_hours: string | null
  map_embed_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  user_id: string
}

export interface SiteSetting {
  id: string
  key: string
  value: string | null
  description: string | null
  created_at: string
  updated_at: string
  user_id: string
}

export interface LocalCommittee {
  id: string
  name: string
  country: string
  website_url: string | null
  logo_url: string | null
  description: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface EventItem {
  id: string
  title: string
  description: string
  event_date: string | null
  location: string | null
  registration_url: string | null
  image_url: string | null
  is_active: boolean
  created_at: string | null
  updated_at: string | null
  contact_email: string | null
}

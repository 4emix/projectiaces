import { GOOGLE_DRIVE_DIRECT_LINK_EXAMPLE } from "@/lib/constants"
import type {
  AboutContent,
  BoardMember,
  ContactInfo,
  HeroContent,
  LocalCommittee,
  MagazineArticle,
} from "@/lib/types"

export const FALLBACK_ID_PREFIX = "fallback-" as const

export function isFallbackId(value: unknown): value is string {
  return typeof value === "string" && value.startsWith(FALLBACK_ID_PREFIX)
}
const FALLBACK_TIMESTAMP = "2024-01-01T00:00:00.000Z"

export const fallbackHeroContent: HeroContent = {
  id: "fallback-hero",
  title: "International Association of Civil Engineering Students",
  subtitle: "Connecting Future Engineers Worldwide",
  description:
    "Join a global community of civil engineering students and professionals dedicated to innovation, collaboration, and excellence in sustainable infrastructure development.",
  background_image_url: null,
  cta_text: "Learn More",
  cta_link: "#about",
  is_active: true,
  created_at: FALLBACK_TIMESTAMP,
  updated_at: FALLBACK_TIMESTAMP,
  user_id: "fallback",
}

export const fallbackAboutContent: AboutContent = {
  id: "fallback-about",
  title: "About IACES",
  content:
    "The International Association of Civil Engineering Students (IACES) unites students, educators, and professionals to advance civil engineering education and foster meaningful international collaboration.",
  image_url: null,
  mission_statement:
    "To connect and empower civil engineering students worldwide through education, collaboration, and professional development opportunities.",
  vision_statement:
    "To be the leading global platform for civil engineering students, driving innovation and excellence in infrastructure and construction education.",
  is_active: true,
  created_at: FALLBACK_TIMESTAMP,
  updated_at: FALLBACK_TIMESTAMP,
  user_id: "fallback",
}

export const fallbackBoardMembers: BoardMember[] = [
  {
    id: "fallback-board-1",
    name: "Alexandra Rivera",
    position: "President",
    bio: "Leads global initiatives connecting civil engineering students with industry partners and academic institutions.",
    image_url: null,
    email: null,
    linkedin_url: null,
    display_order: 1,
    is_active: true,
    created_at: FALLBACK_TIMESTAMP,
    updated_at: FALLBACK_TIMESTAMP,
    user_id: "fallback",
  },
  {
    id: "fallback-board-2",
    name: "Liam Chen",
    position: "Vice President",
    bio: "Coordinates international collaborations and oversees professional development programs.",
    image_url: null,
    email: null,
    linkedin_url: null,
    display_order: 2,
    is_active: true,
    created_at: FALLBACK_TIMESTAMP,
    updated_at: FALLBACK_TIMESTAMP,
    user_id: "fallback",
  },
  {
    id: "fallback-board-3",
    name: "Sofia Martins",
    position: "Secretary General",
    bio: "Manages organizational governance, communications, and member engagement across all regions.",
    image_url: null,
    email: null,
    linkedin_url: null,
    display_order: 3,
    is_active: true,
    created_at: FALLBACK_TIMESTAMP,
    updated_at: FALLBACK_TIMESTAMP,
    user_id: "fallback",
  },
  {
    id: "fallback-board-4",
    name: "Noah Thompson",
    position: "Treasurer",
    bio: "Oversees strategic partnerships and ensures sustainable funding for international initiatives.",
    image_url: null,
    email: null,
    linkedin_url: null,
    display_order: 4,
    is_active: true,
    created_at: FALLBACK_TIMESTAMP,
    updated_at: FALLBACK_TIMESTAMP,
    user_id: "fallback",
  },
]

export const fallbackMagazineArticles: MagazineArticle[] = [
  {
    id: "fallback-magazine-1",
    title: "Sustainable Infrastructure Spotlight",
    description: "Highlighting innovative civil engineering projects that prioritize resilience and sustainability.",
    cover_image_url: null,
    pdf_url: null,
    issue_number: "Vol. 15, Issue 3",
    publication_date: FALLBACK_TIMESTAMP,
    publication_type: "magazine",
    is_featured: true,
    is_active: true,
    created_at: FALLBACK_TIMESTAMP,
    updated_at: FALLBACK_TIMESTAMP,
    user_id: "fallback",
  },
  {
    id: "fallback-magazine-2",
    title: "Global Student Innovation",
    description: "Celebrating award-winning student research from IACES committees around the world.",
    cover_image_url: null,
    pdf_url: null,
    issue_number: "Vol. 15, Issue 2",
    publication_date: "2023-11-01T00:00:00.000Z",
    publication_type: "magazine",
    is_featured: false,
    is_active: true,
    created_at: FALLBACK_TIMESTAMP,
    updated_at: FALLBACK_TIMESTAMP,
    user_id: "fallback",
  },
  {
    id: "fallback-newsletter-1",
    title: "Monthly Newsletter - September 2024",
    description: "Conference highlights, new partnerships, and student achievement recognitions.",
    cover_image_url: null,
    pdf_url: null,
    issue_number: "Newsletter #9",
    publication_date: "2024-09-01T00:00:00.000Z",
    publication_type: "newsletter",
    is_featured: false,
    is_active: true,
    created_at: FALLBACK_TIMESTAMP,
    updated_at: FALLBACK_TIMESTAMP,
    user_id: "fallback",
  },
  {
    id: "fallback-newsletter-2",
    title: "Monthly Newsletter - August 2024",
    description: "Summer program results, research collaborations, and upcoming fall events.",
    cover_image_url: null,
    pdf_url: null,
    issue_number: "Newsletter #8",
    publication_date: "2024-08-01T00:00:00.000Z",
    publication_type: "newsletter",
    is_featured: false,
    is_active: true,
    created_at: FALLBACK_TIMESTAMP,
    updated_at: FALLBACK_TIMESTAMP,
    user_id: "fallback",
  },
]

export const fallbackContactInfo: ContactInfo = {
  id: "fallback-contact",
  address: "123 Technology Drive\nInnovation City, IC 12345",
  phone: "+1 (555) 123-4567",
  email: "info@iaces.network",
  office_hours: "Monday - Friday: 9:00 AM - 5:00 PM EST",
  map_embed_url: null,
  is_active: true,
  created_at: FALLBACK_TIMESTAMP,
  updated_at: FALLBACK_TIMESTAMP,
  user_id: "fallback",
}

export const fallbackLocalCommittees: LocalCommittee[] = [
  {
    id: "fallback-committee-1",
    name: "IACES Lisbon",
    country: "Portugal",
    website_url: null,
    logo_url: null,
    description: "Promoting sustainable infrastructure research and student exchange programs in Southern Europe.",
    display_order: 1,
    is_active: true,
    created_at: FALLBACK_TIMESTAMP,
    updated_at: FALLBACK_TIMESTAMP,
  },
  {
    id: "fallback-committee-2",
    name: "IACES Berlin",
    country: "Germany",
    website_url: null,
    logo_url: null,
    description: "Supporting innovation in smart city development and cross-border engineering collaborations.",
    display_order: 2,
    is_active: true,
    created_at: FALLBACK_TIMESTAMP,
    updated_at: FALLBACK_TIMESTAMP,
  },
  {
    id: "fallback-committee-3",
    name: "IACES Istanbul",
    country: "Turkey",
    website_url: null,
    logo_url: null,
    description: "Connecting students across Eurasia with workshops focused on resilient infrastructure design.",
    display_order: 3,
    is_active: true,
    created_at: FALLBACK_TIMESTAMP,
    updated_at: FALLBACK_TIMESTAMP,
  },
]

export const fallbackSiteSettings: Record<string, string> = {
  contact_email: "info@iaces.network",
  contact_phone: "+1 (555) 123-4567",
  headquarters_city: "Innovation City",
}

export interface AdminEventFallback {
  id: string
  title: string
  description: string
  event_date: string
  location: string
  registration_url: string
  image_url: string | null
  is_active: boolean
  created_at: string
}

export const fallbackEvents: AdminEventFallback[] = [
  {
    id: "fallback-event-1",
    title: "Global Civil Engineering Summit 2024",
    description:
      "Join leading experts and students for three days of cutting-edge research presentations, workshops, and networking opportunities in infrastructure and construction.",
    event_date: "2024-12-15T09:00:00.000Z",
    location: "Singapore",
    registration_url: "mailto:events@iaces.network",
    image_url: null,
    is_active: true,
    created_at: FALLBACK_TIMESTAMP,
  },
  {
    id: "fallback-event-2",
    title: "Sustainable Construction Workshop",
    description:
      "Hands-on workshop covering the latest developments in sustainable construction practices and green building technologies.",
    event_date: "2024-11-08T14:00:00.000Z",
    location: "Virtual Event",
    registration_url: "mailto:workshops@iaces.network",
    image_url: null,
    is_active: true,
    created_at: FALLBACK_TIMESTAMP,
  },
  {
    id: "fallback-event-3",
    title: "Student Innovation Competition",
    description: "Annual competition showcasing innovative projects from civil engineering students worldwide.",
    event_date: "2024-10-25T10:00:00.000Z",
    location: "Boston, USA",
    registration_url: "mailto:innovation@iaces.network",
    image_url: null,
    is_active: true,
    created_at: FALLBACK_TIMESTAMP,
  },
]

export const fallbackMagazineIssuesForAdmin: MagazineArticle[] = [
  {
    id: "fallback-magazine-1",
    title: "The Future of Civil Engineering",
    description:
      "Exploring emerging technologies, sustainable practices, and the global impact of student-led research.",
    cover_image_url: GOOGLE_DRIVE_DIRECT_LINK_EXAMPLE,
    pdf_url: null,
    issue_number: "Vol. 15, Issue 3",
    publication_date: "2024-09-01T00:00:00.000Z",
    publication_type: "magazine",
    is_featured: true,
    is_active: true,
    created_at: FALLBACK_TIMESTAMP,
    updated_at: FALLBACK_TIMESTAMP,
    user_id: "fallback",
  },
  {
    id: "fallback-magazine-2",
    title: "Infrastructure Innovation Digest",
    description:
      "Highlighting cross-border collaboration projects and new materials shaping resilient infrastructure.",
    cover_image_url: GOOGLE_DRIVE_DIRECT_LINK_EXAMPLE,
    pdf_url: null,
    issue_number: "Vol. 15, Issue 2",
    publication_date: "2024-06-01T00:00:00.000Z",
    publication_type: "magazine",
    is_featured: false,
    is_active: true,
    created_at: FALLBACK_TIMESTAMP,
    updated_at: FALLBACK_TIMESTAMP,
    user_id: "fallback",
  },
  {
    id: "fallback-newsletter-1",
    title: "Monthly Newsletter - September 2024",
    description: "Conference highlights, new partnerships, and student achievement recognitions.",
    cover_image_url: GOOGLE_DRIVE_DIRECT_LINK_EXAMPLE,
    pdf_url: null,
    issue_number: "Newsletter #9",
    publication_date: "2024-09-01T00:00:00.000Z",
    publication_type: "newsletter",
    is_featured: false,
    is_active: true,
    created_at: FALLBACK_TIMESTAMP,
    updated_at: FALLBACK_TIMESTAMP,
    user_id: "fallback",
  },
]

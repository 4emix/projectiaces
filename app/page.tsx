import { Navigation } from "@/components/navigation"
import { DynamicHeroSection } from "@/components/dynamic-hero-section"
import { AboutSection } from "@/components/about-section"
import { BoardSection } from "@/components/board-section"
import { MagazineSection } from "@/components/magazine-section"
import { EventsSection } from "@/components/events-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { ContentService } from "@/lib/content-service"

export default async function HomePage() {
  const siteSettings = await ContentService.getSiteSettings()

  return (
    <main className="min-h-screen">
      <Navigation
        siteTitle={siteSettings.site_title}
        siteDescription={siteSettings.site_description}
      />
      <DynamicHeroSection siteSettings={siteSettings} />
      <AboutSection />
      <BoardSection />
      <MagazineSection />
      <EventsSection />
      <ContactSection
        contactEmail={siteSettings.contact_email}
        contactAddress={siteSettings.contact_address}
      />
      <Footer siteSettings={siteSettings} />
    </main>
  )
}

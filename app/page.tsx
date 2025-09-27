import { Navigation } from "@/components/navigation"
import { DynamicHeroSection } from "@/components/dynamic-hero-section"
import { AboutSection } from "@/components/about-section"
import { BoardSection } from "@/components/board-section"
import { MagazineSection } from "@/components/magazine-section"
import { EventsSection } from "@/components/events-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <DynamicHeroSection />
      <AboutSection />
      <BoardSection />
      <MagazineSection />
      <EventsSection />
      <ContactSection />
      <Footer />
    </main>
  )
}

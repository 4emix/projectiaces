import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { ContentService } from "@/lib/content-service"
import type { HeroContent } from "@/lib/types"

async function getHeroContent(): Promise<HeroContent | null> {
  try {
    return await ContentService.getActiveHeroContent()
  } catch (error) {
    console.error("Error loading hero content:", error)
    return null
  }
}

export async function DynamicHeroSection() {
  const heroContent = await getHeroContent()
  const content = heroContent ?? {
    title: "International Association of Civil Engineering Students",
    subtitle: "Connecting Future Engineers Worldwide",
    description:
      "Join a global community of civil engineering students and professionals dedicated to innovation, collaboration, and excellence in sustainable infrastructure development.",
    cta_text: "Learn More",
    cta_link: "#about",
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="absolute inset-0 opacity-20">
        {content.background_image_url && (
          <Image
            src={content.background_image_url}
            alt={content.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-secondary/30" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-[1fr,0.9fr] gap-12 items-center">
          <div className="space-y-10">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">{content.title}</h1>
              {content.subtitle && <p className="text-2xl text-accent font-medium">{content.subtitle}</p>}
              {content.description && <p className="text-xl text-muted-foreground max-w-2xl">{content.description}</p>}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {content.cta_text && content.cta_link && (
                <Button size="lg" asChild>
                  <Link href={content.cta_link}>{content.cta_text}</Link>
                </Button>
              )}
              <Button variant="outline" size="lg" asChild>
                <Link href="#contact">Join Us</Link>
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span>Global Network</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span>Professional Development</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span>Innovation Focus</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-secondary/40 shadow-xl">
              {content.background_image_url ? (
                <Image
                  src={content.background_image_url}
                  alt={content.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(min-width: 1024px) 32rem, 100vw"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent/10 via-primary/10 to-secondary/20">
                  <div className="text-center space-y-3 px-8">
                    <h3 className="text-2xl font-semibold text-foreground">Building Tomorrow's Infrastructure</h3>
                    <p className="text-muted-foreground">Empowering the next generation of civil engineers</p>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-background/10 to-transparent" />
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4 text-sm text-muted-foreground">
              {["Global Network", "Professional Development", "Innovation Focus"].map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-full border border-secondary/40 bg-background/70 px-4 py-2 backdrop-blur">
                  <div className="h-2 w-2 rounded-full bg-accent" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

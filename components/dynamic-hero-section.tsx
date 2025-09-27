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
  const heroImage = content.background_image_url ?? "/placeholder.jpg"

  const highlights = [
    "Global Network of 120+ universities",
    "Leadership & professional training",
    "Hands-on research collaborations",
  ]

  const stats = [
    { label: "Member Chapters", value: "65" },
    { label: "Annual Events", value: "40+" },
    { label: "Countries", value: "32" },
  ]

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-secondary/20 via-background to-primary/10" />
      <div className="absolute -top-40 -right-40 h-96 w-96 -z-10 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-32 -left-24 h-80 w-80 -z-10 rounded-full bg-secondary/20 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-[1.05fr,0.95fr] gap-16 items-center">
          <div className="space-y-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span>Shaping the future of civil engineering</span>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                {content.subtitle && (
                  <p className="text-lg font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                    {content.subtitle}
                  </p>
                )}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
                  {content.title}
                </h1>
              </div>
              {content.description && (
                <p className="max-w-2xl text-lg text-muted-foreground">
                  {content.description}
                </p>
              )}

              <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                {highlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-secondary/40 bg-background/70 px-4 py-3 shadow-sm backdrop-blur"
                  >
                    <span className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-accent" />
                    <span className="text-sm font-medium text-foreground/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              {content.cta_text && content.cta_link && (
                <Button size="lg" className="h-14 px-8 text-base" asChild>
                  <Link href={content.cta_link}>{content.cta_text}</Link>
                </Button>
              )}
              <Button variant="outline" size="lg" className="h-14 px-8 text-base" asChild>
                <Link href="#contact">Become a member</Link>
              </Button>
            </div>

            <dl className="grid gap-6 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-3xl border border-secondary/40 bg-background/80 p-6 text-center shadow-sm backdrop-blur">
                  <dt className="text-sm font-medium text-muted-foreground">{stat.label}</dt>
                  <dd className="mt-2 text-3xl font-bold text-foreground">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="absolute -top-12 -left-10 hidden h-28 w-28 rotate-6 rounded-3xl border border-primary/20 bg-primary/10 blur-2xl sm:block" />
            <div className="relative overflow-hidden rounded-[2.5rem] border border-secondary/40 bg-gradient-to-br from-background via-background to-secondary/10 p-4 shadow-2xl">
              <div className="relative overflow-hidden rounded-[2rem] border border-border/40 bg-background">
                <Image
                  src={heroImage}
                  alt={content.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-background/10 to-transparent" />
              </div>

              <div className="absolute bottom-6 left-1/2 flex w-[88%] -translate-x-1/2 items-center gap-4 rounded-2xl border border-background/20 bg-background/90 px-6 py-4 shadow-lg backdrop-blur">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-lg font-semibold text-primary">
                  IA
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Innovate, Advocate, Connect</p>
                  <p className="text-xs text-muted-foreground">Empowering tomorrow's infrastructure leaders</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-12 -right-8 hidden h-24 w-24 -rotate-6 rounded-full border border-secondary/20 bg-secondary/20 blur-xl md:block" />
          </div>
        </div>
      </div>
    </section>
  )
}

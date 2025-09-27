import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { ContentService } from "@/lib/content-service"
import type { HeroContent } from "@/lib/types"
import { ArrowRight, Compass, Globe2, Lightbulb, Users2 } from "lucide-react"

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
    description:
      "Join a global community of civil engineering students and professionals dedicated to innovation, collaboration, and excellence in sustainable infrastructure development.",
    cta_text: "Learn More",
    cta_link: "#about",
  }

  const heroImage = content.background_image_url ?? "/placeholder.jpg"

  const metrics = [
    { label: "Members", value: "3000+" },
    { label: "Countries", value: "20+" },
    { label: "Years", value: "35+" },
  ]

  const highlights = [
    {
      icon: Globe2,
      title: "Global Exchange",
      description: "Study trips, cultural exchanges, and collaborative design studios across continents.",
    },
    {
      icon: Users2,
      title: "Mentorship Network",
      description: "Direct access to alumni and industry mentors guiding the next generation of engineers.",
    },
    {
      icon: Lightbulb,
      title: "Innovation Labs",
      description: "Hands-on challenges focusing on resilient cities, green mobility, and smart infrastructure.",
    },
    {
      icon: Compass,
      title: "Career Pathways",
      description: "Internships, conferences, and leadership roles that build real-world experience.",
    },
  ]

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-secondary/10 to-background" />
      <div className="absolute -top-32 left-1/2 -z-10 h-[720px] w-[720px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid items-center gap-16 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-12">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold leading-tight text-foreground md:text-6xl">
                <span className="bg-gradient-to-r from-foreground via-accent to-foreground bg-clip-text text-transparent">
                  {content.title}
                </span>
              </h1>

              {content.description && (
                <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">
                  {content.description}
                </p>
              )}
            </div>

            <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
              {content.cta_text && content.cta_link && (
                <Button size="lg" asChild className="group">
                  <Link href={content.cta_link}>
                    {content.cta_text}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              )}
              <Button variant="outline" size="lg" asChild>
                <Link href="#contact">Become a Member</Link>
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-2xl border border-secondary/40 bg-background/70 px-6 py-4 shadow-sm backdrop-blur transition hover:border-accent/50 hover:shadow-lg"
                >
                  <p className="text-2xl font-semibold text-foreground">{metric.value}</p>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-10 -z-10 rounded-[3.5rem] bg-gradient-to-br from-secondary/30 via-background/60 to-background blur-2xl" />
            <div className="relative overflow-hidden rounded-[2.75rem] border border-secondary/30 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/0 to-background/60" />
              <Image
                src={heroImage}
                alt={content.title}
                priority
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 40vw, (min-width: 768px) 60vw, 100vw"
              />

              <div className="absolute inset-x-6 bottom-6 rounded-2xl border border-white/20 bg-background/85 p-6 shadow-lg backdrop-blur">
                <p className="text-sm font-medium uppercase tracking-wide text-accent">Why students choose IACES</p>
                <div className="mt-4 grid gap-3">
                  {highlights.map(({ icon: Icon, title, description }) => (
                    <div key={title} className="flex items-start gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15 text-accent">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{title}</p>
                        <p className="text-sm text-muted-foreground">{description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="absolute -right-6 -top-6 hidden h-28 w-28 rotate-12 rounded-full border border-secondary/20 bg-secondary/20 blur-xl md:block" />
          </div>
        </div>
      </div>
    </section>
  )
}

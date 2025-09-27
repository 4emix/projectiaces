import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { ContentService } from "@/lib/content-service"
import type { HeroContent } from "@/lib/types"
import { ArrowRight, Globe2, Lightbulb, Users2 } from "lucide-react"

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
  const stats = [
    { label: "Member Chapters", value: "120+" },
    { label: "Countries", value: "35" },
    { label: "Annual Events", value: "80+" },
  ]
  const highlights = [
    {
      icon: Globe2,
      title: "Global Collaboration",
      description: "International exchanges and joint design challenges",
    },
    {
      icon: Users2,
      title: "Career Mentorship",
      description: "Direct access to mentors from leading engineering firms",
    },
    {
      icon: Lightbulb,
      title: "Innovation Labs",
      description: "Hands-on projects building resilient infrastructure",
    },
  ]

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
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-secondary/10 to-background" />
      <div className="absolute left-1/2 top-1/2 -z-10 h-[720px] w-[720px] -translate-y-1/2 rounded-full bg-accent/10 blur-3xl" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-[1.15fr,0.85fr] gap-16 items-center">
          <div className="space-y-12">
            <div className="space-y-6">
              {content.subtitle && (
                <span className="inline-flex items-center rounded-full border border-accent/40 bg-background/80 px-4 py-1 text-sm font-medium text-accent shadow-sm backdrop-blur">
                  {content.subtitle}
                </span>
              )}
              <h1 className="text-4xl md:text-6xl font-bold leading-tight text-foreground">
                <span className="bg-gradient-to-r from-foreground via-accent to-foreground bg-clip-text text-transparent">
                  {content.title}
                </span>
              </h1>
              {content.description && (
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                  {content.description}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
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

            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-3 rounded-2xl border border-secondary/40 bg-background/70 px-5 py-3 shadow-sm backdrop-blur">
                  <div className="h-2 w-2 rounded-full bg-accent" />
                  <div>
                    <p className="text-lg font-semibold text-foreground">{stat.value}</p>
                    <p>{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-8 -z-10 rounded-[3rem] bg-gradient-to-br from-secondary/20 via-background/60 to-background blur-2xl" />
            <div className="relative overflow-hidden rounded-[2.5rem] border border-secondary/40 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/10 to-background/60" />
              <Image
                src={heroImage}
                alt={content.title}
                priority
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 45vw, (min-width: 768px) 60vw, 100vw"
              />
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/20 bg-background/80 p-6 shadow-lg backdrop-blur">
                <p className="text-sm uppercase tracking-wide text-accent">What you'll experience</p>
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

            <div className="absolute -bottom-12 -right-8 hidden h-24 w-24 -rotate-6 rounded-full border border-secondary/20 bg-secondary/20 blur-xl md:block" />
          </div>
        </div>
      </div>
    </section>
  )
}

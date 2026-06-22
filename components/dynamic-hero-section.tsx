import Link from "next/link"

import { Button } from "@/components/ui/button"
import { ContentService } from "@/lib/content-service"
import type { HeroContent } from "@/lib/types"
import { ArrowDown, ArrowRight } from "lucide-react"

async function getHeroContent(): Promise<HeroContent | null> {
  try {
    return await ContentService.getActiveHeroContent()
  } catch (error) {
    console.error("Error loading hero content:", error)
    return null
  }
}

const metrics = [
  { label: "Members", value: "3000+" },
  { label: "Committees", value: "22" },
  { label: "Countries", value: "15+" },
  { label: "Years", value: "35+" },
]

// Cities of our local committees — used for the animated marquee.
const cities = [
  "Delft",
  "Istanbul",
  "Ankara",
  "Lisbon",
  "Porto",
  "Budapest",
  "Thessaloniki",
  "Lyon",
  "Karlsruhe",
  "Salerno",
  "Belgrade",
  "Timisoara",
  "Ljubljana",
  "Mostar",
  "Cairo",
  "Khartoum",
  "Mexico City",
]

export async function DynamicHeroSection() {
  const heroContent = await getHeroContent()
  const content = heroContent ?? {
    title: "Building the future of civil engineering, together.",
    description:
      "Join a global community of civil engineering students and professionals dedicated to innovation, collaboration, and excellence in sustainable infrastructure development.",
    cta_text: "Discover IACES",
    cta_link: "#about",
  }

  return (
    <section className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-background pt-24">
      <div className="absolute inset-0 -z-10 bg-grid" aria-hidden />
      <div
        className="absolute -top-40 right-[-10%] -z-10 h-[40rem] w-[40rem] rounded-full bg-accent/10 blur-3xl"
        aria-hidden
      />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl">
          <h1 className="text-display text-4xl font-bold text-foreground sm:text-5xl md:text-7xl lg:text-8xl">
            {content.title}
          </h1>

          {content.description && (
            <p className="mt-5 max-w-2xl text-base text-muted-foreground sm:mt-7 sm:text-lg md:text-xl">
              {content.description}
            </p>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:gap-4">
            {content.cta_text && content.cta_link && (
              <Button size="lg" asChild className="group h-12 px-7 text-base">
                <Link href={content.cta_link}>
                  {content.cta_text}
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            )}
            <Button variant="outline" size="lg" asChild className="h-12 px-7 text-base">
              <Link href="#network">Find a committee</Link>
            </Button>
          </div>

          <dl className="mt-10 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:mt-14 sm:grid-cols-4">
            {metrics.map((metric) => (
              <div key={metric.label} className="bg-background px-4 py-4 transition-colors hover:bg-secondary sm:px-5 sm:py-5">
                <dt className="text-2xl font-bold text-primary tabular-nums sm:text-3xl md:text-4xl">{metric.value}</dt>
                <dd className="mt-1 text-[11px] uppercase tracking-wide text-muted-foreground sm:text-xs">{metric.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Animated city marquee */}
      <div className="marquee-paused group mt-12 w-full select-none border-y border-border py-3 sm:mt-16 sm:py-4">
        <div className="flex w-max animate-marquee items-center gap-6 whitespace-nowrap [--marquee-duration:40s] sm:gap-8">
          {[...cities, ...cities].map((city, index) => (
            <span key={`${city}-${index}`} className="flex items-center gap-6 text-base font-medium text-muted-foreground sm:gap-8 sm:text-lg">
              {city}
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
            </span>
          ))}
        </div>
      </div>

      <Link
        href="#about"
        aria-label="Scroll to content"
        className="mx-auto mt-10 mb-8 inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-accent hover:text-accent"
      >
        <ArrowDown className="h-5 w-5 animate-bounce" />
      </Link>
    </section>
  )
}

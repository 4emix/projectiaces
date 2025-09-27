"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

import { Card, CardContent } from "@/components/ui/card"
import type { AboutContent } from "@/lib/types"
import { fallbackAboutContent } from "@/lib/fallback-data"

const highlights = [
  {
    label: "Countries",
    value: "50+",
  },
  {
    label: "Members",
    value: "10K+",
  },
  {
    label: "Universities",
    value: "200+",
  },
  {
    label: "Years",
    value: "25",
  },
]

const pillars = [
  {
    title: "Education Excellence",
    description:
      "Promoting high standards in civil engineering education through curriculum development, research collaboration, and knowledge sharing in infrastructure and construction.",
  },
  {
    title: "Global Networking",
    description:
      "Connecting students, faculty, and professionals across continents to foster collaboration and cultural exchange in infrastructure and construction technology.",
  },
  {
    title: "Innovation Support",
    description:
      "Supporting student innovation through competitions, grants, and mentorship programs that bridge academia and industry.",
  },
]

export function AboutSection() {
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null)

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const response = await fetch("/api/about")
        if (response.ok) {
          const data = await response.json()
          if (data) {
            setAboutContent(data)
          }
        }
      } catch (error) {
        console.error("Error fetching about content:", error)
      }
    }

    fetchAboutContent()
  }, [])

  const content = aboutContent ?? fallbackAboutContent
  const isFallbackContent = Boolean(content?.id?.startsWith("fallback-"))
  const missionStatement =
    content.mission_statement ?? (isFallbackContent ? fallbackAboutContent.mission_statement : null)
  const visionStatement =
    content.vision_statement ?? (isFallbackContent ? fallbackAboutContent.vision_statement : null)
  const hasMissionOrVision = Boolean(missionStatement || visionStatement)

  return (
    <section id="about" className="py-20 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-10">
            <div className="space-y-5">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent">
                <span className="h-px w-8 bg-accent" />
                Who We Are
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">{content.title}</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">{content.content}</p>
            </div>

            {hasMissionOrVision && (
              <div className="grid gap-6 sm:grid-cols-2">
                {missionStatement && (
                  <Card className="h-full border-none bg-background/80 shadow-lg shadow-secondary/20 ring-1 ring-secondary/30">
                    <CardContent className="flex h-full flex-col gap-3 p-6">
                      <h3 className="text-xl font-semibold text-foreground">Our Mission</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{missionStatement}</p>
                    </CardContent>
                  </Card>
                )}

                {visionStatement && (
                  <Card className="h-full border-none bg-background/80 shadow-lg shadow-secondary/20 ring-1 ring-secondary/30">
                    <CardContent className="flex h-full flex-col gap-3 p-6">
                      <h3 className="text-xl font-semibold text-foreground">Our Vision</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{visionStatement}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 sm:max-w-xl">
              {highlights.map((highlight) => (
                <Card key={highlight.label} className="border-none bg-secondary/40 backdrop-blur">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-foreground">{highlight.value}</div>
                    <div className="text-sm text-muted-foreground">{highlight.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-secondary/40 bg-gradient-to-br from-secondary/20 via-primary/10 to-accent/20 shadow-xl">
              {content.image_url ? (
                <Image
                  src={content.image_url}
                  alt={content.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 28rem, 100vw"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-secondary/20 px-8 text-center">
                  <div className="space-y-3">
                    <h3 className="text-2xl font-semibold text-foreground">A Global Community</h3>
                    <p className="text-muted-foreground text-sm">
                      Students, educators, and professionals collaborating to shape the future of civil engineering.
                    </p>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            </div>

            <Card className="border-none bg-background/90 shadow-xl shadow-secondary/20 ring-1 ring-secondary/30">
              <CardContent className="space-y-4 p-6">
                <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">What we build together</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-accent" />
                    Global exchange programs and study visits
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-accent" />
                    Professional mentorship and lifelong networks
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-accent" />
                    Hands-on projects advancing sustainable infrastructure
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {pillars.map((pillar) => (
            <Card key={pillar.title} className="border-none bg-background/80 shadow-md shadow-secondary/20 ring-1 ring-secondary/30">
              <CardContent className="p-6 space-y-3">
                <h4 className="text-lg font-semibold text-foreground">{pillar.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{pillar.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

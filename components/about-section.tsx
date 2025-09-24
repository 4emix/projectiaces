"use client"

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
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{content.title}</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{content.content}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start mb-16">
          {hasMissionOrVision && (
            <div className="space-y-8">
              {missionStatement && (
                <div className="space-y-3">
                  <h3 className="text-2xl font-semibold text-foreground">Our Mission</h3>
                  <p className="text-muted-foreground leading-relaxed">{missionStatement}</p>
                </div>
              )}

              {visionStatement && (
                <div className="space-y-3">
                  <h3 className="text-2xl font-semibold text-foreground">Our Vision</h3>
                  <p className="text-muted-foreground leading-relaxed">{visionStatement}</p>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 md:ml-auto">
            {highlights.map((highlight) => (
              <Card key={highlight.label}>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-accent mb-2">{highlight.value}</div>
                  <div className="text-sm text-muted-foreground">{highlight.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map((pillar) => (
            <Card key={pillar.title}>
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-foreground mb-3">{pillar.title}</h4>
                <p className="text-muted-foreground text-sm">{pillar.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { HeroContent } from "@/lib/types"

export function DynamicHeroSection() {
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        const response = await fetch("/api/hero")
        if (response.ok) {
          const data = await response.json()
          setHeroContent(data)
        }
      } catch (error) {
        console.error("Error fetching hero content:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchHeroContent()
  }, [])

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading...</p>
        </div>
      </section>
    )
  }

  const content = heroContent || {
    title: "International Association of Civil Engineering Students",
    subtitle: "Connecting Future Engineers Worldwide",
    description:
      "Join a global community of civil engineering students and professionals dedicated to innovation, collaboration, and excellence in sustainable infrastructure development.",
    cta_text: "Learn More",
    cta_link: "#about",
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
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

            <div className="flex items-center space-x-8 text-sm text-muted-foreground">
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
            <div className="aspect-square bg-gradient-to-br from-accent/20 to-primary/20 rounded-2xl flex items-center justify-center">
              <div className="text-center space-y-4 p-8">
                <div className="w-24 h-24 bg-accent/20 rounded-full flex items-center justify-center mx-auto">
                  <div className="w-12 h-12 bg-accent rounded-full"></div>
                </div>
                <h3 className="text-2xl font-semibold text-foreground">Building Tomorrow's Infrastructure</h3>
                <p className="text-muted-foreground">Empowering the next generation of civil engineers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

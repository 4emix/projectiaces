"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, MapPin } from "lucide-react"
import Image from "next/image"
import type { LocalCommittee } from "@/lib/types"

export default function CommitteesPage() {
  const [committees, setCommittees] = useState<LocalCommittee[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCommittees = async () => {
      try {
        console.log("[v0] Fetching committees from API...")
        const response = await fetch("/api/committees")
        if (response.ok) {
          const data = await response.json()
          console.log("[v0] Committees data received:", data)
          setCommittees(data)
        } else {
          console.error("[v0] Failed to fetch committees:", response.status)
        }
      } catch (error) {
        console.error("[v0] Error fetching committees:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCommittees()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <div className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Local Committees</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Our local committees across Europe work tirelessly to promote civil engineering education, foster
                international collaboration, and support students and professionals in their regions.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Local Committees</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our local committees across Europe work tirelessly to promote civil engineering education, foster
              international collaboration, and support students and professionals in their regions.
            </p>
          </div>

          {/* Committees Grid */}
          {committees.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {committees.map((committee) => (
                <Card key={committee.id} className="group hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 relative w-20 h-20">
                      <Image
                        src={committee.logo_url || "/placeholder.svg?height=80&width=80"}
                        alt={`${committee.name} logo`}
                        fill
                        className="object-contain rounded-lg"
                      />
                    </div>
                    <CardTitle className="text-xl">{committee.name}</CardTitle>
                    <div className="flex items-center justify-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-1" />
                      {committee.country}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground text-sm leading-relaxed text-center">{committee.description}</p>

                    {committee.website_url && (
                      <Button className="w-full" size="sm" onClick={() => window.open(committee.website_url, "_blank")}>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Visit Website
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-muted-foreground">No committees available at the moment.</p>
            </div>
          )}

          {/* Call to Action */}
          <div className="text-center mt-16 p-8 bg-secondary/30 rounded-lg">
            <h3 className="text-2xl font-bold text-foreground mb-4">Interested in Starting a Local Committee?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              We're always looking to expand our network and support civil engineering communities worldwide. Contact us
              to learn about establishing a committee in your region.
            </p>
            <Button size="lg">Get in Touch</Button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import type { LocalCommittee } from "@/lib/types"
import Image from "next/image"

export function CommitteesSection() {
  const [committees, setCommittees] = useState<LocalCommittee[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCommittees = async () => {
      try {
        const response = await fetch("/api/committees")
        if (response.ok) {
          const data = await response.json()
          setCommittees(data)
        }
      } catch (error) {
        console.error("Error fetching committees:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCommittees()
  }, [])

  if (loading) {
    return (
      <section id="committees" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Local Committees</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our global network of local committees working together to advance civil engineering education
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
          </div>
        </div>
      </section>
    )
  }

  if (committees.length === 0) {
    return (
      <section id="committees" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Local Committees</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our global network of local committees working together to advance civil engineering education
            </p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">No committees available at the moment.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="committees" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Local Committees</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our global network of local committees working together to advance civil engineering education
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {committees.map((committee) => (
            <Card key={committee.id} className="group hover:shadow-lg transition-all duration-300 border-border/50">
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="w-20 h-20 relative rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={committee.logo_url || "/placeholder.svg?height=80&width=80"}
                      alt={`${committee.name} logo`}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-2">{committee.name}</h3>
                <p className="text-muted-foreground mb-4">{committee.country}</p>

                {committee.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{committee.description}</p>
                )}

                {committee.website_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full group-hover:bg-accent group-hover:text-accent-foreground transition-colors bg-transparent"
                    onClick={() => window.open(committee.website_url!, "_blank")}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visit Website
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

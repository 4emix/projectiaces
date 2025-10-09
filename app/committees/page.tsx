import Image from "next/image"
import Link from "next/link"
import { ExternalLink, MapPin, AlertCircle } from "lucide-react"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ContentService } from "@/lib/content-service"

const placeholderLogo = "/placeholder.svg?height=80&width=80"

function isFallbackCommittee(committeeId: string) {
  return committeeId.startsWith("fallback-")
}

export default async function CommitteesPage() {
  const committees = await ContentService.getAllLocalCommittees()
  const hasCommittees = committees.length > 0
  const isFallbackData = hasCommittees && committees.every((committee) => isFallbackCommittee(committee.id))

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
            {isFallbackData && (
              <div className="mt-6 inline-flex items-center gap-2 rounded-md border border-yellow-400/50 bg-yellow-500/10 px-4 py-2 text-sm text-yellow-900 dark:text-yellow-100">
                <AlertCircle className="h-4 w-4" />
                Displaying sample data until Supabase credentials are configured.
              </div>
            )}
          </div>

          {hasCommittees ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {committees.map((committee) => (
                <Card key={committee.id} className="group hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 relative h-20 w-20">
                      <Image
                        src={committee.logo_url || placeholderLogo}
                        alt={`${committee.name} logo`}
                        fill
                        className="rounded-lg object-contain"
                        sizes="80px"
                      />
                    </div>
                    <CardTitle className="text-xl">{committee.name}</CardTitle>
                    <div className="flex items-center justify-center text-sm text-muted-foreground">
                      <MapPin className="mr-1 h-4 w-4" />
                      {committee.country}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-center text-sm leading-relaxed text-muted-foreground">
                      {committee.description ?? "Description coming soon."}
                    </p>

                    {committee.website_url && (
                      <Button asChild size="sm" className="w-full">
                        <Link href={committee.website_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Visit Website
                        </Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-muted-foreground/40 p-12 text-center text-muted-foreground">
              No committees are available at the moment. Check back soon for updates from our network.
            </div>
          )}

          <div className="mt-16 rounded-lg bg-secondary/30 p-8 text-center">
            <h3 className="mb-4 text-2xl font-bold text-foreground">Interested in Starting a Local Committee?</h3>
            <p className="mx-auto mb-6 max-w-2xl text-muted-foreground">
              We're always looking to expand our network and support civil engineering communities worldwide. Contact us
              to learn about establishing a committee in your region.
            </p>
            <Button size="lg" asChild>
              <Link href="/#contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

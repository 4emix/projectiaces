import Link from "next/link"
import { headers } from "next/headers"
import { Calendar, Clock, MapPin } from "lucide-react"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { fallbackEvents } from "@/lib/fallback-data"
import type { EventItem } from "@/lib/types"
import { formatEventDate, isExternalUrl, splitEventsByTime, toEventItem } from "@/lib/event-utils"

async function fetchEvents(): Promise<EventItem[]> {
  const fallback = fallbackEvents.map(toEventItem)

  try {
    const headerList = headers()
    const host = headerList.get("host")

    if (!host) {
      return fallback
    }

    const protocol = host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https"
    const response = await fetch(`${protocol}://${host}/api/events`, { cache: "no-store" })

    if (!response.ok) {
      return fallback
    }

    const data = await response.json()
    if (!Array.isArray(data)) {
      return fallback
    }

    const events = data.map(toEventItem)
    return events.length > 0 ? events : fallback
  } catch (error) {
    console.error("Error loading events page data:", error)
    return fallback
  }
}

export default async function EventsPage() {
  const events = await fetchEvents()
  const { upcoming, past } = splitEventsByTime(events)
  const hasEvents = upcoming.length > 0 || past.length > 0
  const isFallbackData = events.length > 0 && events.every((event) => event.id.startsWith("fallback-"))

  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">IACES Events</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Connect with fellow engineers, learn from industry experts, and showcase your innovations at our events
              worldwide.
            </p>
            {!hasEvents && (
              <p className="text-sm text-muted-foreground mt-4">
                We&apos;re currently planning our next gathering. Check back soon for new opportunities to participate.
              </p>
            )}
            {isFallbackData && (
              <p className="text-xs text-muted-foreground mt-2">Displaying sample events until Supabase is connected.</p>
            )}
          </div>

          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-foreground">Upcoming Events</h2>
              <Badge variant="outline">{upcoming.length}</Badge>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcoming.length === 0 ? (
                <Card className="md:col-span-2 lg:col-span-3">
                  <CardContent className="p-8 text-center text-sm text-muted-foreground">
                    No upcoming events are scheduled at the moment.
                  </CardContent>
                </Card>
              ) : (
                upcoming.map((event) => {
                  const isExternal = event.registration_url ? isExternalUrl(event.registration_url) : false
                  const hasRegistration = Boolean(event.registration_url)

                  return (
                    <Card key={event.id} className="relative">
                      <CardHeader>
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {event.description && (
                          <p className="text-muted-foreground text-sm leading-relaxed">{event.description}</p>
                        )}

                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {formatEventDate(event.event_date)}
                          </div>
                          {event.location && (
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2" />
                              {event.location}
                            </div>
                          )}
                        </div>

                        {hasRegistration ? (
                          <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="w-full border border-input bg-white text-black hover:bg-muted"
                          >
                            <Link
                              href={event.registration_url!}
                              {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                            >
                              {event.registration_url?.startsWith("mailto:") ? "Contact Organizer" : "Register Now"}
                            </Link>
                          </Button>
                        ) : (
                          <div className="text-xs text-center text-muted-foreground">
                            Registration details coming soon.
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-foreground">Past Events</h2>
              <Badge variant="outline">{past.length}</Badge>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {past.length === 0 ? (
                <Card className="md:col-span-2 lg:col-span-3">
                  <CardContent className="p-8 text-center text-sm text-muted-foreground">
                    Past event highlights will appear here after events conclude.
                  </CardContent>
                </Card>
              ) : (
                past.map((event) => {
                  const isExternal = event.registration_url ? isExternalUrl(event.registration_url) : false
                  const hasLink = Boolean(event.registration_url)

                  return (
                    <Card key={event.id} className="opacity-90">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{event.title}</CardTitle>
                          <Badge variant="secondary" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            Past
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {event.description && (
                          <p className="text-muted-foreground text-sm leading-relaxed">{event.description}</p>
                        )}

                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {formatEventDate(event.event_date, "Completed")}
                          </div>
                          {event.location && (
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2" />
                              {event.location}
                            </div>
                          )}
                        </div>

                        {hasLink ? (
                          <Button asChild className="w-full bg-neutral-800 text-neutral-200 hover:bg-neutral-700" size="sm">
                            <Link
                              href={event.registration_url!}
                              {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                            >
                              {event.registration_url?.startsWith("mailto:") ? "Request Details" : "View Details"}
                            </Link>
                          </Button>
                        ) : (
                          <div className="text-xs text-center text-muted-foreground">No additional resources available.</div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  )
}

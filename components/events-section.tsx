import Link from "next/link"
import { Calendar, Clock, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getEvents } from "@/lib/data/events"
import { fallbackEvents } from "@/lib/fallback-data"
import { formatEventDate, isExternalUrl, isMailtoLink, splitEventsByTime, toEventItem } from "@/lib/event-utils"
import type { EventItem } from "@/lib/types"

const FALLBACK_EVENTS = fallbackEvents.map(toEventItem)

function getActionLabel(event: EventItem, isUpcoming: boolean): string {
  if (!event.registration_url) {
    return isUpcoming ? "Details Coming Soon" : "No Resources Available"
  }

  if (isMailtoLink(event.registration_url)) {
    return isUpcoming ? "Contact Organizer" : "Request Details"
  }

  return isUpcoming ? "Register Now" : "View Details"
}

export async function EventsSection() {
  const events = (await getEvents()) ?? FALLBACK_EVENTS
  const { upcoming, past } = splitEventsByTime(events.length > 0 ? events : FALLBACK_EVENTS)

  return (
    <section id="events" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Upcoming Events</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join us at our upcoming events to connect with fellow engineers, learn from industry experts, and showcase your
            innovations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {upcoming.length === 0 ? (
            <Card className="md:col-span-2 lg:col-span-3">
              <CardContent className="p-8 text-center text-sm text-muted-foreground">
                No upcoming events are scheduled right now. Please check back soon.
              </CardContent>
            </Card>
          ) : (
            upcoming.map((event) => {
              const actionLabel = getActionLabel(event, true)
              const isDisabled = !event.registration_url
              const isExternal = event.registration_url ? isExternalUrl(event.registration_url) : false

              return (
                <Card key={event.id}>
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

                    {isDisabled ? (
                      <div className="text-xs text-center text-muted-foreground">Registration details coming soon.</div>
                    ) : (
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="w-full border border-input bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        <Link
                          href={event.registration_url!}
                          {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        >
                          {actionLabel}
                        </Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>

        <div className="text-center my-16">
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Past Highlights</h3>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Explore summaries and resources from recent gatherings hosted by our global network.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {past.length === 0 ? (
            <Card className="md:col-span-2 lg:col-span-3">
              <CardContent className="p-8 text-center text-sm text-muted-foreground">
                No past events to display yet. New highlights will appear here after events conclude.
              </CardContent>
            </Card>
          ) : (
            past.map((event) => {
              const actionLabel = getActionLabel(event, false)
              const isDisabled = !event.registration_url
              const isExternal = event.registration_url ? isExternalUrl(event.registration_url) : false

              return (
                <Card key={event.id} className="opacity-90">
                  <CardHeader>
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {event.description && (
                      <p className="text-muted-foreground text-sm leading-relaxed">{event.description}</p>
                    )}

                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {formatEventDate(event.event_date, "Completed")}
                      </div>
                      {event.location && (
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          {event.location}
                        </div>
                      )}
                    </div>

                    {isDisabled ? (
                      <div className="text-xs text-center text-muted-foreground">No additional resources available.</div>
                    ) : (
                      <Button asChild size="sm" className="w-full bg-neutral-800 text-neutral-200 hover:bg-neutral-700">
                        <Link
                          href={event.registration_url!}
                          {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        >
                          {actionLabel}
                        </Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="secondary" asChild>
            <Link href="/events">Explore All Events</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

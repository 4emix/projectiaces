"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Calendar, MapPin, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { AdminNavigation } from "@/components/admin/admin-navigation"
import { isSupabaseEnvConfigured } from "@/lib/supabase/config"
import type { EventItem } from "@/lib/types"
import { parseEventDate, toEventItem } from "@/lib/event-utils"

export default function AdminEventsPage() {
  const { toast } = useToast()
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const isSupabaseConfigured = isSupabaseEnvConfigured()

  const showSupabaseToast = () => {
    toast({
      title: "Supabase configuration required",
      description: "Connect Supabase to enable creating and editing events.",
      variant: "destructive",
    })
  }

  useEffect(() => {
    console.log("[v0] AdminEventsPage mounted, fetching events...")
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      console.log("[v0] Starting fetch to /api/events")
      const response = await fetch("/api/events")
      console.log("[v0] Response status:", response.status)
      console.log("[v0] Response ok:", response.ok)

      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Events data received:", data)
        console.log("[v0] Number of events:", data.length)
        if (Array.isArray(data)) {
          setEvents(data.map(toEventItem))
        }
      } else {
        const errorText = await response.text()
        console.error("[v0] API response not ok:", response.status, errorText)
      }
    } catch (error) {
      console.error("[v0] Error fetching events:", error)
    } finally {
      console.log("[v0] Setting loading to false")
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!isSupabaseConfigured) {
      showSupabaseToast()
      return
    }

    if (!confirm("Are you sure you want to delete this event?")) return

    try {
      const response = await fetch(`/api/events/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Event deleted successfully",
        })
        fetchEvents()
      } else {
        throw new Error("Failed to delete event")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      })
    }
  }

  const toggleActive = async (id: string, isActive: boolean) => {
    if (!isSupabaseConfigured) {
      showSupabaseToast()
      return
    }

    try {
      const response = await fetch(`/api/events/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_active: !isActive }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Event ${!isActive ? "activated" : "deactivated"} successfully`,
        })
        fetchEvents()
      } else {
        throw new Error("Failed to update event")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update event",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/40 to-background">
        <AdminNavigation />
        <main className="flex min-h-[60vh] items-center justify-center pt-24">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-accent/40 border-t-accent"></div>
            <p className="mt-4 text-sm text-muted-foreground">Loading events...</p>
          </div>
        </main>
      </div>
    )
  }

  console.log("[v0] Rendering events page with", events.length, "events")

  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const upcomingEvents = [...events]
    .filter((event) => {
      const eventDate = parseEventDate(event.event_date)
      if (!eventDate) {
        return true
      }

      return eventDate >= startOfToday
    })
    .sort((a, b) => {
      const dateA = parseEventDate(a.event_date)
      const dateB = parseEventDate(b.event_date)

      if (!dateA && !dateB) {
        return a.title.localeCompare(b.title)
      }
      if (!dateA) {
        return 1
      }
      if (!dateB) {
        return -1
      }

      return dateA.getTime() - dateB.getTime()
    })

  const pastEvents = [...events]
    .filter((event) => {
      const eventDate = parseEventDate(event.event_date)
      return Boolean(eventDate) && eventDate! < startOfToday
    })
    .sort((a, b) => {
      const dateA = parseEventDate(a.event_date)
      const dateB = parseEventDate(b.event_date)

      if (!dateA && !dateB) {
        return a.title.localeCompare(b.title)
      }
      if (!dateA) {
        return 1
      }
      if (!dateB) {
        return -1
      }

      return dateB.getTime() - dateA.getTime()
    })

  const renderEventCard = (event: EventItem, isUpcoming: boolean) => {
    const eventDate = parseEventDate(event.event_date)
    const formattedDate = eventDate
      ? eventDate.toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Date to be announced"

    return (
      <Card
        key={`${isUpcoming ? "upcoming" : "past"}-${event.id}`}
        className="border-border/60 bg-card/80 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
      >
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex flex-1 space-x-4">
              {event.image_url && (
                <img
                  src={event.image_url ?? "/placeholder.svg"}
                  alt={event.title}
                  className="hidden h-16 w-20 rounded object-cover sm:block"
                />
              )}
              <div className="flex-1">
                <div className="mb-2 flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-foreground">{event.title}</h3>
                  <Badge variant={event.is_active ? "default" : "secondary"}>
                    {event.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <p className="mb-2 text-sm text-muted-foreground">{event.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formattedDate}</span>
                  </div>
                  {event.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  {isUpcoming ? (
                    <Button
                      asChild
                      variant="outline"
                      className="rounded-full border border-input bg-background text-foreground hover:bg-muted"
                    >
                      <Link
                        href={event.registration_url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Register Now
                      </Link>
                    </Button>
                  ) : (
                    <Button asChild className="rounded-full bg-neutral-900 text-neutral-100 hover:bg-neutral-700">
                      <Link
                        href={event.registration_url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-2">
              {isSupabaseConfigured ? (
                <Button variant="outline" size="sm" className="rounded-full" asChild>
                  <Link href={`/admin/events/${event.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" className="rounded-full" onClick={showSupabaseToast}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => toggleActive(event.id, event.is_active)}
              >
                {event.is_active ? "Deactivate" : "Activate"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full text-destructive"
                onClick={() => handleDelete(event.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/40 to-background">
      <AdminNavigation />
      <main className="pt-24 pb-12">
        <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <div>
                <h1 className="text-3xl font-semibold text-foreground">Events Management</h1>
                <p className="text-muted-foreground">Manage upcoming events and activities</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="w-full justify-start rounded-full text-muted-foreground transition hover:text-foreground md:w-auto"
              >
                <Link href="/admin">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to dashboard
                </Link>
              </Button>
            </div>
            {isSupabaseConfigured ? (
              <Button asChild className="rounded-full px-5">
                <Link href="/admin/events/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Event
                </Link>
              </Button>
            ) : (
              <Button onClick={showSupabaseToast} variant="outline" className="rounded-full px-5">
                <Plus className="mr-2 h-4 w-4" />
                Add New Event
              </Button>
            )}
          </div>

          {!isSupabaseConfigured && (
            <Alert variant="destructive" className="border border-border/60 bg-destructive/10 text-destructive">
              <AlertTitle>Event management is read-only</AlertTitle>
              <AlertDescription>
                Supabase credentials are not configured. Existing entries shown here are static fallback data and cannot be
                modified until Supabase is connected.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-10">
            {events.length === 0 ? (
              <Card className="border-border/60 bg-card/80 shadow-sm">
                <CardContent className="p-10 text-center">
                  <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-medium">No events found</h3>
                  <p className="mb-4 text-muted-foreground">Get started by creating your first event.</p>
                  {isSupabaseConfigured ? (
                    <Button asChild className="rounded-full px-5">
                      <Link href="/admin/events/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Create First Event
                      </Link>
                    </Button>
                  ) : (
                    <Button onClick={showSupabaseToast} variant="outline" className="rounded-full px-5">
                      <Plus className="mr-2 h-4 w-4" />
                      Create First Event
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <>
                <section>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-foreground">Upcoming Events</h2>
                    <Badge variant="outline">{upcomingEvents.length}</Badge>
                  </div>
                  <div className="mt-4 grid gap-6">
                    {upcomingEvents.length === 0 ? (
                      <Card className="border-border/60 bg-card/60">
                        <CardContent className="p-6 text-center text-sm text-muted-foreground">
                          No upcoming events.
                        </CardContent>
                      </Card>
                    ) : (
                      upcomingEvents.map((event) => renderEventCard(event, true))
                    )}
                  </div>
                </section>
                <section>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-foreground">Past Events</h2>
                    <Badge variant="outline">{pastEvents.length}</Badge>
                  </div>
                  <div className="mt-4 grid gap-6">
                    {pastEvents.length === 0 ? (
                      <Card className="border-border/60 bg-card/60">
                        <CardContent className="p-6 text-center text-sm text-muted-foreground">
                          No past events yet.
                        </CardContent>
                      </Card>
                    ) : (
                      pastEvents.map((event) => renderEventCard(event, false))
                    )}
                  </div>
                </section>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

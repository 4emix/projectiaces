"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Calendar, MapPin } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { AdminNavigation } from "@/components/admin/admin-navigation"

interface Event {
  id: string
  title: string
  description: string
  event_date: string
  location: string
  registration_url: string
  image_url: string
  is_active: boolean
  created_at: string
}

export default function AdminEventsPage() {
  const { toast } = useToast()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

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
        setEvents(data)
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
      <div className="min-h-screen bg-background">
        <AdminNavigation />
        <main className="pt-16">
          <div className="p-8">
            <div className="text-center">Loading events...</div>
          </div>
        </main>
      </div>
    )
  }

  console.log("[v0] Rendering events page with", events.length, "events")

  return (
    <div className="min-h-screen bg-background">
      <AdminNavigation />
      <main className="pt-16">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Events Management</h1>
              <p className="text-muted-foreground">Manage upcoming events and activities</p>
            </div>
            <Button asChild>
              <Link href="/admin/events/new">
                <Plus className="w-4 h-4 mr-2" />
                Add New Event
              </Link>
            </Button>
          </div>

          <div className="grid gap-6">
            {events.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No events found</h3>
                  <p className="text-muted-foreground mb-4">Get started by creating your first event.</p>
                  <Button asChild>
                    <Link href="/admin/events/new">
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Event
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              events.map((event) => (
                <Card key={event.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex space-x-4">
                        {event.image_url && (
                          <img
                            src={event.image_url || "/placeholder.svg"}
                            alt={event.title}
                            className="w-20 h-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold text-foreground">{event.title}</h3>
                            <Badge variant={event.is_active ? "default" : "secondary"}>
                              {event.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(event.event_date).toLocaleDateString()}</span>
                            </div>
                            {event.location && (
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-3 h-3" />
                                <span>{event.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/events/${event.id}/edit`}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => toggleActive(event.id, event.is_active)}>
                          {event.is_active ? "Deactivate" : "Activate"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(event.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

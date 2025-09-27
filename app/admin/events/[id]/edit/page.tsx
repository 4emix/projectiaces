"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save } from "lucide-react"

import { useToast } from "@/hooks/use-toast"
import { isSupabaseEnvConfigured } from "@/lib/supabase/config"
import { toGoogleDriveDirectUrl } from "@/lib/utils"
import { GOOGLE_DRIVE_IMAGE_HINT } from "@/lib/constants"

interface EventFormData {
  title: string
  description: string
  event_date: string
  location: string
  registration_url: string
  image_url: string
  is_active: boolean
}

interface EventResponse extends Partial<EventFormData> {
  id: string
  event_date?: string
  is_active?: boolean
}

export default function EditEventPage() {
  const params = useParams<{ id: string }>()
  const eventId = params?.id
  const router = useRouter()
  const { toast } = useToast()
  const isSupabaseConfigured = isSupabaseEnvConfigured()

  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    event_date: "",
    location: "",
    registration_url: "",
    image_url: "",
    is_active: true,
  })

  useEffect(() => {
    if (!eventId) return

    const fetchEvent = async () => {
      setInitialLoading(true)
      try {
        const response = await fetch("/api/events")
        if (!response.ok) {
          throw new Error("Failed to fetch event details")
        }

        const events: EventResponse[] = await response.json()
        const event = events.find((item) => item.id === eventId)

        if (!event) {
          toast({
            title: "Event not found",
            description: "We couldn't locate the requested event.",
            variant: "destructive",
          })
          return
        }

        const formattedDate = event.event_date
          ? new Date(event.event_date).toISOString().split("T")[0]
          : ""

        setFormData({
          title: event.title || "",
          description: event.description || "",
          event_date: formattedDate,
          location: event.location || "",
          registration_url: event.registration_url || "",
          image_url: event.image_url || "",
          is_active: event.is_active ?? true,
        })
      } catch (error) {
        console.error("Failed to load event", error)
        toast({
          title: "Error",
          description: "Unable to load event details. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setInitialLoading(false)
      }
    }

    fetchEvent()
  }, [eventId, toast])

  const handleChange = (field: keyof EventFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!eventId) return

    if (!isSupabaseConfigured) {
      toast({
        title: "Supabase configuration required",
        description: "Connect Supabase to enable editing events.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const payload = {
        ...formData,
        image_url: toGoogleDriveDirectUrl(formData.image_url),
      }

      const response = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error("Failed to update event")
      }

      toast({
        title: "Success",
        description: "Event updated successfully",
      })
      router.push("/admin/events")
    } catch (error) {
      console.error("Failed to update event", error)
      toast({
        title: "Error",
        description: "Failed to update event",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center space-x-4 mb-8">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/events">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events Management
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Event</h1>
          <p className="text-muted-foreground">Update details for your event</p>
        </div>
      </div>

      {!isSupabaseConfigured && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Event editing is unavailable</AlertTitle>
          <AlertDescription>
            Supabase credentials are not configured. Configure Supabase to edit event details.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
        </CardHeader>
        <CardContent>
          {initialLoading ? (
            <div className="py-12 text-center text-sm text-muted-foreground">Loading event details...</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="Global Civil Engineering Summit 2024"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Brief description of the event..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="event_date">Event Date *</Label>
                  <Input
                    id="event_date"
                    type="date"
                    value={formData.event_date}
                    onChange={(e) => handleChange("event_date", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    placeholder="San Francisco, CA"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="registration_url">Registration URL</Label>
                  <Input
                    id="registration_url"
                    value={formData.registration_url}
                    onChange={(e) => handleChange("registration_url", e.target.value)}
                    placeholder="https://example.com/register"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image_url">Event Image URL</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => handleChange("image_url", e.target.value)}
                    placeholder="https://example.com/event-image.jpg"
                  />
                  <p className="text-xs text-muted-foreground">{GOOGLE_DRIVE_IMAGE_HINT}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleChange("is_active", checked)}
                />
                <Label htmlFor="is_active">Published</Label>
              </div>

              <Button type="submit" disabled={loading || !isSupabaseConfigured} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

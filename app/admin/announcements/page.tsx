"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import type { Announcement } from "@/lib/types"
import { AdminNavigation } from "@/components/admin/admin-navigation"

function formatDateTime(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ""
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function AnnouncementsAdminPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch("/api/announcements")
      if (response.ok) {
        const data = await response.json()
        setAnnouncements(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error("Error fetching announcements:", error)
      toast({ title: "Error", description: "Failed to load announcements", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return

    try {
      const response = await fetch(`/api/announcements/${id}`, { method: "DELETE" })
      if (response.ok) {
        setAnnouncements((prev) => prev.filter((a) => a.id !== id))
        toast({ title: "Success", description: "Announcement deleted successfully" })
      } else {
        throw new Error("Failed to delete announcement")
      }
    } catch (error) {
      console.error("Error deleting announcement:", error)
      toast({ title: "Error", description: "Failed to delete announcement", variant: "destructive" })
    }
  }

  const pageContent = (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Announcements</h1>
            <p className="text-muted-foreground">
              Manage announcements. The 5 most recent are shown on the homepage; all appear on the announcements page.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="w-full justify-start rounded-full text-muted-foreground transition hover:text-foreground sm:w-auto"
          >
            <Link href="/admin">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to dashboard
            </Link>
          </Button>
        </div>
        <Button asChild className="rounded-full px-5">
          <Link href="/admin/announcements/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Announcement
          </Link>
        </Button>
      </div>

      {loading ? (
        <Card className="border-border/60 bg-card/80 shadow-sm">
          <CardContent className="p-10 text-center text-muted-foreground">Loading announcements...</CardContent>
        </Card>
      ) : announcements.length === 0 ? (
        <Card className="border-border/60 bg-card/80 shadow-sm">
          <CardContent className="p-10 text-center">
            <p className="mb-4 text-muted-foreground">No announcements yet</p>
            <Button asChild className="rounded-full px-5">
              <Link href="/admin/announcements/new">
                <Plus className="mr-2 h-4 w-4" />
                Add First Announcement
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border/60 bg-card/80 shadow-sm">
          <CardContent className="divide-y divide-border p-0">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="flex items-center justify-between gap-4 p-4 sm:px-6">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium text-foreground">{announcement.title}</p>
                    {!announcement.is_active && (
                      <Badge variant="secondary" className="shrink-0">
                        Inactive
                      </Badge>
                    )}
                    {announcement.link_url && (
                      <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{formatDateTime(announcement.announced_at)}</p>
                </div>
                <div className="flex shrink-0 space-x-2">
                  <Button variant="outline" size="sm" className="rounded-full" asChild>
                    <Link href={`/admin/announcements/${announcement.id}/edit`}>
                      <Edit className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() => handleDelete(announcement.id, announcement.title)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/40 to-background">
      <AdminNavigation />
      <main className="pt-24 pb-12">
        <div className="mx-auto max-w-4xl space-y-6 px-4 sm:px-6 lg:px-8">{pageContent}</div>
      </main>
    </div>
  )
}

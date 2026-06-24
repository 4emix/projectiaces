"use client"

import { useState, useEffect } from "react"
import { ContentEditor, TextField, TextAreaField, SwitchField, DateTimeField } from "@/components/admin/content-editor"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import type { Announcement } from "@/lib/types"

function isoToLocalInput(iso: string | null | undefined) {
  if (!iso) return ""
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ""
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function EditAnnouncementPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<Partial<Announcement>>({
    title: "",
    body: "",
    link_url: "",
    link_label: "",
    is_active: true,
  })
  const [dateInput, setDateInput] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await fetch("/api/announcements")
        if (response.ok) {
          const announcements = await response.json()
          const announcement = announcements.find((a: Announcement) => a.id === params.id)
          if (announcement) {
            setData(announcement)
            setDateInput(isoToLocalInput(announcement.announced_at))
          } else {
            toast({ title: "Error", description: "Announcement not found", variant: "destructive" })
            router.push("/admin/announcements")
          }
        }
      } catch (error) {
        console.error("Error fetching announcement:", error)
        toast({ title: "Error", description: "Failed to load announcement", variant: "destructive" })
      } finally {
        setLoading(false)
      }
    }

    fetchAnnouncement()
  }, [params.id, toast, router])

  const handleSave = async () => {
    if (!data.title) {
      toast({ title: "Error", description: "Title is required", variant: "destructive" })
      return
    }

    setSaving(true)
    try {
      const announced_at = dateInput ? new Date(dateInput).toISOString() : data.announced_at
      const response = await fetch(`/api/announcements/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, announced_at }),
      })

      if (response.ok) {
        const updated = await response.json()
        setData(updated)
        setDateInput(isoToLocalInput(updated.announced_at))
        toast({ title: "Success", description: "Your changes have been saved successfully!" })
      } else {
        throw new Error("Failed to update announcement")
      }
    } catch (error) {
      console.error("Error updating announcement:", error)
      toast({ title: "Error", description: "Failed to update announcement", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const handlePreview = () => {
    window.open("/announcements", "_blank")
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading announcement...</p>
        </div>
      </div>
    )
  }

  return (
    <ContentEditor
      title="Edit Announcement"
      backUrl="/admin/announcements"
      onSave={handleSave}
      onPreview={handlePreview}
      isSaving={saving}
      saveLabel="Save Announcement"
      description="Modify the announcement and publish your updates."
    >
      <div className="space-y-6">
        <TextField
          label="Title"
          value={data.title || ""}
          onChange={(value) => setData((prev) => ({ ...prev, title: value }))}
          placeholder="e.g., Graduation Ceremony"
          description="The announcement title (shown in the list)"
          required
        />

        <DateTimeField
          label="Date & time"
          value={dateInput}
          onChange={setDateInput}
          description="Shown under the title and used to order announcements"
        />

        <TextAreaField
          label="Details"
          value={data.body || ""}
          onChange={(value) => setData((prev) => ({ ...prev, body: value }))}
          placeholder="The full announcement text shown in the popup"
          description="Displayed in the box when someone clicks the announcement"
          rows={6}
        />

        <div className="grid md:grid-cols-2 gap-6">
          <TextField
            label="Link (optional)"
            value={data.link_url || ""}
            onChange={(value) => setData((prev) => ({ ...prev, link_url: value }))}
            placeholder="https://example.com/details"
            description="Optional link shown as a button in the popup"
          />

          <TextField
            label="Link label (optional)"
            value={data.link_label || ""}
            onChange={(value) => setData((prev) => ({ ...prev, link_label: value }))}
            placeholder="Open link"
            description="Text for the link button"
          />
        </div>

        <SwitchField
          label="Active"
          checked={data.is_active ?? true}
          onChange={(checked) => setData((prev) => ({ ...prev, is_active: checked }))}
          description="Whether this announcement is currently shown"
        />

        {saving && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent mx-auto"></div>
            <p className="text-muted-foreground mt-2">Saving changes...</p>
          </div>
        )}
      </div>
    </ContentEditor>
  )
}

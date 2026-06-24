"use client"

import { useState } from "react"
import { ContentEditor, TextField, TextAreaField, SwitchField, DateTimeField } from "@/components/admin/content-editor"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import type { Announcement } from "@/lib/types"

function nowLocalInput() {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function NewAnnouncementPage() {
  const [data, setData] = useState<Partial<Announcement>>({
    title: "",
    body: "",
    link_url: "",
    link_label: "",
    is_active: true,
  })
  const [dateInput, setDateInput] = useState(nowLocalInput())
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSave = async () => {
    if (!data.title) {
      toast({ title: "Error", description: "Title is required", variant: "destructive" })
      return
    }

    setSaving(true)
    try {
      const announced_at = dateInput ? new Date(dateInput).toISOString() : new Date().toISOString()
      const response = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, announced_at }),
      })

      if (response.ok) {
        toast({ title: "Success", description: "Announcement created successfully" })
        router.push("/admin/announcements")
      } else {
        throw new Error("Failed to create announcement")
      }
    } catch (error) {
      console.error("Error creating announcement:", error)
      toast({ title: "Error", description: "Failed to create announcement", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  return (
    <ContentEditor
      title="Add Announcement"
      backUrl="/admin/announcements"
      onSave={handleSave}
      isSaving={saving}
      saveLabel="Create Announcement"
      description="Create an announcement shown on the homepage and the announcements page."
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
            <p className="text-muted-foreground mt-2">Creating announcement...</p>
          </div>
        )}
      </div>
    </ContentEditor>
  )
}

"use client"

import { useState, useEffect } from "react"
import { ContentEditor, TextField, TextAreaField, SwitchField } from "@/components/admin/content-editor"
import { useToast } from "@/hooks/use-toast"
import type { AboutContent } from "@/lib/types"

export default function AboutAdminPage() {
  const [aboutData, setAboutData] = useState<Partial<AboutContent>>({
    title: "",
    content: "",
    image_url: "",
    mission_statement: "",
    vision_statement: "",
    is_active: true,
    id: null, // Initialize id field
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const response = await fetch("/api/about")
        if (response.ok) {
          const data = await response.json()
          if (data) {
            setAboutData(data)
          }
        }
      } catch (error) {
        console.error("Error fetching about content:", error)
        toast({
          title: "Error",
          description: "Failed to load about content",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAboutContent()
  }, [toast])

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/about", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(aboutData),
      })

      if (response.ok) {
        const updatedData = await response.json()
        setAboutData(updatedData)
        toast({
          title: "Success",
          description: "About content updated successfully",
        })
      } else {
        throw new Error("Failed to update about content")
      }
    } catch (error) {
      console.error("Error saving about content:", error)
      toast({
        title: "Error",
        description: "Failed to save about content",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handlePreview = () => {
    window.open("/#about", "_blank")
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading about content...</p>
        </div>
      </div>
    )
  }

  return (
    <ContentEditor
      title="Edit About Section"
      backUrl="/admin"
      onSave={handleSave}
      onPreview={handlePreview}
      isSaving={saving}
      saveLabel="Save About Content"
    >
      <div className="space-y-6">
        <TextField
          label="Section Title"
          value={aboutData.title || ""}
          onChange={(value) => setAboutData((prev) => ({ ...prev, title: value }))}
          placeholder="About IACES"
          description="The main title for the about section"
          required
        />

        <TextAreaField
          label="Main Content"
          value={aboutData.content || ""}
          onChange={(value) => setAboutData((prev) => ({ ...prev, content: value }))}
          placeholder="Main about description..."
          description="The primary content describing the organization"
          rows={6}
        />

        <TextField
          label="Image URL"
          value={aboutData.image_url || ""}
          onChange={(value) => setAboutData((prev) => ({ ...prev, image_url: value }))}
          placeholder="https://example.com/about-image.jpg"
          description="Optional image for the about section"
        />

        <TextAreaField
          label="Mission Statement"
          value={aboutData.mission_statement || ""}
          onChange={(value) => setAboutData((prev) => ({ ...prev, mission_statement: value }))}
          placeholder="Our mission is to..."
          description="The organization's mission statement"
          rows={4}
        />

        <TextAreaField
          label="Vision Statement"
          value={aboutData.vision_statement || ""}
          onChange={(value) => setAboutData((prev) => ({ ...prev, vision_statement: value }))}
          placeholder="Our vision is to..."
          description="The organization's vision statement"
          rows={4}
        />

        <SwitchField
          label="Active"
          checked={aboutData.is_active || false}
          onChange={(checked) => setAboutData((prev) => ({ ...prev, is_active: checked }))}
          description="Whether this about section is currently displayed"
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

"use client"

import { useState, useEffect } from "react"
import { ContentEditor, TextField, TextAreaField, SwitchField } from "@/components/admin/content-editor"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import type { AboutContent } from "@/lib/types"

export default function AboutAdminPage({ params }: { params: { id: string } }) {
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
  const [isFallbackContent, setIsFallbackContent] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const response = await fetch("/api/about")
        if (response.ok) {
          const data = await response.json()
          const datas = data.find((c: AboutContent) => c.id === params.id)
          if (datas) {
            setAboutData(datas)
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
  }, [params.id, toast, router])

  const handleSave = async () => {
    if (!aboutData.title || !aboutData.title.trim()) {
      toast({
        title: "Title is required",
        description: "Please provide a title for the about section before saving.",
        variant: "destructive",
      })
      return
    }

    if (!aboutData.content || !aboutData.content.trim()) {
      toast({
        title: "Content is required",
        description: "Add a description to tell visitors about your organization.",
        variant: "destructive",
      })
      return
    }

    if (!isSupabaseConfigured) {
      toast({
        title: "Supabase configuration required",
        description: "Connect Supabase to enable saving changes to the about section.",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      const response = await fetch(`/api/about/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(aboutData),
      })

      if (response.ok) {
        const updatedData = await response.json()
        setAboutData(updatedData)
        setIsFallbackContent(Boolean(updatedData?.id?.startsWith("fallback-")))
        toast({
          title: "Success",
          description: "About content updated successfully",
        })
      } else {
        const errorData = await response.json().catch(() => null)
        if (response.status === 503) {
          toast({
            title: "Supabase connection required",
            description: "Connect Supabase to enable saving about content.",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Error",
            description: errorData?.error ?? "Failed to save about content",
            variant: "destructive",
          })
        }
        return
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
      saveDisabled={!isSupabaseConfigured}
      saveLabel="Save About Content"
      description="Share your organization's mission, vision, and story with visitors."
    >
      <div className="space-y-6">
        
        {isFallbackContent && (
          <Alert variant="destructive">
            <AlertTitle>No active about content found</AlertTitle>
            <AlertDescription>
              Saving will create a new about entry once Supabase is connected. Until then, fallback content is shown on the site.
            </AlertDescription>
          </Alert>
        )}
        {!isSupabaseConfigured && (
          <Alert variant="destructive">
            <AlertTitle>Editing is temporarily disabled</AlertTitle>
            <AlertDescription>
              Supabase credentials are not configured. The content shown below is read-only fallback data.
            </AlertDescription>
          </Alert>
        )}
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

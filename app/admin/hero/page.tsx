"use client"

import { useState, useEffect } from "react"
import { ContentEditor, TextField, TextAreaField, SwitchField } from "@/components/admin/content-editor"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { isSupabaseEnvConfigured } from "@/lib/supabase/config"
import type { HeroContent } from "@/lib/types"

function toNullableString(value: string | null | undefined) {
  if (typeof value !== "string") {
    return null
  }

  const trimmed = value.trim()
  return trimmed.length === 0 ? null : trimmed
}

export default function HeroAdminPage() {
  const isSupabaseConfigured = isSupabaseEnvConfigured()
  const [heroData, setHeroData] = useState<Partial<HeroContent>>({
    title: "",
    subtitle: "",
    description: "",
    cta_text: "",
    cta_link: "",
    is_active: true,
    id: null, // Initialize id field
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isFallbackContent, setIsFallbackContent] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        const response = await fetch("/api/hero")
        if (response.ok) {
          const data = await response.json()
          if (data) {
            setHeroData(data)
            setIsFallbackContent(Boolean(data?.id?.startsWith("fallback-")))
          }
        }
      } catch (error) {
        console.error("Error fetching hero content:", error)
        toast({
          title: "Error",
          description: "Failed to load hero content",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchHeroContent()
  }, [toast])

  const handleSave = async () => {
    if (!heroData.title || !heroData.title.trim()) {
      toast({
        title: "Title is required",
        description: "Please provide a headline for the hero section before saving.",
        variant: "destructive",
      })
      return
    }

    if (!isSupabaseConfigured) {
      toast({
        title: "Supabase configuration required",
        description: "Connect Supabase to enable saving changes to the hero section.",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      const payload = {
        ...(heroData.id ? { id: heroData.id } : {}),
        title: heroData.title.trim(),
        subtitle: toNullableString(heroData.subtitle),
        description: toNullableString(heroData.description),
        cta_text: toNullableString(heroData.cta_text),
        cta_link: toNullableString(heroData.cta_link),
        is_active: heroData.is_active ?? true,
      }

      const response = await fetch("/api/hero", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        const updatedData = await response.json()
        setHeroData(updatedData)
        setIsFallbackContent(Boolean(updatedData?.id?.startsWith("fallback-")))
        toast({
          title: "Success",
          description: "Hero content updated successfully",
        })
      } else {
        const errorData = await response.json().catch(() => null)
        if (response.status === 503) {
          toast({
            title: "Supabase connection required",
            description: "Connect Supabase to enable saving hero content.",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Error",
            description: errorData?.error ?? "Failed to save hero content",
            variant: "destructive",
          })
        }
        return
      }
    } catch (error) {
      console.error("Error saving hero content:", error)
      toast({
        title: "Error",
        description: "Failed to save hero content",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handlePreview = () => {
    window.open("/", "_blank")
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading hero content...</p>
        </div>
      </div>
    )
  }

  return (
    <ContentEditor
      title="Edit Hero Section"
      backUrl="/admin"
      onSave={handleSave}
      onPreview={handlePreview}
      isSaving={saving}
      saveDisabled={!isSupabaseConfigured}
      saveLabel="Save Hero Content"
      description="Control the main headline, supporting text, and call-to-action visitors see first."
    >
      <div className="space-y-6">
        {isFallbackContent && (
          <Alert variant="destructive">
            <AlertTitle>No active hero content found</AlertTitle>
            <AlertDescription>
              Saving will create a new hero entry once Supabase is connected. Until then, fallback content is shown on the site.
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
          label="Main Title"
          value={heroData.title || ""}
          onChange={(value) => setHeroData((prev) => ({ ...prev, title: value }))}
          placeholder="Enter the main hero title"
          description="The primary headline displayed on the homepage"
          required
        />

        <TextField
          label="Subtitle"
          value={heroData.subtitle || ""}
          onChange={(value) => setHeroData((prev) => ({ ...prev, subtitle: value }))}
          placeholder="Enter a subtitle"
          description="Supporting text that appears below the main title"
        />

        <TextAreaField
          label="Description"
          value={heroData.description || ""}
          onChange={(value) => setHeroData((prev) => ({ ...prev, description: value }))}
          placeholder="Enter a detailed description"
          description="Longer description text that explains the organization's purpose"
          rows={4}
        />

        <div className="grid md:grid-cols-2 gap-6">
          <TextField
            label="Call-to-Action Text"
            value={heroData.cta_text || ""}
            onChange={(value) => setHeroData((prev) => ({ ...prev, cta_text: value }))}
            placeholder="e.g., Learn More, Get Started"
            description="Text for the primary action button"
          />

          <TextField
            label="Call-to-Action Link"
            value={heroData.cta_link || ""}
            onChange={(value) => setHeroData((prev) => ({ ...prev, cta_link: value }))}
            placeholder="e.g., #about, /contact"
            description="URL or anchor link for the button"
          />
        </div>

        <SwitchField
          label="Active"
          checked={heroData.is_active || false}
          onChange={(checked) => setHeroData((prev) => ({ ...prev, is_active: checked }))}
          description="Whether this hero section is currently displayed"
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

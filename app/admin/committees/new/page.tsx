"use client"

import { useState } from "react"
import { ContentEditor, TextField, TextAreaField, SwitchField } from "@/components/admin/content-editor"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import type { LocalCommittee } from "@/lib/types"

export default function NewCommitteePage() {
  const [committeeData, setCommitteeData] = useState<Partial<LocalCommittee>>({
    name: "",
    country: "",
    website_url: "",
    logo_url: "",
    description: "",
    display_order: 0,
    is_active: true,
  })
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSave = async () => {
    if (!committeeData.name || !committeeData.country) {
      toast({
        title: "Error",
        description: "Name and country are required",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      const response = await fetch("/api/committees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(committeeData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Committee created successfully",
        })
        router.push("/admin/committees")
      } else {
        throw new Error("Failed to create committee")
      }
    } catch (error) {
      console.error("Error creating committee:", error)
      toast({
        title: "Error",
        description: "Failed to create committee",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <ContentEditor
      title="Add New Committee"
      backUrl="/admin/committees"
      onSave={handleSave}
      isSaving={saving}
      saveLabel="Create Committee"
      description="Create a new local committee entry with key details and visibility settings."
    >
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <TextField
            label="Committee Name"
            value={committeeData.name || ""}
            onChange={(value) => setCommitteeData((prev) => ({ ...prev, name: value }))}
            placeholder="e.g., IACES Germany"
            description="The official name of the local committee"
            required
          />

          <TextField
            label="Country"
            value={committeeData.country || ""}
            onChange={(value) => setCommitteeData((prev) => ({ ...prev, country: value }))}
            placeholder="e.g., Germany"
            description="The country where this committee operates"
            required
          />
        </div>

        <TextField
          label="Website URL"
          value={committeeData.website_url || ""}
          onChange={(value) => setCommitteeData((prev) => ({ ...prev, website_url: value }))}
          placeholder="https://example.com"
          description="The committee's official website"
        />

        <TextField
          label="Logo URL"
          value={committeeData.logo_url || ""}
          onChange={(value) => setCommitteeData((prev) => ({ ...prev, logo_url: value }))}
          placeholder="https://example.com/logo.png"
          description="URL to the committee's logo image"
        />

        <TextAreaField
          label="Description"
          value={committeeData.description || ""}
          onChange={(value) => setCommitteeData((prev) => ({ ...prev, description: value }))}
          placeholder="Brief description of the committee"
          description="A short description of the committee's activities and goals"
          rows={4}
        />

        <div className="grid md:grid-cols-2 gap-6">
          <TextField
            label="Display Order"
            value={committeeData.display_order?.toString() || "0"}
            onChange={(value) => setCommitteeData((prev) => ({ ...prev, display_order: Number.parseInt(value) || 0 }))}
            placeholder="0"
            description="Order in which this committee appears (lower numbers first)"
          />

          <SwitchField
            label="Active"
            checked={committeeData.is_active || false}
            onChange={(checked) => setCommitteeData((prev) => ({ ...prev, is_active: checked }))}
            description="Whether this committee is currently displayed"
          />
        </div>

        {saving && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent mx-auto"></div>
            <p className="text-muted-foreground mt-2">Creating committee...</p>
          </div>
        )}
      </div>
    </ContentEditor>
  )
}

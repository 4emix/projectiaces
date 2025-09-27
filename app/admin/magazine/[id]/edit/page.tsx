"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { isSupabaseEnvConfigured } from "@/lib/supabase/config"
import { toGoogleDriveDirectUrl } from "@/lib/utils"

interface MagazineIssueForm {
  title: string
  issue_number: string
  description: string
  cover_image_url: string
  pdf_url: string
  publication_date: string
  publication_type: "magazine" | "newsletter"
  is_featured: boolean
  is_active: boolean
}

export default function EditMagazineIssuePage() {
  const params = useParams()
  const { toast } = useToast()
  const router = useRouter()
  const isSupabaseConfigured = isSupabaseEnvConfigured()

  const [formData, setFormData] = useState<MagazineIssueForm | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notFound, setNotFound] = useState(false)

  const issueIdParam = params?.id
  const issueId = Array.isArray(issueIdParam) ? issueIdParam[0] : issueIdParam

  useEffect(() => {
    if (!issueId) {
      return
    }

    const fetchIssue = async () => {
      try {
        const response = await fetch(`/api/magazines/${issueId}`)
        if (response.status === 404) {
          setNotFound(true)
          return
        }

        if (!response.ok) {
          throw new Error("Failed to load magazine issue")
        }

        const data = await response.json()
        setFormData({
          title: data.title ?? "",
          issue_number: data.issue_number ?? "",
          description: data.description ?? "",
          cover_image_url: toGoogleDriveDirectUrl(data.cover_image_url) ?? "",
          pdf_url: data.pdf_url ?? "",
          publication_date: data.publication_date
            ? new Date(data.publication_date).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          publication_type:
            data.publication_type === "newsletter" ? "newsletter" : "magazine",
          is_featured: Boolean(data.is_featured),
          is_active: Boolean(data.is_active),
        })
      } catch (error) {
        console.error("Error fetching magazine issue:", error)
        toast({
          title: "Error",
          description: "Could not load the magazine issue details.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    void fetchIssue()
  }, [issueId, toast])

  const handleChange = (field: keyof MagazineIssueForm, value: string | boolean) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!formData || !issueId) {
      return
    }

    if (!isSupabaseConfigured) {
      toast({
        title: "Supabase configuration required",
        description: "Connect Supabase to enable updating magazine issues.",
        variant: "destructive",
      })
      return
    }

    if (!formData.title.trim() || !formData.issue_number.trim() || !formData.publication_date) {
      toast({
        title: "Missing required information",
        description: "Title, issue number, and publication date are required.",
        variant: "destructive",
      })
      return
    }

    setSaving(true)

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        cover_image_url: toGoogleDriveDirectUrl(formData.cover_image_url),
        pdf_url: formData.pdf_url.trim() || null,
        issue_number: formData.issue_number.trim(),
        publication_date: formData.publication_date,
        publication_type: formData.publication_type,
        is_featured: formData.is_featured,
        is_active: formData.is_active,
      }

      const response = await fetch(`/api/magazines/${issueId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error("Failed to update magazine issue")
      }

      toast({
        title: "Success",
        description: "Magazine issue updated successfully",
      })
      router.push("/admin/magazine")
    } catch (error) {
      console.error("Error updating magazine issue:", error)
      toast({
        title: "Error",
        description: "Failed to update magazine issue",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">Loading magazine issue...</div>
      </div>
    )
  }

  if (notFound || !formData) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/magazine">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Magazine Management
            </Link>
          </Button>
        </div>
        <Alert variant="destructive">
          <AlertTitle>Magazine issue not found</AlertTitle>
          <AlertDescription>The requested magazine issue could not be located.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center space-x-4 mb-8">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/magazine">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Magazine Management
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Magazine Issue</h1>
          <p className="text-muted-foreground">Update an existing magazine or newsletter publication</p>
        </div>
      </div>

      {!isSupabaseConfigured && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Magazine updates are unavailable</AlertTitle>
          <AlertDescription>
            Supabase credentials are not configured. Configure Supabase to update magazine issues.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Publication Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(event) => handleChange("title", event.target.value)}
                placeholder="Digital Innovation in Civil Engineering"
                required
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="issue_number">Issue Number *</Label>
                <Input
                  id="issue_number"
                  value={formData.issue_number}
                  onChange={(event) => handleChange("issue_number", event.target.value)}
                  placeholder="Vol. 15, Issue 3"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="publication_date">Publication Date *</Label>
                <Input
                  id="publication_date"
                  type="date"
                  value={formData.publication_date}
                  onChange={(event) => handleChange("publication_date", event.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="publication_type">Publication Type *</Label>
                <Select
                  value={formData.publication_type}
                  onValueChange={(value) => handleChange("publication_type", value as "magazine" | "newsletter")}
                >
                  <SelectTrigger id="publication_type">
                    <SelectValue placeholder="Select publication type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="magazine">Magazine</SelectItem>
                    <SelectItem value="newsletter">Newsletter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(event) => handleChange("description", event.target.value)}
                placeholder="Brief description of this publication..."
                rows={3}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="cover_image_url">Cover Image URL</Label>
                <Input
                  id="cover_image_url"
                  value={formData.cover_image_url}
                  onChange={(event) => handleChange("cover_image_url", event.target.value)}
                  placeholder="https://example.com/cover.jpg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pdf_url">PDF URL</Label>
                <Input
                  id="pdf_url"
                  value={formData.pdf_url}
                  onChange={(event) => handleChange("pdf_url", event.target.value)}
                  placeholder="https://example.com/publication.pdf"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => handleChange("is_featured", checked)}
                />
                <Label htmlFor="is_featured">Feature this publication</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleChange("is_active", checked)}
                />
                <Label htmlFor="is_active">Publish immediately</Label>
              </div>
            </div>

            <Button type="submit" disabled={saving || !isSupabaseConfigured} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

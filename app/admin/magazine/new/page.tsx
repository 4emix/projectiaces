"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Save, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { isSupabaseEnvConfigured } from "@/lib/supabase/config"
import { toGoogleDriveImageUrl } from "@/lib/utils"
import { GOOGLE_DRIVE_IMAGE_HINT } from "@/lib/constants"

export default function NewMagazineIssuePage() {
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const isSupabaseConfigured = isSupabaseEnvConfigured()
  const [formData, setFormData] = useState({
    title: "",
    issue_number: "",
    description: "",
    cover_image_url: "",
    pdf_url: "",
    publication_date: new Date().toISOString().split("T")[0],
    publication_type: "magazine" as "magazine" | "newsletter",
    is_featured: false,
    is_active: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isSupabaseConfigured) {
      toast({
        title: "Supabase configuration required",
        description: "Connect Supabase to enable creating magazine issues.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        cover_image_url: toGoogleDriveImageUrl(formData.cover_image_url),
        pdf_url: formData.pdf_url.trim() || null,
        issue_number: formData.issue_number.trim(),
        publication_date: formData.publication_date,
        publication_type: formData.publication_type,
        is_featured: formData.is_featured,
        is_active: formData.is_active,
      }

      if (!payload.title || !payload.issue_number || !payload.publication_date) {
        toast({
          title: "Missing required information",
          description: "Title, issue number, and publication date are required to create a magazine issue.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      const response = await fetch("/api/magazines", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Magazine issue created successfully",
        })
        router.push("/admin/magazine")
      } else {
        throw new Error("Failed to create magazine issue")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create magazine issue",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
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
          <h1 className="text-3xl font-bold text-foreground">Create New Magazine Issue</h1>
          <p className="text-muted-foreground">Add a new magazine issue to the collection</p>
        </div>
      </div>

      {!isSupabaseConfigured && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Magazine creation is unavailable</AlertTitle>
          <AlertDescription>
            Supabase credentials are not configured. Configure Supabase to add or edit magazine issues.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Magazine Issue Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Issue Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Digital Innovation in Computer Engineering"
                required
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="issue_number">Issue Number *</Label>
                <Input
                  id="issue_number"
                  value={formData.issue_number}
                  onChange={(e) => handleChange("issue_number", e.target.value)}
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
                  onChange={(e) => handleChange("publication_date", e.target.value)}
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
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Brief description of this magazine issue..."
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
                  onChange={(e) => handleChange("cover_image_url", e.target.value)}
                  placeholder="https://example.com/cover.jpg"
                />
                <p className="text-xs text-muted-foreground">{GOOGLE_DRIVE_IMAGE_HINT}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pdf_url">PDF URL</Label>
                <Input
                  id="pdf_url"
                  value={formData.pdf_url}
                  onChange={(e) => handleChange("pdf_url", e.target.value)}
                  placeholder="https://example.com/magazine.pdf"
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
                <Label htmlFor="is_featured">Feature this issue on the magazine page</Label>
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

            <Button type="submit" disabled={loading || !isSupabaseConfigured} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Creating..." : "Create Magazine Issue"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

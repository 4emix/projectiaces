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
import { Save, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { isSupabaseEnvConfigured } from "@/lib/supabase/config"

export default function NewMagazineIssuePage() {
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const isSupabaseConfigured = isSupabaseEnvConfigured()
  const [formData, setFormData] = useState({
    title: "",
    volume: 1,
    issue: 1,
    description: "",
    cover_image_url: "",
    pdf_url: "",
    published_date: new Date().toISOString().split("T")[0],
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
      const response = await fetch("/api/magazines", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
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
                <Label htmlFor="volume">Volume *</Label>
                <Input
                  id="volume"
                  type="number"
                  value={formData.volume}
                  onChange={(e) => handleChange("volume", Number.parseInt(e.target.value) || 1)}
                  min="1"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="issue">Issue Number *</Label>
                <Input
                  id="issue"
                  type="number"
                  value={formData.issue}
                  onChange={(e) => handleChange("issue", Number.parseInt(e.target.value) || 1)}
                  min="1"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="published_date">Published Date *</Label>
                <Input
                  id="published_date"
                  type="date"
                  value={formData.published_date}
                  onChange={(e) => handleChange("published_date", e.target.value)}
                  required
                />
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

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => handleChange("is_active", checked)}
              />
              <Label htmlFor="is_active">Publish immediately</Label>
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

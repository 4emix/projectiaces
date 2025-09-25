"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Edit, Eye, FileText, Plus, Trash2 } from "lucide-react"

import { AdminNavigation } from "@/components/admin/admin-navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { isSupabaseEnvConfigured } from "@/lib/supabase/config"

interface MagazineIssue {
  id: string
  title: string
  description: string | null
  cover_image_url: string | null
  pdf_url: string | null
  issue_number: string | null
  publication_date: string | null
  publication_type: "magazine" | "newsletter"
  is_featured: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function AdminMagazinePage() {
  const { toast } = useToast()
  const [issues, setIssues] = useState<MagazineIssue[]>([])
  const [loading, setLoading] = useState(true)
  const isSupabaseConfigured = isSupabaseEnvConfigured()

  const showSupabaseToast = () => {
    toast({
      title: "Supabase configuration required",
      description: "Connect Supabase to enable creating and editing magazine issues.",
      variant: "destructive",
    })
  }

  useEffect(() => {
    fetchIssues()
  }, [])

  const fetchIssues = async () => {
    try {
      const response = await fetch("/api/magazines")
      if (response.ok) {
        const data = await response.json()
        setIssues(data)
      }
    } catch (error) {
      console.error("Error fetching magazine issues:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!isSupabaseConfigured) {
      showSupabaseToast()
      return
    }

    if (!confirm("Are you sure you want to delete this magazine issue?")) return

    try {
      const response = await fetch(`/api/magazines/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Magazine issue deleted successfully",
        })
        fetchIssues()
      } else {
        throw new Error("Failed to delete magazine issue")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete magazine issue",
        variant: "destructive",
      })
    }
  }

  const toggleActive = async (id: string, isActive: boolean) => {
    if (!isSupabaseConfigured) {
      showSupabaseToast()
      return
    }

    try {
      const response = await fetch(`/api/magazines/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_active: !isActive }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Magazine issue ${!isActive ? "activated" : "deactivated"} successfully`,
        })
        fetchIssues()
      } else {
        throw new Error("Failed to update magazine issue")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update magazine issue",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/40 to-background">
        <AdminNavigation />
        <main className="flex min-h-[60vh] items-center justify-center pt-24">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-accent/40 border-t-accent"></div>
            <p className="mt-4 text-sm text-muted-foreground">Loading magazine issues...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/40 to-background">
      <AdminNavigation />
      <main className="pt-24 pb-12">
        <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <div>
                <h1 className="text-3xl font-semibold text-foreground">Magazine Management</h1>
                <p className="text-muted-foreground">Manage magazine issues and publications</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="w-full justify-start rounded-full text-muted-foreground transition hover:text-foreground md:w-auto"
              >
                <Link href="/admin">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to dashboard
                </Link>
              </Button>
            </div>
            {isSupabaseConfigured ? (
              <Button asChild className="rounded-full px-5">
                <Link href="/admin/magazine/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Issue
                </Link>
              </Button>
            ) : (
              <Button onClick={showSupabaseToast} variant="outline" className="rounded-full px-5">
                <Plus className="mr-2 h-4 w-4" />
                Add New Issue
              </Button>
            )}
          </div>

          {!isSupabaseConfigured && (
            <Alert variant="destructive" className="border border-border/60 bg-destructive/10 text-destructive">
              <AlertTitle>Magazine management is read-only</AlertTitle>
              <AlertDescription>
                Supabase credentials are not configured. The issues listed below are static fallback data and cannot be changed
                until Supabase is connected.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            {issues.length === 0 ? (
              <Card className="border-border/60 bg-card/80 shadow-sm">
                <CardContent className="p-10 text-center">
                  <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-medium">No magazine issues found</h3>
                  <p className="mb-4 text-muted-foreground">Get started by creating your first magazine issue.</p>
                  {isSupabaseConfigured ? (
                    <Button asChild className="rounded-full px-5">
                      <Link href="/admin/magazine/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Create First Issue
                      </Link>
                    </Button>
                  ) : (
                    <Button onClick={showSupabaseToast} variant="outline" className="rounded-full px-5">
                      <Plus className="mr-2 h-4 w-4" />
                      Create First Issue
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              issues.map((issue) => (
                <Card
                  key={issue.id}
                  className="border-border/60 bg-card/80 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  <CardContent className="space-y-6 p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                      <div className="sm:w-28">
                        <div className="relative h-40 overflow-hidden rounded-2xl border border-border/50 bg-muted/30 shadow-inner sm:h-36">
                          {issue.cover_image_url ? (
                            <img
                              src={issue.cover_image_url}
                              alt={`${issue.title} cover`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
                              No Cover
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-foreground">{issue.title}</h3>
                          <Badge variant={issue.is_active ? "default" : "secondary"} className="rounded-full">
                            {issue.is_active ? "Active" : "Inactive"}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {issue.publication_type}
                          </Badge>
                          {issue.is_featured && <Badge variant="outline">Featured</Badge>}
                        </div>
                        <div className="grid gap-1 text-sm text-muted-foreground">
                          {issue.description && <p className="leading-relaxed">{issue.description}</p>}
                          <p className="font-medium text-foreground">
                            Issue No. {issue.issue_number || "Not set"}
                          </p>
                          <p>
                            Published: {issue.publication_date ? new Date(issue.publication_date).toLocaleDateString() : "TBA"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                      {issue.pdf_url && (
                        <Button variant="outline" size="sm" className="rounded-full" asChild>
                          <Link href={issue.pdf_url} target="_blank" rel="noopener noreferrer">
                            <Eye className="mr-2 h-4 w-4" />
                            View PDF
                          </Link>
                        </Button>
                      )}
                      {isSupabaseConfigured ? (
                        <Button variant="outline" size="sm" className="rounded-full" asChild>
                          <Link href={`/admin/magazine/${issue.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" className="rounded-full" onClick={showSupabaseToast}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        onClick={() => toggleActive(issue.id, issue.is_active)}
                      >
                        {issue.is_active ? "Deactivate" : "Activate"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full text-destructive"
                        onClick={() => handleDelete(issue.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

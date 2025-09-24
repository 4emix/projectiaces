"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Eye, FileText } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface MagazineIssue {
  id: string
  title: string
  volume: number
  issue: number
  description: string
  cover_image_url: string
  pdf_url: string
  published_date: string
  is_active: boolean
  created_at: string
}

export default function AdminMagazinePage() {
  const { toast } = useToast()
  const [issues, setIssues] = useState<MagazineIssue[]>([])
  const [loading, setLoading] = useState(true)

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
      <div className="p-8">
        <div className="text-center">Loading magazine issues...</div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Magazine Management</h1>
          <p className="text-muted-foreground">Manage magazine issues and publications</p>
        </div>
        <Button asChild>
          <Link href="/admin/magazine/new">
            <Plus className="w-4 h-4 mr-2" />
            Add New Issue
          </Link>
        </Button>
      </div>

      <div className="grid gap-6">
        {issues.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No magazine issues found</h3>
              <p className="text-muted-foreground mb-4">Get started by creating your first magazine issue.</p>
              <Button asChild>
                <Link href="/admin/magazine/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Issue
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          issues.map((issue) => (
            <Card key={issue.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex space-x-4">
                    {issue.cover_image_url && (
                      <img
                        src={issue.cover_image_url || "/placeholder.svg"}
                        alt={`${issue.title} cover`}
                        className="w-16 h-20 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{issue.title}</h3>
                        <Badge variant={issue.is_active ? "default" : "secondary"}>
                          {issue.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Volume {issue.volume}, Issue {issue.issue}
                      </p>
                      <p className="text-sm text-muted-foreground mb-2">{issue.description}</p>
                      <p className="text-xs text-muted-foreground">
                        Published: {new Date(issue.published_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {issue.pdf_url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={issue.pdf_url} target="_blank" rel="noopener noreferrer">
                          <Eye className="w-4 h-4 mr-2" />
                          View PDF
                        </a>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/magazine/${issue.id}/edit`}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => toggleActive(issue.id, issue.is_active)}>
                      {issue.is_active ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(issue.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

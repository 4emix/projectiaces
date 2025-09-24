"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import type { LocalCommittee } from "@/lib/types"
import Image from "next/image"

export default function CommitteesAdminPage() {
  const [committees, setCommittees] = useState<LocalCommittee[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchCommittees()
  }, [])

  const fetchCommittees = async () => {
    try {
      const response = await fetch("/api/committees")
      if (response.ok) {
        const data = await response.json()
        setCommittees(data)
      }
    } catch (error) {
      console.error("Error fetching committees:", error)
      toast({
        title: "Error",
        description: "Failed to load committees",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return

    try {
      const response = await fetch(`/api/committees/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setCommittees(committees.filter((c) => c.id !== id))
        toast({
          title: "Success",
          description: "Committee deleted successfully",
        })
      } else {
        throw new Error("Failed to delete committee")
      }
    } catch (error) {
      console.error("Error deleting committee:", error)
      toast({
        title: "Error",
        description: "Failed to delete committee",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading committees...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Local Committees</h1>
          <p className="text-muted-foreground">Manage local committees and their information</p>
        </div>
        <Button asChild>
          <Link href="/admin/committees/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Committee
          </Link>
        </Button>
      </div>

      {committees.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">No committees found</p>
            <Button asChild>
              <Link href="/admin/committees/new">
                <Plus className="w-4 h-4 mr-2" />
                Add First Committee
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {committees.map((committee) => (
            <Card key={committee.id} className="group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={committee.logo_url || "/placeholder.svg?height=48&width=48"}
                        alt={`${committee.name} logo`}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{committee.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{committee.country}</p>
                    </div>
                  </div>
                  <Badge variant={committee.is_active ? "default" : "secondary"}>
                    {committee.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {committee.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{committee.description}</p>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/committees/${committee.id}/edit`}>
                        <Edit className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(committee.id, committee.name)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {committee.website_url && (
                    <Button variant="ghost" size="sm" onClick={() => window.open(committee.website_url!, "_blank")}>
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

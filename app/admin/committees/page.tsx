"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, ExternalLink, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import type { LocalCommittee } from "@/lib/types"
import Image from "next/image"
import { AdminNavigation } from "@/components/admin/admin-navigation"

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

  const pageContent = (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Local Committees</h1>
            <p className="text-muted-foreground">Manage local committees and their information</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="w-full justify-start rounded-full text-muted-foreground transition hover:text-foreground sm:w-auto"
          >
            <Link href="/admin">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to dashboard
            </Link>
          </Button>
        </div>
        <Button asChild className="rounded-full px-5">
          <Link href="/admin/committees/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Committee
          </Link>
        </Button>
      </div>

      {committees.length === 0 ? (
        <Card className="border-border/60 bg-card/80 shadow-sm">
          <CardContent className="p-10 text-center">
            <p className="mb-4 text-muted-foreground">No committees found</p>
            <Button asChild className="rounded-full px-5">
              <Link href="/admin/committees/new">
                <Plus className="mr-2 h-4 w-4" />
                Add First Committee
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {committees.map((committee) => (
            <Card
              key={committee.id}
              className="group border-border/60 bg-card/80 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-border/40 bg-background/70">
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
                    <Button variant="outline" size="sm" className="rounded-full" asChild>
                      <Link href={`/admin/committees/${committee.id}/edit`}>
                        <Edit className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      onClick={() => handleDelete(committee.id, committee.name)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {committee.website_url && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full"
                      onClick={() => window.open(committee.website_url!, "_blank")}
                    >
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/40 to-background">
        <AdminNavigation />
        <main className="flex min-h-[60vh] items-center justify-center pt-24">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-accent/40 border-t-accent"></div>
            <p className="mt-4 text-sm text-muted-foreground">Loading committees...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/40 to-background">
      <AdminNavigation />
      <main className="pt-24 pb-12">
        <div className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6 lg:px-8">{pageContent}</div>
      </main>
    </div>
  )
}

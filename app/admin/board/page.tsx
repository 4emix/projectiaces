"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Edit, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { BoardMember } from "@/lib/types"

export default function BoardAdminPage() {
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBoardMembers = async () => {
      try {
        console.log("[v0] Fetching board members from API...")
        const response = await fetch("/api/board")
        if (response.ok) {
          const data = await response.json()
          console.log("[v0] Board members data received:", data)
          setBoardMembers(data)
        } else {
          console.error("[v0] Failed to fetch board members:", response.status)
        }
      } catch (error) {
        console.error("[v0] Error fetching board members:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBoardMembers()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/board/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        setBoardMembers((prev) => prev.filter((member) => member.id !== id))
      }
    } catch (error) {
      console.error("Error deleting board member:", error)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Board Members</h1>
              <p className="text-muted-foreground">Manage board member profiles and information</p>
            </div>
          </div>
          <Button asChild>
            <Link href="/admin/board/new">
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Link>
          </Button>
        </div>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Board Members</h1>
            <p className="text-muted-foreground">Manage board member profiles and information</p>
          </div>
        </div>
        <Button asChild>
          <Link href="/admin/board/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Member
          </Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {boardMembers.map((member) => (
          <Card key={member.id}>
            <CardHeader className="text-center">
              <Avatar className="w-20 h-20 mx-auto mb-4">
                <AvatarImage src={member.image_url || `/placeholder.svg?height=80&width=80&query=${member.name}`} />
                <AvatarFallback className="text-lg bg-accent text-accent-foreground">
                  {getInitials(member.name)}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-lg">{member.name}</CardTitle>
              <div className="flex items-center justify-center space-x-2">
                <Badge variant="outline">{member.position}</Badge>
                {member.is_active && (
                  <Badge variant="default" className="text-xs">
                    Active
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{member.bio}</p>

              <div className="text-xs text-muted-foreground space-y-1">
                {member.email && <p>Email: {member.email}</p>}
                <p>Order: {member.display_order}</p>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
                  <Link href={`/admin/board/${member.id}/edit`}>
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(member.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {boardMembers.length === 0 && !loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Plus className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">No board members yet</h3>
                <p className="text-muted-foreground">Get started by adding your first board member.</p>
              </div>
              <Button asChild>
                <Link href="/admin/board/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Member
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

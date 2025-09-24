"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { BoardMember } from "@/lib/types"

export function BoardSection() {
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
          // Filter only active members for public display
          setBoardMembers(data.filter((member: BoardMember) => member.is_active))
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  if (loading) {
    return (
      <section id="board" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Board of Directors</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Meet the distinguished leaders guiding IACES towards excellence in civil engineering education and global
              collaboration.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
          </div>
        </div>
      </section>
    )
  }

  if (boardMembers.length === 0) {
    return (
      <section id="board" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Board of Directors</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Meet the distinguished leaders guiding IACES towards excellence in civil engineering education and global
              collaboration.
            </p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">Board member information will be available soon.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="board" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Board of Directors</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Meet the distinguished leaders guiding IACES towards excellence in civil engineering education and global
            collaboration.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {boardMembers.map((member) => (
            <Card key={member.id} className="text-center">
              <CardContent className="p-6">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src={member.image_url || `/placeholder.svg?height=80&width=80&query=${member.name}`} />
                  <AvatarFallback className="text-lg bg-accent text-accent-foreground">
                    {getInitials(member.name)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-semibold text-foreground mb-1">{member.name}</h3>
                <p className="text-accent font-medium mb-3">{member.position}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

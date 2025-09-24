"use client"

import { useState, useEffect } from "react"
import { ContentEditor, TextField, TextAreaField, SwitchField } from "@/components/admin/content-editor"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import type { BoardMember } from "@/lib/types"

export default function EditBoardMemberPage({ params }: { params: { id: string } }) {
  const [boardMemberData, setBoardMemberData] = useState<Partial<BoardMember>>({
    name: "",
    position: "",
    bio: "",
    image_url: "",
    email: "",
    linkedin_url: "",
    display_order: 0,
    is_active: true,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchBoardMember = async () => {
      try {
        console.log("[v0] Board Edit: Fetching board member with ID:", params.id)
        const response = await fetch("/api/board")
        if (response.ok) {
          const boardMembers = await response.json()
          console.log("[v0] Board Edit: All board members received:", boardMembers)
          const member = boardMembers.find((m: BoardMember) => m.id === params.id)
          console.log("[v0] Board Edit: Looking for member with ID:", params.id)
          console.log("[v0] Board Edit: Found member:", member)
          if (member) {
            console.log("[v0] Board Edit: Setting board member data:", member)
            setBoardMemberData(member)
          } else {
            console.log("[v0] Board Edit: No member found with ID:", params.id)
            console.log(
              "[v0] Board Edit: Available IDs:",
              boardMembers.map((m: BoardMember) => m.id),
            )
            setLoading(false)
            toast({
              title: "Error",
              description: "Board member not found",
              variant: "destructive",
            })
            router.push("/admin/board")
            return
          }
        }
      } catch (error) {
        console.error("Error fetching board member:", error)
        toast({
          title: "Error",
          description: "Failed to load board member",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchBoardMember()
  }, [params.id, toast, router])

  const handleSave = async () => {
    console.log("[v0] Board Edit: handleSave function called")

    if (!boardMemberData.id) {
      console.log("[v0] Board Edit: No valid board member ID found")
      toast({
        title: "Error",
        description: "Invalid board member - please return to the board list and try again",
        variant: "destructive",
      })
      router.push("/admin/board")
      return
    }

    if (!boardMemberData.name || !boardMemberData.position) {
      console.log("[v0] Board Edit: Validation failed - missing name or position")
      toast({
        title: "Error",
        description: "Name and position are required",
        variant: "destructive",
      })
      return
    }

    console.log("[v0] Board Edit: Starting save process with data:", boardMemberData)
    setSaving(true)
    try {
      const memberId = boardMemberData.id || params.id
      console.log("[v0] Board Edit: Making PUT request to /api/board/" + memberId)
      const response = await fetch(`/api/board/${memberId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(boardMemberData),
      })

      console.log("[v0] Board Edit: Response status:", response.status)
      if (response.ok) {
        const updatedMember = await response.json()
        console.log("[v0] Board Edit: Successfully updated member:", updatedMember)
        setBoardMemberData(updatedMember)
        toast({
          title: "Success",
          description: "Your changes have been saved successfully!",
        })
      } else {
        const errorText = await response.text()
        console.log("[v0] Board Edit: Error response:", errorText)
        throw new Error("Failed to update board member")
      }
    } catch (error) {
      console.error("[v0] Board Edit: Error updating board member:", error)
      toast({
        title: "Error",
        description: "Failed to update board member",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handlePreview = () => {
    window.open("/#board", "_blank")
  }

  console.log("[v0] Board Edit: Component rendering with boardMemberData:", boardMemberData)
  console.log("[v0] Board Edit: handleSave function created:", !!handleSave)

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading board member...</p>
        </div>
      </div>
    )
  }

  return (
    <ContentEditor
      title="Edit Board Member"
      backUrl="/admin/board"
      onPreview={handlePreview}
      onSave={handleSave}
      isSaving={saving}
      saveLabel="Save Board Member"
      description="Update leadership information and manage public visibility."
    >
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <TextField
              label="Full Name"
              value={boardMemberData.name || ""}
              onChange={(value) => setBoardMemberData((prev) => ({ ...prev, name: value }))}
              placeholder="e.g., Dr. Sarah Johnson"
              description="The full name of the board member"
              required
            />

            <TextField
              label="Position"
              value={boardMemberData.position || ""}
              onChange={(value) => setBoardMemberData((prev) => ({ ...prev, position: value }))}
              placeholder="e.g., President"
              description="The board position or title"
              required
            />
          </div>

          <TextAreaField
            label="Biography"
            value={boardMemberData.bio || ""}
            onChange={(value) => setBoardMemberData((prev) => ({ ...prev, bio: value }))}
            placeholder="Brief biography and background..."
            description="A detailed biography of the board member"
            rows={4}
          />

          <div className="grid md:grid-cols-2 gap-6">
            <TextField
              label="Profile Image URL"
              value={boardMemberData.image_url || ""}
              onChange={(value) => setBoardMemberData((prev) => ({ ...prev, image_url: value }))}
              placeholder="https://example.com/image.jpg"
              description="URL to the board member's profile photo"
            />

            <TextField
              label="Email"
              value={boardMemberData.email || ""}
              onChange={(value) => setBoardMemberData((prev) => ({ ...prev, email: value }))}
              placeholder="sarah.johnson@iaces.org"
              description="Contact email address"
            />
          </div>

          <TextField
            label="LinkedIn URL"
            value={boardMemberData.linkedin_url || ""}
            onChange={(value) => setBoardMemberData((prev) => ({ ...prev, linkedin_url: value }))}
            placeholder="https://linkedin.com/in/sarahjohnson"
            description="LinkedIn profile URL"
          />

          <div className="grid md:grid-cols-2 gap-6">
            <TextField
              label="Display Order"
              value={boardMemberData.display_order?.toString() || "0"}
              onChange={(value) =>
                setBoardMemberData((prev) => ({ ...prev, display_order: Number.parseInt(value) || 0 }))
              }
              placeholder="0"
              description="Order in which this member appears (lower numbers first)"
            />

            <SwitchField
              label="Active"
              checked={boardMemberData.is_active || false}
              onChange={(checked) => setBoardMemberData((prev) => ({ ...prev, is_active: checked }))}
              description="Whether this board member is currently displayed"
            />
          </div>

          {saving && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent mx-auto"></div>
              <p className="text-muted-foreground mt-2">Saving changes...</p>
            </div>
          )}
        </div>
      </ContentEditor>
  )
}

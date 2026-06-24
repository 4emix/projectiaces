import { type NextRequest, NextResponse } from "next/server"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { ContentService } from "@/lib/content-service"

export const dynamic = "force-dynamic"

async function requireUser() {
  if (!isSupabaseConfigured()) {
    return { error: NextResponse.json({ error: "Supabase is not configured" }, { status: 503 }) }
  }
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }
  }
  return { ok: true as const }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requireUser()
    if ("error" in auth) return auth.error

    const body = await request.json()
    const updated = await ContentService.updateAnnouncement(params.id, body)

    if (!updated) {
      return NextResponse.json({ error: "Failed to update announcement" }, { status: 500 })
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error in PUT /api/announcements/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requireUser()
    if ("error" in auth) return auth.error

    const success = await ContentService.deleteAnnouncement(params.id)

    if (!success) {
      return NextResponse.json({ error: "Failed to delete announcement" }, { status: 500 })
    }

    return NextResponse.json({ message: "Announcement deleted successfully" })
  } catch (error) {
    console.error("Error in DELETE /api/announcements/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

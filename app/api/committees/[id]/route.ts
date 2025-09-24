import { type NextRequest, NextResponse } from "next/server"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { ContentService } from "@/lib/content-service"

export const dynamic = "force-dynamic"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 })
    }

    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const updatedCommittee = await ContentService.updateLocalCommittee(params.id, body)

    if (!updatedCommittee) {
      return NextResponse.json({ error: "Failed to update committee" }, { status: 500 })
    }

    return NextResponse.json(updatedCommittee)
  } catch (error) {
    console.error("Error in PUT /api/committees:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 })
    }

    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const success = await ContentService.deleteLocalCommittee(params.id)

    if (!success) {
      return NextResponse.json({ error: "Failed to delete committee" }, { status: 500 })
    }

    return NextResponse.json({ message: "Committee deleted successfully" })
  } catch (error) {
    console.error("Error in DELETE /api/committees:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

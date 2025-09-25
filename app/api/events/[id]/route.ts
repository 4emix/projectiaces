import { type NextRequest, NextResponse } from "next/server"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { buildEventMutationPayload, executeEventMutation } from "../utils"

export const dynamic = "force-dynamic"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 })
    }

    const { id } = params
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    console.log("[v0] Events API - updating event:", { id, body })

    const payload = {
      ...buildEventMutationPayload(body),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await executeEventMutation(payload, (eventPayload) =>
      supabase.from("events").update(eventPayload).eq("id", id).select().single(),
    )

    if (error) {
      console.error("Error updating event:", error)
      return NextResponse.json({ error: "Failed to update event" }, { status: 500 })
    }

    console.log("[v0] Events API - updated successfully:", data)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in PUT /api/events/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 })
    }

    const { id } = params
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    console.log("[v0] Events API - patching event:", { id, body })

    const payload = {
      ...buildEventMutationPayload(body),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await executeEventMutation(payload, (eventPayload) =>
      supabase.from("events").update(eventPayload).eq("id", id).select().single(),
    )

    if (error) {
      console.error("Error patching event:", error)
      return NextResponse.json({ error: "Failed to update event" }, { status: 500 })
    }

    console.log("[v0] Events API - patched successfully:", data)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in PATCH /api/events/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 })
    }

    const { id } = params
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] Events API - deleting event:", id)

    const { error } = await supabase.from("events").delete().eq("id", id)

    if (error) {
      console.error("Error deleting event:", error)
      return NextResponse.json({ error: "Failed to delete event" }, { status: 500 })
    }

    console.log("[v0] Events API - deleted successfully")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in DELETE /api/events/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

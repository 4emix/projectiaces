import { NextResponse, type NextRequest } from "next/server"

import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"

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
  return { supabase }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requireUser()
    if (auth.error) return auth.error

    const body = await request.json().catch(() => ({}))
    const isRead = Boolean(body?.is_read)

    const { data, error } = await auth.supabase
      .from("contact_messages")
      .update({ is_read: isRead })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating contact message:", error)
      return NextResponse.json({ error: "Failed to update message" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in PATCH /api/contact/messages/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requireUser()
    if (auth.error) return auth.error

    const { error } = await auth.supabase.from("contact_messages").delete().eq("id", params.id)

    if (error) {
      console.error("Error deleting contact message:", error)
      return NextResponse.json({ error: "Failed to delete message" }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Error in DELETE /api/contact/messages/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

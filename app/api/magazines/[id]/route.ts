import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("magazine_articles")
      .select("*")
      .eq("id", params.id)
      .maybeSingle()

    if (error) {
      console.error("Error fetching magazine article:", error)
      return NextResponse.json({ error: "Failed to fetch magazine article" }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: "Magazine article not found" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in GET /api/magazines/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const updates = await request.json()

    const { data, error } = await supabase
      .from("magazine_articles")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating magazine article:", error)
      return NextResponse.json({ error: "Failed to update magazine article" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in PATCH /api/magazines/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { error } = await supabase.from("magazine_articles").delete().eq("id", params.id)

    if (error) {
      console.error("Error deleting magazine article:", error)
      return NextResponse.json({ error: "Failed to delete magazine article" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in DELETE /api/magazines/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
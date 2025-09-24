import { type NextRequest, NextResponse } from "next/server"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { fallbackMagazineIssuesForAdmin } from "@/lib/fallback-data"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(fallbackMagazineIssuesForAdmin)
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    let query = supabase.from("magazine_articles").select("*").order("publication_date", { ascending: false })

    if (!user) {
      query = query.eq("is_active", true)
    }

    const { data, error } = await query
    if (error) {
      console.error("Error fetching magazine articles:", error)
      return NextResponse.json(fallbackMagazineIssuesForAdmin)
    }

    return NextResponse.json(data && data.length > 0 ? data : fallbackMagazineIssuesForAdmin)
  } catch (error) {
    console.error("Error in GET /api/magazines:", error)
    return NextResponse.json(fallbackMagazineIssuesForAdmin)
  }
}

export async function POST(request: NextRequest) {
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
    console.log("[v0] Magazines API - creating article:", body)

    const { data, error } = await supabase
      .from("magazine_articles")
      .insert({
        ...body,
        user_id: user.id,
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating magazine article:", error)
      return NextResponse.json({ error: "Failed to create magazine article" }, { status: 500 })
    }

    console.log("[v0] Magazines API - created successfully:", data)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in POST /api/magazines:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

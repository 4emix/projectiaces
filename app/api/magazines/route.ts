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

    const normalized =
      data?.map((article) => ({
        ...article,
        publication_type: article.publication_type === "newsletter" ? "newsletter" : "magazine",
      })) ?? []

    return NextResponse.json(
      normalized.length > 0 ? normalized : fallbackMagazineIssuesForAdmin.map((article) => ({ ...article }))
    )
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

    const sanitizeOptionalString = (value: unknown) => {
      if (typeof value !== "string") {
        return null
      }
      const trimmed = value.trim()
      return trimmed.length > 0 ? trimmed : null
    }

    if (
      typeof body.title !== "string" ||
      typeof body.issue_number !== "string" ||
      typeof body.publication_date !== "string" ||
      typeof body.publication_type !== "string"
    ) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    const publicationType = body.publication_type.trim().toLowerCase()
    if (publicationType !== "magazine" && publicationType !== "newsletter") {
      return NextResponse.json({ error: "Invalid publication type" }, { status: 400 })
    }

    const newArticle = {
      title: body.title.trim(),
      description: sanitizeOptionalString(body.description),
      cover_image_url: sanitizeOptionalString(body.cover_image_url),
      pdf_url: sanitizeOptionalString(body.pdf_url),
      issue_number: body.issue_number.trim(),
      publication_date: body.publication_date.trim(),
      publication_type: publicationType,

      is_featured: typeof body.is_featured === "boolean" ? body.is_featured : false,
      is_active: typeof body.is_active === "boolean" ? body.is_active : true,
    }

    if (!newArticle.title || !newArticle.issue_number || !newArticle.publication_date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("magazine_articles")
      .insert({
        ...newArticle,
        user_id: user.id,
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

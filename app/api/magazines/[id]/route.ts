import { type NextRequest, NextResponse } from "next/server"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { toGoogleDriveImageUrl } from "@/lib/utils"

export const dynamic = "force-dynamic"

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 })
    }

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

    return NextResponse.json({
      ...data,
      cover_image_url: toGoogleDriveImageUrl(data.cover_image_url),
      publication_type: data.publication_type === "newsletter" ? "newsletter" : "magazine",
    })
  } catch (error) {
    console.error("Error in GET /api/magazines/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
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

    const sanitizeOptionalString = (value: unknown) => {
      if (typeof value !== "string") {
        return null
      }
      const trimmed = value.trim()
      return trimmed.length > 0 ? trimmed : null
    }

    const sanitizeOptionalUrl = (value: unknown) => {
      const sanitized = sanitizeOptionalString(value)
      return sanitized ? toGoogleDriveImageUrl(sanitized) : null
    }

    const updates: Record<string, unknown> = {}

    if (Object.prototype.hasOwnProperty.call(body, "title")) {
      if (typeof body.title !== "string") {
        return NextResponse.json({ error: "Invalid title" }, { status: 400 })
      }
      updates.title = body.title.trim()
    }

    if (Object.prototype.hasOwnProperty.call(body, "description")) {
      updates.description = sanitizeOptionalString(body.description)
    }

    if (Object.prototype.hasOwnProperty.call(body, "cover_image_url")) {
      updates.cover_image_url = sanitizeOptionalUrl(body.cover_image_url)
    }

    if (Object.prototype.hasOwnProperty.call(body, "pdf_url")) {
      updates.pdf_url = sanitizeOptionalString(body.pdf_url)
    }

    if (Object.prototype.hasOwnProperty.call(body, "issue_number")) {
      if (typeof body.issue_number !== "string") {
        return NextResponse.json({ error: "Invalid issue number" }, { status: 400 })
      }
      updates.issue_number = body.issue_number.trim()
    }

    if (Object.prototype.hasOwnProperty.call(body, "publication_date")) {
      if (typeof body.publication_date !== "string") {
        return NextResponse.json({ error: "Invalid publication date" }, { status: 400 })
      }
      updates.publication_date = body.publication_date.trim()
    }

    if (Object.prototype.hasOwnProperty.call(body, "publication_type")) {
      if (typeof body.publication_type !== "string") {
        return NextResponse.json({ error: "Invalid publication type" }, { status: 400 })
      }
      const publicationType = body.publication_type.trim().toLowerCase()
      if (publicationType !== "magazine" && publicationType !== "newsletter") {
        return NextResponse.json({ error: "Invalid publication type" }, { status: 400 })
      }
      updates.publication_type = publicationType
    }

    if (Object.prototype.hasOwnProperty.call(body, "is_featured")) {
      if (typeof body.is_featured !== "boolean") {
        return NextResponse.json({ error: "Invalid featured flag" }, { status: 400 })
      }
      updates.is_featured = body.is_featured
    }

    if (Object.prototype.hasOwnProperty.call(body, "is_active")) {
      if (typeof body.is_active !== "boolean") {
        return NextResponse.json({ error: "Invalid active flag" }, { status: 400 })
      }
      updates.is_active = body.is_active
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No valid fields provided" }, { status: 400 })
    }

    updates.updated_at = new Date().toISOString()

    const { data, error } = await supabase
      .from("magazine_articles")
      .update(updates)
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating magazine article:", error)
      return NextResponse.json({ error: "Failed to update magazine article" }, { status: 500 })
    }

    return NextResponse.json({
      ...data,
      cover_image_url: toGoogleDriveImageUrl(data.cover_image_url),
      publication_type: data.publication_type === "newsletter" ? "newsletter" : "magazine",
    })
  } catch (error) {
    console.error("Error in PATCH /api/magazines/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
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
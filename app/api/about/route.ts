import { type NextRequest, NextResponse } from "next/server"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { ContentService } from "@/lib/content-service"
import { isFallbackId } from "@/lib/fallback-data"
import type { AboutContent } from "@/lib/types"

export const dynamic = "force-dynamic"

function toNullableString(value: unknown) {
  if (typeof value === "string") {
    const trimmed = value.trim()
    return trimmed.length === 0 ? null : trimmed
  }

  if (value === null) {
    return null
  }

  return undefined
}


export async function GET() {
  try {
    const aboutContent = await ContentService.getActiveAboutContent()
    return NextResponse.json(aboutContent)
  } catch (error) {
    console.error("Error in GET /api/about:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
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

    const body = (await request.json()) as Partial<AboutContent> & { id?: string }
    const { id, title, content, image_url, mission_statement, vision_statement, is_active } = body

    if (typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    if (typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    const updates: Partial<AboutContent> = {
      title: title.trim(),
      content: content.trim(),
    }

    const nullableImage = toNullableString(image_url)
    if (nullableImage !== undefined) {
      updates.image_url = nullableImage
    }

    const nullableMission = toNullableString(mission_statement)
    if (nullableMission !== undefined) {
      updates.mission_statement = nullableMission
    }

    const nullableVision = toNullableString(vision_statement)
    if (nullableVision !== undefined) {
      updates.vision_statement = nullableVision
    }

    if (typeof is_active === "boolean") {
      updates.is_active = is_active
    }

    console.log("[v0] About API - received data:", { id, updates })

    const timestamp = new Date().toISOString()
    let result: AboutContent | null = null

    if (id && !isFallbackId(id)) {
      const { data: existingRecord, error: existingError } = await supabase
        .from("about_content")
        .select("id, user_id")
        .eq("id", id)
        .maybeSingle()

      if (existingError) {
        console.error("Error checking existing about content:", existingError)
      }

      if (existingRecord && existingRecord.user_id === user.id) {
        const { data, error } = await supabase
          .from("about_content")
          .update({ ...updates, updated_at: timestamp })
          .eq("id", id)
          .select()
          .single()

        if (error) {
          console.error("Error updating about content:", error)
        } else {
          result = data
        }
      }
    }

    if (!result) {
      const insertData = {
        ...updates,
        user_id: user.id,
        is_active: updates.is_active ?? true,
        updated_at: timestamp,
      }

      const { data, error } = await supabase
        .from("about_content")
        .insert(insertData)
        .select()
        .single()

      if (error) {
        console.error("Error creating about content:", error)
        return NextResponse.json({ error: "Failed to save about content" }, { status: 500 })
      }

      result = data
    }

    console.log("[v0] About API - saved successfully:", result)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in PUT /api/about:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

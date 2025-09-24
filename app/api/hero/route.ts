import { type NextRequest, NextResponse } from "next/server"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { ContentService } from "@/lib/content-service"
import type { HeroContent } from "@/lib/types"

export const dynamic = "force-dynamic"

function isFallbackId(value: unknown) {
  return typeof value === "string" && value.startsWith("fallback-")
}

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

export const dynamic = "force-dynamic"

function isFallbackId(value: unknown) {
  return typeof value === "string" && value.startsWith("fallback-")
}
export async function GET() {
  try {
    const heroContent = await ContentService.getActiveHeroContent()
    return NextResponse.json(heroContent)
  } catch (error) {
    console.error("Error in GET /api/hero:", error)
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

    const body = (await request.json()) as Partial<HeroContent> & { id?: string }
    const { id, title, subtitle, description, cta_text, cta_link, background_image_url, is_active } = body

    if (typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const updates: Partial<HeroContent> = {
      title: title.trim(),
    }

    const nullableSubtitle = toNullableString(subtitle)
    if (nullableSubtitle !== undefined) {
      updates.subtitle = nullableSubtitle
    }

    const nullableDescription = toNullableString(description)
    if (nullableDescription !== undefined) {
      updates.description = nullableDescription
    }

    const nullableCtaText = toNullableString(cta_text)
    if (nullableCtaText !== undefined) {
      updates.cta_text = nullableCtaText
    }

    const nullableCtaLink = toNullableString(cta_link)
    if (nullableCtaLink !== undefined) {
      updates.cta_link = nullableCtaLink
    }

    const nullableBackgroundImage = toNullableString(background_image_url)
    if (nullableBackgroundImage !== undefined) {
      updates.background_image_url = nullableBackgroundImage
    }

    if (typeof is_active === "boolean") {
      updates.is_active = is_active
    }

    console.log("[v0] Hero API - received data:", { id, updates })

    let result
    if (id && !isFallbackId(id)) {
      // Update existing record
      result = await ContentService.updateHeroContent(id, updates)
    } else {
      // Create new record or update existing active one
      const existingHero = await ContentService.getActiveHeroContent()
      if (existingHero && !isFallbackId(existingHero.id)) {
        result = await ContentService.updateHeroContent(existingHero.id, updates)
      } else {
        // Create new hero content
        const insertData = {
          ...updates,
          user_id: user.id,
          is_active: updates.is_active ?? true,
        }

        const { data, error } = await supabase
          .from("hero_content")
          .insert(insertData)
          .select()
          .single()

        if (error) {
          console.error("Error creating hero content:", error)
          return NextResponse.json({ error: "Failed to create hero content" }, { status: 500 })
        }
        result = data
      }
    }

    if (!result) {
      return NextResponse.json({ error: "Failed to save hero content" }, { status: 500 })
    }

    console.log("[v0] Hero API - saved successfully:", result)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in PUT /api/hero:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

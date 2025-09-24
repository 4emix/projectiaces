import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { ContentService } from "@/lib/content-service"

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
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updates } = body

    console.log("[v0] Hero API - received data:", { id, updates })

    let result
    if (id) {
      // Update existing record
      result = await ContentService.updateHeroContent(id, updates)
    } else {
      // Create new record or update existing active one
      const existingHero = await ContentService.getActiveHeroContent()
      if (existingHero) {
        result = await ContentService.updateHeroContent(existingHero.id, updates)
      } else {
        // Create new hero content
        const { data, error } = await supabase
          .from("hero_content")
          .insert({
            ...updates,
            user_id: user.id,
            is_active: true,
          })
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

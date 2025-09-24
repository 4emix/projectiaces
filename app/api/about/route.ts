import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { ContentService } from "@/lib/content-service"

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
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updates } = body

    console.log("[v0] About API - received data:", { id, updates })

    let result
    if (id) {
      // Update existing record
      result = await ContentService.updateAboutContent(id, updates)
    } else {
      // Create new record or update existing active one
      const existingAbout = await ContentService.getActiveAboutContent()
      if (existingAbout) {
        result = await ContentService.updateAboutContent(existingAbout.id, updates)
      } else {
        // Create new about content
        const { data, error } = await supabase
          .from("about_content")
          .insert({
            ...updates,
            user_id: user.id,
            is_active: true,
          })
          .select()
          .single()

        if (error) {
          console.error("Error creating about content:", error)
          return NextResponse.json({ error: "Failed to create about content" }, { status: 500 })
        }
        result = data
      }
    }

    if (!result) {
      return NextResponse.json({ error: "Failed to save about content" }, { status: 500 })
    }

    console.log("[v0] About API - saved successfully:", result)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in PUT /api/about:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { ContentService } from "@/lib/content-service"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const boardMembers = await ContentService.getAllBoardMembers()
    return NextResponse.json(boardMembers)
  } catch (error) {
    console.error("Error in GET /api/board:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
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
    const memberData = {
      ...body,
      user_id: user.id,
    }

    const newMember = await ContentService.createBoardMember(memberData)

    if (!newMember) {
      return NextResponse.json({ error: "Failed to create board member" }, { status: 500 })
    }

    return NextResponse.json(newMember, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/board:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

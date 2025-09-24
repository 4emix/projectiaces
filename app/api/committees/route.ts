import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { ContentService } from "@/lib/content-service"

export async function GET() {
  try {
    const committees = await ContentService.getActiveLocalCommittees()
    return NextResponse.json(committees)
  } catch (error) {
    console.error("Error in GET /api/committees:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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
    const newCommittee = await ContentService.createLocalCommittee(body)

    if (!newCommittee) {
      return NextResponse.json({ error: "Failed to create committee" }, { status: 500 })
    }

    return NextResponse.json(newCommittee, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/committees:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

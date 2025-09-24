import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { ContentService } from "@/lib/content-service"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const debugInfo: string[] = []

  try {
    debugInfo.push(`Starting PUT request for ID: ${params.id}`)

    const supabase = await createClient()
    debugInfo.push("Supabase client created")

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    debugInfo.push(`Auth check - user: ${user?.id}, error: ${authError?.message || "none"}`)

    if (authError || !user) {
      debugInfo.push("Unauthorized access attempt")
      return NextResponse.json(
        {
          error: "Unauthorized",
          debug: debugInfo,
        },
        { status: 401 },
      )
    }

    const body = await request.json()
    debugInfo.push(`Request body received: ${JSON.stringify(body)}`)

    debugInfo.push("Calling ContentService.updateBoardMember")
    const updatedMember = await ContentService.updateBoardMember(params.id, body)
    debugInfo.push(`ContentService result: ${updatedMember ? "success" : "null"}`)

    if (!updatedMember) {
      debugInfo.push("Failed to update board member - ContentService returned null")
      return NextResponse.json(
        {
          error: "Failed to update board member",
          debug: debugInfo,
        },
        { status: 500 },
      )
    }

    debugInfo.push(`Successfully updated board member: ${updatedMember.id}`)
    return NextResponse.json({
      ...updatedMember,
      debug: debugInfo,
    })
  } catch (error) {
    debugInfo.push(`Error in PUT /api/board/[id]: ${error}`)
    console.error("Error in PUT /api/board/[id]:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        debug: debugInfo,
        errorDetails: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const debugInfo: string[] = []

  try {
    const supabase = await createClient()
    debugInfo.push("Supabase client created")

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    debugInfo.push(`Auth check - user: ${user?.id}, error: ${authError?.message || "none"}`)

    if (authError || !user) {
      debugInfo.push("Unauthorized access attempt")
      return NextResponse.json(
        {
          error: "Unauthorized",
          debug: debugInfo,
        },
        { status: 401 },
      )
    }

    const success = await ContentService.deleteBoardMember(params.id)

    debugInfo.push(`Delete operation result: ${success ? "success" : "failure"}`)

    if (!success) {
      return NextResponse.json(
        {
          error: "Failed to delete board member",
          debug: debugInfo,
        },
        { status: 500 },
      )
    }

    debugInfo.push("Successfully deleted board member")
    return NextResponse.json({
      success: true,
      debug: debugInfo,
    })
  } catch (error) {
    debugInfo.push(`Error in DELETE /api/board/[id]: ${error}`)
    console.error("Error in DELETE /api/board/[id]:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        debug: debugInfo,
        errorDetails: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

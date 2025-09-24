import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    console.log("[v0] Events API - fetching events...")
    const supabase = await createClient()

    const { data, error } = await supabase.from("events").select("*").order("date", { ascending: true })

    if (error) {
      console.error("[v0] Events API - Error fetching events:", error)
      return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
    }

    console.log("[v0] Events API - Raw data from database:", data)

    const transformedData =
      data?.map((event) => ({
        ...event,
        event_date: event.date, // Map date to event_date for admin page
        registration_url: event.contact_email ? `mailto:${event.contact_email}` : "", // Use contact email as registration
        is_active: true, // Default to active since field doesn't exist in DB
      })) || []

    console.log("[v0] Events API - Transformed data:", transformedData)
    return NextResponse.json(transformedData)
  } catch (error) {
    console.error("[v0] Events API - Error in GET /api/events:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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
    console.log("[v0] Events API - creating event:", body)

    const { data, error } = await supabase
      .from("events")
      .insert({
        ...body,
        user_id: user.id,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating event:", error)
      return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
    }

    console.log("[v0] Events API - created successfully:", data)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in POST /api/events:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

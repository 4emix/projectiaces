import { type NextRequest, NextResponse } from "next/server"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { fallbackEvents } from "@/lib/fallback-data"
import { buildEventMutationPayload, normalizeEventRecord } from "./utils"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    console.log("[v0] Events API - fetching events...")
    if (!isSupabaseConfigured()) {
      console.warn("Supabase not configured - returning fallback events data.")
      return NextResponse.json(fallbackEvents)
    }

    const supabase = await createClient()

    const { data, error } = await supabase.from("events").select("*").order("date", { ascending: true })

    if (error) {
      console.error("[v0] Events API - Error fetching events:", error)
      return NextResponse.json(fallbackEvents)
    }

    console.log("[v0] Events API - Raw data from database:", data)

    const transformedData = data?.map((event) => normalizeEventRecord(event)) || []

    console.log("[v0] Events API - Transformed data:", transformedData)
    return NextResponse.json(transformedData.length > 0 ? transformedData : fallbackEvents)
  } catch (error) {
    console.error("[v0] Events API - Error in GET /api/events:", error)
    return NextResponse.json(fallbackEvents)
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
    console.log("[v0] Events API - creating event:", body)

    const payloadWithUser = {
      ...buildEventMutationPayload(body),
      user_id: user.id,
    }

    let { data, error } = await supabase.from("events").insert(payloadWithUser).select().single()

    if (error?.message?.includes("registration_url")) {
      const { registration_url: _unused, ...fallbackPayload } = payloadWithUser
      ;({ data, error } = await supabase.from("events").insert(fallbackPayload).select().single())
    }

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

import { type NextRequest, NextResponse } from "next/server"
import { createClient, createServiceRoleClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { fallbackEvents } from "@/lib/fallback-data"
import {
  buildEventMutationPayload,
  executeEventMutation,
  normalizeEventRecord,
  resolveEventMutationContext,
} from "./utils"


export const dynamic = "force-dynamic"

export async function GET() {
  try {
    console.log("[v0] Events API - fetching events...")
    if (!isSupabaseConfigured()) {
      console.warn("Supabase not configured - returning fallback events data.")
      return NextResponse.json(fallbackEvents)
    }

    const supabase = await createClient()
    const queryClient = createServiceRoleClient() ?? supabase

    let { data, error } = await queryClient.from("events").select("*").order("event_date", { ascending: true })

    if (error?.message?.toLowerCase().includes("event_date")) {
      ;({ data, error } = await queryClient.from("events").select("*").order("date", { ascending: true }))
    }

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

    const body = await request.json()
    console.log("[v0] Events API - creating event:", body)

    const mutationContext = await resolveEventMutationContext()
    if (mutationContext.error) {
      return mutationContext.error
    }

    const { client: mutationClient, userId } = mutationContext

    const basePayload = buildEventMutationPayload(body)
    const payloadWithUser = userId ? { ...basePayload, user_id: userId } : basePayload

    const { data, error } = await executeEventMutation(payloadWithUser, (payload) =>
      mutationClient.from("events").insert(payload).select().single(),
    )

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

import { type NextRequest, NextResponse } from "next/server"

import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { isAdminEmail } from "@/lib/admin"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 })
    }

    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user || !isAdminEmail(user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const daysParam = Number.parseInt(request.nextUrl.searchParams.get("days") ?? "30", 10)
    const days = Number.isFinite(daysParam) ? Math.min(Math.max(daysParam, 7), 90) : 30

    const { data, error } = await supabase.rpc("get_traffic_stats", { days })

    if (error) {
      console.error("Error fetching traffic stats:", error)
      return NextResponse.json({ error: "Failed to load analytics" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in GET /api/analytics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

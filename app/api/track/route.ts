import { type NextRequest, NextResponse } from "next/server"

import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

function detectDevice(userAgent: string): string {
  const ua = userAgent.toLowerCase()
  if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/.test(ua)) return "tablet"
  if (/mobile|iphone|ipod|android.*mobile|blackberry|opera mini|iemobile/.test(ua)) return "mobile"
  return "desktop"
}

export async function POST(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ ok: false }, { status: 200 })
    }

    const body = await request.json().catch(() => null)
    const path = String(body?.path ?? "").slice(0, 512)
    if (!path) {
      return NextResponse.json({ ok: false }, { status: 200 })
    }

    // Never log admin/auth/api routes.
    if (path.startsWith("/admin") || path.startsWith("/auth") || path.startsWith("/api")) {
      return NextResponse.json({ ok: true }, { status: 200 })
    }

    const referrer = String(body?.referrer ?? "").slice(0, 512) || null
    const visitorId = String(body?.visitor_id ?? "").slice(0, 64) || null
    const device = detectDevice(request.headers.get("user-agent") ?? "")

    const supabase = await createClient()
    await supabase.from("page_views").insert({ path, referrer, visitor_id: visitorId, device })

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (error) {
    console.error("Error in POST /api/track:", error)
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}

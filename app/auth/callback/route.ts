import { NextResponse } from "next/server"
import type { Session } from "@supabase/supabase-js"

import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"

type AuthChangePayload = {
  event: string
  session: Session | null
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ success: true })
  }

  const supabase = await createClient()
  const { event, session }: AuthChangePayload = await request.json()

  if (event === "SIGNED_OUT") {
    await supabase.auth.signOut()
    return NextResponse.json({ success: true })
  }

  if (session) {
    await supabase.auth.setSession(session)
  }

  return NextResponse.json({ success: true })
}

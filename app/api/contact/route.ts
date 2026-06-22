import { NextResponse, type NextRequest } from "next/server"

import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null)

    const name = String(body?.name ?? "").trim()
    const email = String(body?.email ?? "").trim()
    const subject = String(body?.subject ?? "").trim()
    const message = String(body?.message ?? "").trim()

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email and message are required." }, { status: 400 })
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 })
    }

    if (name.length > 120 || email.length > 160 || subject.length > 160 || message.length > 4000) {
      return NextResponse.json({ error: "One of the fields is too long." }, { status: 400 })
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: "Messaging is not available right now." }, { status: 503 })
    }

    const supabase = await createClient()
    const { error } = await supabase.from("contact_messages").insert({
      name,
      email,
      subject: subject || null,
      message,
    })

    if (error) {
      console.error("Error saving contact message:", error)
      return NextResponse.json({ error: "Could not send your message. Please try again." }, { status: 500 })
    }

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/contact:", error)
    return NextResponse.json({ error: "Unexpected error. Please try again." }, { status: 500 })
  }
}

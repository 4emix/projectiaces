import { NextResponse } from "next/server"
import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js"

import { createClient, createServiceRoleClient } from "@/lib/supabase/server"

const REGISTRATION_MAILTO_PREFIX = "mailto:"

function sanitizeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : ""
}

export function parseRegistrationValue(value: unknown): {
  email: string | null
  url: string | null
} {
  const trimmed = sanitizeString(value)
  if (!trimmed) {
    return { email: null, url: null }
  }

  if (trimmed.toLowerCase().startsWith(REGISTRATION_MAILTO_PREFIX)) {
    const email = trimmed.slice(REGISTRATION_MAILTO_PREFIX.length).trim()
    return { email: email || null, url: null }
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return { email: null, url: trimmed }
  }

  if (trimmed.includes("@") && !trimmed.includes(" ")) {
    return { email: trimmed, url: null }
  }

  return { email: null, url: trimmed }
}

export function buildEventMutationPayload(body: Record<string, unknown>): Record<string, unknown> {
  const payload: Record<string, unknown> = {}

  if ("title" in body && typeof body.title === "string") {
    payload.title = body.title.trim()
  }

  if ("description" in body && typeof body.description === "string") {
    payload.description = body.description.trim()
  }

  if ("event_date" in body) {
    const rawDate = sanitizeString(body.event_date)
    payload.event_date = rawDate || null
  }

  if ("location" in body) {
    const location = sanitizeString(body.location)
    payload.location = location || null
  }

  if ("image_url" in body) {
    const imageUrl = sanitizeString(body.image_url)
    payload.image_url = imageUrl || null
  }

  if ("is_active" in body && typeof body.is_active === "boolean") {
    payload.is_active = body.is_active
  }

  if ("registration_url" in body) {
    const { email, url } = parseRegistrationValue(body.registration_url)
    payload.contact_email = email
    payload.registration_url = url
  }

  return payload
}

type MutationClientResult =
  | { client: SupabaseClient; error: null }
  | { client: null; error: NextResponse }

export async function resolveEventMutationContext(): Promise<MutationClientResult> {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return {
      client: null,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    }
  }

  const serviceClient = createServiceRoleClient()
  if (serviceClient) {
    return { client: serviceClient, error: null }
  }

  return { client: supabase, error: null }
}

export function normalizeEventRecord(event: Record<string, any>) {
  const eventDate = event.event_date ?? event.date ?? null

  const registrationUrl = (() => {
    const directUrl = sanitizeString(event.registration_url)
    if (directUrl) {
      return directUrl
    }

    const contactEmail = sanitizeString(event.contact_email)
    if (contactEmail) {
      return `${REGISTRATION_MAILTO_PREFIX}${contactEmail}`
    }

    return ""
  })()

  return {
    ...event,
    event_date: eventDate,
    registration_url: registrationUrl,
    is_active: typeof event.is_active === "boolean" ? event.is_active : true,
  }
}

function messageMentionsColumn(message: string, column: string) {
  const normalized = column.toLowerCase()
  const pattern = new RegExp(`(^|[^a-z0-9_])${normalized}([^a-z0-9_]|$)`)
  return pattern.test(message)
}

function adjustPayloadForError(
  payload: Record<string, unknown>,
  error: PostgrestError,
): Record<string, unknown> | null {
  const message = error.message.toLowerCase()

  if (messageMentionsColumn(message, "registration_url") && "registration_url" in payload) {
    const { registration_url: _unusedRegistrationUrl, ...rest } = payload
    return { ...rest }
  }

  if (messageMentionsColumn(message, "updated_at") && "updated_at" in payload) {
    const { updated_at: _unusedUpdatedAt, ...rest } = payload
    return { ...rest }
  }

  if (messageMentionsColumn(message, "contact_email") && "contact_email" in payload) {
    const nextPayload = { ...payload }
    delete nextPayload.contact_email
    return nextPayload
  }

  if (messageMentionsColumn(message, "is_active") && "is_active" in payload) {
    const { is_active: _unusedIsActive, ...rest } = payload
    return { ...rest }
  }

  if (messageMentionsColumn(message, "event_date") && "event_date" in payload) {
    const { event_date, ...rest } = payload
    return { ...rest, date: event_date }
  }

  if (messageMentionsColumn(message, "date") && "date" in payload) {
    const { date, ...rest } = payload
    return { ...rest, event_date: date }
  }

  return null
}

type MutationExecutor<T> = (
  payload: Record<string, unknown>,
) => Promise<{ data: T | null; error: PostgrestError | null }>

export async function executeEventMutation<T>(
  basePayload: Record<string, unknown>,
  executor: MutationExecutor<T>,
): Promise<{ data: T | null; error: PostgrestError | null }> {
  let payload = { ...basePayload }
  const attemptedPayloads = new Set<string>()
  let lastError: PostgrestError | null = null

  while (true) {
    const cacheKey = JSON.stringify(payload)
    if (attemptedPayloads.has(cacheKey)) {
      return { data: null, error: lastError }
    }

    attemptedPayloads.add(cacheKey)
    const { data, error } = await executor(payload)
    if (!error) {
      return { data, error: null }
    }

    lastError = error
    const adjustedPayload = adjustPayloadForError(payload, error)
    if (!adjustedPayload) {
      return { data: null, error }
    }

    payload = adjustedPayload
  }
}

import type { PostgrestError } from "@supabase/supabase-js"

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

function adjustPayloadForError(
  payload: Record<string, unknown>,
  error: PostgrestError,
): Record<string, unknown> | null {
  const message = error.message.toLowerCase()

  if (message.includes("registration_url") && "registration_url" in payload) {
    const { registration_url: _unusedRegistrationUrl, ...rest } = payload
    const nextPayload = { ...rest }
    if ("contact_email" in nextPayload) {
      delete nextPayload.contact_email
    }
    return nextPayload
  }

  if (message.includes("contact_email") && "contact_email" in payload) {
    const nextPayload = { ...payload }
    delete nextPayload.contact_email
    return nextPayload
  }

  if ((message.includes('"event_date"') || message.includes(" event_date")) && "event_date" in payload) {
    const { event_date, ...rest } = payload
    return { ...rest, date: event_date }
  }

  if ((message.includes('"date"') || message.includes(" date")) && "date" in payload) {
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

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
    payload.date = rawDate || null
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

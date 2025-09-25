import type { EventItem } from "./types"

function sanitizeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : ""
}

function buildFallbackId(raw: Record<string, unknown>): string {
  const title = sanitizeString(raw?.title)
  const date = sanitizeString(raw?.event_date ?? raw?.date)
  const base = title ? title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") : "event"
  const suffix = date || sanitizeString(raw?.created_at) || sanitizeString(raw?.id)
  return suffix ? `${base}-${suffix}` : `${base}-placeholder`
}

export function toEventItem(raw: Record<string, unknown>): EventItem {
  const idValue = sanitizeString(raw?.id)
  const description = sanitizeString(raw?.description)
  const location = sanitizeString(raw?.location)
  const registrationUrl = sanitizeString(raw?.registration_url)
  const imageUrl = sanitizeString(raw?.image_url)
  const contactEmail = sanitizeString(raw?.contact_email)

  const eventDateValue = sanitizeString(raw?.event_date ?? raw?.date)

  return {
    id: idValue || buildFallbackId(raw),
    title: sanitizeString(raw?.title) || "Untitled Event",
    description,
    event_date: eventDateValue || null,
    location: location || null,
    registration_url: registrationUrl || (contactEmail ? `mailto:${contactEmail}` : null),
    image_url: imageUrl || null,
    is_active:
      typeof raw?.is_active === "boolean"
        ? raw.is_active
        : typeof (raw as { isActive?: boolean })?.isActive === "boolean"
          ? (raw as { isActive?: boolean }).isActive!
          : true,
    created_at: sanitizeString(raw?.created_at) || null,
    updated_at: sanitizeString(raw?.updated_at) || null,
    contact_email: contactEmail || null,
  }
}

export function parseEventDate(value: string | null | undefined): Date | null {
  if (!value) {
    return null
  }

  const date = new Date(value)
  return Number.isFinite(date.getTime()) ? date : null
}

export function formatEventDate(
  value: string | null | undefined,
  fallbackText = "Date to be announced",
): string {
  const date = parseEventDate(value)
  if (!date) {
    return fallbackText
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function compareAsc(a: EventItem, b: EventItem): number {
  const dateA = parseEventDate(a.event_date)
  const dateB = parseEventDate(b.event_date)

  if (!dateA && !dateB) {
    return a.title.localeCompare(b.title)
  }
  if (!dateA) {
    return 1
  }
  if (!dateB) {
    return -1
  }

  return dateA.getTime() - dateB.getTime()
}

function compareDesc(a: EventItem, b: EventItem): number {
  const dateA = parseEventDate(a.event_date)
  const dateB = parseEventDate(b.event_date)

  if (!dateA && !dateB) {
    return a.title.localeCompare(b.title)
  }
  if (!dateA) {
    return 1
  }
  if (!dateB) {
    return -1
  }

  return dateB.getTime() - dateA.getTime()
}

export function splitEventsByTime(events: EventItem[]): {
  upcoming: EventItem[]
  past: EventItem[]
} {
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)

  const upcoming: EventItem[] = []
  const past: EventItem[] = []

  events.forEach((event) => {
    if (event.is_active === false) {
      return
    }

    const eventDate = parseEventDate(event.event_date)

    if (!eventDate || eventDate >= startOfToday) {
      upcoming.push(event)
    } else {
      past.push(event)
    }
  })

  upcoming.sort(compareAsc)
  past.sort(compareDesc)

  return { upcoming, past }
}

export function isExternalUrl(url: string): boolean {
  return /^https?:\/\//i.test(url)
}

export function isMailtoLink(url: string): boolean {
  return url.toLowerCase().startsWith("mailto:")
}

import { fallbackEvents } from "@/lib/fallback-data"
import { toEventItem } from "@/lib/event-utils"
import { createClient, createServiceRoleClient, isSupabaseConfigured } from "@/lib/supabase/server"
import type { EventItem } from "@/lib/types"

export async function getEvents(): Promise<EventItem[]> {
  const fallback = fallbackEvents.map(toEventItem)

  if (!isSupabaseConfigured()) {
    return fallback
  }

  try {
    const supabase = await createClient()
    const queryClient = createServiceRoleClient() ?? supabase

    let { data, error } = await queryClient.from("events").select("*").order("event_date", { ascending: true })

    if (error?.message?.toLowerCase().includes("event_date")) {
      ;({ data, error } = await queryClient.from("events").select("*").order("date", { ascending: true }))
    }

    if (error) {
      console.error("Error loading events from Supabase:", error)
      return fallback
    }

    const events = (data ?? []).map(toEventItem)
    return events.length > 0 ? events : fallback
  } catch (error) {
    console.error("Error loading events data:", error)
    return fallback
  }
}

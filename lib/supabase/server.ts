import { createServerClient } from "@supabase/ssr"
import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

import { getSupabaseConfig, getSupabaseServiceRoleConfig } from "./config"

export function isSupabaseConfigured() {
  return getSupabaseConfig() !== null
}

/**
 * Especially important if using Fluid compute: Don't put this client in a
 * global variable. Always create a new client within each function when using
 * it.
 */
export async function createClient() {
  const config = getSupabaseConfig()
  if (!config) {
    throw new Error(
      [
        "Supabase environment variables are not configured.",
        "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (or their SUPABASE_URL/SUPABASE_ANON_KEY equivalents).",
      ].join(" "),
    )
  }

  const cookieStore = await cookies()

  return createServerClient(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // The "setAll" method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}

export function createServiceRoleClient(): SupabaseClient | null {
  const config = getSupabaseServiceRoleConfig()
  if (!config) {
    return null
  }

  return createSupabaseClient(config.url, config.serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

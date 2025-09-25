import { createClient as createSupabaseClient } from "@supabase/supabase-js"

import { getSupabaseConfig } from "./config"

type SupabaseClient = ReturnType<typeof createSupabaseClient>

let cachedClient: SupabaseClient | null = null
let cachedStubClient: SupabaseClient | null = null

function createStubClient(): SupabaseClient {
  const stub = {
    auth: {
      async getUser() {
        return { data: { user: null }, error: null }
      },
      onAuthStateChange() {
        return {
          data: {
            subscription: {
              unsubscribe() {
                // no-op
              },
            },
          },
        }
      },
      async signInWithPassword() {
        return { data: { user: null, session: null }, error: new Error("Supabase is not configured") }
      },
      async signUp() {
        return { data: { user: null, session: null }, error: new Error("Supabase is not configured") }
      },
      async signOut() {
        return { error: null }
      },
      async setSession() {
        return { data: { session: null }, error: null }
      },
    },
  }

  return stub as unknown as SupabaseClient
}

export function createClient() {
  const config = getSupabaseConfig()

  if (!config) {
    if (!cachedStubClient) {
      cachedStubClient = createStubClient()
    }
    return cachedStubClient
  }

  if (!cachedClient) {
    cachedClient = createSupabaseClient(config.url, config.anonKey)
  }
  return cachedClient
}

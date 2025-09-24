import { createClient as createSupabaseClient } from "@supabase/supabase-js"

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
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    if (!cachedStubClient) {
      cachedStubClient = createStubClient()
    }
    return cachedStubClient
  }

  if (!cachedClient) {
    cachedClient = createSupabaseClient(url, anonKey)
  }
  return cachedClient
}

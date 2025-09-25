const SUPABASE_URL_ENV_KEYS = ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_URL"] as const
const SUPABASE_ANON_KEY_ENV_KEYS = [
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_ANON_KEY",
  "SUPABASE_KEY",
] as const

export type SupabaseConfig = {
  url: string
  anonKey: string
}

function readEnvValue(keys: readonly string[]): string | undefined {
  for (const key of keys) {
    const value = process.env[key as keyof NodeJS.ProcessEnv]
    if (typeof value === "string") {
      const trimmed = value.trim()
      if (trimmed.length > 0) {
        return trimmed
      }
    }
  }

  return undefined
}

export function getSupabaseConfig(): SupabaseConfig | null {
  const url = readEnvValue(SUPABASE_URL_ENV_KEYS)
  const anonKey = readEnvValue(SUPABASE_ANON_KEY_ENV_KEYS)

  if (!url || !anonKey) {
    return null
  }

  return { url, anonKey }
}

export function isSupabaseEnvConfigured(): boolean {
  return getSupabaseConfig() !== null
}

export function getSupabaseUrl(): string | undefined {
  return readEnvValue(SUPABASE_URL_ENV_KEYS)
}

export function getSupabaseAnonKey(): string | undefined {
  return readEnvValue(SUPABASE_ANON_KEY_ENV_KEYS)
}

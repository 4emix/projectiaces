const SUPABASE_URL_ENV_KEYS = ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_URL"] as const
const SUPABASE_ANON_KEY_ENV_KEYS = [
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_ANON_KEY",
  "SUPABASE_KEY",
] as const

type EnvLike = Record<string, string | undefined>

function resolveRuntimeEnv(): EnvLike | null {
  if (typeof process !== "undefined" && typeof process.env !== "undefined") {
    return process.env
  }

  if (typeof globalThis !== "undefined") {
    const candidate = (globalThis as { __env?: EnvLike | undefined }).__env
    if (candidate && typeof candidate === "object") {
      return candidate
    }
  }

  return null
}

const runtimeEnv = resolveRuntimeEnv()

const DEFAULT_SUPABASE_URL = "https://fsakwsavwoaakljdrtig.supabase.co"
const DEFAULT_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzYWt3c2F2d29hYWtsamRydGlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2MjA3MzUsImV4cCI6MjA3NDE5NjczNX0.Tzd4M1m2-BiZJYvFmHfUKM-Ce2WTI00y4eAiaTeoYIU"

const COMMON_PLACEHOLDER_VALUES = new Set([
  "undefined",
  "UNDEFINED",
  "null",
  "NULL",
])

const PLACEHOLDER_ANON_KEY_VALUES = new Set([
  "your-supabase-anon-key",
  "your_supabase_anon_key",
  "YOUR_SUPABASE_ANON_KEY",
])

const PLACEHOLDER_URL_VALUES = new Set([
  "your-supabase-url",
  "your_supabase_url",
  "YOUR_SUPABASE_URL",
])

for (const value of COMMON_PLACEHOLDER_VALUES) {
  PLACEHOLDER_ANON_KEY_VALUES.add(value)
  PLACEHOLDER_URL_VALUES.add(value)
}

export type SupabaseConfig = {
  url: string
  anonKey: string
}

function readEnvValue(
  keys: readonly string[],
  { placeholderValues }: { placeholderValues?: ReadonlySet<string> } = {}
): string | undefined {
  if (!runtimeEnv) {
    return undefined
  }

  for (const key of keys) {
    const value = runtimeEnv[key]
    if (typeof value === "string") {
      const trimmed = value.trim()
      if (trimmed.length > 0) {
        const normalized = trimmed.toLowerCase()
        if (!placeholderValues?.has(trimmed) && !placeholderValues?.has(normalized)) {
          return trimmed
        }

      }
    }
  }

  return undefined
}

export function getSupabaseConfig(): SupabaseConfig | null {
  const url =
    readEnvValue(SUPABASE_URL_ENV_KEYS, {
      placeholderValues: PLACEHOLDER_URL_VALUES,
    }) ?? DEFAULT_SUPABASE_URL
  const anonKey =
    readEnvValue(SUPABASE_ANON_KEY_ENV_KEYS, {
      placeholderValues: PLACEHOLDER_ANON_KEY_VALUES,
    }) ?? DEFAULT_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    return null
  }

  return { url, anonKey }
}

export function isSupabaseEnvConfigured(): boolean {
  return getSupabaseConfig() !== null
}

export function getSupabaseUrl(): string | undefined {
  return (
    readEnvValue(SUPABASE_URL_ENV_KEYS, {
      placeholderValues: PLACEHOLDER_URL_VALUES,
    }) ?? DEFAULT_SUPABASE_URL
  )
}

export function getSupabaseAnonKey(): string | undefined {
  return (
    readEnvValue(SUPABASE_ANON_KEY_ENV_KEYS, {
      placeholderValues: PLACEHOLDER_ANON_KEY_VALUES,
    }) ?? DEFAULT_SUPABASE_ANON_KEY
  )

}

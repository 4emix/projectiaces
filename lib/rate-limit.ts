// Lightweight in-memory rate limiter. Note: on serverless this is per-instance
// and resets on cold starts, so it is best-effort defense-in-depth against bursts
// and bots. For strong, distributed limits use a durable store (e.g. Upstash).

type Entry = { count: number; reset: number }

const store = new Map<string, Entry>()

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()

  // Opportunistic cleanup to keep the map bounded.
  if (store.size > 10_000) {
    for (const [k, v] of store) {
      if (v.reset < now) store.delete(k)
    }
  }

  const entry = store.get(key)
  if (!entry || entry.reset < now) {
    store.set(key, { count: 1, reset: now + windowMs })
    return true
  }
  if (entry.count >= limit) {
    return false
  }
  entry.count += 1
  return true
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for") ?? ""
  const ip = forwarded.split(",")[0]?.trim()
  return ip || request.headers.get("x-real-ip") || "unknown"
}

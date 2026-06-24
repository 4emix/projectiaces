"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

function getVisitorId(): string {
  try {
    const key = "iaces_vid"
    let id = localStorage.getItem(key)
    if (!id) {
      id = (crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`).slice(0, 64)
      localStorage.setItem(key, id)
    }
    return id
  } catch {
    return ""
  }
}

export function AnalyticsTracker() {
  const pathname = usePathname()

  useEffect(() => {
    if (!pathname) return
    // Don't track admin/auth areas.
    if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) return

    const payload = JSON.stringify({
      path: pathname,
      referrer: document.referrer || "",
      visitor_id: getVisitorId(),
    })

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {})
  }, [pathname])

  return null
}

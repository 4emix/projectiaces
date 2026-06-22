"use client"

import { useEffect, useMemo, useState } from "react"
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { ExternalLink, MapPin } from "lucide-react"

import type { LocalCommittee } from "@/lib/types"
import { getCommitteeCoordinates, jitter, type LatLng } from "@/lib/lc-coordinates"

type MappedCommittee = LocalCommittee & { position: LatLng }

// Navy teardrop pin rendered as an inline SVG divIcon.
const navyIcon = L.divIcon({
  className: "iaces-pin",
  html: `
    <div style="position:relative;width:28px;height:38px;filter:drop-shadow(0 4px 6px rgba(15,23,42,0.35));">
      <svg width="28" height="38" viewBox="0 0 28 38" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 0C6.27 0 0 6.27 0 14c0 9.5 14 24 14 24s14-14.5 14-24C28 6.27 21.73 0 14 0Z" fill="oklch(0.3 0.1 263)"/>
        <circle cx="14" cy="14" r="5" fill="#ffffff"/>
      </svg>
    </div>
  `,
  iconSize: [28, 38],
  iconAnchor: [14, 38],
  popupAnchor: [0, -34],
})

export default function LCMap() {
  const [committees, setCommittees] = useState<LocalCommittee[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        const res = await fetch("/api/committees")
        if (res.ok && active) {
          const data = await res.json()
          if (Array.isArray(data)) setCommittees(data)
        }
      } catch (error) {
        console.error("Failed to load committees for map:", error)
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [])

  const mapped = useMemo<MappedCommittee[]>(() => {
    const seen = new Map<string, number>()
    return committees
      .map((committee) => {
        const base = getCommitteeCoordinates(committee.name, committee.country)
        if (!base) return null
        const key = `${base[0].toFixed(3)},${base[1].toFixed(3)}`
        const count = seen.get(key) ?? 0
        seen.set(key, count + 1)
        return { ...committee, position: jitter(base, count) }
      })
      .filter((value): value is MappedCommittee => value !== null)
  }, [committees])

  const countryCount = useMemo(
    () => new Set(mapped.map((c) => c.country.trim().toLowerCase())).size,
    [mapped],
  )

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-secondary shadow-xl">
      <MapContainer
        center={[38, 18]}
        zoom={4}
        minZoom={2}
        scrollWheelZoom={false}
        style={{ height: "min(70vh, 560px)", width: "100%" }}
        worldCopyJump
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {mapped.map((committee) => (
          <Marker key={committee.id} position={committee.position} icon={navyIcon}>
            <Popup>
              <div className="space-y-1.5">
                <p className="text-sm font-semibold text-primary">{committee.name}</p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {committee.country}
                </p>
                {committee.website_url && committee.website_url.trim().length > 0 && (
                  <a
                    href={committee.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
                  >
                    Visit <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Stat overlay */}
      <div className="pointer-events-none absolute left-4 top-4 z-[1000] flex gap-3">
        <div className="pointer-events-auto rounded-xl border border-border bg-background/90 px-4 py-2 shadow-md backdrop-blur">
          <p className="text-2xl font-bold text-primary tabular-nums">{loading ? "…" : mapped.length}</p>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Committees</p>
        </div>
        <div className="pointer-events-auto rounded-xl border border-border bg-background/90 px-4 py-2 shadow-md backdrop-blur">
          <p className="text-2xl font-bold text-primary tabular-nums">{loading ? "…" : countryCount}</p>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Countries</p>
        </div>
      </div>
    </div>
  )
}

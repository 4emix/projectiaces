"use client"

import { useEffect, useMemo, useState } from "react"
import { GeoJSON, MapContainer, TileLayer } from "react-leaflet"
import "leaflet/dist/leaflet.css"

import type { LocalCommittee } from "@/lib/types"

// LC country name → GeoJSON `properties.name`
const ALIAS: Record<string, string> = {
  netherland: "Netherlands",
  netherlands: "Netherlands",
  serbia: "Republic of Serbia",
  turkey: "Turkey",
  türkiye: "Turkey",
  turkiye: "Turkey",
}
const toGeoName = (country: string) => ALIAS[country.trim().toLowerCase()] ?? country.trim()

const NAVY = "#1e3a8a"
const NAVY_HOVER = "#2747a6"

export default function LCMap() {
  const [committees, setCommittees] = useState<LocalCommittee[]>([])
  const [geo, setGeo] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    Promise.all([
      fetch("/api/committees")
        .then((r) => (r.ok ? r.json() : []))
        .catch(() => []),
      fetch("/world-countries.geo.json")
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
    ]).then(([c, g]) => {
      if (!active) return
      if (Array.isArray(c)) setCommittees(c)
      setGeo(g)
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [])

  // GeoJSON name → committees in that country
  const byCountry = useMemo(() => {
    const map = new Map<string, LocalCommittee[]>()
    committees.forEach((committee) => {
      const key = toGeoName(committee.country)
      const list = map.get(key) ?? []
      list.push(committee)
      map.set(key, list)
    })
    return map
  }, [committees])

  const countryCount = useMemo(
    () => new Set(committees.map((c) => toGeoName(c.country))).size,
    [committees],
  )

  const styleFor = (feature: any) =>
    byCountry.has(feature?.properties?.name)
      ? { fillColor: NAVY, fillOpacity: 0.85, color: "#ffffff", weight: 1 }
      : { fillColor: "#eef2f7", fillOpacity: 0.7, color: "#dfe5ee", weight: 0.6 }

  const onEachFeature = (feature: any, layer: any) => {
    const name = feature?.properties?.name
    const items = byCountry.get(name)
    if (!items) return

    const rows = items
      .map(
        (i) =>
          `<li style="margin:2px 0">${i.name}${
            i.website_url && i.website_url.trim()
              ? ` — <a href="${i.website_url}" target="_blank" rel="noopener noreferrer" style="color:${NAVY};text-decoration:underline">visit</a>`
              : ""
          }</li>`,
      )
      .join("")
    layer.bindPopup(
      `<div><p style="font-weight:600;color:${NAVY};margin:0 0 4px">${name} · ${items.length}</p>` +
        `<ul style="margin:0;padding-left:16px;font-size:12px;color:#475569">${rows}</ul></div>`,
    )
    layer.on({
      mouseover: (e: any) => e.target.setStyle({ fillColor: NAVY_HOVER, fillOpacity: 0.95, weight: 1.5 }),
      mouseout: (e: any) => e.target.setStyle(styleFor(feature)),
    })
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-secondary shadow-xl">
      <MapContainer
        center={[34, 12]}
        zoom={3}
        minZoom={2}
        scrollWheelZoom={false}
        style={{ height: "clamp(360px, 58vh, 560px)", width: "100%" }}
        worldCopyJump
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {geo && <GeoJSON key={byCountry.size} data={geo} style={styleFor} onEachFeature={onEachFeature} />}
      </MapContainer>

      {/* Stat overlay */}
      <div className="pointer-events-none absolute left-4 top-4 z-[1000] flex gap-3">
        <div className="pointer-events-auto rounded-xl border border-border bg-background/90 px-4 py-2 shadow-md backdrop-blur">
          <p className="text-2xl font-bold text-primary tabular-nums">{loading ? "…" : committees.length}</p>
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

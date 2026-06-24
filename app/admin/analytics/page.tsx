"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Eye, Users, TrendingUp, BarChart3, Monitor, Smartphone, Tablet } from "lucide-react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AdminNavigation } from "@/components/admin/admin-navigation"

type Stats = {
  total_views: number
  unique_visitors: number
  views_period: number
  visitors_period: number
  daily: { day: string; views: number }[]
  top_pages: { path: string; views: number }[]
  devices: { device: string; views: number }[]
}

const NAVY = "#1e3a8a"
const BLUE = "#2563eb"

function deviceIcon(device: string) {
  if (device === "mobile") return Smartphone
  if (device === "tablet") return Tablet
  return Monitor
}

export default function AnalyticsAdminPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/analytics?days=30")
        if (!res.ok) {
          setError(res.status === 401 ? "Please sign in to view analytics." : "Failed to load analytics.")
          return
        }
        setStats(await res.json())
      } catch {
        setError("Network error while loading analytics.")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const statCards = stats
    ? [
        { title: "Total Views", value: stats.total_views, icon: Eye },
        { title: "Unique Visitors", value: stats.unique_visitors, icon: Users },
        { title: "Views (30d)", value: stats.views_period, icon: TrendingUp },
        { title: "Visitors (30d)", value: stats.visitors_period, icon: BarChart3 },
      ]
    : []

  const maxPage = stats?.top_pages?.reduce((m, p) => Math.max(m, p.views), 0) ?? 0
  const totalDevice = stats?.devices?.reduce((s, d) => s + d.views, 0) ?? 0

  const content = (
    <div className="space-y-6">
      <div className="space-y-3">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Website Traffic</h1>
          <p className="text-muted-foreground">Page views and visitors over the last 30 days.</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="w-full justify-start rounded-full text-muted-foreground transition hover:text-foreground sm:w-auto"
        >
          <Link href="/admin">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to dashboard
          </Link>
        </Button>
      </div>

      {loading ? (
        <Card className="border-border/60 bg-card/80 shadow-sm">
          <CardContent className="p-10 text-center text-muted-foreground">Loading analytics...</CardContent>
        </Card>
      ) : error ? (
        <Card className="border-border/60 bg-card/80 shadow-sm">
          <CardContent className="p-10 text-center text-muted-foreground">{error}</CardContent>
        </Card>
      ) : stats ? (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {statCards.map((s) => {
              const Icon = s.icon
              return (
                <Card key={s.title} className="border-border/60 bg-card/80 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground/80">{s.title}</CardTitle>
                    <span className="rounded-full border border-border/60 bg-background/80 p-2">
                      <Icon className="h-4 w-4 text-accent" />
                    </span>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-semibold text-foreground tabular-nums">
                      {s.value.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Daily views chart */}
          <Card className="border-border/60 bg-card/80 shadow-sm">
            <CardHeader className="border-b border-border/40 pb-4">
              <CardTitle className="text-lg">Daily views</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.daily} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={BLUE} stopOpacity={0.4} />
                        <stop offset="100%" stopColor={BLUE} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis
                      dataKey="day"
                      tickFormatter={(d: string) => d.slice(5).replace("-", "/")}
                      tick={{ fontSize: 11, fill: "#64748b" }}
                      interval="preserveStartEnd"
                      minTickGap={24}
                    />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#64748b" }} width={32} />
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }}
                      labelStyle={{ color: NAVY, fontWeight: 600 }}
                    />
                    <Area type="monotone" dataKey="views" stroke={NAVY} strokeWidth={2} fill="url(#viewsGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Top pages */}
            <Card className="border-border/60 bg-card/80 shadow-sm">
              <CardHeader className="border-b border-border/40 pb-4">
                <CardTitle className="text-lg">Top pages</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                {stats.top_pages.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No data yet.</p>
                ) : (
                  stats.top_pages.map((p) => (
                    <div key={p.path} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="truncate font-medium text-foreground">{p.path}</span>
                        <span className="shrink-0 text-muted-foreground tabular-nums">{p.views}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-accent"
                          style={{ width: `${maxPage ? (p.views / maxPage) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Devices */}
            <Card className="border-border/60 bg-card/80 shadow-sm">
              <CardHeader className="border-b border-border/40 pb-4">
                <CardTitle className="text-lg">Devices</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                {stats.devices.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No data yet.</p>
                ) : (
                  stats.devices.map((d) => {
                    const Icon = deviceIcon(d.device)
                    const pct = totalDevice ? Math.round((d.views / totalDevice) * 100) : 0
                    return (
                      <div key={d.device} className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 text-accent">
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium capitalize text-foreground">{d.device}</span>
                            <span className="text-muted-foreground tabular-nums">
                              {pct}% · {d.views}
                            </span>
                          </div>
                          <div className="mt-1 h-2 overflow-hidden rounded-full bg-secondary">
                            <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </CardContent>
            </Card>
          </div>
        </>
      ) : null}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/40 to-background">
      <AdminNavigation />
      <main className="pt-24 pb-12">
        <div className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6 lg:px-8">{content}</div>
      </main>
    </div>
  )
}

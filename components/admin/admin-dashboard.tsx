import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { LucideIcon } from "lucide-react"
import { Users, FileText, Calendar, TrendingUp, Eye, Edit, Globe, Mail, History } from "lucide-react"
import Link from "next/link"

import { ContentService } from "@/lib/content-service"
import { getEvents } from "@/lib/data/events"
import { splitEventsByTime } from "@/lib/event-utils"
import { AdminMessages } from "@/components/admin/admin-messages"

type Stat = {
  title: string
  value: string
  icon: LucideIcon
  change?: string
  changeType?: "positive" | "negative" | "neutral"
}

export async function AdminDashboard() {
  const [boardMembers, localCommittees, magazineArticles, events] = await Promise.all([
    ContentService.getAllBoardMembers(),
    ContentService.getAllLocalCommittees(),
    ContentService.getActiveMagazineArticles(),
    getEvents(),
  ])

  const { upcoming, past } = splitEventsByTime(events)
  const magazines = magazineArticles.filter((p) => p.publication_type !== "newsletter")
  const newsletters = magazineArticles.filter((p) => p.publication_type === "newsletter")

  const formatNumber = (value: number) => value.toLocaleString()

  const stats: Stat[] = [
    {
      title: "Local Committees",
      value: formatNumber(localCommittees.length),
      icon: Globe,
    },
    {
      title: "Magazine Issues",
      value: formatNumber(magazines.length),
      icon: FileText,
    },
    {
      title: "Newsletters",
      value: formatNumber(newsletters.length),
      icon: Mail,
    },
    {
      title: "Upcoming Events",
      value: formatNumber(upcoming.length),
      icon: Calendar,
    },
    {
      title: "Past Events",
      value: formatNumber(past.length),
      icon: History,
    },
  ]

  const timeAgo = (iso: string | null | undefined): string => {
    if (!iso) return ""
    const then = new Date(iso).getTime()
    if (!Number.isFinite(then)) return ""
    const seconds = Math.max(0, (Date.now() - then) / 1000)
    if (seconds < 3600) return `${Math.max(1, Math.round(seconds / 60))}m ago`
    if (seconds < 86400) return `${Math.round(seconds / 3600)}h ago`
    const days = Math.round(seconds / 86400)
    if (days < 30) return `${days}d ago`
    return new Date(iso).toLocaleDateString()
  }

  const recentActivity = [
    ...events.map((e) => ({ action: "Event", item: e.title, type: "event", ts: e.updated_at ?? e.created_at })),
    ...localCommittees.map((c) => ({
      action: "Local committee",
      item: c.name,
      type: "committee",
      ts: c.updated_at ?? c.created_at,
    })),
    ...magazineArticles.map((m) => ({
      action: m.publication_type === "newsletter" ? "Newsletter" : "Publication",
      item: m.title,
      type: m.publication_type === "newsletter" ? "newsletter" : "magazine",
      ts: m.updated_at ?? m.created_at,
    })),
    ...boardMembers.map((b) => ({
      action: "Board member",
      item: b.name,
      type: "board",
      ts: b.updated_at ?? b.created_at,
    })),
  ]
    .filter((entry) => Boolean(entry.ts))
    .sort((a, b) => new Date(b.ts as string).getTime() - new Date(a.ts as string).getTime())
    .slice(0, 5)
    .map((entry) => ({ action: entry.action, item: entry.item, type: entry.type, time: timeAgo(entry.ts) }))

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-3xl border border-border/60 bg-card/80 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Dashboard</p>
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Welcome back to the Admin Hub</h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Monitor high-level activity, jump into key management areas, and keep your IACES presence looking fresh.
            </p>
          </div>
          <Button asChild className="rounded-full px-6 py-2 text-sm shadow">
            <Link href="/">
              <Eye className="mr-2 h-4 w-4" />
              View live site
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card
              key={index}
              className="border-border/60 bg-gradient-to-br from-background via-card to-card/80 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground/80">{stat.title}</CardTitle>
                <span className="rounded-full border border-border/60 bg-background/80 p-2">
                  <Icon className="h-4 w-4 text-accent" />
                </span>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold text-foreground">{stat.value}</div>
                {stat.change ? (
                  <div className="mt-2 flex items-center space-x-2 text-xs">
                    <Badge
                      variant={
                        stat.changeType === "positive"
                          ? "default"
                          : stat.changeType === "negative"
                            ? "destructive"
                            : "secondary"
                      }
                      className="text-xs"
                    >
                      {stat.change}
                    </Badge>
                    <span className="text-muted-foreground">vs. last month</span>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Contact Messages */}
        <AdminMessages />

        {/* Recent Activity */}
        <Card className="border-border/60 bg-card/80 shadow-sm">
          <CardHeader className="border-b border-border/40 pb-4">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-accent/10">
                <TrendingUp className="h-5 w-5 text-accent" />
              </span>
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 rounded-2xl border border-border/50 bg-background/60 p-4 shadow-sm"
              >
                <div className="mt-2 h-2 w-2 rounded-full bg-accent"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.item}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{activity.time}</p>
                </div>
                <Badge variant="outline" className="rounded-full text-xs capitalize">
                  {activity.type}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Content Management Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: "Hero Section",
            description: "Manage the main homepage hero content and call-to-action.",
            href: "/admin/hero",
            icon: <Edit className="h-4 w-4" />,
            cta: "Edit Hero",
          },
          {
            title: "About Section",
            description: "Update mission, vision, and organizational information.",
            href: "/admin/about",
            icon: <Edit className="h-4 w-4" />,
            cta: "Edit About",
          },
          {
            title: "Board Members",
            description: "Manage board member profiles and information.",
            href: "/admin/board",
            icon: <Users className="h-4 w-4" />,
            cta: "Manage Board",
          },
          {
            title: "Local Committees",
            description: "Manage local committees and their information.",
            href: "/admin/committees",
            icon: <Globe className="h-4 w-4" />,
            cta: "Manage Committees",
          },
          {
            title: "Publications",
            description: "Manage magazines and newsletters.",
            href: "/admin/magazine",
            icon: <FileText className="h-4 w-4" />,
            cta: "Manage Publications",
          },
          {
            title: "Events",
            description: "Manage upcoming and past events.",
            href: "/admin/events",
            icon: <Calendar className="h-4 w-4" />,
            cta: "Manage Events",
          },
        ].map((section) => (
          <Card
            key={section.title}
            className="flex h-full flex-col justify-between border-border/60 bg-card/80 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
          >
            <CardHeader className="border-b border-border/40 pb-4">
              <CardTitle className="text-lg text-foreground">{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col justify-between space-y-4 pt-4">
              <p className="text-sm text-muted-foreground">{section.description}</p>
              <Button variant="outline" size="sm" asChild className="w-full rounded-full">
                <Link href={section.href}>
                  <span className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent/10 text-accent">
                    {section.icon}
                  </span>
                  {section.cta}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

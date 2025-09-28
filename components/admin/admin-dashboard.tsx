import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, FileText, Calendar, TrendingUp, Eye, Edit, Plus, Globe } from "lucide-react"
import Link from "next/link"

export function AdminDashboard() {
  const stats = [
    {
      title: "Total Board Members",
      value: "4",
      icon: Users,
      change: "+0",
      changeType: "neutral" as const,
    },
    {
      title: "Local Committees",
      value: "4",
      icon: Globe,
      change: "+1",
      changeType: "positive" as const,
    },
    {
      title: "Magazine Issues",
      value: "3",
      icon: FileText,
      change: "+1",
      changeType: "positive" as const,
    },
    {
      title: "Upcoming Events",
      value: "3",
      icon: Calendar,
      change: "+2",
      changeType: "positive" as const,
    },
  ]

  const recentActivity = [
    {
      action: "New local committee added",
      item: "IACES Spain",
      time: "1 hour ago",
      type: "committee",
    },
    {
      action: "New magazine issue published",
      item: "Vol. 15, Issue 3",
      time: "2 hours ago",
      type: "magazine",
    },
    {
      action: "Event registration opened",
      item: "Global Civil Engineering Summit 2024",
      time: "1 day ago",
      type: "event",
    },
    {
      action: "Board member profile updated",
      item: "Dr. Sarah Johnson",
      time: "3 days ago",
      type: "board",
    },
  ]

  const quickActions = [
    {
      title: "Add Board Member",
      description: "Add a new board member profile",
      href: "/admin/board/new",
      icon: Users,
    },
    {
      title: "Add Local Committee",
      description: "Add a new local committee",
      href: "/admin/committees/new",
      icon: Globe,
    },
    {
      title: "Create Magazine Issue",
      description: "Publish a new magazine issue",
      href: "/admin/magazine/new",
      icon: FileText,
    },
    {
      title: "Schedule Event",
      description: "Add a new upcoming event",
      href: "/admin/events/new",
      icon: Calendar,
    },
  ]

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-3xl border border-border/60 bg-card/80 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-foreground">Dashboard</p>
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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
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
                  <Icon className="h-4 w-4 text-accent-foreground" />
                </span>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold text-foreground">{stat.value}</div>
                <div className="mt-2 flex items-center space-x-2 text-xs">
                  <Badge variant={stat.changeType === "positive" ? "default" : "secondary"} className="text-xs">
                    {stat.change}
                  </Badge>
                  <span className="text-muted-foreground">vs. last month</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card className="border-border/60 bg-card/80 shadow-sm">
          <CardHeader className="border-b border-border/40 pb-4">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-accent/10">
                <Plus className="h-5 w-5 text-accent-foreground" />
              </span>
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-2xl border border-border/50 bg-background/60 p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-md"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10">
                      <Icon className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{action.title}</h4>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-full" asChild>
                    <Link href={action.href}>Open</Link>
                  </Button>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-border/60 bg-card/80 shadow-sm">
          <CardHeader className="border-b border-border/40 pb-4">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-accent/10">
                <TrendingUp className="h-5 w-5 text-accent-foreground" />
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
                  <span className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent/10 text-accent-foreground">
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

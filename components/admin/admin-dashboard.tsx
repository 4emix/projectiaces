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
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your IACES website content</p>
        </div>
        <Button asChild>
          <Link href="/">
            <Eye className="w-4 h-4 mr-2" />
            View Site
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="flex items-center space-x-1 text-xs">
                  <Badge variant={stat.changeType === "positive" ? "default" : "secondary"} className="text-xs">
                    {stat.change}
                  </Badge>
                  <span className="text-muted-foreground">from last month</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-accent/20 rounded-lg">
                      <Icon className="w-4 h-4 text-accent-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{action.title}</h4>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={action.href}>Go</Link>
                  </Button>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 border border-border rounded-lg">
                <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.item}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {activity.type}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Content Management Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Hero Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Manage the main homepage hero content and call-to-action.</p>
            <Button variant="outline" size="sm" asChild className="w-full bg-transparent">
              <Link href="/admin/hero">
                <Edit className="w-4 h-4 mr-2" />
                Edit Hero
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">About Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Update mission, vision, and organizational information.</p>
            <Button variant="outline" size="sm" asChild className="w-full bg-transparent">
              <Link href="/admin/about">
                <Edit className="w-4 h-4 mr-2" />
                Edit About
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Board Members</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Manage board member profiles and information.</p>
            <Button variant="outline" size="sm" asChild className="w-full bg-transparent">
              <Link href="/admin/board">
                <Users className="w-4 h-4 mr-2" />
                Manage Board
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Local Committees</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Manage local committees and their information.</p>
            <Button variant="outline" size="sm" asChild className="w-full bg-transparent">
              <Link href="/admin/committees">
                <Globe className="w-4 h-4 mr-2" />
                Manage Committees
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Publications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Manage magazines and newsletters.</p>
            <Button variant="outline" size="sm" asChild className="w-full bg-transparent">
              <Link href="/admin/magazine">
                <FileText className="w-4 h-4 mr-2" />
                Manage Publications
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Manage upcoming and past events.</p>
            <Button variant="outline" size="sm" asChild className="w-full bg-transparent">
              <Link href="/admin/events">
                <Calendar className="w-4 h-4 mr-2" />
                Manage Events
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Clock } from "lucide-react"

const allEvents = [
  {
    title: "Global Computer Engineering Summit 2024",
    date: "December 15-17, 2024",
    location: "Singapore",
    description:
      "Join leading experts and students for three days of cutting-edge research presentations, workshops, and networking opportunities.",
    attendees: "500+ Expected",
    status: "upcoming",
    featured: true,
  },
  {
    title: "AI & Machine Learning Workshop",
    date: "November 8, 2024",
    location: "Virtual Event",
    description:
      "Hands-on workshop covering the latest developments in artificial intelligence and machine learning applications.",
    attendees: "200+ Registered",
    status: "upcoming",
    featured: false,
  },
  {
    title: "Student Innovation Competition",
    date: "October 25, 2024",
    location: "MIT, Boston",
    description: "Annual competition showcasing innovative projects from computer engineering students worldwide.",
    attendees: "150+ Participants",
    status: "upcoming",
    featured: false,
  },
  {
    title: "Cybersecurity in IoT Devices",
    date: "September 20, 2024",
    location: "London, UK",
    description: "Workshop focusing on security challenges and solutions for Internet of Things devices.",
    attendees: "120+ Attended",
    status: "past",
    featured: false,
  },
  {
    title: "Blockchain Technology Symposium",
    date: "August 15, 2024",
    location: "Berlin, Germany",
    description: "Exploring the applications of blockchain technology in various engineering domains.",
    attendees: "300+ Attended",
    status: "past",
    featured: false,
  },
  {
    title: "Green Computing Initiative",
    date: "July 10, 2024",
    location: "Copenhagen, Denmark",
    description: "Discussing sustainable practices and energy-efficient computing solutions.",
    attendees: "180+ Attended",
    status: "past",
    featured: false,
  },
]

export default function EventsPage() {
  const upcomingEvents = allEvents.filter((event) => event.status === "upcoming")
  const pastEvents = allEvents.filter((event) => event.status === "past")

  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">IACES Events</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Connect with fellow engineers, learn from industry experts, and showcase your innovations at our events
              worldwide.
            </p>
          </div>

          {/* Upcoming Events */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8">Upcoming Events</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event, index) => (
                <Card key={index} className="relative">
                  {event.featured && (
                    <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">Featured</Badge>
                  )}
                  <CardHeader>
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground text-sm leading-relaxed">{event.description}</p>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-2" />
                        {event.date}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-2" />
                        {event.location}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="w-4 h-4 mr-2" />
                        {event.attendees}
                      </div>
                    </div>

                    <Button className="w-full" size="sm">
                      Register Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Past Events */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-8">Past Events</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastEvents.map((event, index) => (
                <Card key={index} className="opacity-75">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        Past
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground text-sm leading-relaxed">{event.description}</p>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-2" />
                        {event.date}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-2" />
                        {event.location}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="w-4 h-4 mr-2" />
                        {event.attendees}
                      </div>
                    </div>

                    <Button variant="outline" className="w-full bg-transparent" size="sm">
                      View Summary
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  )
}

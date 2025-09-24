import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users } from "lucide-react"
import Link from "next/link"

const latestEvents = [
  {
    title: "Global Civil Engineering Summit 2024",
    date: "December 15-17, 2024",
    location: "Singapore",
    description:
      "Join leading experts and students for three days of cutting-edge research presentations, workshops, and networking opportunities in infrastructure and construction.",
    attendees: "500+ Expected",
  },
  {
    title: "Sustainable Construction Workshop",
    date: "November 8, 2024",
    location: "Virtual Event",
    description:
      "Hands-on workshop covering the latest developments in sustainable construction practices and green building technologies.",
    attendees: "200+ Registered",
  },
  {
    title: "Student Innovation Competition",
    date: "October 25, 2024",
    location: "MIT, Boston",
    description: "Annual competition showcasing innovative projects from civil engineering students worldwide.",
    attendees: "150+ Participants",
  },
]

export function EventsSection() {
  return (
    <section id="events" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Upcoming Events</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join us at our upcoming events to connect with fellow engineers, learn from industry experts, and showcase
            your innovations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestEvents.map((event, index) => (
            <Card key={index}>
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

        <div className="text-center mt-12">
          <Link href="/events">
            <Button variant="outline" size="lg">
              View All Events
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

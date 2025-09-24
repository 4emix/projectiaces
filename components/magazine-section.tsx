import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Download } from "lucide-react"
import Link from "next/link"

const magazineIssues = [
  {
    title: "The Future of Quantum Computing",
    description:
      "Exploring the latest developments in quantum computing and its implications for computer engineering.",
    issue: "Vol. 15, Issue 3",
    date: "September 2024",
    featured: true,
  },
  {
    title: "AI Ethics in Engineering Education",
    description: "Discussing the importance of ethical considerations in artificial intelligence curriculum.",
    issue: "Vol. 15, Issue 2",
    date: "June 2024",
    featured: false,
  },
  {
    title: "Sustainable Computing Practices",
    description: "How computer engineers can contribute to environmental sustainability through green computing.",
    issue: "Vol. 15, Issue 1",
    date: "March 2024",
    featured: false,
  },
]

export function MagazineSection() {
  return (
    <section id="magazine" className="py-20 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">IACES Publications</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Stay updated with the latest research, trends, and innovations in computer engineering through our quarterly
            magazine and monthly newsletters.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {magazineIssues.map((issue, index) => (
            <Card key={index} className="relative">
              {issue.featured && (
                <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">Featured</Badge>
              )}
              <CardHeader>
                <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-center p-4">
                    <div className="text-2xl font-bold text-foreground mb-2">{issue.issue}</div>
                    <div className="text-sm text-muted-foreground">IACES Magazine</div>
                  </div>
                </div>
                <CardTitle className="text-lg">{issue.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{issue.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-1" />
                    {issue.date}
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/magazines">
            <Button variant="outline" size="lg">
              View All Publications
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

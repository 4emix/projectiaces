import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Download, Eye, FileText } from "lucide-react"

const magazineIssues = [
  {
    title: "The Future of Quantum Computing",
    description:
      "Exploring the latest developments in quantum computing and its implications for computer engineering.",
    issue: "Vol. 15, Issue 3",
    date: "September 2024",
    featured: true,
    type: "magazine",
    downloads: "2.3k",
  },
  {
    title: "AI Ethics in Engineering Education",
    description: "Discussing the importance of ethical considerations in artificial intelligence curriculum.",
    issue: "Vol. 15, Issue 2",
    date: "June 2024",
    featured: false,
    type: "magazine",
    downloads: "1.8k",
  },
  {
    title: "Sustainable Computing Practices",
    description: "How computer engineers can contribute to environmental sustainability through green computing.",
    issue: "Vol. 15, Issue 1",
    date: "March 2024",
    featured: false,
    type: "magazine",
    downloads: "2.1k",
  },
  {
    title: "Monthly Newsletter - October 2024",
    description: "Latest updates from IACES committees, upcoming events, and member spotlights.",
    issue: "Newsletter #10",
    date: "October 2024",
    featured: false,
    type: "newsletter",
    downloads: "950",
  },
  {
    title: "Monthly Newsletter - September 2024",
    description: "Conference highlights, new partnerships, and student achievement recognitions.",
    issue: "Newsletter #9",
    date: "September 2024",
    featured: false,
    type: "newsletter",
    downloads: "1.1k",
  },
  {
    title: "Monthly Newsletter - August 2024",
    description: "Summer program results, research collaborations, and upcoming fall events.",
    issue: "Newsletter #8",
    date: "August 2024",
    featured: false,
    type: "newsletter",
    downloads: "890",
  },
]

export default function MagazinesPage() {
  const magazines = magazineIssues.filter((item) => item.type === "magazine")
  const newsletters = magazineIssues.filter((item) => item.type === "newsletter")

  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Publications</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Stay updated with the latest research, trends, and innovations in computer engineering through our
              quarterly magazine and monthly newsletters.
            </p>
          </div>

          {/* Magazine Issues */}
          <section className="mb-16">
            <div className="flex items-center mb-8">
              <FileText className="w-8 h-8 mr-3 text-primary" />
              <h2 className="text-3xl font-bold text-foreground">IACES Magazine</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {magazines.map((issue, index) => (
                <Card key={index} className="relative group hover:shadow-lg transition-shadow">
                  {issue.featured && (
                    <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground z-10">Featured</Badge>
                  )}
                  <CardHeader>
                    <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-4 flex items-center justify-center group-hover:from-primary/30 group-hover:to-accent/30 transition-colors">
                      <div className="text-center p-4">
                        <div className="text-2xl font-bold text-foreground mb-2">{issue.issue}</div>
                        <div className="text-sm text-muted-foreground">IACES Magazine</div>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{issue.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{issue.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-1" />
                        {issue.date}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Download className="w-4 h-4 mr-1" />
                        {issue.downloads}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Newsletters */}
          <section>
            <div className="flex items-center mb-8">
              <FileText className="w-8 h-8 mr-3 text-secondary-foreground" />
              <h2 className="text-3xl font-bold text-foreground">Monthly Newsletters</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {newsletters.map((newsletter, index) => (
                <Card key={index} className="group hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="aspect-[4/3] bg-gradient-to-br from-secondary/20 to-muted/20 rounded-lg mb-4 flex items-center justify-center group-hover:from-secondary/30 group-hover:to-muted/30 transition-colors">
                      <div className="text-center p-4">
                        <div className="text-xl font-bold text-foreground mb-2">{newsletter.issue}</div>
                        <div className="text-sm text-muted-foreground">IACES Newsletter</div>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{newsletter.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{newsletter.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-1" />
                        {newsletter.date}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Download className="w-4 h-4 mr-1" />
                        {newsletter.downloads}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Subscription CTA */}
          <div className="text-center mt-16 p-8 bg-primary/5 rounded-lg border border-primary/20">
            <h3 className="text-2xl font-bold text-foreground mb-4">Subscribe to Our Publications</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Get the latest issues delivered directly to your inbox. Stay informed about cutting-edge research,
              industry trends, and IACES community updates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">Subscribe to Magazine</Button>
              <Button size="lg" variant="outline">
                Subscribe to Newsletter
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

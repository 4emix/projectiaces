import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Download, Eye, FileText } from "lucide-react"

import { ContentService } from "@/lib/content-service"
import type { MagazineArticle } from "@/lib/types"

const formatPublicationDate = (value: string | null) => {
  if (!value) {
    return "Publication date coming soon"
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return value
  }

  return parsed.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
  })
}

const hasPdf = (article: MagazineArticle) => Boolean(article.pdf_url)

const DownloadButton = ({ article }: { article: MagazineArticle }) => {
  if (!hasPdf(article)) {
    return (
      <Button size="sm" variant="outline" className="flex-1" disabled>
        <Download className="w-4 h-4 mr-1" />
        PDF unavailable
      </Button>
    )
  }

  return (
    <Button size="sm" className="flex-1" asChild>
      <a href={article.pdf_url ?? "#"} target="_blank" rel="noopener noreferrer">
        <Download className="w-4 h-4 mr-1" />
        Download
      </a>
    </Button>
  )
}

const ViewButton = ({ article }: { article: MagazineArticle }) => {
  if (!hasPdf(article)) {
    return null
  }

  return (
    <Button size="sm" variant="outline" asChild>
      <a href={article.pdf_url ?? "#"} target="_blank" rel="noopener noreferrer">
        <Eye className="w-4 h-4" />
      </a>
    </Button>
  )
}

export default async function MagazinesPage() {
  const allArticles = await ContentService.getActiveMagazineArticles()
  const magazines = allArticles.filter((item) => item.publication_type === "magazine")
  const newsletters = allArticles.filter((item) => item.publication_type === "newsletter")

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
            {magazines.length === 0 ? (
              <div className="text-muted-foreground text-center py-12 border rounded-lg">
                No magazine publications are available yet. Check back soon!
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {magazines.map((issue) => (
                  <Card key={issue.id} className="relative group hover:shadow-lg transition-shadow">
                    {issue.is_featured && (
                      <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground z-10">Featured</Badge>
                    )}
                    <CardHeader>
                      <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-4 flex items-center justify-center group-hover:from-primary/30 group-hover:to-accent/30 transition-colors">
                        <div className="text-center p-4">
                          <div className="text-2xl font-bold text-foreground mb-2">
                            {issue.issue_number ?? "Issue pending"}
                          </div>
                          <div className="text-sm text-muted-foreground">IACES Magazine</div>
                        </div>
                      </div>
                      <CardTitle className="text-lg">{issue.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                        {issue.description ?? "Description coming soon."}
                      </p>
                      <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatPublicationDate(issue.publication_date)}
                        </div>
                        <Badge variant={issue.is_active ? "default" : "secondary"}>
                          {issue.is_active ? "Published" : "Draft"}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <DownloadButton article={issue} />
                        <ViewButton article={issue} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {/* Newsletters */}
          <section>
            <div className="flex items-center mb-8">
              <FileText className="w-8 h-8 mr-3 text-secondary-foreground" />
              <h2 className="text-3xl font-bold text-foreground">Monthly Newsletters</h2>
            </div>
            {newsletters.length === 0 ? (
              <div className="text-muted-foreground text-center py-12 border rounded-lg">
                No newsletters are available yet. Subscribe to get notified when new issues are released.
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {newsletters.map((newsletter) => (
                  <Card key={newsletter.id} className="group hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="aspect-[4/3] bg-gradient-to-br from-secondary/20 to-muted/20 rounded-lg mb-4 flex items-center justify-center group-hover:from-secondary/30 group-hover:to-muted/30 transition-colors">
                        <div className="text-center p-4">
                          <div className="text-xl font-bold text-foreground mb-2">
                            {newsletter.issue_number ?? "Newsletter"}
                          </div>
                          <div className="text-sm text-muted-foreground">IACES Newsletter</div>
                        </div>
                      </div>
                      <CardTitle className="text-lg">{newsletter.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                        {newsletter.description ?? "Description coming soon."}
                      </p>
                      <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatPublicationDate(newsletter.publication_date)}
                        </div>
                        <Badge variant={newsletter.is_active ? "default" : "secondary"}>
                          {newsletter.is_active ? "Published" : "Draft"}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <DownloadButton article={newsletter} />
                        <ViewButton article={newsletter} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
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

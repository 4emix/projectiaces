import Link from "next/link"
import { Calendar, Download, FileText } from "lucide-react"

import { ContentService } from "@/lib/content-service"
import type { MagazineArticle } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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

export async function MagazineSection() {
  const publications = await ContentService.getActiveMagazineArticles()
  const featuredPublications = publications
    .filter((publication) => publication.is_featured)
    .sort((a, b) => {
      const aDate = a.publication_date ? new Date(a.publication_date).getTime() : 0
      const bDate = b.publication_date ? new Date(b.publication_date).getTime() : 0
      return bDate - aDate
    })

  const spotlight = featuredPublications.length > 0 ? featuredPublications : publications.slice(0, 3)

  return (
    <section id="publications" className="py-20 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">IACES Publications</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Stay updated with the latest research, trends, and innovations in computer engineering through our quarterly
            magazine and monthly newsletters.
          </p>
        </div>

        {spotlight.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-background">
            <div className="flex items-center justify-center mb-4 text-primary">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No publications available yet</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Check back soon to explore featured magazines and newsletters from the IACES community.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {spotlight.map((publication) => {
              const isNewsletter = publication.publication_type === "newsletter"

              return (
                <Card key={publication.id} className="relative group hover:shadow-lg transition-shadow">
                  {publication.is_featured && (
                    <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">Featured</Badge>
                  )}
                  <CardHeader>
                    <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-4 flex items-center justify-center group-hover:from-primary/30 group-hover:to-accent/30 transition-colors">
                      <div className="text-center p-4">
                        <div className="text-2xl font-bold text-foreground mb-2">
                          {publication.issue_number ?? (isNewsletter ? "Newsletter" : "Issue pending")}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {isNewsletter ? "IACES Newsletter" : "IACES Magazine"}
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{publication.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                      {publication.description ?? "Description coming soon."}
                    </p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatPublicationDate(publication.publication_date)}
                      </div>
                      <Badge variant={isNewsletter ? "secondary" : "default"}>
                        {isNewsletter ? "Newsletter" : "Magazine"}
                      </Badge>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        variant={hasPdf(publication) ? "outline" : "ghost"}
                        disabled={!hasPdf(publication)}
                        asChild={hasPdf(publication)}
                      >
                        {hasPdf(publication) ? (
                          <a href={publication.pdf_url ?? "#"} target="_blank" rel="noopener noreferrer">
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </a>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-1" />
                            PDF unavailable
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

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

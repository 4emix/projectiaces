import { Card, CardContent } from "@/components/ui/card"

export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">About IACES</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            The International Association of Civil Engineering Students (IACES) is a global organization that brings
            together students, educators, and professionals in the field of civil engineering.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-foreground">Our Mission</h3>
            <p className="text-muted-foreground leading-relaxed">
              To connect and empower civil engineering students worldwide through education, collaboration, and
              professional development opportunities. We foster innovation and excellence in infrastructure education
              while building bridges between academic institutions and industry.
            </p>

            <h3 className="text-2xl font-semibold text-foreground">Our Vision</h3>
            <p className="text-muted-foreground leading-relaxed">
              To be the leading global platform for civil engineering students, driving innovation and excellence in
              infrastructure and construction education while preparing the next generation of engineers for the
              challenges of tomorrow.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-accent mb-2">50+</div>
                <div className="text-sm text-muted-foreground">Countries</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-accent mb-2">10K+</div>
                <div className="text-sm text-muted-foreground">Members</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-accent mb-2">200+</div>
                <div className="text-sm text-muted-foreground">Universities</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-accent mb-2">25</div>
                <div className="text-sm text-muted-foreground">Years</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold text-foreground mb-3">Education Excellence</h4>
              <p className="text-muted-foreground text-sm">
                Promoting high standards in civil engineering education through curriculum development, research
                collaboration, and knowledge sharing in infrastructure and construction.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold text-foreground mb-3">Global Networking</h4>
              <p className="text-muted-foreground text-sm">
                Connecting students, faculty, and professionals across continents to foster collaboration and cultural
                exchange in infrastructure and construction technology.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold text-foreground mb-3">Innovation Support</h4>
              <p className="text-muted-foreground text-sm">
                Supporting student innovation through competitions, grants, and mentorship programs that bridge academia
                and industry.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

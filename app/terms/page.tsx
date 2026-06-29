import type { Metadata } from "next"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Terms of Use — IACES",
  description: "The terms that govern your use of the IACES website.",
}

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <article className="mx-auto max-w-3xl px-4 pb-20 pt-28 sm:px-6 sm:pt-32 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Terms of Use</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: 29 June 2026</p>

        <div className="mt-8 max-w-none space-y-6 text-muted-foreground">
          <p>
            By accessing this website operated by the International Association of Civil Engineering Students
            (&ldquo;IACES&rdquo;), you agree to these Terms of Use. If you do not agree, please do not use the site.
          </p>

          <div>
            <h2 className="text-xl font-semibold text-foreground">Use of the site</h2>
            <p className="mt-2">
              The website and its content are provided for informational purposes about IACES, its committees, events and
              publications. You agree not to misuse the site, attempt to gain unauthorized access, or disrupt its
              operation.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground">Intellectual property</h2>
            <p className="mt-2">
              The IACES name, logo and original content on this site belong to IACES or its contributors and may not be
              reproduced without permission. Third-party logos and materials remain the property of their owners.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground">External links</h2>
            <p className="mt-2">
              The site may link to external pages (for example, committee social media). We are not responsible for the
              content, accuracy or practices of third-party websites.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground">Disclaimer &amp; liability</h2>
            <p className="mt-2">
              The site and its content are provided &ldquo;as is&rdquo; without warranties of any kind. Event details,
              dates and other information may change. To the extent permitted by law, IACES is not liable for any loss
              arising from use of, or reliance on, this website.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground">Governing law</h2>
            <p className="mt-2">These terms are governed by the laws of the Republic of Türkiye.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground">Contact</h2>
            <p className="mt-2">
              Questions about these terms?{" "}
              <a href="mailto:generalboard@iaces.info" className="text-accent hover:underline">
                generalboard@iaces.info
              </a>
            </p>
          </div>

          <p className="text-xs text-muted-foreground/80">
            This document is a general template provided for transparency and is not legal advice.
          </p>
        </div>
      </article>
      <Footer />
    </main>
  )
}

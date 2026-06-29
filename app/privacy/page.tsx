import type { Metadata } from "next"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Privacy Policy — IACES",
  description: "How IACES collects, uses and protects your personal data.",
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <article className="mx-auto max-w-3xl px-4 pb-20 pt-28 sm:px-6 sm:pt-32 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Privacy Policy</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: 29 June 2026</p>

        <div className="prose prose-slate mt-8 max-w-none space-y-6 text-muted-foreground">
          <p>
            This Privacy Policy explains how the International Association of Civil Engineering Students
            (&ldquo;IACES&rdquo;, &ldquo;we&rdquo;) processes personal data on this website. We act in line with the
            EU General Data Protection Regulation (GDPR) and the Turkish Personal Data Protection Law (KVKK&nbsp;6698).
          </p>

          <div>
            <h2 className="text-xl font-semibold text-foreground">Data we collect</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                <strong>Contact form:</strong> the name, email address and message you choose to send us.
              </li>
              <li>
                <strong>Usage analytics:</strong> the page visited, referring site, device type and a random,
                anonymous visitor identifier stored in your browser. We do <em>not</em> store your IP address or any
                directly identifying information for analytics.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground">Why we use it</h2>
            <p className="mt-2">
              We use contact data solely to respond to your enquiry, and aggregated analytics to understand and improve
              the website. We do not sell your data or use it for third-party advertising.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground">Storage &amp; retention</h2>
            <p className="mt-2">
              Data is stored on our infrastructure provider (Supabase / Vercel). Contact messages are kept only as long
              as needed to handle your request and are then deleted. Analytics records are retained in aggregate.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground">Cookies &amp; local storage</h2>
            <p className="mt-2">
              We use browser local storage for a single anonymous analytics identifier and essential session cookies for
              the administrator area. We do not use third-party advertising or tracking cookies.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground">Your rights</h2>
            <p className="mt-2">
              Under GDPR and KVKK you may request access to, correction of, or deletion of your personal data, and object
              to its processing. To exercise these rights, contact us at the address below.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground">Contact</h2>
            <p className="mt-2">
              For any privacy request, email{" "}
              <a href="mailto:generalboard@iaces.info" className="text-accent hover:underline">
                generalboard@iaces.info
              </a>
              .
            </p>
          </div>

          <p className="text-xs text-muted-foreground/80">
            This document is a general template provided for transparency and is not legal advice. Please have it
            reviewed by a qualified professional before relying on it.
          </p>
        </div>
      </article>
      <Footer />
    </main>
  )
}

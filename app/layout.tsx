import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"

import { SupabaseListener } from "@/components/auth/supabase-listener"
import { AnalyticsTracker } from "@/components/analytics-tracker"
import { ContentService } from "@/lib/content-service"

import "./globals.css"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await ContentService.getSiteSettings()
  const title = siteSettings.site_title ?? "IACES - International Association of Civil Engineering Students"
  const description =
    siteSettings.site_description ??
    "Connecting civil engineering students worldwide through education, collaboration, and professional development opportunities."

  return {
    title,
    description,
    generator: "v0.app",
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/iaces-favicon-64.png", type: "image/png", sizes: "64x64" },
      ],
      shortcut: "/favicon.ico",
      apple: "/iaces-favicon-64.png",
    },
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <SupabaseListener />
        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}

import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"

import { SupabaseListener } from "@/components/auth/supabase-listener"

import "./globals.css"

export const metadata: Metadata = {
  title: "IACES - International Association of Civil Engineering Students",
  description:
    "Connecting civil engineering students worldwide through education, collaboration, and professional development opportunities.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <SupabaseListener />
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}

"use client"

import dynamic from "next/dynamic"
import { Globe2 } from "lucide-react"

import { Reveal } from "@/components/reveal"

const LCMap = dynamic(() => import("@/components/lc-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[min(70vh,560px)] items-center justify-center rounded-2xl border border-border bg-secondary">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-accent" />
        <p className="mt-3 text-sm text-muted-foreground">Loading map…</p>
      </div>
    </div>
  ),
})

export function NetworkSection() {
  return (
    <section id="network" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-12 max-w-3xl">
          <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-accent">
            <Globe2 className="h-4 w-4" />
            Global Network
          </span>
          <h2 className="mt-4 text-4xl font-bold text-display text-foreground md:text-6xl">
            Where our committees are
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            From Lisbon to Khartoum, our local committees power a worldwide community of civil
            engineering students. Explore the map to find an IACES committee near you.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <LCMap />
        </Reveal>
      </div>
    </section>
  )
}

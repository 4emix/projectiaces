"use client"

import dynamic from "next/dynamic"

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

export function LCMapEmbed() {
  return <LCMap />
}

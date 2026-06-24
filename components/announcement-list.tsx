"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpRight, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Announcement } from "@/lib/types"

function pad(n: number) {
  return String(n).padStart(2, "0")
}

function formatDateTime(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ""
  return {
    date: `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`,
    time: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
  }
}

function isExternal(url: string) {
  return /^https?:\/\//i.test(url)
}

export function AnnouncementList({ announcements }: { announcements: Announcement[] }) {
  const [selected, setSelected] = useState<Announcement | null>(null)

  if (!announcements || announcements.length === 0) {
    return <p className="text-sm text-muted-foreground">No announcements yet.</p>
  }

  return (
    <>
      <ul className="divide-y divide-border border-y border-border">
        {announcements.map((a) => {
          const dt = formatDateTime(a.announced_at)
          return (
            <li key={a.id}>
              <button
                type="button"
                onClick={() => setSelected(a)}
                className="group flex w-full items-center justify-between gap-4 py-4 text-left transition-colors"
              >
                <span className="min-w-0">
                  <span className="block font-medium text-foreground transition-colors group-hover:text-accent">
                    {a.title}
                  </span>
                  {dt && (
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {dt.date} <span className="text-accent">{dt.time}</span>
                    </span>
                  )}
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
              </button>
            </li>
          )
        })}
      </ul>

      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selected.title}</DialogTitle>
                <DialogDescription>
                  {(() => {
                    const dt = formatDateTime(selected.announced_at)
                    return dt ? `${dt.date} ${dt.time}` : ""
                  })()}
                </DialogDescription>
              </DialogHeader>

              {selected.body && (
                <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{selected.body}</p>
              )}

              {selected.link_url && (
                <div className="pt-2">
                  <Button asChild>
                    <Link
                      href={selected.link_url}
                      {...(isExternal(selected.link_url)
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {selected.link_label?.trim() || "Open link"}
                      <ArrowUpRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

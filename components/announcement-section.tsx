import Link from "next/link"
import { Megaphone, ArrowRight } from "lucide-react"

import { ContentService } from "@/lib/content-service"
import { AnnouncementList } from "@/components/announcement-list"
import { Button } from "@/components/ui/button"

export async function AnnouncementSection() {
  let announcements = [] as Awaited<ReturnType<typeof ContentService.getActiveAnnouncements>>
  try {
    announcements = await ContentService.getActiveAnnouncements(5)
  } catch (error) {
    console.error("Error loading announcements:", error)
  }

  if (!announcements || announcements.length === 0) {
    return null
  }

  return (
    <section id="announcements" className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-foreground sm:text-3xl">
            <Megaphone className="h-6 w-6 text-accent" />
            Announcements
          </h2>
          <Button variant="ghost" size="sm" asChild className="shrink-0">
            <Link href="/announcements">
              View all
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <AnnouncementList announcements={announcements} />
      </div>
    </section>
  )
}

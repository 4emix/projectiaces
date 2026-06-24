import { Footer } from "@/components/footer"
import { Navigation } from "@/components/navigation"
import { AnnouncementList } from "@/components/announcement-list"
import { ContentService } from "@/lib/content-service"

export const revalidate = 60

export default async function AnnouncementsPage() {
  let announcements = [] as Awaited<ReturnType<typeof ContentService.getActiveAnnouncements>>
  try {
    announcements = await ContentService.getActiveAnnouncements()
  } catch (error) {
    console.error("Error loading announcements:", error)
  }

  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="pt-28 pb-20 sm:pt-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">Announcements</h1>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
              All the latest news and updates from IACES. Click any item to read the details.
            </p>
          </div>

          <AnnouncementList announcements={announcements} />
        </div>
      </div>

      <Footer />
    </main>
  )
}

import { Suspense } from "react"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { AdminNavigation } from "@/components/admin/admin-navigation"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/40 to-background">
      <AdminNavigation />
      <main className="pt-24 pb-12">
        <Suspense
          fallback={
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <div className="rounded-3xl border border-border/60 bg-card/60 p-8 text-center text-muted-foreground shadow-sm">
                Loading...
              </div>
            </div>
          }
        >
          <AdminDashboard />
        </Suspense>
      </main>
    </div>
  )
}

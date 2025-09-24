import { Suspense } from "react"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { AdminNavigation } from "@/components/admin/admin-navigation"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background">
      <AdminNavigation />
      <main className="pt-16">
        <Suspense fallback={<div className="p-8">Loading...</div>}>
          <AdminDashboard />
        </Suspense>
      </main>
    </div>
  )
}

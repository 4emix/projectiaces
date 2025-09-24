import type React from "react"
import { AuthGuard } from "@/components/auth/auth-guard"

export const dynamic = "force-dynamic"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthGuard>{children}</AuthGuard>
}

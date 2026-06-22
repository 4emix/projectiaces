"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import clsx from "clsx"
import { Button } from "@/components/ui/button"
import { BrandLogo } from "@/components/brand-logo"
import { UserMenu } from "@/components/auth/user-menu"
import { Menu, X, Home, Settings, Users, FileText, Calendar, BarChart3 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export function AdminNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const navItems = [
    { href: "/admin", icon: BarChart3, label: "Dashboard" },
    { href: "/admin/hero", icon: Home, label: "Hero" },
    { href: "/admin/about", icon: FileText, label: "About" },
    { href: "/admin/board", icon: Users, label: "Board" },
    { href: "/admin/magazine", icon: FileText, label: "Magazine" },
    { href: "/admin/events", icon: Calendar, label: "Events" },
    { href: "/admin/settings", icon: Settings, label: "Settings" },
  ]

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-border/60 bg-card/80 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link href="/admin" className="group flex items-center gap-3" aria-label="IACES Admin">
            <BrandLogo className="transition-transform duration-200 group-hover:scale-105" />
            <span className="hidden text-base font-semibold leading-tight text-foreground sm:block">Admin Hub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center justify-center md:flex">
            <div className="flex items-center space-x-2 rounded-full border border-border/50 bg-background/80 p-1 shadow-inner">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={clsx(
                      "flex items-center space-x-2 rounded-full px-4 py-2 text-sm font-medium transition-all",
                      isActive
                        ? "bg-accent text-accent-foreground shadow"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="hidden items-center space-x-2 md:flex">
            <Button variant="outline" className="rounded-full" asChild>
              <Link href="/">View Site</Link>
            </Button>
            <Button
              variant="ghost"
              className="rounded-full"
              onClick={handleSignOut}
            >
              Log out
            </Button>
            <UserMenu />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="mt-3 space-y-2 rounded-2xl border border-border/60 bg-card/95 p-3 shadow-lg">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={clsx(
                      "flex items-center space-x-3 rounded-xl px-3 py-2 text-sm font-medium transition",
                      isActive
                        ? "bg-accent/10 text-accent"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-background/80 shadow-inner">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span>{item.label}</span>
                  </Link>
                )
              })}
              <div className="flex items-center justify-between space-x-2 rounded-xl bg-background/80 p-2">
                <Button variant="outline" size="sm" className="flex-1 rounded-full" asChild>
                  <Link href="/">View Site</Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full"
                  onClick={handleSignOut}
                >
                  Log out
                </Button>
                <UserMenu />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserMenu } from "@/components/auth/user-menu"
import { Menu, X, Home, Settings, Users, FileText, Calendar, Mail, BarChart3 } from "lucide-react"

export function AdminNavigation() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: "/admin", icon: BarChart3, label: "Dashboard" },
    { href: "/admin/hero", icon: Home, label: "Hero Section" },
    { href: "/admin/about", icon: FileText, label: "About" },
    { href: "/admin/board", icon: Users, label: "Board Members" },
    { href: "/admin/magazine", icon: FileText, label: "Magazine" },
    { href: "/admin/events", icon: Calendar, label: "Events" },
    { href: "/admin/contact", icon: Mail, label: "Contact Info" },
    { href: "/admin/settings", icon: Settings, label: "Settings" },
  ]

  return (
    <nav className="fixed top-0 w-full z-50 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/admin" className="text-xl font-bold text-foreground">
              IACES Admin
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md text-sm"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-2">
            <Button variant="outline" asChild>
              <Link href="/">View Site</Link>
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
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-card border border-border rounded-lg mt-2">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-2 px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
              <div className="flex items-center space-x-2 px-3 py-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/">View Site</Link>
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

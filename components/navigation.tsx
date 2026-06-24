"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BrandLogo } from "@/components/brand-logo"
import { UserMenu } from "@/components/auth/user-menu"
import { Menu, X } from "lucide-react"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center" aria-label="IACES home">
              <BrandLogo />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="/#about" className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors">
                About
              </Link>
              <Link href="/#board" className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors">
                Board
              </Link>
              <Link href="/committees" className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors">
                Committees
              </Link>
              <Link href="/magazines" className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors">
                Publications
              </Link>
              <Link href="/events" className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors">
                Events
              </Link>
              <Link href="/announcements" className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors">
                Announcements
              </Link>
              <Link href="/#contact" className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors">
                Contact
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Button size="sm" asChild>
              <Link href="/#contact">Join Us</Link>
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
              <Link
                href="/#about"
                className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link
                href="/#board"
                className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Board
              </Link>
              <Link
                href="/committees"
                className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Committees
              </Link>
              <Link
                href="/magazines"
                className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Publications
              </Link>
              <Link
                href="/events"
                className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Events
              </Link>
              <Link
                href="/announcements"
                className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Announcements
              </Link>
              <Link
                href="/#contact"
                className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              <div className="px-3 py-2">
                <UserMenu />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

import Link from "next/link"
import { Linkedin, Twitter, Mail } from "lucide-react"

import { ContentService } from "@/lib/content-service"

export async function Footer() {
  const siteSettings = await ContentService.getSiteSettings()
  const siteTitle = siteSettings.site_title ?? "IACES"
  const siteDescription =
    siteSettings.site_description ??
    "International Association of Civil Engineering Students - Connecting future engineers worldwide."
  const contactEmail = siteSettings.contact_email ?? "info@iaces.network"
  const contactAddress = siteSettings.contact_address ?? "123 Technology Drive\nInnovation City, IC 12345"

  const socialLinks = [
    { href: siteSettings.social_twitter, icon: Twitter },
    { href: siteSettings.social_linkedin, icon: Linkedin },
    { href: contactEmail ? `mailto:${contactEmail}` : null, icon: Mail },
  ].filter((link) => typeof link.href === "string" && link.href.trim().length > 0) as {
    href: string
    icon: typeof Twitter
  }[]

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{siteTitle}</h3>
            <p className="text-sm text-primary-foreground/80">{siteDescription}</p>
            {socialLinks.length > 0 && (
              <div className="flex space-x-4">
                {socialLinks.map(({ href, icon: Icon }) => (
                  <Link key={href} href={href} className="text-primary-foreground/80 hover:text-primary-foreground">
                    <Icon className="w-5 h-5" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Quick Links</h4>
            <div className="space-y-2 text-sm">
              <Link href="#about" className="block text-primary-foreground/80 hover:text-primary-foreground">
                About Us
              </Link>
              <Link href="#board" className="block text-primary-foreground/80 hover:text-primary-foreground">
                Board of Directors
              </Link>
              <Link href="#magazine" className="block text-primary-foreground/80 hover:text-primary-foreground">
                Magazine
              </Link>
              <Link href="#events" className="block text-primary-foreground/80 hover:text-primary-foreground">
                Events
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Resources</h4>
            <div className="space-y-2 text-sm">
              <Link href="#" className="block text-primary-foreground/80 hover:text-primary-foreground">
                Membership
              </Link>
              <Link href="#" className="block text-primary-foreground/80 hover:text-primary-foreground">
                Publications
              </Link>
              <Link href="#" className="block text-primary-foreground/80 hover:text-primary-foreground">
                Research
              </Link>
              <Link href="#" className="block text-primary-foreground/80 hover:text-primary-foreground">
                Careers
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Contact</h4>
            <div className="space-y-2 text-sm text-primary-foreground/80">
              <p className="whitespace-pre-line">{contactAddress}</p>
              <p>{contactEmail}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/80">
          <p>
            &copy; 2025 {siteTitle}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

import Link from "next/link"
import { Linkedin, Twitter, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">IACES</h3>
            <p className="text-sm text-primary-foreground/80">
              International Association of Civil Engineering Students - Connecting future engineers worldwide.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-primary-foreground/80 hover:text-primary-foreground">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-primary-foreground/80 hover:text-primary-foreground">
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-primary-foreground/80 hover:text-primary-foreground">
                <Mail className="w-5 h-5" />
              </Link>
            </div>
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
              <p>123 Technology Drive</p>
              <p>Innovation City, IC 12345</p>
              <p>info@iaces.network</p>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/80">
          <p>&copy; 2025 International Association of Civil Engineering Students. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

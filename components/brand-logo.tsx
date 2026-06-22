import { cn } from "@/lib/utils"

interface BrandLogoProps {
  className?: string
}

// Original IACES logo, recolored to navy via a CSS mask.
// The mask uses the PNG's alpha channel, so the result is solid navy
// regardless of the source logo's own colors (works for the white logo).
export function BrandLogo({ className }: BrandLogoProps) {
  return (
    <span
      role="img"
      aria-label="IACES"
      className={cn("block h-10 w-[108px] bg-primary", className)}
      style={{
        WebkitMaskImage: "url(/iaces-logo.png)",
        maskImage: "url(/iaces-logo.png)",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskPosition: "left center",
        maskPosition: "left center",
      }}
    />
  )
}

import { cn } from "@/lib/utils"

interface BrandLogoProps {
  className?: string
  /** Hide the wordmark, show only the mark. */
  iconOnly?: boolean
}

// Navy IACES lockup — bridge "A" mark (from the favicon) + wordmark, all in navy.
export function BrandLogo({ className, iconOnly = false }: BrandLogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 text-primary", className)}>
      <svg viewBox="0 0 40 41" className="h-9 w-auto" fill="currentColor" aria-hidden="true">
        <path d="M7.839 40.783 23.869 12.729 20 6 0 40.783h7.839Z" />
        <path d="M16.053 40.783H40L27.99 19.894l-4.02 7.032 3.976 6.914H20.02l-3.967 6.943Z" />
      </svg>
      {!iconOnly && (
        <span className="flex flex-col leading-none">
          <span className="text-xl font-bold tracking-tight">IACES</span>
          <span className="text-[8.5px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Civil Engineering Students
          </span>
        </span>
      )}
    </span>
  )
}

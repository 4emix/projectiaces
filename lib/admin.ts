// Admin authorization allowlist.
//
// The app currently treats "any authenticated Supabase user" as an admin.
// Set the ADMIN_EMAILS env var (comma-separated) to restrict admin access to
// specific accounts. If ADMIN_EMAILS is not set, this returns true so an
// unconfigured deployment never locks the legitimate owner out — but you
// SHOULD set it (and disable public sign-ups in Supabase) before launch.

export function isAdminEmail(email: string | null | undefined): boolean {
  const raw = process.env.ADMIN_EMAILS
  if (!raw || !raw.trim()) {
    if (process.env.NODE_ENV === "production") {
      console.warn("ADMIN_EMAILS is not set — every authenticated user is treated as an admin.")
    }
    return true
  }
  if (!email) return false
  const allow = raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
  return allow.includes(email.toLowerCase())
}

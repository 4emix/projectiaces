import { NextResponse, type NextRequest } from "next/server"
import { revalidatePath, unstable_noStore as noStore } from "next/cache"

import { ContentService } from "@/lib/content-service"
import { fallbackSiteSettings } from "@/lib/fallback-data"
import { createClient, createServiceRoleClient, isSupabaseConfigured } from "@/lib/supabase/server"

const DEFAULT_SETTINGS = {
  site_title: fallbackSiteSettings.site_title,
  site_description: fallbackSiteSettings.site_description,
  contact_email: fallbackSiteSettings.contact_email,
  contact_address: fallbackSiteSettings.contact_address,
  social_facebook: fallbackSiteSettings.social_facebook,
  social_twitter: fallbackSiteSettings.social_twitter,
  social_linkedin: fallbackSiteSettings.social_linkedin,
  maintenance_mode: fallbackSiteSettings.maintenance_mode === "true",
  allow_registrations: fallbackSiteSettings.allow_registrations === "true",
  enable_analytics: fallbackSiteSettings.enable_analytics === "true",
}

type SiteSettingsResponse = typeof DEFAULT_SETTINGS

type SiteSettingsPayload = {
  siteTitle: unknown
  siteDescription: unknown
  contactEmail: unknown
  contactAddress: unknown
  socialFacebook: unknown
  socialTwitter: unknown
  socialLinkedin: unknown
  maintenanceMode: unknown
  allowRegistrations: unknown
  enableAnalytics: unknown
}

function toBoolean(value: unknown, defaultValue: boolean): boolean {
  if (typeof value === "boolean") {
    return value
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase()
    if (["true", "1", "yes", "on"].includes(normalized)) {
      return true
    }
    if (["false", "0", "no", "off"].includes(normalized)) {
      return false
    }
  }

  return defaultValue
}

function toNullableString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null
  }
  const trimmed = value.trim()
  return trimmed.length === 0 ? null : trimmed
}

async function readSiteSettings(): Promise<SiteSettingsResponse> {
  const rawSettings = await ContentService.getSiteSettings()

  return {
    site_title: rawSettings.site_title ?? DEFAULT_SETTINGS.site_title,
    site_description: rawSettings.site_description ?? DEFAULT_SETTINGS.site_description,
    contact_email: rawSettings.contact_email ?? DEFAULT_SETTINGS.contact_email,
    contact_address: rawSettings.contact_address ?? DEFAULT_SETTINGS.contact_address,
    social_facebook: rawSettings.social_facebook ?? DEFAULT_SETTINGS.social_facebook,
    social_twitter: rawSettings.social_twitter ?? DEFAULT_SETTINGS.social_twitter,
    social_linkedin: rawSettings.social_linkedin ?? DEFAULT_SETTINGS.social_linkedin,
    maintenance_mode: toBoolean(rawSettings.maintenance_mode, DEFAULT_SETTINGS.maintenance_mode),
    allow_registrations: toBoolean(rawSettings.allow_registrations, DEFAULT_SETTINGS.allow_registrations),
    enable_analytics: toBoolean(rawSettings.enable_analytics, DEFAULT_SETTINGS.enable_analytics),
  }
}

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    noStore()
    const settings = await readSiteSettings()
    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error loading site settings:", error)
    return NextResponse.json({ error: "Failed to load site settings" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    noStore()
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 })
    }

    const supabase = await createClient()
    const writer = createServiceRoleClient() ?? supabase
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = (await request.json()) as SiteSettingsPayload

    const siteTitle = toNullableString(body.siteTitle)
    if (!siteTitle) {
      return NextResponse.json({ error: "Site title is required" }, { status: 400 })
    }

    const siteDescription = toNullableString(body.siteDescription)
    const contactEmail = toNullableString(body.contactEmail)
    const contactAddress = toNullableString(body.contactAddress)
    const socialFacebook = toNullableString(body.socialFacebook)
    const socialTwitter = toNullableString(body.socialTwitter)
    const socialLinkedin = toNullableString(body.socialLinkedin)

    const maintenanceMode = toBoolean(body.maintenanceMode, DEFAULT_SETTINGS.maintenance_mode)
    const allowRegistrations = toBoolean(body.allowRegistrations, DEFAULT_SETTINGS.allow_registrations)
    const enableAnalytics = toBoolean(body.enableAnalytics, DEFAULT_SETTINGS.enable_analytics)

    const updates = [
      { key: "site_title", value: siteTitle },
      { key: "site_description", value: siteDescription },
      { key: "contact_email", value: contactEmail },
      { key: "contact_address", value: contactAddress },
      { key: "social_facebook", value: socialFacebook },
      { key: "social_twitter", value: socialTwitter },
      { key: "social_linkedin", value: socialLinkedin },
      { key: "maintenance_mode", value: maintenanceMode ? "true" : "false" },
      { key: "allow_registrations", value: allowRegistrations ? "true" : "false" },
      { key: "enable_analytics", value: enableAnalytics ? "true" : "false" },
    ].map((setting) => ({
      ...setting,
      user_id: user.id,
      updated_at: new Date().toISOString(),
    }))

    const { error } = await writer.from("site_settings").upsert(updates, { onConflict: "key" })

    if (error) {
      console.error("Error updating site settings:", error)
      return NextResponse.json({ error: "Failed to save site settings" }, { status: 500 })
    }

    revalidatePath("/", "layout")
    revalidatePath("/")

    const updatedSettings = await readSiteSettings()
    return NextResponse.json(updatedSettings)
  } catch (error) {
    console.error("Error saving site settings:", error)
    return NextResponse.json({ error: "Failed to save site settings" }, { status: 500 })
  }
}

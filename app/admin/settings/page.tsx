"use client"

import { useEffect, useState } from "react"
import { ContentEditor, TextField, TextAreaField, SwitchField } from "@/components/admin/content-editor"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { isSupabaseEnvConfigured } from "@/lib/supabase/config"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface AdminSiteSettings {
  siteTitle: string
  siteDescription: string
  contactEmail: string
  contactAddress: string
  socialFacebook: string
  socialTwitter: string
  socialLinkedin: string
  maintenanceMode: boolean
  allowRegistrations: boolean
  enableAnalytics: boolean
}

const DEFAULT_SETTINGS: AdminSiteSettings = {
  siteTitle: "IACES - International Association of Civil Engineering Students",
  siteDescription: "Connecting civil engineering students worldwide",
  contactEmail: "info@iaces.network",
  contactAddress: "123 Technology Drive, Innovation City, IC 12345",
  socialFacebook: "https://facebook.com/iaces",
  socialTwitter: "https://twitter.com/iaces",
  socialLinkedin: "https://linkedin.com/company/iaces",
  maintenanceMode: false,
  allowRegistrations: true,
  enableAnalytics: true,
}

export default function SettingsAdminPage() {
  const [siteSettings, setSiteSettings] = useState<AdminSiteSettings>(() => ({ ...DEFAULT_SETTINGS }))
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()
  const isSupabaseConfigured = isSupabaseEnvConfigured()

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/settings")
        if (!response.ok) {
          throw new Error(`Failed to load settings: ${response.status}`)
        }

        const data = await response.json()
        setSiteSettings({
          siteTitle: data.site_title ?? DEFAULT_SETTINGS.siteTitle,
          siteDescription: data.site_description ?? DEFAULT_SETTINGS.siteDescription,
          contactEmail: data.contact_email ?? DEFAULT_SETTINGS.contactEmail,
          contactAddress: data.contact_address ?? DEFAULT_SETTINGS.contactAddress,
          socialFacebook: data.social_facebook ?? DEFAULT_SETTINGS.socialFacebook,
          socialTwitter: data.social_twitter ?? DEFAULT_SETTINGS.socialTwitter,
          socialLinkedin: data.social_linkedin ?? DEFAULT_SETTINGS.socialLinkedin,
          maintenanceMode: Boolean(data.maintenance_mode),
          allowRegistrations: Boolean(data.allow_registrations),
          enableAnalytics: Boolean(data.enable_analytics),
        })
      } catch (error) {
        console.error("Error loading site settings:", error)
        toast({
          title: "Failed to load settings",
          description: "Showing fallback values. Please try again later.",
          variant: "destructive",
        })
        setSiteSettings({ ...DEFAULT_SETTINGS })
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [toast])

  const handleSave = async () => {
    if (!siteSettings.siteTitle || !siteSettings.siteTitle.trim()) {
      toast({
        title: "Site title is required",
        description: "Please provide a title for your website before saving.",
        variant: "destructive",
      })
      return
    }

    if (!isSupabaseConfigured) {
      toast({
        title: "Supabase configuration required",
        description: "Connect Supabase to enable saving settings.",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          siteTitle: siteSettings.siteTitle,
          siteDescription: siteSettings.siteDescription,
          contactEmail: siteSettings.contactEmail,
          contactAddress: siteSettings.contactAddress,
          socialFacebook: siteSettings.socialFacebook,
          socialTwitter: siteSettings.socialTwitter,
          socialLinkedin: siteSettings.socialLinkedin,
          maintenanceMode: siteSettings.maintenanceMode,
          allowRegistrations: siteSettings.allowRegistrations,
          enableAnalytics: siteSettings.enableAnalytics,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        toast({
          title: "Error saving settings",
          description: errorData?.error ?? "We couldn't save your settings. Please try again.",
          variant: "destructive",
        })
        return
      }

      const data = await response.json()
      setSiteSettings({
        siteTitle: data.site_title ?? siteSettings.siteTitle,
        siteDescription: data.site_description ?? siteSettings.siteDescription,
        contactEmail: data.contact_email ?? siteSettings.contactEmail,
        contactAddress: data.contact_address ?? siteSettings.contactAddress,
        socialFacebook: data.social_facebook ?? siteSettings.socialFacebook,
        socialTwitter: data.social_twitter ?? siteSettings.socialTwitter,
        socialLinkedin: data.social_linkedin ?? siteSettings.socialLinkedin,
        maintenanceMode: Boolean(data.maintenance_mode),
        allowRegistrations: Boolean(data.allow_registrations),
        enableAnalytics: Boolean(data.enable_analytics),
      })

      toast({
        title: "Settings saved",
        description: "Your configuration changes have been stored.",
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: "We couldn't save your settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading site settings...</p>
        </div>
      </div>
    )
  }

  return (
    <ContentEditor
      title="Site Settings"
      backUrl="/admin"
      onSave={handleSave}
      isSaving={saving}
      saveDisabled={!isSupabaseConfigured}
      saveLabel="Save Settings"
      description="Configure global preferences, contact details, and system behaviour."
    >
      <div className="space-y-8">
        {!isSupabaseConfigured && (
          <Alert variant="destructive">
            <AlertTitle>Editing is temporarily disabled</AlertTitle>
            <AlertDescription>
              Supabase credentials are not configured. The settings shown below are fallback values and cannot be saved until
              Supabase is connected.
            </AlertDescription>
          </Alert>
        )}

        {/* General Settings */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">General Settings</h3>
          <div className="space-y-4">
            <TextField
              label="Site Title"
              value={siteSettings.siteTitle}
              onChange={(value) => setSiteSettings((prev) => ({ ...prev, siteTitle: value }))}
              placeholder="Enter site title"
              description="The main title of your website"
              required
            />

            <TextAreaField
              label="Site Description"
              value={siteSettings.siteDescription}
              onChange={(value) => setSiteSettings((prev) => ({ ...prev, siteDescription: value }))}
              placeholder="Enter site description"
              description="Brief description used in meta tags and search results"
              rows={3}
            />
          </div>
        </div>

        <Separator />

        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Contact Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <TextField
              label="Contact Email"
              value={siteSettings.contactEmail}
              onChange={(value) => setSiteSettings((prev) => ({ ...prev, contactEmail: value }))}
              placeholder="info@example.com"
              description="Primary contact email address"
            />

            <div className="md:col-span-2">
              <TextAreaField
                label="Address"
                value={siteSettings.contactAddress}
                onChange={(value) => setSiteSettings((prev) => ({ ...prev, contactAddress: value }))}
                placeholder="Enter full address"
                description="Physical address of the organization"
                rows={2}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Social Media Links</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <TextField
              label="Facebook URL"
              value={siteSettings.socialFacebook}
              onChange={(value) => setSiteSettings((prev) => ({ ...prev, socialFacebook: value }))}
              placeholder="https://facebook.com/yourpage"
              description="Link to Facebook page"
            />

            <TextField
              label="Twitter URL"
              value={siteSettings.socialTwitter}
              onChange={(value) => setSiteSettings((prev) => ({ ...prev, socialTwitter: value }))}
              placeholder="https://twitter.com/yourhandle"
              description="Link to Twitter profile"
            />

            <TextField
              label="LinkedIn URL"
              value={siteSettings.socialLinkedin}
              onChange={(value) => setSiteSettings((prev) => ({ ...prev, socialLinkedin: value }))}
              placeholder="https://linkedin.com/company/yourcompany"
              description="Link to LinkedIn company page"
            />
          </div>
        </div>

        <Separator />

        {/* System Settings */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">System Settings</h3>
          <div className="space-y-4">
            <SwitchField
              label="Maintenance Mode"
              checked={siteSettings.maintenanceMode}
              onChange={(checked) => setSiteSettings((prev) => ({ ...prev, maintenanceMode: checked }))}
              description="Enable to show maintenance page to visitors"
            />

            <SwitchField
              label="Allow Registrations"
              checked={siteSettings.allowRegistrations}
              onChange={(checked) => setSiteSettings((prev) => ({ ...prev, allowRegistrations: checked }))}
              description="Allow new user registrations"
            />

            <SwitchField
              label="Enable Analytics"
              checked={siteSettings.enableAnalytics}
              onChange={(checked) => setSiteSettings((prev) => ({ ...prev, enableAnalytics: checked }))}
              description="Enable website analytics tracking"
            />
          </div>
        </div>
      </div>
    </ContentEditor>
  )
}

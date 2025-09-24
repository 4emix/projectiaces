"use client"

import { useState } from "react"
import { ContentEditor, TextField, TextAreaField, SwitchField } from "@/components/admin/content-editor"
import { Separator } from "@/components/ui/separator"

export default function SettingsAdminPage() {
  const [siteSettings, setSiteSettings] = useState({
    siteTitle: "IACES - International Association of Computer Engineering Students",
    siteDescription: "Connecting computer engineering students worldwide",
    contactEmail: "info@iaces.network",
    contactPhone: "+1 (555) 123-4567",
    address: "123 Technology Drive, Innovation City, IC 12345",
    officeHours: "Monday - Friday: 9:00 AM - 5:00 PM EST",
    socialFacebook: "https://facebook.com/iaces",
    socialTwitter: "https://twitter.com/iaces",
    socialLinkedin: "https://linkedin.com/company/iaces",
    socialGithub: "https://github.com/iaces",
    maintenanceMode: false,
    allowRegistrations: true,
    enableAnalytics: true,
  })

  const handleSave = () => {
    console.log("Saving site settings:", siteSettings)
    // TODO: Implement save functionality
  }

  return (
    <ContentEditor title="Site Settings" backUrl="/admin" onSave={handleSave}>
      <div className="space-y-8">
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

            <TextField
              label="Contact Phone"
              value={siteSettings.contactPhone}
              onChange={(value) => setSiteSettings((prev) => ({ ...prev, contactPhone: value }))}
              placeholder="+1 (555) 123-4567"
              description="Primary contact phone number"
            />

            <div className="md:col-span-2">
              <TextAreaField
                label="Address"
                value={siteSettings.address}
                onChange={(value) => setSiteSettings((prev) => ({ ...prev, address: value }))}
                placeholder="Enter full address"
                description="Physical address of the organization"
                rows={2}
              />
            </div>

            <div className="md:col-span-2">
              <TextField
                label="Office Hours"
                value={siteSettings.officeHours}
                onChange={(value) => setSiteSettings((prev) => ({ ...prev, officeHours: value }))}
                placeholder="Monday - Friday: 9:00 AM - 5:00 PM EST"
                description="Business hours for contact"
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

            <TextField
              label="GitHub URL"
              value={siteSettings.socialGithub}
              onChange={(value) => setSiteSettings((prev) => ({ ...prev, socialGithub: value }))}
              placeholder="https://github.com/yourorg"
              description="Link to GitHub organization"
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

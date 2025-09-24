"use client"

import type React from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Eye, Loader2, Save } from "lucide-react"

interface ContentEditorProps {
  title: string
  backUrl: string
  children: React.ReactNode
  description?: string
  onSave?: () => void | Promise<void>
  onPreview?: () => void
  extraActions?: React.ReactNode
  isSaving?: boolean
  saveLabel?: string
  saveDisabled?: boolean
}

export function ContentEditor({
  title,
  backUrl,
  children,
  description,
  onSave,
  onPreview,
  extraActions,
  isSaving = false,
  saveLabel = "Save changes",
  saveDisabled = false,
}: ContentEditorProps) {
  const hasActions = Boolean(onSave || onPreview || extraActions)

  return (
    <div className="space-y-6 p-6 sm:p-8 lg:p-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href={backUrl}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-foreground lg:text-3xl">{title}</h1>
            <p className="text-sm text-muted-foreground lg:text-base">
              {description ?? "Update content, configure settings, and publish changes."}
            </p>
          </div>
        </div>

        {hasActions && (
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
            {extraActions}
            {onPreview && (
              <Button
                type="button"
                variant="outline"
                onClick={onPreview}
                disabled={isSaving}
                className="justify-center"
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
            )}
            {onSave && (
              <Button
                type="button"
                onClick={onSave}
                disabled={isSaving || saveDisabled}
                className="min-w-[160px]"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {saveLabel}
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </div>

      <Card className="border-border/70 shadow-sm">
        <CardContent className="p-6 sm:p-8">{children}</CardContent>
      </Card>

      {hasActions && onSave && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/75 lg:hidden">
          <div className="mx-auto flex max-w-3xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
            {onPreview && (
              <Button
                type="button"
                variant="outline"
                onClick={onPreview}
                disabled={isSaving}
                className="justify-center"
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
            )}
            <Button
              type="button"
              onClick={onSave}
              disabled={isSaving || saveDisabled}
              className="w-full sm:w-auto"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {saveLabel}
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

interface FormFieldProps {
  label: string
  children: React.ReactNode
  description?: string
}

export function FormField({ label, children, description }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      {children}
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </div>
  )
}

interface TextFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  description?: string
  required?: boolean
}

export function TextField({ label, value, onChange, placeholder, description, required }: TextFieldProps) {
  return (
    <FormField label={label} description={description}>
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} />
    </FormField>
  )
}

interface TextAreaFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  description?: string
  rows?: number
  required?: boolean
}

export function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  description,
  rows = 4,
  required,
}: TextAreaFieldProps) {
  return (
    <FormField label={label} description={description}>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        required={required}
      />
    </FormField>
  )
}

interface SwitchFieldProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  description?: string
}

export function SwitchField({ label, checked, onChange, description }: SwitchFieldProps) {
  return (
    <FormField label={label} description={description}>
      <Switch checked={checked} onCheckedChange={onChange} />
    </FormField>
  )
}

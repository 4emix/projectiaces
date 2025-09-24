"use client"

import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Eye, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface ContentEditorProps {
  title: string
  backUrl: string
  children: React.ReactNode
  onPreview?: () => void
}

export function ContentEditor({ title, backUrl, children, onPreview }: ContentEditorProps) {
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link href={backUrl}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            <p className="text-muted-foreground">Edit content and settings</p>
          </div>
        </div>
        {onPreview && (
          <Button variant="outline" onClick={onPreview}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-6">{children}</CardContent>
      </Card>
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

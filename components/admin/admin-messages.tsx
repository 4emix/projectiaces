"use client"

import { useEffect, useState } from "react"
import { Mail, MailOpen, Trash2, RefreshCw, Inbox } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type ContactMessage = {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  is_read: boolean
  created_at: string
}

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime()
  if (!Number.isFinite(then)) return ""
  const seconds = Math.max(0, (Date.now() - then) / 1000)
  if (seconds < 3600) return `${Math.max(1, Math.round(seconds / 60))}m ago`
  if (seconds < 86400) return `${Math.round(seconds / 3600)}h ago`
  const days = Math.round(seconds / 86400)
  if (days < 30) return `${days}d ago`
  return new Date(iso).toLocaleDateString()
}

export function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/contact/messages")
      if (!res.ok) {
        setError(res.status === 401 ? "Please sign in to view messages." : "Failed to load messages.")
        setMessages([])
        return
      }
      const data = await res.json()
      setMessages(Array.isArray(data) ? data : [])
    } catch {
      setError("Network error while loading messages.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const toggleRead = async (msg: ContactMessage) => {
    setBusyId(msg.id)
    try {
      const res = await fetch(`/api/contact/messages/${msg.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_read: !msg.is_read }),
      })
      if (res.ok) {
        setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, is_read: !m.is_read } : m)))
      }
    } finally {
      setBusyId(null)
    }
  }

  const remove = async (id: string) => {
    setBusyId(id)
    try {
      const res = await fetch(`/api/contact/messages/${id}`, { method: "DELETE" })
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id))
      }
    } finally {
      setBusyId(null)
    }
  }

  const unread = messages.filter((m) => !m.is_read).length

  return (
    <Card className="border-border/60 bg-card/80 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 pb-4">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-accent/10">
            <Inbox className="h-5 w-5 text-accent" />
          </span>
          <span>Messages</span>
          {unread > 0 && <Badge className="rounded-full">{unread} new</Badge>}
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full"
          onClick={load}
          disabled={loading}
          aria-label="Refresh messages"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent className="pt-4">
        {loading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Loading messages...</p>
        ) : error ? (
          <p className="py-8 text-center text-sm text-muted-foreground">{error}</p>
        ) : messages.length === 0 ? (
          <div className="py-10 text-center">
            <Inbox className="mx-auto mb-3 h-8 w-8 text-muted-foreground/60" />
            <p className="text-sm text-muted-foreground">No messages yet.</p>
          </div>
        ) : (
          <div className="max-h-[28rem] space-y-3 overflow-y-auto pr-1">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`rounded-2xl border p-4 shadow-sm transition-colors ${
                  msg.is_read ? "border-border/50 bg-background/60" : "border-accent/40 bg-accent/5"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {!msg.is_read && <span className="h-2 w-2 shrink-0 rounded-full bg-accent" aria-hidden />}
                      <p className="truncate font-medium text-foreground">{msg.name}</p>
                    </div>
                    <a
                      href={`mailto:${msg.email}`}
                      className="block truncate text-xs text-accent hover:underline"
                    >
                      {msg.email}
                    </a>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(msg.created_at)}</span>
                </div>

                {msg.subject && <p className="mt-2 text-sm font-medium text-foreground">{msg.subject}</p>}
                <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">{msg.message}</p>

                <div className="mt-3 flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    disabled={busyId === msg.id}
                    onClick={() => toggleRead(msg)}
                  >
                    {msg.is_read ? (
                      <>
                        <Mail className="mr-1 h-3.5 w-3.5" />
                        Mark unread
                      </>
                    ) : (
                      <>
                        <MailOpen className="mr-1 h-3.5 w-3.5" />
                        Mark read
                      </>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full text-destructive hover:text-destructive"
                    disabled={busyId === msg.id}
                    onClick={() => remove(msg.id)}
                    aria-label="Delete message"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

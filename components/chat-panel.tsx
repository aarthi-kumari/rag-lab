"use client"

import { useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Textarea } from "@/components/ui/textarea"
import { suggestions, type Message } from "@/lib/mockData"
import { CopyIcon, RefreshCwIcon, SendIcon } from "lucide-react"

export function ChatPanel({
  title,
  messages,
  onSend,
}: {
  title: string
  messages: Message[]
  onSend: (content: string) => void
}) {
  const [draft, setDraft] = useState("")

  function submit() {
    const content = draft.trim()
    if (!content) return
    onSend(content)
    setDraft("")
  }

  return (
    <section className="flex h-full min-h-0 min-w-0 flex-col">
      <header className="flex items-center gap-2 border-b px-4 py-3">
        <SidebarTrigger />
        <h1 className="min-w-0 flex-1 truncate text-sm font-medium">{title}</h1>
        <ThemeToggle />
      </header>
      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col gap-6 p-4">
          {messages.length === 0 ? (
            <p className="text-sm text-muted-foreground">No messages yet.</p>
          ) : (
            messages.map((message) =>
              message.role === "user" ? (
                <div
                  key={message.id}
                  className="ml-auto max-w-[80%] whitespace-pre-wrap rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground"
                >
                  {message.content}
                </div>
              ) : (
                <div key={message.id} className="flex flex-col gap-2">
                  <div className="whitespace-pre-wrap text-sm leading-6">
                    {message.content}
                  </div>
                  <div className="flex gap-1">
                    <Button type="button" variant="ghost" size="sm">
                      <CopyIcon data-icon="inline-start" />
                      Copy
                    </Button>
                    <Button type="button" variant="ghost" size="sm">
                      <RefreshCwIcon data-icon="inline-start" />
                      Regenerate
                    </Button>
                  </div>
                </div>
              )
            )
          )}
        </div>
      </ScrollArea>
      <form
  className="mx-4 mb-4 flex flex-col gap-2 rounded-xl border bg-card p-2"
  onSubmit={(event) => {
    event.preventDefault()
    submit()
  }}
>
  <div className="flex items-end gap-2">
    <Textarea
      value={draft}
      placeholder="Ask a follow-up question..."
      onChange={(event) => setDraft(event.target.value)}
      onKeyDown={(event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault()
          submit()
        }
      }}
    />
    <Button type="submit" size="icon" aria-label="Send">
      <SendIcon data-icon="inline-start" />
    </Button>
  </div>
  <div className="flex flex-wrap gap-2">
    {suggestions.map((suggestion) => (
      <Button
        key={suggestion}
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onSend(suggestion)}
      >
        {suggestion}
      </Button>
    ))}
  </div>
</form>
    </section>
  )
}
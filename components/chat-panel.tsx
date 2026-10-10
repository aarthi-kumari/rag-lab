"use client"

import { useState } from "react"
import { SendIcon } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Textarea } from "@/components/ui/textarea"
import type { Message } from "@/lib/mock-data"

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
    <section className="flex min-h-0 min-w-0 flex-1 flex-col">
      <header className="flex items-center gap-2 border-b px-4 py-3">
        <SidebarTrigger />
        <h1 className="min-w-0 flex-1 truncate text-sm font-medium">{title}</h1>
        <ThemeToggle />
      </header>
      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col gap-3 p-4">
          {messages.length === 0 ? (
            <p className="text-sm text-muted-foreground">No messages yet.</p>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={
                  message.role === "user"
                    ? "ml-auto max-w-[80%] rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground"
                    : "max-w-[80%] rounded-lg bg-muted px-3 py-2 text-sm"
                }
              >
                {message.content}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
      <form
        className="flex items-end gap-2 border-t p-4"
        onSubmit={(event) => {
          event.preventDefault()
          submit()
        }}
      >
        <Textarea
          value={draft}
          placeholder="The model arrives on Day 2."
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
      </form>
    </section>
  )
}
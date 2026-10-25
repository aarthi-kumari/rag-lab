"use client"

import { useRef, useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Textarea } from "@/components/ui/textarea"
import { suggestions, type Message } from "@/lib/mockData"
import {
  CopyIcon,
  FileTextIcon,
  GitCompareIcon,
  PaperclipIcon,
  RefreshCwIcon,
  SearchIcon,
  SendIcon,
  XIcon,
} from "lucide-react"

const suggestionIcons: Record<string, typeof FileTextIcon> = {
  "Summarize this document": FileTextIcon,
  "Find a policy": SearchIcon,
  "Compare documents": GitCompareIcon,
}

const chipClassName =
  "h-10 rounded-[12px] border-border bg-background px-3 text-sm font-normal text-foreground shadow-none hover:border-indigo-400/40 hover:bg-indigo-500/10 active:bg-indigo-500/15 focus-visible:border-indigo-400/60 focus-visible:ring-2 focus-visible:ring-indigo-400/30"

export type ChatFile = {
  id: string
  originalName: string
  storedName: string
}

export function ChatPanel({
  title,
  messages,
  files,
  uploading,
  onSend,
  onUpload,
  onOpenFile,
  onRemoveFile,
}: {
  title: string
  messages: Message[]
  files: ChatFile[]
  uploading: boolean
  onSend: (content: string) => void
  onUpload: (file: File) => void
  onOpenFile: (file: ChatFile) => void
  onRemoveFile: (file: ChatFile) => void
}) {
  const [draft, setDraft] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

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
        className="mx-3 mb-3 flex min-w-0 flex-col gap-2 rounded-[18px] border border-border bg-card p-2.5 text-card-foreground sm:mx-4 sm:mb-4"
        onSubmit={(event) => {
          event.preventDefault()
          submit()
        }}
      >
        {files.length > 0 ? (
          <div className="flex min-w-0 flex-wrap gap-2">
            {files.map((file) => (
              <div key={file.id} className="flex max-w-full items-center gap-1">
                <Button
                  type="button"
                  variant="outline"
                  className={chipClassName}
                  onClick={() => onOpenFile(file)}
                >
                  <PaperclipIcon data-icon="inline-start" />
                  <span className="max-w-48 truncate">{file.originalName}</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Remove ${file.originalName}`}
                  onClick={() => onRemoveFile(file)}
                >
                  <XIcon data-icon="inline-start" />
                </Button>
              </div>
            ))}
          </div>
        ) : null}
        <div className="flex min-w-0 items-end gap-2">
          <input
            ref={fileInputRef}
            type="file"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0]
              event.target.value = ""
              if (file) onUpload(file)
            }}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Upload file"
            disabled={uploading}
            className="size-11 shrink-0 rounded-[12px] text-muted-foreground hover:bg-muted hover:text-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-400/40"
            onClick={() => fileInputRef.current?.click()}
          >
            <PaperclipIcon data-icon="inline-start" />
          </Button>
          <Textarea
            value={draft}
            placeholder="Ask anything about this document…"
            className="min-h-11 min-w-0 flex-1 resize-none rounded-[14px] border-border bg-background px-3 py-2 text-sm text-foreground transition-[border-color,box-shadow] duration-150 placeholder:text-muted-foreground focus-visible:border-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-400/30 md:text-sm dark:bg-background"
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault()
                submit()
              }
            }}
          />
          <Button
            type="submit"
            size="icon"
            aria-label="Send"
            disabled={!draft.trim()}
            className="composer-send size-11 shrink-0 rounded-[12px] border-transparent transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400/40"
          >
            <SendIcon data-icon="inline-start" />
          </Button>
        </div>
        <div className="flex min-w-0 flex-wrap gap-2">
          {suggestions.map((suggestion) => {
            const Icon = suggestionIcons[suggestion]
            return (
              <Button
                key={suggestion}
                type="button"
                variant="outline"
                className={chipClassName}
                onClick={() => onSend(suggestion)}
              >
                {Icon ? <Icon data-icon="inline-start" /> : null}
                {suggestion}
              </Button>
            )
          })}
        </div>
      </form>
    </section>
  )
}
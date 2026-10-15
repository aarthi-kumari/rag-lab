"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { ChatPanel } from "@/components/chat-panel"
import { SourcesPanel } from "@/components/sources-panel"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { chats, messagesByChat, type Message } from "@/lib/mock-data"

export function LabShell() {
  const [activeChatId, setActiveChatId] = useState(chats[0].id)
  const [extraMessages, setExtraMessages] = useState<Record<string, Message[]>>({})

  const activeChat = chats.find((chat) => chat.id === activeChatId) ?? chats[0]
  const messages = [
    ...(messagesByChat[activeChat.id] ?? []),
    ...(extraMessages[activeChat.id] ?? []),
  ]

  function handleSend(content: string) {
    const next: Message[] = [
      { id: crypto.randomUUID(), role: "user", content },
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Streaming starts on Day 2.",
      },
    ]
    setExtraMessages((current) => ({
      ...current,
      [activeChat.id]: [...(current[activeChat.id] ?? []), ...next],
    }))
  }

  return (
    <SidebarProvider className="h-svh">
      <AppSidebar activeChatId={activeChat.id} onSelectChat={setActiveChatId} />
      <SidebarInset className="min-h-0">
        <div className="flex min-h-0 flex-1 lg:hidden">
          <ChatPanel
            title={activeChat.title}
            messages={messages}
            onSend={handleSend}
          />
        </div>
        <ResizablePanelGroup
          orientation="horizontal"
          className="hidden min-h-0 flex-1 lg:flex"
        >
          <ResizablePanel defaultSize="70%" minSize="40%">
            <ChatPanel
              title={activeChat.title}
              messages={messages}
              onSend={handleSend}
            />
          </ResizablePanel>
          <ResizableHandle withHandle aria-label="Resize sources panel" />
          <ResizablePanel defaultSize="30%" minSize="20%" maxSize="50%">
            <SourcesPanel />
          </ResizablePanel>
        </ResizablePanelGroup>
      </SidebarInset>
    </SidebarProvider>
  )
}
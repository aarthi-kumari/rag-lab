"use client"

import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { ChatPanel } from "@/components/chat-panel"
import { SourcesPanel } from "@/components/sources-panel"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { chats, type Message } from "@/lib/mock-data"

const api = "http://localhost:4000"

type StoredMessage = {
  id: string
  text: string
}

export function LabShell() {
  const [activeChatId, setActiveChatId] = useState(chats[0].id)
  const [messages, setMessages] = useState<Message[]>([])

  const activeChat = chats.find((chat) => chat.id === activeChatId) ?? chats[0]

  async function loadMessages(chatId: string) {
    const response = await fetch(`${api}/chats/${chatId}/messages`)
    const data = (await response.json()) as StoredMessage[]
    setMessages(
      data.map((message) => ({
        id: message.id,
        role: "user",
        content: message.text,
      }))
    )
  }

  useEffect(() => {
    void loadMessages(activeChat.id)
  }, [activeChat.id])

  async function handleSend(content: string) {
    const chatId = activeChat.id
    await fetch(`${api}/chats/${chatId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: content }),
    })
    await loadMessages(chatId)
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
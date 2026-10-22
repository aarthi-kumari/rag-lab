"use client"

import { useEffect, useRef, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { ChatPanel } from "@/components/chat-panel"
import { SourcesPanel } from "@/components/sources-panel"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import {
  demoChats,
  messagesByChat,
  sourcesForMessage,
  titleFromText,
  USE_MOCK_SOURCES,
  type ChatSummary,
  type Message,
} from "@/lib/mockData"

const api = "http://localhost:4000"

type StoredMessage = {
  id: string
  text: string
  role?: "user" | "assistant"
}

export function LabShell() {
  const [activeChatId, setActiveChatId] = useState("")
  const [chatList, setChatList] = useState<ChatSummary[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const activeChatIdRef = useRef(activeChatId)
  activeChatIdRef.current = activeChatId

  async function loadChats(preferId?: string) {
    let data: ChatSummary[] = []
    try {
      const response = await fetch(`${api}/chats`)
      if (response.ok) data = (await response.json()) as ChatSummary[]
    } catch {
      data = []
    }
    const serverChats = data.map((chat) => ({
      ...chat,
      title: titleFromText(chat.title),
    }))
    const mockChats = USE_MOCK_SOURCES
      ? demoChats.filter((chat) => !serverChats.some((item) => item.id === chat.id))
      : []
    const next = [...serverChats, ...mockChats]
    if (next.length === 0) {
      const id = crypto.randomUUID()
      setChatList([{ id, title: "New chat", createdAt: new Date().toISOString() }])
      setActiveChatId(id)
      setMessages([])
      return
    }
    setChatList(next)
    setActiveChatId((current) => {
      if (preferId && next.some((chat) => chat.id === preferId)) return preferId
      if (current && next.some((chat) => chat.id === current)) return current
      return next[0].id
    })
  }

  async function loadMessages(chatId: string) {
    const response = await fetch(`${api}/chats/${chatId}/messages`)
    const data = (await response.json()) as StoredMessage[]
    if (activeChatIdRef.current !== chatId) return
    if (USE_MOCK_SOURCES && data.length === 0 && messagesByChat[chatId]) {
      setMessages(messagesByChat[chatId])
      return
    }
    setMessages(
      data.map((message) => ({
        id: message.id,
        role: message.role === "assistant" ? "assistant" : "user",
        content: message.text,
        sources: sourcesForMessage(message.id),
      }))
    )
  }

  useEffect(() => {
    void loadChats()
  }, [])

  useEffect(() => {
    if (!activeChatId) return
    void loadMessages(activeChatId)
  }, [activeChatId])

  async function handleSend(content: string) {
    const chatId = activeChatId
    const saved = await fetch(`${api}/chats/${chatId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: content, role: "user" }),
    })
    if (!saved.ok) return
    await fetch(`${api}/chats/${chatId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: "Model not connected yet.",
        role: "assistant",
      }),
    })
    await loadChats(chatId)
    await loadMessages(chatId)
  }

  function handleNewChat() {
    const id = crypto.randomUUID()
    setChatList((current) => [
      { id, title: "New chat", createdAt: new Date().toISOString() },
      ...current,
    ])
    setActiveChatId(id)
    setMessages([])
  }

  const firstUserMessage = messages.find((message) => message.role === "user")
  const title = firstUserMessage
    ? titleFromText(firstUserMessage.content)
    : "New chat"
  const latestAssistant = [...messages]
    .reverse()
    .find((message) => message.role === "assistant")
  const visibleSources = latestAssistant?.sources ?? []

  return (
    <SidebarProvider className="h-svh">
      <AppSidebar
        chats={chatList}
        activeChatId={activeChatId}
        onSelectChat={setActiveChatId}
        onNewChat={handleNewChat}
      />
      <SidebarInset className="min-h-0">
        <div className="flex min-h-0 flex-1 lg:hidden">
          <ChatPanel title={title} messages={messages} onSend={handleSend} />
        </div>
        <ResizablePanelGroup
          orientation="horizontal"
          className="hidden min-h-0 flex-1 lg:flex"
        >
          <ResizablePanel defaultSize="70%" minSize="40%">
            <ChatPanel title={title} messages={messages} onSend={handleSend} />
          </ResizablePanel>
          <ResizableHandle withHandle aria-label="Resize sources panel" />
          <ResizablePanel defaultSize="30%" minSize="20%" maxSize="50%">
            <SourcesPanel
              sources={visibleSources}
              showDemoBadge={USE_MOCK_SOURCES}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </SidebarInset>
    </SidebarProvider>
  )
}

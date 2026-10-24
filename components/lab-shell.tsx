"use client"

import { useEffect, useRef, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { ChatPanel, type ChatFile } from "@/components/chat-panel"
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

type StoredFile = {
  id: string
  originalName: string
  storedName: string
}

export function LabShell() {
  const [activeChatId, setActiveChatId] = useState("")
  const [chatList, setChatList] = useState<ChatSummary[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [files, setFiles] = useState<ChatFile[]>([])
  const [uploading, setUploading] = useState(false)
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
      setFiles([])
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

  async function loadFiles(chatId: string) {
    try {
      const response = await fetch(`${api}/chats/${chatId}/files`)
      if (!response.ok) return
      const data = (await response.json()) as StoredFile[]
      if (activeChatIdRef.current !== chatId) return
      setFiles(
        data.map((file) => ({
          id: file.id,
          originalName: file.originalName,
          href: `${api}/uploads/${file.storedName}`,
        }))
      )
    } catch {
      if (activeChatIdRef.current === chatId) setFiles([])
    }
  }

  useEffect(() => {
    if (!activeChatId) return
    void loadMessages(activeChatId)
    void loadFiles(activeChatId)
  }, [activeChatId])

  async function handleSend(content: string) {
    const chatId = activeChatId
    const saved = await fetch(`${api}/chats/${chatId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: content, role: "user" }),
    })
    if (!saved.ok) return
    await loadChats(chatId)
    await loadMessages(chatId)
  }

  async function handleUpload(file: File) {
    const chatId = activeChatId
    if (!chatId) return
    const body = new FormData()
    body.append("file", file)
    setUploading(true)
    try {
      const saved = await fetch(`${api}/chats/${chatId}/files`, {
        method: "POST",
        body,
      })
      if (!saved.ok) return
      await loadFiles(chatId)
      await loadChats(chatId)
    } finally {
      setUploading(false)
    }
  }

  function handleNewChat() {
    const id = crypto.randomUUID()
    setChatList((current) => [
      { id, title: "New chat", createdAt: new Date().toISOString() },
      ...current,
    ])
    setActiveChatId(id)
    setMessages([])
    setFiles([])
  }

  const firstUserMessage = messages.find((message) => message.role === "user")
  const activeChat = chatList.find((chat) => chat.id === activeChatId)
  const title = firstUserMessage
    ? titleFromText(firstUserMessage.content)
    : (activeChat?.title ?? "New chat")
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
          <ChatPanel
            title={title}
            messages={messages}
            files={files}
            uploading={uploading}
            onSend={handleSend}
            onUpload={handleUpload}
          />
        </div>
        <ResizablePanelGroup
          orientation="horizontal"
          className="min-h-0 flex-1 max-lg:hidden! lg:flex"
        >
          <ResizablePanel defaultSize="70%" minSize="40%">
            <ChatPanel
              title={title}
              messages={messages}
              files={files}
              uploading={uploading}
              onSend={handleSend}
              onUpload={handleUpload}
            />
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

"use client"

import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import type { ChatSummary } from "@/lib/mockData"

const groups = [
  { id: "today", label: "Today" },
  { id: "previous", label: "Previous 7 days" },
] as const

type ChatGroup = (typeof groups)[number]["id"]

function startOfToday() {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  return date
}

function chatGroup(createdAt: string): ChatGroup | null {
  const date = new Date(createdAt)
  if (date >= startOfToday()) return "today"
  const weekAgo = startOfToday()
  weekAgo.setDate(weekAgo.getDate() - 7)
  if (date >= weekAgo) return "previous"
  return null
}

function formatWhen(createdAt: string) {
  const date = new Date(createdAt)
  if (date >= startOfToday()) {
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
  }
  return date.toLocaleDateString([], { month: "short", day: "numeric" })
}

export function AppSidebar({
  chats,
  activeChatId,
  email,
  onSelectChat,
  onNewChat,
  onSignOut,
}: {
  chats: ChatSummary[]
  activeChatId: string
  email: string
  onSelectChat: (id: string) => void
  onNewChat: () => void
  onSignOut: () => void
}) {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex flex-col gap-0.5 px-2 py-1">
          <div className="font-heading text-xl">RAG Lab</div>
          <p className="text-xs text-muted-foreground">
            Ask. Retrieve. Understand.
          </p>
        </div>
        <Button className="w-full" onClick={onNewChat}>
          <PlusIcon data-icon="inline-start" />
          New chat
        </Button>
      </SidebarHeader>
      <SidebarContent>
        {groups.map((group) => {
          const items = chats.filter((chat) => chatGroup(chat.createdAt) === group.id)
          if (items.length === 0) return null
          return (
            <SidebarGroup key={group.id}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((chat) => (
                    <SidebarMenuItem key={chat.id}>
                      <SidebarMenuButton
                        isActive={chat.id === activeChatId}
                        onClick={() => onSelectChat(chat.id)}
                      >
                        <span className="flex w-full min-w-0 items-center gap-2">
                          <span className="min-w-0 flex-1 truncate">
                            {chat.title}
                          </span>
                          <span className="shrink-0 text-xs text-muted-foreground">
                            {formatWhen(chat.createdAt)}
                          </span>
                        </span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )
        })}
      </SidebarContent>
      <SidebarFooter>
        <p className="truncate px-2 text-xs text-muted-foreground">{email}</p>
        <Button variant="outline" className="w-full" onClick={onSignOut}>
          Sign out
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}

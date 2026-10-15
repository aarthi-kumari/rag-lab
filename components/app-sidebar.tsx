"use client"

import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { chats, type ChatGroup } from "@/lib/mock-data"

const groups: { id: ChatGroup; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "previous", label: "Previous 7 days" },
]

export function AppSidebar({
  activeChatId,
  onSelectChat,
}: {
  activeChatId: string
  onSelectChat: (id: string) => void
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
        <Button className="w-full">
          <PlusIcon data-icon="inline-start" />
          New chat
        </Button>
      </SidebarHeader>
      <SidebarContent>
        {groups.map((group) => (
          <SidebarGroup key={group.id}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {chats
                  .filter((chat) => chat.group === group.id)
                  .map((chat) => (
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
                            {chat.when}
                          </span>
                        </span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}
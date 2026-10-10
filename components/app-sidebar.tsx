"use client"

import { MessageSquarePlusIcon } from "lucide-react"
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
import { chats } from "@/lib/mock-data"

export function AppSidebar({
    activeChatId,
    onSelectChat,

}: {
    activeChatId: string
    onSelectChat: (id: string) => void

}){
    return (
        <Sidebar>
            <SidebarHeader>
                <div className="px-2 py-1 text-sm font-medium">RAG Lab</div>
            </SidebarHeader>
            <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <MessageSquarePlusIcon />
                  <span>New chat</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {chats.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton
                    isActive={chat.id === activeChatId}
                    onClick={() => onSelectChat(chat.id)}
                  >
                    <span>{chat.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
        </Sidebar>
    )
}
   
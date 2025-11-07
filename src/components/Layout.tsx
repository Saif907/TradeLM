import { ReactNode } from "react";
import { ChatSidebar } from "@/components/ChatSidebar";

interface Chat {
  id: string;
  title: string;
  timestamp: Date;
}

interface LayoutProps {
  children: ReactNode;
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
  chats: Chat[];
  activeChat: string | null;
  onChatSelect: (id: string) => void;
  onNewChat: () => void;
}

export function Layout({
  children,
  sidebarOpen,
  onSidebarToggle,
  chats,
  activeChat,
  onChatSelect,
  onNewChat,
}: LayoutProps) {
  return (
    <div className="flex h-screen bg-[hsl(var(--chat-bg))] overflow-hidden">
      <ChatSidebar
        isOpen={sidebarOpen}
        onToggle={onSidebarToggle}
        chats={chats}
        activeChat={activeChat}
        onChatSelect={onChatSelect}
        onNewChat={onNewChat}
      />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}

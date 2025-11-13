import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { ChatWelcome } from "@/components/ChatWelcome";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { chatAPI } from "@/lib/api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface Chat {
  id: string;
  title: string;
  timestamp: Date;
  messages: Message[];
}

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load chats from backend
  useEffect(() => {
    if (!user) return;

    const loadChats = async () => {
      try {
        const backendChats = await chatAPI.getChats();
        
        const chatsWithMessages = backendChats.map((chat: any) => ({
          id: chat.id,
          title: chat.title,
          timestamp: new Date(chat.created_at),
          messages: [] // Messages loaded separately when chat selected
        }));
        
        setChats(chatsWithMessages);
      } catch (error) {
        console.error("Error loading chats:", error);
        toast.error("Failed to load chats");
      }
    };

    loadChats();
  }, [user]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeChat, chats]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const currentChat = chats.find((c) => c.id === activeChat);

  const handleNewChat = async () => {
    if (!user) return;

    try {
      const newChat = await chatAPI.createChat("New chat");
      
      const chatData: Chat = {
        id: newChat.id,
        title: newChat.title,
        timestamp: new Date(newChat.created_at),
        messages: [],
      };

      setChats([chatData, ...chats]);
      setActiveChat(newChat.id);
    } catch (error) {
      console.error("Error creating chat:", error);
      toast.error("Failed to create chat");
    }
  };

  const handleChatSelect = async (chatId: string) => {
    try {
      const chatData = await chatAPI.getChat(chatId);
      
      // Update chat with messages
      setChats(prev => prev.map(c => 
        c.id === chatId 
          ? {
              ...c,
              messages: chatData.messages.map((m: any) => ({
                id: m.id,
                role: m.role,
                content: m.content
              }))
            }
          : c
      ));
      
      setActiveChat(chatId);
    } catch (error) {
      console.error("Error loading chat:", error);
      toast.error("Failed to load chat");
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!user) return;

    // Create new chat if none active
    if (!activeChat) {
      await handleNewChat();
      setTimeout(() => handleSendMessage(content), 100);
      return;
    }

    // Add user message optimistically
    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      role: "user",
      content,
    };

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChat
          ? {
              ...chat,
              title: chat.messages.length === 0 ? content.slice(0, 50) : chat.title,
              messages: [...chat.messages, userMessage],
            }
          : chat
      )
    );

    setIsTyping(true);

    try {
      // Send message to backend AI
      const response = await chatAPI.sendMessage(activeChat, content);

      // Add AI response
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: response.message,
      };

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChat
            ? { ...chat, messages: [...chat.messages, aiMessage] }
            : chat
        )
      );

      // Show success if trade extracted
      if (response.trade_extracted) {
        toast.success("Trade logged successfully!");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
      
      // Remove optimistic user message on error
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChat
            ? { ...chat, messages: chat.messages.filter(m => m.id !== userMessage.id) }
            : chat
        )
      );
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (text: string) => {
    handleSendMessage(text);
  };

  return (
    <Layout
      sidebarOpen={sidebarOpen}
      onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
      chats={chats}
      activeChat={activeChat}
      onChatSelect={handleChatSelect}
      onNewChat={handleNewChat}
    >
      <div className="flex-1 flex flex-col h-screen">
        {!currentChat || currentChat.messages.length === 0 ? (
          <ChatWelcome onSuggestionClick={handleSuggestionClick} />
        ) : (
          <ScrollArea className="flex-1" ref={scrollRef}>
            <div className="space-y-0">
              {currentChat.messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  role={message.role}
                  content={message.content}
                />
              ))}
              {isTyping && (
                <ChatMessage
                  role="assistant"
                  content="Processing your message..."
                />
              )}
            </div>
          </ScrollArea>
        )}

        <ChatInput onSend={handleSendMessage} disabled={isTyping} />
      </div>
    </Layout>
  );
};

export default Index;
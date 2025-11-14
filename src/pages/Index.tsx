// src/pages/Index.tsx

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
        // Automatically select the most recent chat if available
        if (chatsWithMessages.length > 0) {
             handleChatSelect(chatsWithMessages[0].id);
        }
        
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

  const handleNewChat = async (initialTitle = "New chat") => {
    if (!user) return null; // Return null on auth failure

    try {
      const newChat = await chatAPI.createChat(initialTitle);
      
      const chatData: Chat = {
        id: newChat.id,
        title: newChat.title,
        timestamp: new Date(newChat.created_at),
        messages: [],
      };

      setChats((prev) => [chatData, ...prev]);
      setActiveChat(newChat.id);
      return chatData; // Return the new chat data
    } catch (error) {
      console.error("Error creating chat:", error);
      toast.error("Failed to create chat");
      return null;
    }
  };

  const handleChatSelect = async (chatId: string) => {
    try {
      // Set active chat immediately to show loading spinner
      setActiveChat(chatId);
      
      const response = await chatAPI.getChat(chatId);
      
      // Update chat with messages
      setChats(prev => prev.map(c => 
        c.id === chatId 
          ? {
              ...c,
              messages: (response.messages || []).map((m: any) => ({
                id: m.id,
                role: m.role,
                content: m.content
              })),
              title: response.chat.title, // Update title if it changed on backend
            }
          : c
      ));
      
    } catch (error) {
      console.error("Error loading chat:", error);
      toast.error("Failed to load chat");
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!user || isTyping) return;

    let targetChatId = activeChat;
    let initialMessage = false;
    const optimisticUserMessageId = `temp-${Date.now()}-user`;
    const typingMessageId = `temp-${Date.now()}-ai`;

    // 1. Handle Chat Creation if necessary
    if (!targetChatId) {
      const newChat = await handleNewChat(content.slice(0, 50));
      if (!newChat) return; // Stop if chat creation fails
      targetChatId = newChat.id;
      initialMessage = true;
    }

    // 2. Optimistically update UI with user message and typing indicator
    const userMessage: Message = {
      id: optimisticUserMessageId,
      role: "user",
      content,
    };
    
    const typingMessage: Message = {
        id: typingMessageId,
        role: "assistant",
        content: "Processing your message...",
    };

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === targetChatId
          ? {
              ...chat,
              title: initialMessage ? content.slice(0, 50) : chat.title,
              messages: [...chat.messages, userMessage, typingMessage],
            }
          : chat
      )
    );

    setIsTyping(true);

    try {
      // 3. Send message to backend AI
      const response = await chatAPI.sendMessage(targetChatId, content);

      // 4. Update state to replace optimistic data with real AI response
      const aiResponseContent = response.message;
      const finalAiMessage: Message = {
          id: `ai-${Date.now()}-final`,
          role: "assistant",
          content: aiResponseContent,
      };

      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id !== targetChatId) return chat;

          // Filter out the temporary user and typing messages
          const newMessages = chat.messages.filter(m => 
            m.id !== optimisticUserMessageId && m.id !== typingMessageId
          );
          
          // Re-add the user message (retaining optimistic content)
          newMessages.push(userMessage);

          // Add the final AI message
          newMessages.push(finalAiMessage);

          return { ...chat, messages: newMessages };
        })
      );
      
      // Show success if trade extracted
      if (response.trade_extracted) {
        toast.success("Trade logged successfully!");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
      
      // Remove optimistic user message and typing indicator on error
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === targetChatId
            ? { ...chat, messages: chat.messages.filter(m => m.id !== optimisticUserMessageId && m.id !== typingMessageId) }
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
      onNewChat={() => handleNewChat()}
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
            </div>
          </ScrollArea>
        )}

        <ChatInput onSend={handleSendMessage} disabled={isTyping} />
      </div>
    </Layout>
  );
};

export default Index;
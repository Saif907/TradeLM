import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { ChatWelcome } from "@/components/ChatWelcome";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

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

  // Load chats from database
  useEffect(() => {
    if (!user) return;

    const loadChats = async () => {
      const { data: chatsData, error } = await supabase
        .from("chats")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Failed to load chats");
        return;
      }

      if (chatsData) {
        const chatsWithMessages = await Promise.all(
          chatsData.map(async (chat) => {
            const { data: messagesData } = await supabase
              .from("messages")
              .select("*")
              .eq("chat_id", chat.id)
              .order("created_at", { ascending: true });

            return {
              id: chat.id,
              title: chat.title,
              timestamp: new Date(chat.created_at),
              messages: (messagesData || []).map((msg) => ({
                id: msg.id,
                role: msg.role as "user" | "assistant",
                content: msg.content,
              })),
            };
          })
        );

        setChats(chatsWithMessages);
      }
    };

    loadChats();

    // Set up real-time subscription
    const channel = supabase
      .channel("chats-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chats",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          loadChats();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        () => {
          loadChats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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

    const { data, error } = await supabase
      .from("chats")
      .insert({
        title: "New chat",
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      toast.error("Failed to create chat");
      return;
    }

    const newChat: Chat = {
      id: data.id,
      title: data.title,
      timestamp: new Date(data.created_at),
      messages: [],
    };

    setChats([newChat, ...chats]);
    setActiveChat(newChat.id);
  };

  const handleSendMessage = async (content: string) => {
    if (!user) return;

    if (!activeChat) {
      await handleNewChat();
      setTimeout(() => handleSendMessage(content), 100);
      return;
    }

    // Save user message to database
    const { data: userMessageData, error: userError } = await supabase
      .from("messages")
      .insert({
        chat_id: activeChat,
        user_id: user.id,
        role: "user",
        content,
      })
      .select()
      .single();

    if (userError) {
      toast.error("Failed to send message");
      return;
    }

    const userMessage: Message = {
      id: userMessageData.id,
      role: "user",
      content,
    };

    // Update chat title if first message
    const currentChat = chats.find((c) => c.id === activeChat);
    if (currentChat && currentChat.messages.length === 0) {
      await supabase
        .from("chats")
        .update({ title: content.slice(0, 50) })
        .eq("id", activeChat);
    }

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

    // Simulate AI response and save to database
    setTimeout(async () => {
      const aiContent = `I've recorded your trade. Here's what I understood:\n\n"${content}"\n\nIn a real implementation, I would parse this information, extract the ticker symbol, entry/exit prices, dates, and calculate your profit/loss. I would also provide insights on your trading patterns and suggest improvements to your strategy.\n\nConnect to Lovable AI to enable full trading journal features including automatic trade parsing, P&L calculations, and personalized trading insights.`;

      const { data: aiMessageData, error: aiError } = await supabase
        .from("messages")
        .insert({
          chat_id: activeChat,
          user_id: user.id,
          role: "assistant",
          content: aiContent,
        })
        .select()
        .single();

      if (aiError) {
        toast.error("Failed to save AI response");
        setIsTyping(false);
        return;
      }

      const aiMessage: Message = {
        id: aiMessageData.id,
        role: "assistant",
        content: aiContent,
      };

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChat
            ? { ...chat, messages: [...chat.messages, aiMessage] }
            : chat
        )
      );
      setIsTyping(false);
    }, 1000);
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
      onChatSelect={setActiveChat}
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
                  content="Processing your trade..."
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

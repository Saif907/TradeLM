import { supabase } from "@/integrations/supabase/client";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// Get auth token from Supabase session
async function getAuthToken(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  console.log("🔑 Session exists:", !!session);
  console.log("🔑 Token exists:", !!session?.access_token);
  if (session?.access_token) {
    console.log("🔑 Token preview:", session.access_token.substring(0, 50) + "...");
  }
  return session?.access_token || null;
}

// API client with auth
async function apiClient(endpoint: string, options: RequestInit = {}) {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error("Not authenticated");
  }
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  
  headers["Authorization"] = `Bearer ${token}`;
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    mode: 'cors',
    credentials: 'include',
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Unknown error" }));
    console.error("API Error:", error);
    throw new Error(error.detail || `API Error: ${response.status}`);
  }
  
  return response.json();
}

// Chat API
export const chatAPI = {
  // Create new chat
  createChat: async (title: string) => {
    return apiClient("/chats", {
      method: "POST",
      body: JSON.stringify({ title }),
    });
  },
  
  // Get all chats
  getChats: async () => {
    return apiClient("/chats");
  },
  
  // Get chat with messages
  getChat: async (chatId: string) => {
    return apiClient(`/chats/${chatId}`);
  },
  
  // Delete chat
  deleteChat: async (chatId: string) => {
    return apiClient(`/chats/${chatId}`, {
      method: "DELETE",
    });
  },
  
  // Send message to AI
  sendMessage: async (chatId: string, message: string) => {
    return apiClient("/ai/chat", {
      method: "POST",
      body: JSON.stringify({ chat_id: chatId, message }),
    });
  },
};

// Trade API
export const tradeAPI = {
  // Get all trades
  getTrades: async () => {
    return apiClient("/trades");
  },
  
  // Create trade
  createTrade: async (trade: any) => {
    return apiClient("/trades", {
      method: "POST",
      body: JSON.stringify(trade),
    });
  },
  
  // Get analytics
  getAnalytics: async () => {
    return apiClient("/ai/analytics", {
      method: "POST",
      body: JSON.stringify({}),
    });
  },
};
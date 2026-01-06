import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ChatHistoryItem {
  id: string;
  title: string;
  messages: Array<{
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  bio?: string;
  password?: string; // For email-based login
  provider: 'google' | 'github' | 'email';
  createdAt: string;
  lastLogin: string;
}

interface UserContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  chatHistory: ChatHistoryItem[];
  login: (user: UserProfile) => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addChatToHistory: (chat: ChatHistoryItem) => void;
  removeChatFromHistory: (chatId: string) => void;
  updateChatInHistory: (chat: ChatHistoryItem) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'pr4kh4r_user_profile';
const CHAT_STORAGE_KEY = 'pr4kh4r_chat_history';

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);

  // Load user and chat history from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }

    const storedChats = localStorage.getItem(CHAT_STORAGE_KEY);
    if (storedChats) {
      try {
        const parsedChats = JSON.parse(storedChats);
        setChatHistory(parsedChats);
      } catch (error) {
        console.error('Failed to parse stored chats:', error);
        localStorage.removeItem(CHAT_STORAGE_KEY);
      }
    }
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [user]);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

  const login = (userData: UserProfile) => {
    const userWithTimestamp = {
      ...userData,
      lastLogin: new Date().toISOString(),
    };
    setUser(userWithTimestamp);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
    }
  };

  const addChatToHistory = (chat: ChatHistoryItem) => {
    setChatHistory(prev => [chat, ...prev]);
  };

  const removeChatFromHistory = (chatId: string) => {
    setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
  };

  const updateChatInHistory = (chat: ChatHistoryItem) => {
    setChatHistory(prev => prev.map(c => c.id === chat.id ? chat : c));
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      chatHistory,
      login, 
      logout, 
      updateProfile,
      addChatToHistory,
      removeChatFromHistory,
      updateChatInHistory,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

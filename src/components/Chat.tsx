import { useState } from "react";
import { useUser } from "../context/UserContext";
import { ClaudeSidebar, ChatHistory } from "./ClaudeSidebar";
import { ChatContainer, Chat, Message } from "./ChatContainer";
import { ClaudeWelcome } from "./ClaudeWelcome";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { ResizableSidebar } from "./ResizableSidebar";

interface ChatProps {
  onNavigateToProfile: () => void;
}

export function Chat({ onNavigateToProfile }: ChatProps) {
  const { logout } = useUser();
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  const currentChat = chats.find(chat => chat.id === currentChatId) || null;

  const generateChatHistory = (): ChatHistory[] => {
    return chats.map(chat => ({
      id: chat.id,
      title: chat.title,
      lastMessage: chat.messages.length > 0 
        ? chat.messages[chat.messages.length - 1].text 
        : "New chat",
      timestamp: chat.updatedAt,
      messageCount: chat.messages.filter(m => m.isUser).length,
    }));
  };

  const handleNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
  };

  const handleUpdateChat = (updatedChat: Chat) => {
    setChats(prev => prev.map(chat => 
      chat.id === updatedChat.id ? updatedChat : chat
    ));
  };

  const handleDeleteChat = (chatId: string) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    if (currentChatId === chatId) {
      const remainingChats = chats.filter(chat => chat.id !== chatId);
      setCurrentChatId(remainingChats.length > 0 ? remainingChats[0].id : null);
    }
  };

  const handleSignOut = () => {
    logout();
  };

  const handleSendMessage = (messageText: string) => {
    if (!currentChat) {
      // Create a new chat if none exists
      handleNewChat();
      return;
    }

    // This will be handled by ChatContainer
  };

  const handleWelcomeMessage = (messageText: string) => {
    // Create a new chat and send the message
    const newChat: Chat = {
      id: Date.now().toString(),
      title: messageText.slice(0, 50) + (messageText.length > 50 ? "..." : ""),
      messages: [
        {
          id: Date.now().toString(),
          text: messageText,
          isUser: true,
          timestamp: new Date(),
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    
    // Add AI response after a delay
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Hello! I'm Claude, an AI assistant. I'd be happy to help you with that. Let me think about your request...",
        isUser: false,
        timestamp: new Date(),
      };
      
      const updatedChat: Chat = {
        ...newChat,
        messages: [...newChat.messages, aiMessage],
        updatedAt: new Date(),
      };
      
      setChats(prev => prev.map(chat => 
        chat.id === newChat.id ? updatedChat : chat
      ));
    }, 1000);
  };

  return (
    <SidebarProvider>
      <div className="h-screen w-full bg-background">
        <ResizableSidebar
          sidebar={
            <ClaudeSidebar
              chatHistory={generateChatHistory()}
              currentChatId={currentChatId}
              onSelectChat={handleSelectChat}
              onNewChat={handleNewChat}
              onDeleteChat={handleDeleteChat}
              onSignOut={handleSignOut}
              onOpenProfile={onNavigateToProfile}
            />
          }
          main={
            <>
              {/* Header with sidebar toggle */}
              <div className="flex-shrink-0 flex items-center gap-2 px-4 py-3 border-b border-border bg-background">
                <SidebarTrigger className="h-8 w-8 p-0 hover:bg-accent text-[rgba(255,255,255,1)]">
                  <Menu className="h-4 w-4" />
                </SidebarTrigger>
                {currentChat && (
                  <div className="flex-1 min-w-0">
                    <h1 className="text-sm font-medium text-foreground truncate">{currentChat.title}</h1>
                  </div>
                )}
                <ThemeToggle />
              </div>
              {currentChat && currentChat.messages.length > 0 ? (
                <ChatContainer
                  currentChat={currentChat}
                  onUpdateChat={handleUpdateChat}
                />
              ) : (
                <ClaudeWelcome onSendMessage={handleWelcomeMessage} />
              )}
            </>
          }
          minSidebarWidth={200}
          maxSidebarWidth={480}
          minMainWidth={320}
          defaultSidebarWidth={384} // 40% of 960px
        />
      </div>
    </SidebarProvider>
  );
}
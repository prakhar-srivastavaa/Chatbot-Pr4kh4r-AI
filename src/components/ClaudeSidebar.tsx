import { useState } from "react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter } from "./ui/sidebar";
import { 
  Plus, 
  MessageSquare, 
  FolderOpen, 
  Sparkles, 
  Star, 
  Clock,
  ChevronDown,
  User,
  Trash2
} from "lucide-react";
import { UserMenu } from "./UserMenu";

export interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
}

interface ClaudeSidebarProps {
  chatHistory: ChatHistory[];
  currentChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
  onSignOut: () => void;
  onOpenProfile?: () => void;
}

export function ClaudeSidebar({ 
  chatHistory, 
  currentChatId, 
  onSelectChat, 
  onNewChat, 
  onDeleteChat,
  onSignOut,
  onOpenProfile
}: ClaudeSidebarProps) {
  // Starred items can remain static or be enhanced later
  const starredItems = [
    "AI Product Documentation",
    "AI Documentation Strategy"
  ];

  // Use the most recent 10 chats from chatHistory as recents
  const recentItems = chatHistory
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 10);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString();
  };

  return (
    <div className="w-full h-full flex flex-col bg-sidebar border-r border-sidebar-border">
      <div className="p-4 border-b border-sidebar-border flex-shrink-0">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
            <span className="text-white text-xs font-medium">P</span>
          </div>
          <h1 className="text-lg font-medium text-sidebar-foreground">Pr4kh4r AI</h1>
        </div>
        
        <Button 
          onClick={onNewChat} 
          className="w-full justify-start bg-sidebar-accent hover:bg-sidebar-accent/80 text-sidebar-foreground border border-sidebar-border" 
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          New chat
        </Button>
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="flex-1">
          <div className="p-2">
            {/* Navigation sections */}
            <div className="space-y-1 mb-4">
              <Button
                variant="ghost"
                className="w-full justify-start h-8 px-2 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Chats
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start h-8 px-2 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent"
              >
                <FolderOpen className="h-4 w-4 mr-2" />
                Projects
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start h-8 px-2 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Artifacts
              </Button>
            </div>

            {/* Starred section */}
            <div className="mb-4">
              <div className="flex items-center gap-2 px-2 py-1 text-xs font-medium text-sidebar-foreground/70 uppercase tracking-wider">
                <Star className="h-3 w-3" />
                Starred
              </div>
              <div className="space-y-1 mt-2">
                {starredItems.map((item, index) => (
                  <button
                    key={index}
                    className="w-full text-left px-2 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent rounded-md truncate"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Recents section */}
            <div>
              <div className="flex items-center gap-2 px-2 py-1 text-xs font-medium text-sidebar-foreground/70 uppercase tracking-wider">
                <Clock className="h-3 w-3" />
                Recents
              </div>
              <div className="space-y-1 mt-2">
                {recentItems.length === 0 ? (
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">No recent chats</div>
                ) : (
                  recentItems.map((chat) => (
                    <div
                      key={chat.id}
                      className={`group flex items-center gap-1 w-full px-2 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent rounded-md ${currentChatId === chat.id ? 'bg-sidebar-accent' : ''}`}
                    >
                      <button
                        className="flex-1 text-left truncate"
                        onClick={() => onSelectChat(chat.id)}
                      >
                        {chat.title}
                      </button>
                      <button
                        className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteChat(chat.id);
                        }}
                        title="Delete chat"
                      >
                        <Trash2 className="h-3 w-3 text-red-500 hover:text-red-700" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      <div className="p-4 border-t border-sidebar-border flex-shrink-0">
        <UserMenu onSignOut={onSignOut} onOpenProfile={onOpenProfile} />
      </div>
    </div>
  );
}
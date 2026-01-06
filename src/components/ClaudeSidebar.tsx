import { useState } from "react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import {
  Plus,
  MessageSquare,
  Sparkles,
  Star,
  Clock,
  ChevronDown,
  User,
  Trash2,
  Tool,
  Flare,
  Link,
  BarChart3,
  TrendingUp,
  Robot,
  Calendar,
  Instagram,
  Twitter,
  Linkedin,
  Film,
  Layers,
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
  onOpenProfile,
}: ClaudeSidebarProps) {
  const [platformToolsOpen, setPlatformToolsOpen] = useState(true);

  const platformLinks = [
    { id: "post", label: "Post", Icon: MessageSquare },
    { id: "platformTools", label: "Platform Tools", Icon: Tool, hasSubitems: true },
    { id: "create", label: "Create", Icon: Flare },
    { id: "profiles", label: "Profiles", Icon: User, onClick: onOpenProfile },
    { id: "connectSocials", label: "Connect Socials", Icon: Link },
    { id: "analytics", label: "Analytics", Icon: BarChart3 },
    { id: "trends", label: "Trends", Icon: TrendingUp },
    { id: "agents", label: "Agents", Icon: Robot },
  ];

  const platformToolsSubitems = ["Automation", "Templates", "Insights"];

  const socialPlatforms = [
    { id: "instagram", label: "Instagram", Icon: Instagram, status: "Connected" },
    { id: "twitter", label: "X (Twitter)", Icon: Twitter, status: "Connected" },
    { id: "linkedin", label: "LinkedIn", Icon: Linkedin, status: "Pending approval" },
  ];

  const starredItems = [
    "AI Product Documentation",
    "AI Documentation Strategy",
  ];

  const recentItems = chatHistory
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 10);

  const handlePlatformLinkClick = (link: typeof platformLinks[number]) => {
    if (link.id === "platformTools") {
      setPlatformToolsOpen(prev => !prev);
    }
    link.onClick?.();
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
          size="default"
          variant="default"
        >
          <Plus className="h-4 w-4 mr-2" />
          New chat
        </Button>
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="flex-1">
          <div className="p-3 space-y-5">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/70">Platform</p>
              <div className="space-y-1">
                {platformLinks.map((link) => (
                  <div key={link.id} className="space-y-1">
                    <Button
                      variant="ghost"
                      size="default"
                      className="w-full justify-start gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent"
                      onClick={() => handlePlatformLinkClick(link)}
                    >
                      <link.Icon className="h-4 w-4 text-sidebar-foreground/80" />
                      <span className="flex-1 text-left truncate">{link.label}</span>
                      {link.hasSubitems && (
                        <ChevronDown
                          className={`h-4 w-4 text-sidebar-foreground/70 transition-transform ${platformToolsOpen ? "rotate-180" : ""}`}
                        />
                      )}
                    </Button>
                    {link.hasSubitems && platformToolsOpen && (
                      <div className="pl-10 space-y-1">
                        {platformToolsSubitems.map((item) => (
                          <Button
                            key={item}
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start gap-2 rounded-md text-[12px] text-sidebar-foreground/60 hover:bg-sidebar-accent"
                          >
                            <Layers className="h-3 w-3" />
                            <span>{item}</span>
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-background/60 px-3 py-3">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/70">
                <span>Connect Socials</span>
                <Button variant="outline" size="icon" className="h-7 w-7 p-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2 space-y-2">
                {socialPlatforms.map((platform) => (
                  <div
                    key={platform.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border/50 bg-background/30 px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <platform.Icon className="h-4 w-4 text-sidebar-foreground" />
                      <div className="text-left">
                        <p className="text-sm font-medium text-foreground">{platform.label}</p>
                        <p className="text-[11px] text-muted-foreground">{platform.status}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="gap-1 text-xs">
                      {platform.status === "Connected" ? "Manage" : "Connect"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Button
                variant="secondary"
                className="w-full justify-start gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg hover:from-blue-500 hover:to-cyan-400"
              >
                <Film className="h-4 w-4 text-white" />
                AI Clipping Agent
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 justify-start gap-2" size="sm">
                  <Sparkles className="h-4 w-4" />
                  Spark
                </Button>
                <Button variant="outline" className="flex-1 justify-start gap-2" size="sm">
                  <Calendar className="h-4 w-4" />
                  Calendar
                </Button>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 px-2 py-1 text-xs font-medium text-sidebar-foreground/70 uppercase tracking-wider">
                <Star className="h-3 w-3" />
                Starred
              </div>
              <div className="mt-2 space-y-1 px-2">
                {starredItems.map((item, index) => (
                  <button
                    key={index}
                    className="w-full text-left rounded-md px-2 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 px-2 py-1 text-xs font-medium text-sidebar-foreground/70 uppercase tracking-wider">
                <Clock className="h-3 w-3" />
                Recents
              </div>
              <div className="mt-2 space-y-1 px-2">
                {recentItems.length === 0 ? (
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">No recent chats</div>
                ) : (
                  recentItems.map((chat) => (
                    <div
                      key={chat.id}
                      className={`group flex items-center gap-1 w-full rounded-md px-2 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent ${currentChatId === chat.id ? "bg-sidebar-accent" : ""}`}
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
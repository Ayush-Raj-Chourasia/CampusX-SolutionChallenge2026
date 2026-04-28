import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMessagingStore, type ChatUser } from "@/stores/messagingStore";
import {
  ArrowLeft,
  Search,
  Trash2,
  MoreVertical,
  MessageSquare,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const formatTimestamp = (timestamp: string | Date): string => {
  const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "now";
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const Messages = () => {
  const navigate = useNavigate();
  const { chats, deleteChat, markAsRead, getChatsWithUnread, getUnreadCount } = useMessagingStore();
  const [filteredChats, setFilteredChats] = useState<ChatUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const sorted = getChatsWithUnread();
    if (searchQuery.trim()) {
      setFilteredChats(
        sorted.filter((chat) =>
          chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          chat.listingTitle.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredChats(sorted);
    }
  }, [searchQuery, chats, getChatsWithUnread]);

  const handleChatClick = (chat: ChatUser) => {
    markAsRead(chat.id);
    navigate(`/chat/${chat.listingId}`);
  };

  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteChat(chatId);
    toast.success("Chat deleted");
  };

  const unreadCount = getUnreadCount();

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Messages</h1>
            {unreadCount > 0 && (
              <p className="text-xs text-muted-foreground">
                {unreadCount} unread {unreadCount === 1 ? "message" : "messages"}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="bg-card border-b border-border px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Chats List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <MessageSquare className="w-12 h-12 text-muted-foreground/30 mb-3" />
            <p className="text-lg font-medium">
              {chats.length === 0 ? "No conversations yet" : "No messages found"}
            </p>
            <p className="text-sm text-muted-foreground">
              {chats.length === 0
                ? "Start chatting with sellers to see messages here"
                : "Try adjusting your search"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleChatClick(chat)}
                className="bg-card hover:bg-muted/50 cursor-pointer transition-colors border-b border-border last:border-b-0"
              >
                <div className="flex items-start gap-3 p-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold text-sm">
                      {chat.avatar ? (
                        <img src={chat.avatar} alt={chat.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        chat.name.charAt(0).toUpperCase()
                      )}
                    </div>
                  </div>

                  {/* Chat Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold truncate">{chat.name}</h3>
                      <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                        {formatTimestamp(chat.lastMessageTime)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mb-1">
                      {chat.listingTitle} • ₹{chat.listingPrice.toLocaleString()}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate max-w-xs">
                        {chat.lastMessage}
                      </p>
                      {chat.unread > 0 && (
                        <div className="ml-2 flex-shrink-0 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                          {chat.unread}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0 ml-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteChat(chat.id, e as any);
                          }}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Chat
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;

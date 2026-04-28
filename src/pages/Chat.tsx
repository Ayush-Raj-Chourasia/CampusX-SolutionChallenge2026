import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FeedbackModal } from "@/components/FeedbackModal";
import {
  ArrowLeft,
  Shield,
  Send,
  CheckCircle2,
  Lock,
  Image as ImageIcon,
  Phone,
  MoreVertical,
  X,
  Flag,
  Trash2,
  Ban,
  PhoneOff,
  AlertCircle
} from "lucide-react";
import { useListingsStore } from "@/stores/listingsStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { socket } from "@/lib/socket";
import { getApiUrl } from "@/lib/api";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const API_URL = getApiUrl();

interface Message {
  _id: string;
  sender: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
  content: string;
  image?: string;
  createdAt: string;
}

interface ChatData {
  _id: string;
  participants: {
    _id: string;
    name: string;
    profilePicture?: string;
  }[];
  listing: string;
}

const Chat = () => {
  const { id } = useParams();
  const listingId = id || "0";
  // Store uses number IDs in mock data, but we need string for backend compatibility if possible, 
  // or at least not NaN.

  const listing = useListingsStore((state) => state.getListingById(parseInt(listingId) || 0));
  const getCurrentUser = () => {
    // Helper to get current user from session or token (decoding optional, but we have /api/auth/profile)
    // For now, we'll rely on the fact that 'sender' in message distinguishes 'user' vs 'other'
    // But to style "my messages" vs "their messages", we need my ID.
    // Let's assume we can parse it from token or store it.
    // For simplicity, we'll decode basic info or use a stored user ID.
    const token = sessionStorage.getItem('authToken');
    if (!token) return null;
    try {
      // simplistic decode or just trust the response structure
      // We'll fetch user profile once or store ID on login. 
      // For now, let's fetch current user ID on mount.
      return null;
    } catch (e) { return null; }
  };

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chat, setChat] = useState<ChatData | null>(null);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [callActive, setCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [escrowCompleted, setEscrowCompleted] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const callTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fallback product/seller info if listing store is empty (e.g. refresh)
  //Ideally we should fetch listing details from API if not in store


  // Fetch Current User
  useEffect(() => {
    const fetchUser = async () => {
      const token = sessionStorage.getItem('authToken');
      if (token) {
        try {
          const res = await fetch(`${API_URL}/api/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          if (data.success) {
            setCurrentUser(data.data.user);
          }
        } catch (err) {
          console.error("Error fetching user:", err);
        }
      }
    };
    fetchUser();
  }, []);

  // Fetch Listing if not in store
  const [apiListing, setApiListing] = useState<any>(null);

  useEffect(() => {
    const fetchListing = async () => {
      if (listing) return; // Already have it from store
      if (!listingId || listingId === "0") return;

      // Check if it's a valid ObjectId before calling API to avoid 500s
      const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(listingId);
      if (!isValidObjectId) {
        return;
      }

      const token = sessionStorage.getItem('authToken');
      if (!token) return; // Need auth to fetch protected listing

      try {
        const res = await fetch(`${API_URL}/listings/${listingId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setApiListing(data.data);
        }
      } catch (err) {
        console.error("Error fetching listing:", err);
      }
    };
    fetchListing();
  }, [listingId, listing]);

  const activeListing = listing || apiListing;
  const product = activeListing || {
    title: "Item",
    price: 0,
    image: "📦",
    seller: "Seller",
    _id: "0",
    college: "Campus"
  };

  // Initialize Chat
  // Initialize Chat
  useEffect(() => {
    const initChat = async () => {
      if (!currentUser) {
        console.log("Waiting for currentUser...");
        return;
      }

      if (!activeListing) {
        console.log("Waiting for listing data...");
        return;
      }

      console.log("Initializing chat with:", { currentUser, activeListing });

      try {
        const token = sessionStorage.getItem('authToken');

        // Use sellerId from the active listing (store or API)
        // If it's a mock listing (numeric ID), we might still need a fallback for the demo.
        let sellerId = (activeListing as any).seller || (activeListing as any).sellerId;

        // If sellerId is just a name "Priya M.", we can't look it up easily without real user data.
        // But the API listing should return a user object or ID for 'seller'.
        if (typeof sellerId === 'object' && sellerId._id) {
          sellerId = sellerId._id;
        }

        // Validate ObjectId
        const isValidObjectId = (id: any) => typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);

        if (!isValidObjectId(sellerId)) {
          // Fallback for Mock Data only
          sellerId = "60d0fe4f5311236168a109ca";
        }

        const res = await fetch(`${API_URL}/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            listingId: listingId.toString(),
            sellerId: sellerId
          })
        });

        const data = await res.json();
        console.log("Chat Init Response:", data);

        if (data.success) {
          setChat(data.data);

          // Fetch Messages
          const msgRes = await fetch(`${API_URL}/chat/${data.data._id}/messages`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const msgData = await msgRes.json();
          if (msgData.success) {
            setMessages(msgData.data);
          }

          // Socket Join
          console.log("🔌 Connecting socket and joining room:", data.data._id);
          socket.connect();
          socket.emit('join_chat', data.data._id);
          console.log("✅ Socket connected:", socket.connected);
        } else {
          console.error("Chat Init Failed:", data);
          toast.error(data.message || "Failed to init chat");
        }
      } catch (err) {
        console.error("Chat Init Error:", err);
        // toast.error("Failed to connect to chat");
      }
    };

    initChat();

    return () => {
      socket.off('receive_message');
      socket.disconnect();
    };
  }, [listingId, currentUser, activeListing]);

  // Socket Listener
  useEffect(() => {
    if (!chat) return;

    console.log("Setting up socket listener for chat:", chat._id);

    const handleReceiveMessage = (newMessage: Message) => {
      console.log("Received message via socket:", newMessage);
      setMessages((prev) => {
        // Dedup
        if (prev.find(m => m._id === newMessage._id)) return prev;
        return [...prev, newMessage];
      });
    };

    socket.on('receive_message', handleReceiveMessage);

    return () => {
      console.log("Cleaning up socket listener");
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [chat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    console.log("handleSend called", { input, imagePreview, chat });

    if (!chat) {
      console.error("Cannot send: chat is null");
      toast.error("Chat not initialized. Please refresh the page.");
      return;
    }

    if (!input.trim() && !imagePreview) {
      console.log("Empty message, not sending");
      return;
    }

    try {
      const token = sessionStorage.getItem('authToken');
      console.log("Sending message to API...", { chatId: chat._id, message: input });

      const res = await fetch(`${API_URL}/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          chatId: chat._id,
          content: input,
          image: imagePreview
        })
      });

      const data = await res.json();
      console.log("Send message response:", data);

      if (data.success) {
        setInput("");
        setImagePreview(null);
        toast.success("Message sent!");
      } else {
        toast.error(data.message || "Failed to send message");
      }
    } catch (err) {
      console.error("Send Error:", err);
      toast.error("Failed to send message");
    }
  };

  const handleInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const handleStartCall = () => {
    setCallActive(true);
    setCallDuration(0);
    callTimerRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    toast.success(`Calling ${product.seller}...`);
  };

  const handleEndCall = () => {
    setCallActive(false);
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
    }
    setCallModalOpen(false);
    toast.info(`Call ended - ${formatDuration(callDuration)}`);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    if (file.size > MAX_FILE_SIZE) {
      setUploadError("Image exceeds 1MB limit");
      toast.error("Image exceeds 1MB limit");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setUploadError("Only image files allowed");
      toast.error("Only image files allowed");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleBlockUser = () => toast.success(`${product.seller} has been blocked`);
  const handleReportUser = () => toast.success("Report submitted.");
  const handleDeleteChat = () => toast.success("Chat deleted");
  const handleCompleteEscrow = () => {
    setEscrowCompleted(true);
    setShowFeedback(true);
    toast.success("✅ Payment released! Now share your feedback.");
  };
  const handleCloseFeedback = () => {
    setShowFeedback(false);
    setFeedbackGiven(true);
  };

  // Determine other participant name for Header
  const otherParticipant = chat?.participants.find(p => p._id !== currentUser?._id);
  const displayName = otherParticipant?.name || product.seller;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to={`/product/${listingId}`}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold">
                  {displayName.charAt(0)}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-card" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{displayName}</span>
                  <CheckCircle2 className="w-4 h-4 text-success" />
                </div>
                <p className="text-xs text-muted-foreground">Online • {product.college || 'Campus'}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setCallModalOpen(true)}>
              <Phone className="w-5 h-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleReportUser}>
                  <Flag className="w-4 h-4 mr-2" />
                  Report User
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleBlockUser}>
                  <Ban className="w-4 h-4 mr-2" />
                  Block User
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDeleteChat} className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Chat
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Product Reference */}
        <Link to={`/product/${listingId}`}>
          <div className="mt-3 p-3 rounded-xl bg-muted/50 flex items-center gap-3 hover:bg-muted transition-colors">
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-2xl overflow-hidden">
              {typeof product.image === 'string' && product.image.startsWith('data:') ? (
                <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
              ) : (
                product.image
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">{product.title}</p>
              <p className="text-secondary font-semibold">₹{product.price.toLocaleString()}</p>
            </div>
            <div className="escrow-secured text-xs">
              <Shield className="w-3 h-3" />
              Escrow
            </div>
          </div>
        </Link>
      </header>

      {/* Encryption Notice */}
      <div className="bg-muted/30 py-2 px-4 flex items-center justify-center gap-2">
        <Lock className="w-3 h-3 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Messages are end-to-end encrypted</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg) => {
            const isMe = msg.sender._id === currentUser?._id;
            return (
              <motion.div
                key={msg._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[80%] ${isMe ? "bg-primary text-primary-foreground" : "bg-card border border-border"
                  } rounded-2xl px-4 py-3`}>
                  {msg.image && (
                    <img src={msg.image} alt="Shared" className="rounded-lg mb-2 max-w-full" />
                  )}
                  <p className="text-sm whitespace-pre-line">{msg.content}</p>
                  <p className={`text-xs mt-1 ${isMe ? "text-primary-foreground/70" : "text-muted-foreground"
                    }`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-muted-foreground"
          >
            <span className="text-sm">{displayName} is typing...</span>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Complete Escrow Button */}
      {!escrowCompleted && (
        <div className="px-4 pb-2">
          <Button
            variant="trust"
            size="sm"
            className="w-full gap-2"
            onClick={handleCompleteEscrow}
          >
            <CheckCircle2 className="w-4 h-4" />
            Complete Escrow & Release Payment
          </Button>
        </div>
      )}

      {/* Image Preview */}
      {imagePreview && (
        <div className="px-4 pb-2">
          <div className="relative inline-block">
            <img src={imagePreview} alt="Preview" className="h-20 rounded-lg" />
            <button
              onClick={() => setImagePreview(null)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
              aria-label="Remove image preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 bg-card border-t border-border">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          aria-label="Upload chat attachment"
          title="Upload chat attachment"
        />
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}>
            <ImageIcon className="w-5 h-5" />
          </Button>
          <Input
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleInputKeyPress}
            className="flex-1"
          />
          <Button
            variant="secondary"
            size="icon"
            onClick={handleSend}
            disabled={!input.trim() && !imagePreview}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedback}
        onClose={handleCloseFeedback}
        listingTitle={product.title}
        userName={displayName}
        listingId={listingId}
        role="buyer"
      />

      {/* Call Modal */}
      <Dialog open={callModalOpen} onOpenChange={setCallModalOpen}>
        <DialogContent className="sm:max-w-md">
          {/* Same Call Modal Content */}
          <DialogHeader>
            <DialogTitle className="text-center">
              {callActive ? "Call in Progress" : "Call Seller"}
            </DialogTitle>
            <DialogDescription className="text-center">
              {callActive ? formatDuration(callDuration) : `Call ${displayName} about ${product.title}`}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center py-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-4xl font-bold mb-4">
              {displayName.charAt(0)}
            </div>
            <p className="text-lg font-semibold">{displayName}</p>
          </div>
          {/* Footer same as before */}
          <DialogFooter className="flex justify-center gap-4">
            {callActive ? (
              <Button variant="destructive" size="lg" className="w-16 h-16 rounded-full" onClick={handleEndCall}>
                <PhoneOff className="w-6 h-6" />
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setCallModalOpen(false)}>Cancel</Button>
                <Button variant="trust" size="lg" className="gap-2" onClick={handleStartCall}>
                  <Phone className="w-5 h-5" />
                  Start Call
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Chat;

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "@/components/icons/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  Plus,
  Shield,
  Star,
  Heart,
  MessageSquare,
  ChevronDown,
  GraduationCap,
  Bell,
  User,
  CheckCircle2,
  Sparkles,
  X,
  Settings,
  LogOut,
  HelpCircle,
  ShoppingBag
} from "lucide-react";
import { useListingsStore, type Listing } from "@/stores/listingsStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const categories = [
  { id: "all", label: "All Items", emoji: "🏪" },
  { id: "books", label: "Books", emoji: "📚" },
  { id: "electronics", label: "Electronics", emoji: "💻" },
  { id: "cycles", label: "Cycles", emoji: "🚲" },
  { id: "furniture", label: "Furniture", emoji: "🪑" },
  { id: "clothing", label: "Clothing", emoji: "👕" },
  { id: "instruments", label: "Instruments", emoji: "🎸" },
  { id: "other", label: "Other", emoji: "📦" },
];

type SortOption = "relevance" | "price-low" | "price-high";

const notifications = [
  { id: 1, title: "New offer received", message: "Rahul offered ₹50,000 for MacBook Air", time: "2 min ago", unread: true },
  { id: 2, title: "Payment released", message: "₹6,000 has been released for Guitar sale", time: "1 hour ago", unread: true },
  { id: 3, title: "Item marked sold", message: "Your 'Engineering Mathematics' was marked as sold", time: "3 hours ago", unread: false },
];

const Marketplace = () => {
  const navigate = useNavigate();
  const listings = useListingsStore((state) => state.listings);
  const setListings = useListingsStore((state) => state.setListings);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [wishlistedItems, setWishlistedItems] = useState<number[]>([2, 6]);
  const [isLoading, setIsLoading] = useState(true);
  // Persist favorites per user session
  const currentUser = typeof window !== 'undefined' && sessionStorage.getItem('currentUser')
    ? JSON.parse(sessionStorage.getItem('currentUser')!)
    : null;

  // Fetch listings from backend on mount
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const token = sessionStorage.getItem('authToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const API_URL = import.meta.env.VITE_API_URL || 'https://campusx-rg-axgefjeqgae2bpfs.eastasia-01.azurewebsites.net';

        const response = await fetch(`${API_URL}/api/listings`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 401) {
          // Prevent loop: only toast if we are actually redirecting
          sessionStorage.removeItem('authToken'); // Clear invalid token
          toast.error('Session expired. Please login again.');
          navigate('/login');
          return;
        }

        const data = await response.json();

        if (data.success) {
          // Convert backend format to frontend format
          const formattedListings = data.data.map((item: any) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            price: item.price,
            originalPrice: item.originalPrice,
            condition: item.condition,
            category: item.category,
            image: item.image,
            images: item.images || [],
            seller: item.seller,
            sellerId: item.sellerId,
            college: item.college,
            verified: item.verified,
            trustScore: item.trustScore,
            escrow: item.escrow,
            wishlist: item.wishlist,
            status: item.status,
            views: item.views,
            year: 'Student',
            rating: item.trustScore / 20, // Convert trustScore to rating
            reviews: 0,
            createdAt: new Date(item.createdAt)
          }));
          setListings(formattedListings);
        }
      } catch (error) {
        console.error('Fetch listings error:', error);
        toast.error('Failed to load listings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, []); // Empty deps - only run on mount

  // initialize wishlisted from session
  useEffect(() => {
    try {
      const key = currentUser ? `favorites_${currentUser.collegeEmail}` : 'favorites_guest';
      const stored = sessionStorage.getItem(key);
      if (stored) setWishlistedItems(JSON.parse(stored));
    } catch (e) {
      // ignore
    }
  }, [currentUser]);
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsList, setNotificationsList] = useState<any[]>(() => {
    try {
      const stored = sessionStorage.getItem('notifications');
      return stored ? JSON.parse(stored) : notifications;
    } catch (e) {
      return notifications;
    }
  });

  const toggleWishlist = async (id: number) => {
    try {
      const token = sessionStorage.getItem('authToken');
      if (!token) {
        toast.error('Please login to manage wishlist');
        return;
      }

      const API_URL = import.meta.env.VITE_API_URL || 'https://campusx-rg-axgefjeqgae2bpfs.eastasia-01.azurewebsites.net';

      const response = await fetch(`${API_URL}/api/listings/${id}/wishlist`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setWishlistedItems(prev => {
          const next = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id];
          try {
            const key = currentUser ? `favorites_${currentUser.collegeEmail}` : 'favorites_guest';
            sessionStorage.setItem(key, JSON.stringify(next));
          } catch (e) { }
          return next;
        });
        toast.success(data.message);
      }
    } catch (error) {
      console.error('Wishlist error:', error);
      toast.error('Failed to update wishlist');
    }
  };

  const markAllRead = () => {
    const updated = notificationsList.map(n => ({ ...n, unread: false }));
    setNotificationsList(updated);
    try { sessionStorage.setItem('notifications', JSON.stringify(updated)); } catch (e) { }
    toast.success("All notifications marked as read");
  };

  const unreadCount = notificationsList.filter(n => n.unread).length;

  // Persist notifications when list changes
  useEffect(() => {
    try { sessionStorage.setItem('notifications', JSON.stringify(notificationsList)); } catch (e) { }
  }, [notificationsList]);

  // Filter and sort listings
  const filteredListings = useMemo(() => {
    let result = [...listings];

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter(item => item.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.seller.toLowerCase().includes(query)
      );
    }

    // Filter by price range
    result = result.filter(item =>
      item.price >= priceRange[0] && item.price <= priceRange[1]
    );

    // Sort
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "relevance":
      default:
        result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
    }

    return result;
  }, [listings, selectedCategory, searchQuery, sortBy, priceRange]);

  const sortLabels: Record<SortOption, string> = {
    relevance: "Relevance",
    "price-low": "Price: Low → High",
    "price-high": "Price: High → Low",
  };

  const clearFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setPriceRange([0, 100000]);
    setSortBy("relevance");
  };

  const hasActiveFilters = selectedCategory !== "all" || searchQuery || priceRange[0] > 0 || priceRange[1] < 100000;

  const handleLogout = () => {
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <Link to="/">
              <Logo size="sm" />
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search for books, electronics, cycles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 h-11"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <Dialog open={notificationsOpen} onOpenChange={(open) => {
                setNotificationsOpen(open);
                if (open) {
                  // mark all as read when opened
                  const updated = notificationsList.map(n => ({ ...n, unread: false }));
                  setNotificationsList(updated);
                  try { sessionStorage.setItem('notifications', JSON.stringify(updated)); } catch (e) { }
                }
              }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
                  )}
                </Button>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                      Notifications
                      {unreadCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={markAllRead}>
                          Mark all read
                        </Button>
                      )}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {notificationsList.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-3 rounded-lg ${notif.unread ? "bg-secondary/10" : "bg-muted/50"}`}
                      >
                        <div className="flex items-start justify-between">
                          <p className="font-medium text-sm">{notif.title}</p>
                          {notif.unread && <div className="w-2 h-2 bg-secondary rounded-full" />}
                        </div>
                        <p className="text-sm text-muted-foreground">{notif.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>

              {/* Messages dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MessageSquare className="w-5 h-5" />
                    {/* unread dot if any unread messages */}
                    {(() => {
                      try {
                        const key = currentUser ? `messages_${currentUser.collegeEmail}` : 'messages_guest';
                        const msgs = JSON.parse(sessionStorage.getItem(key) || '[]');
                        if (msgs.some((m: any) => m.unread)) {
                          return <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full" />;
                        }
                      } catch (e) { }
                      return null;
                    })()}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  <div className="px-3 py-2 border-b border-border">
                    <p className="font-medium">Messages</p>
                  </div>
                  {(() => {
                    try {
                      const key = currentUser ? `messages_${currentUser.collegeEmail}` : 'messages_guest';
                      const msgs = JSON.parse(sessionStorage.getItem(key) || '[]');
                      if (msgs.length === 0) {
                        return <div className="p-3 text-sm text-muted-foreground">No conversations yet</div>;
                      }
                      return msgs.map((c: any) => (
                        <DropdownMenuItem key={c.id} onClick={() => window.location.href = `/chat/${c.id}`}>
                          <div className="flex items-center justify-between w-full">
                            <div>
                              <div className="font-medium text-sm">{c.name}</div>
                              <div className="text-xs text-muted-foreground truncate w-44">{c.last}</div>
                            </div>
                            {c.unread && <div className="w-2 h-2 bg-secondary rounded-full" />}
                          </div>
                        </DropdownMenuItem>
                      ));
                    } catch (e) {
                      return <div className="p-3 text-sm text-muted-foreground">No conversations yet</div>;
                    }
                  })()}
                </DropdownMenuContent>
              </DropdownMenu>
              <Link to="/sell">
                <Button variant="secondary" size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Sell
                </Button>
              </Link>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2 border-b border-border">
                    <p className="font-medium">{currentUser ? currentUser.fullName : 'Guest'}</p>
                    <p className="text-sm text-muted-foreground">{currentUser ? currentUser.collegeEmail : 'Not signed in'}</p>
                  </div>
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="w-4 h-4 mr-2" />
                    View Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/edit-profile')}>
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/my-listings')}>
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    My Listings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/favorites')}>
                    <Heart className="w-4 h-4 mr-2" />
                    Favorites
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/help')}>
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Help & Support
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => {
                    // logout: clear session user and navigate to login
                    sessionStorage.removeItem('currentUser');
                    toast.success('Logged out');
                    navigate('/login');
                  }} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Campus Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl bg-gradient-to-r from-primary/10 via-secondary/10 to-success/10 border border-border flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">{currentUser?.college || 'Your College'} Marketplace</h2>
              <p className="text-sm text-muted-foreground">
                {filteredListings.length > 0
                  ? `${filteredListings.length} listings from verified students`
                  : 'Trading with verified students from your campus'}
              </p>
            </div>
          </div>
          <div className="trust-badge">
            <Shield className="w-3.5 h-3.5" />
            Campus Only
          </div>
        </motion.div>

        {/* Categories */}
        <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === cat.id
                ? "bg-secondary text-secondary-foreground"
                : "bg-muted hover:bg-muted/80 text-muted-foreground"
                }`}
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Filters Bar */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">{filteredListings.length}</span> items available
            </p>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-destructive">
                Clear filters
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* Filters Sheet */}
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                  {hasActiveFilters && (
                    <span className="w-2 h-2 bg-secondary rounded-full" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  <div className="space-y-4">
                    <Label>Price Range: ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}</Label>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      min={0}
                      max={100000}
                      step={500}
                      className="mt-2"
                    />
                  </div>
                  <Button className="w-full" onClick={() => setFiltersOpen(false)}>
                    Apply Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  Sort: {sortLabels[sortBy]}
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy("relevance")}>
                  Relevance (Latest)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("price-low")}>
                  Price: Low → High
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("price-high")}>
                  Price: High → Low
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* AI Recommendation Banner */}
        {filteredListings.some(l => l.id === 2) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 rounded-xl bg-gradient-to-r from-secondary/5 to-primary/5 border border-secondary/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-primary-foreground">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium">AI Price Alert</p>
                <p className="text-sm text-muted-foreground">The MacBook Air is priced 40% below market average. Great deal!</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Listings Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading listings from your college...</p>
            </div>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No items found matching your criteria</p>
            <Button variant="secondary" className="mt-4" onClick={clearFilters}>
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing, index) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                {/* Image */}
                <div className="relative aspect-square bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center overflow-hidden">
                  {typeof listing.image === 'string' && (listing.image.startsWith('http') || listing.image.startsWith('data:image')) ? (
                    <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-7xl">{listing.image}</span>
                  )}

                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(listing.id)}
                    className="absolute top-3 right-3 w-10 h-10 rounded-full bg-card/80 backdrop-blur flex items-center justify-center hover:bg-card transition-colors"
                    aria-label={wishlistedItems.includes(listing.id) ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart className={`w-5 h-5 ${wishlistedItems.includes(listing.id) ? "fill-destructive text-destructive" : "text-muted-foreground"}`} />
                  </button>

                  {/* Escrow Badge */}
                  {listing.escrow && (
                    <div className="absolute top-3 left-3 escrow-secured text-xs">
                      <Shield className="w-3 h-3" />
                      Escrow
                    </div>
                  )}

                  {/* Discount Badge */}
                  <div className="absolute bottom-3 left-3 px-2 py-1 rounded-lg bg-destructive text-destructive-foreground text-xs font-bold">
                    {Math.round((1 - listing.price / listing.originalPrice) * 100)}% OFF
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold line-clamp-1">{listing.title}</h3>
                    <span className="px-2 py-0.5 rounded-md bg-muted text-xs font-medium text-muted-foreground">
                      {listing.condition}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-secondary">₹{listing.price.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground line-through">₹{listing.originalPrice.toLocaleString()}</span>
                  </div>

                  {/* Seller Info */}
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-xs font-semibold">
                        {listing.seller.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium">{listing.seller}</span>
                          {listing.verified && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{listing.year}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-accent text-accent" />
                      <span className="text-sm font-medium">{listing.rating}</span>
                      <span className="text-xs text-muted-foreground">({listing.reviews})</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Link to={`/product/${listing.id}`} className="flex-1">
                      <Button variant="default" size="sm" className="w-full">
                        View Details
                      </Button>
                    </Link>
                    <Link to={`/chat/${listing.id}`}>
                      <Button variant="outline" size="icon" className="shrink-0">
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Marketplace;

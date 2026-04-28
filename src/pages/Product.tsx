import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Logo } from "@/components/icons/Logo";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft,
  Shield, 
  Star, 
  Heart,
  MessageSquare,
  CheckCircle2,
  MapPin,
  Clock,
  Share2,
  Sparkles,
  Package,
  Loader2,
  Pencil,
  Trash2
} from "lucide-react";
import { toast } from "sonner";
import { useListingsStore, type EscrowState } from "@/stores/listingsStore";
import { UPIPaymentModal } from "@/components/payment/UPIPaymentModal";
import { formatMemberSince, formatResponseTime, formatNumber } from "@/lib/metricsFormatter";

const escrowSteps: { state: EscrowState; label: string; description: string }[] = [
  { state: "INITIATED", label: "Payment Initiated", description: "Processing your payment..." },
  { state: "ESCROW_HOLD", label: "In Escrow", description: "Funds secured. Awaiting delivery..." },
  { state: "DELIVERED", label: "Delivered", description: "Confirm you received the item" },
  { state: "RELEASED", label: "Complete", description: "Payment released to seller" },
];

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const escrowStates = useListingsStore((state) => state.escrowStates);
  const setEscrowState = useListingsStore((state) => state.setEscrowState);
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUPIPayment, setShowUPIPayment] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const currentEscrowState = escrowStates[id || ""] || "NONE";

  // Get current user
  useEffect(() => {
    const userData = sessionStorage.getItem('currentUser');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  // Fetch product data from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = sessionStorage.getItem('authToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/listings/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Product data:', data.data);
          setProduct(data.data);
          setIsWishlisted(data.data.wishlist || false);
        } else {
          toast.error('Failed to load product');
          navigate('/marketplace');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Error loading product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const sellerInfo = {
    name: product?.seller || "Unknown",
    avatar: product?.seller?.charAt(0) || "U",
    college: product?.college || "College",
    year: "Student",
    department: "Department",
    rating: product?.trustScore ? Math.min(5, product.trustScore / 20) : 0,
    reviews: 0,
    transactions: 0,
    memberSince: product?.createdAt ? formatMemberSince(new Date(product.createdAt)) : "Recently",
    responseTime: "< 1 hour",
    verified: product?.verified || false,
  };

  const aiPricingAnalysis = {
    fairPrice: Math.round((product?.price || 0) * 0.95),
    marketAverage: Math.round((product?.price || 0) * 1.18),
    verdict: "Great Deal",
    confidence: 94,
  };

  const handleBuyNow = async () => {
    if (currentEscrowState !== "NONE") return;
    setShowUPIPayment(true);
  };

  const handlePaymentSuccess = async () => {
    setIsProcessing(true);
    
    // Simulate escrow flow after successful payment
    setEscrowState(id || "", "INITIATED");
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    setEscrowState(id || "", "ESCROW_HOLD");
    toast.success("Payment secured in escrow! Awaiting delivery.");
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    setEscrowState(id || "", "DELIVERED");
    toast.info("Seller marked as delivered. Please confirm receipt.");
    
    setIsProcessing(false);
    setShowUPIPayment(false);
  };

  const handleConfirmDelivery = async () => {
    setIsProcessing(true);
    toast.success("Confirming delivery...");
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    setEscrowState(id || "", "RELEASED");
    toast.success("Payment released to seller! Transaction complete.");
    
    setIsProcessing(false);
  };

  const handleMakeOffer = () => {
    navigate(`/chat/${id}`);
  };

  const handleDeleteListing = async () => {
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    try {
      const token = sessionStorage.getItem('authToken');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${API_URL}/api/listings/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        toast.success('Listing deleted successfully');
        navigate('/my-listings');
      } else {
        toast.error('Failed to delete listing');
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
      toast.error('Error deleting listing');
    }
  };

  // Check if current user is the owner
  const userId = currentUser?.id || currentUser?._id;
  const sellerId = product?.sellerId || product?.seller;
  const isOwner = currentUser && product && userId && sellerId &&
    (String(userId) === String(sellerId));
  
  console.log('Ownership check:', { userId, sellerId, isOwner, currentUser, product });

  const getCurrentStepIndex = () => {
    return escrowSteps.findIndex(s => s.state === currentEscrowState);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Product not found</p>
          <Button onClick={() => navigate('/marketplace')}>Back to Marketplace</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/marketplace">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <Logo size="sm" />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Link copied!");
              }}>
                <Share2 className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-destructive text-destructive" : ""}`} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left - Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center relative overflow-hidden">
              {product.images && product.images.length > 0 && product.images[selectedImage] ? (
                typeof product.images[selectedImage] === 'string' && product.images[selectedImage].startsWith('http') ? (
                  <img src={product.images[selectedImage]} alt={product.title} className="w-full h-full object-cover" />
                ) : product.images[selectedImage].startsWith('data:image') ? (
                  <img src={product.images[selectedImage]} alt={product.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-9xl">{product.images[selectedImage]}</span>
                )
              ) : (
                <span className="text-9xl">📦</span>
              )}
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <div className="escrow-secured">
                  <Shield className="w-4 h-4" />
                  Escrow Protected
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-destructive text-destructive-foreground text-sm font-bold">
                  {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                </div>
              </div>
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 0 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 flex-shrink-0 rounded-xl bg-muted flex items-center justify-center transition-all overflow-hidden ${
                      selectedImage === i ? "ring-2 ring-primary ring-offset-2" : ""
                    }`}
                  >
                    {typeof img === 'string' && (img.startsWith('http') || img.startsWith('data:image')) ? (
                      <img src={img} alt={`${product.title} ${i + 1}`} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl">{img}</span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* AI Price Analysis */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 rounded-xl bg-gradient-to-r from-success/10 to-secondary/10 border border-success/20"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-success to-secondary flex items-center justify-center text-success-foreground">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">AI Price Analysis</h4>
                    <span className="text-sm text-muted-foreground">{aiPricingAnalysis.confidence}% confidence</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Listed</p>
                      <p className="font-semibold">₹{product.price.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Fair Price</p>
                      <p className="font-semibold text-success">₹{aiPricingAnalysis.fairPrice.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Market Avg</p>
                      <p className="font-semibold">₹{aiPricingAnalysis.marketAverage.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="mt-3 px-3 py-1.5 rounded-lg bg-success/20 text-success text-sm font-medium inline-flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    {aiPricingAnalysis.verdict} - Below fair price!
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right - Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Title & Price */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-muted text-sm font-medium">{product.category}</span>
                <span className="px-3 py-1 rounded-lg bg-secondary/10 text-secondary text-sm font-medium">{product.condition}</span>
              </div>
              <h1 className="text-3xl font-display font-bold">{product.title}</h1>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-secondary">₹{product.price.toLocaleString()}</span>
                <span className="text-xl text-muted-foreground line-through">₹{product.originalPrice.toLocaleString()}</span>
              </div>
            </div>

            {/* Meta */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {new Date(product.createdAt).toLocaleDateString('en-IN', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
              <span>{formatNumber(product.views || 0)} views</span>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="font-semibold">Description</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            {/* Meetup Locations */}
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <MapPin className="w-4 h-4 text-secondary" />
                Preferred Meetup Spots
              </h3>
              <div className="flex flex-wrap gap-2">
                {["Library", "Hostel Block", "Academic Block"].map((spot) => (
                  <span key={spot} className="px-3 py-1.5 rounded-lg bg-muted text-sm">
                    {spot}
                  </span>
                ))}
              </div>
            </div>

            {/* Escrow Progress */}
            {currentEscrowState !== "NONE" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-card border border-border space-y-4"
              >
                <h3 className="font-semibold flex items-center gap-2">
                  <Package className="w-5 h-5 text-secondary" />
                  Escrow Status
                </h3>
                <div className="space-y-3">
                  {escrowSteps.map((step, index) => {
                    const currentIndex = getCurrentStepIndex();
                    const isComplete = index < currentIndex;
                    const isCurrent = index === currentIndex;
                    
                    return (
                      <div key={step.state} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          isComplete ? "bg-success text-success-foreground" :
                          isCurrent ? "bg-secondary text-secondary-foreground" :
                          "bg-muted text-muted-foreground"
                        }`}>
                          {isComplete ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${isCurrent ? "text-secondary" : ""}`}>{step.label}</p>
                          {isCurrent && (
                            <p className="text-sm text-muted-foreground">{step.description}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {currentEscrowState === "DELIVERED" && (
                  <Button 
                    variant="hero" 
                    className="w-full" 
                    onClick={handleConfirmDelivery}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Confirm Delivery
                      </>
                    )}
                  </Button>
                )}
              </motion.div>
            )}

            {/* Seller Card */}
            <div className="p-4 rounded-xl bg-card border border-border space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold text-lg">
                    {sellerInfo.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{sellerInfo.name}</span>
                      {sellerInfo.verified && (
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {sellerInfo.department} • {sellerInfo.year}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Shield className="w-3 h-3 text-primary" />
                      <p className="text-xs text-primary font-medium">{sellerInfo.college}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    <span className="font-semibold">{sellerInfo.rating}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{sellerInfo.reviews} reviews</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 py-3 border-t border-b border-border">
                <div className="text-center">
                  <p className="font-semibold">{sellerInfo.transactions}</p>
                  <p className="text-xs text-muted-foreground">Transactions</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold">{sellerInfo.responseTime}</p>
                  <p className="text-xs text-muted-foreground">Response</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold">{sellerInfo.memberSince}</p>
                  <p className="text-xs text-muted-foreground">Member Since</p>
                </div>
              </div>

              <Link to={`/chat/${id}`}>
                <Button variant="outline" className="w-full gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Message Seller
                </Button>
              </Link>
            </div>

            {/* Action Buttons */}
            {isOwner ? (
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20 text-center">
                  <p className="text-sm text-muted-foreground">This is your listing</p>
                </div>
                <div className="flex gap-3">
                  <Link to={`/edit-listing/${id}`} className="flex-1">
                    <Button variant="default" size="lg" className="w-full gap-2">
                      <Pencil className="w-5 h-5" />
                      Edit Listing
                    </Button>
                  </Link>
                  <Button 
                    variant="destructive" 
                    size="lg" 
                    onClick={handleDeleteListing}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            ) : currentEscrowState === "NONE" && (
              <div className="flex gap-3">
                <Button 
                  variant="hero" 
                  size="lg" 
                  className="flex-1" 
                  onClick={handleBuyNow}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      Buy with Escrow
                    </>
                  )}
                </Button>
                <Button variant="secondary" size="lg" className="flex-1" onClick={handleMakeOffer}>
                  <Sparkles className="w-5 h-5" />
                  AI Negotiate
                </Button>
              </div>
            )}

            {currentEscrowState === "RELEASED" && (
              <div className="p-4 rounded-xl bg-success/10 border border-success/20 text-center">
                <CheckCircle2 className="w-8 h-8 text-success mx-auto mb-2" />
                <p className="font-semibold text-success">Transaction Complete!</p>
                <p className="text-sm text-muted-foreground">Thank you for using CampusX</p>
              </div>
            )}

            {/* Safety Note */}
            <div className="p-3 rounded-lg bg-success/10 border border-success/20 flex items-start gap-3">
              <Shield className="w-5 h-5 text-success mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-success">Buyer Protection Active</p>
                <p className="text-muted-foreground">Your payment is held in escrow until you confirm delivery. Full refund if item doesn't match description.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* UPI Payment Modal */}
      {product && (
        <UPIPaymentModal
          isOpen={showUPIPayment}
          onClose={() => setShowUPIPayment(false)}
          amount={product.price}
          productTitle={product.title}
          sellerName={product.seller}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default Product;

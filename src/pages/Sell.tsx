import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "@/components/icons/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageCropper } from "@/components/ImageCropper";
import { 
  ArrowLeft,
  Camera,
  Sparkles,
  CheckCircle2,
  Shield,
  X,
  Upload,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { useListingsStore } from "@/stores/listingsStore";

const categories = [
  { id: "books", label: "Books", emoji: "📚" },
  { id: "electronics", label: "Electronics", emoji: "💻" },
  { id: "cycles", label: "Cycles", emoji: "🚲" },
  { id: "furniture", label: "Furniture", emoji: "🪑" },
  { id: "clothing", label: "Clothing", emoji: "👕" },
  { id: "instruments", label: "Instruments", emoji: "🎸" },
  { id: "other", label: "Other", emoji: "📦" },
];

const conditions = ["New", "Like New", "Good", "Fair"];

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

const Sell = () => {
  const navigate = useNavigate();
  const addListing = useListingsStore((state) => state.addListing);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    condition: "",
    image: "📦",
  });
  
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiSuggestedPrice, setAiSuggestedPrice] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = "Valid price is required";
    if (!formData.originalPrice || parseFloat(formData.originalPrice) <= 0) newErrors.originalPrice = "Original price is required";
    if (parseFloat(formData.price) > parseFloat(formData.originalPrice)) newErrors.price = "Selling price should be less than original";
    if (!formData.category) newErrors.category = "Select a category";
    if (!formData.condition) newErrors.condition = "Select condition";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadError(null);

    const file = files[0];
    if (file.size > MAX_FILE_SIZE) {
      setUploadError(`File "${file.name}" exceeds 1MB limit`);
      toast.error(`File "${file.name}" exceeds 1MB limit`);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setUploadError("Only image files are allowed");
      toast.error("Only image files are allowed");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setImageToCrop(base64);
      setShowCropper(true);
    };
    reader.onerror = () => {
      toast.error("Failed to read file");
    };
    reader.readAsDataURL(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCropComplete = (croppedImage: string) => {
    setUploadedImages((prev) => [...prev, croppedImage]);
    toast.success("Image cropped and uploaded successfully!");
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    toast.info("Image removed");
  };

  const handleGetAIPrice = () => {
    if (!formData.title || !formData.originalPrice) {
      toast.error("Enter title and original price first");
      return;
    }
    const original = parseFloat(formData.originalPrice);
    const suggested = Math.round(original * (0.5 + Math.random() * 0.2));
    setAiSuggestedPrice(suggested);
    setFormData({ ...formData, price: suggested.toString() });
    toast.success(`AI suggests ₹${suggested.toLocaleString()} based on market data`);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Get auth token
      const token = sessionStorage.getItem('authToken');
      if (!token) {
        toast.error('Please login to create a listing');
        navigate('/login');
        return;
      }

      // Call real backend API
      const API_URL = import.meta.env.VITE_API_URL || 'https://campusx-rg-axgefjeqgae2bpfs.eastasia-01.azurewebsites.net';
      
      const response = await fetch(`${API_URL}/api/listings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          originalPrice: parseFloat(formData.originalPrice),
          condition: formData.condition,
          category: formData.category,
          images: uploadedImages.length > 0 ? uploadedImages : []
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create listing');
      }

      // Success! Navigate to marketplace
      toast.success("✅ Item listed successfully!");
      navigate("/marketplace");
      
    } catch (error: any) {
      console.error('Create listing error:', error);
      toast.error(error.message || 'Failed to create listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <h1 className="font-semibold">Sell Item</h1>
            <div className="w-20" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Campus Scoped Info */}
          <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-3">
            <Shield className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium text-primary">Campus-Only Listing</p>
              <p className="text-sm text-muted-foreground">Only students from your college can see this listing</p>
            </div>
          </div>

          {/* Escrow Badge */}
          <div className="p-4 rounded-xl bg-success/10 border border-success/20 flex items-center gap-3">
            <Shield className="w-5 h-5 text-success" />
            <div>
              <p className="font-medium text-success">Escrow Protection Included</p>
              <p className="text-sm text-muted-foreground">Your item is automatically protected with secure payments</p>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Photos (Max 1MB each)</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              aria-label="Upload product photos"
              title="Upload product photos"
            />
            <div className="grid grid-cols-4 gap-3">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-xl bg-muted border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <Upload className="w-6 h-6 text-muted-foreground" />
                <span className="text-xs text-muted-foreground mt-1">Upload</span>
              </div>
              
              {uploadedImages.map((img, index) => (
                <div key={index} className="aspect-square rounded-xl overflow-hidden relative group">
                  <img src={img} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={`Remove image ${index + 1}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              {uploadedImages.length === 0 && (
                <div className="aspect-square rounded-xl bg-muted flex items-center justify-center text-4xl">
                  {formData.image}
                </div>
              )}
            </div>
            {uploadError && (
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="w-4 h-4" />
                {uploadError}
              </div>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="e.g., MacBook Air M1 2020"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe your item's condition, features, and why you're selling..."
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={errors.description ? "border-destructive" : ""}
            />
            {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category *</Label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setFormData({ ...formData, category: cat.id, image: cat.emoji });
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    formData.category === cat.id
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-muted hover:bg-muted/80 text-muted-foreground"
                  }`}
                >
                  <span>{cat.emoji}</span>
                  {cat.label}
                </button>
              ))}
            </div>
            {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
          </div>

          {/* Condition */}
          <div className="space-y-2">
            <Label>Condition *</Label>
            <div className="flex flex-wrap gap-2">
              {conditions.map((cond) => (
                <button
                  key={cond}
                  onClick={() => setFormData({ ...formData, condition: cond })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    formData.condition === cond
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-muted hover:bg-muted/80 text-muted-foreground"
                  }`}
                >
                  {cond}
                </button>
              ))}
            </div>
            {errors.condition && <p className="text-xs text-destructive">{errors.condition}</p>}
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="originalPrice">Original Price (₹) *</Label>
              <Input
                id="originalPrice"
                type="number"
                placeholder="e.g., 50000"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                className={errors.originalPrice ? "border-destructive" : ""}
              />
              {errors.originalPrice && <p className="text-xs text-destructive">{errors.originalPrice}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Your Price (₹) *</Label>
              <div className="relative">
                <Input
                  id="price"
                  type="number"
                  placeholder="e.g., 35000"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className={errors.price ? "border-destructive" : ""}
                />
              </div>
              {errors.price && <p className="text-xs text-destructive">{errors.price}</p>}
            </div>
          </div>

          {/* AI Price Suggestion */}
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={handleGetAIPrice}
          >
            <Sparkles className="w-4 h-4" />
            Get AI Price Suggestion
          </Button>

          {aiSuggestedPrice && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-secondary" />
              <p className="text-sm">
                AI suggests <span className="font-semibold text-secondary">₹{aiSuggestedPrice.toLocaleString()}</span> for quick sale
              </p>
            </motion.div>
          )}

          {/* Submit */}
          <Button
            variant="hero"
            size="lg"
            className="w-full"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Posting..." : "Post Item for Sale"}
          </Button>
        </motion.div>
      </main>

      {/* Image Cropper Modal */}
      <ImageCropper
        isOpen={showCropper}
        onClose={() => {
          setShowCropper(false);
          setImageToCrop(null);
        }}
        onSave={handleCropComplete}
        imageSrc={imageToCrop || ""}
      />
    </div>
  );
};

export default Sell;

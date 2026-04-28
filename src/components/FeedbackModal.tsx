import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Star, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  listingTitle: string;
  userName: string;
  listingId: number | string;
  role: "buyer" | "seller"; // To personalize the feedback request
}

export const FeedbackModal = ({
  isOpen,
  onClose,
  listingTitle,
  userName,
  listingId,
  role,
}: FeedbackModalProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitFeedback = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Store feedback in session storage (demo persistence)
    try {
      const feedbacks = JSON.parse(
        sessionStorage.getItem("feedbacks") || "[]"
      );
      feedbacks.push({
        id: Date.now(),
        listingId,
        role,
        userName,
        listingTitle,
        rating,
        comment: comment.trim() || "No comment provided",
        timestamp: new Date().toISOString(),
      });
      sessionStorage.setItem("feedbacks", JSON.stringify(feedbacks));
    } catch (e) {
      console.error("Failed to store feedback:", e);
    }

    setIsSubmitting(false);
    setSubmitted(true);
    toast.success("Thank you for your feedback!");

    // Auto-close after 2 seconds
    setTimeout(() => {
      onClose();
      setRating(0);
      setComment("");
      setSubmitted(false);
    }, 2000);
  };

  const handleClose = () => {
    if (!submitted) {
      setRating(0);
      setComment("");
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your Feedback</DialogTitle>
          <DialogDescription>
            {role === "buyer"
              ? `How was your experience with ${userName}?`
              : `How was your experience with the buyer?`}
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-8 gap-4"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </motion.div>
            <div className="text-center">
              <p className="font-semibold text-lg">Thank You!</p>
              <p className="text-sm text-muted-foreground mt-1">
                Your feedback helps the community
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Rating Stars */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Rating</label>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${star <= (hoverRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                        }`}
                    />
                  </motion.button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-xs text-muted-foreground text-center">
                  {rating === 5 && "Excellent!"}
                  {rating === 4 && "Great!"}
                  {rating === 3 && "Good"}
                  {rating === 2 && "Fair"}
                  {rating === 1 && "Poor"}
                </p>
              )}
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <label htmlFor="comment" className="text-sm font-medium">
                Additional Comment (Optional)
              </label>
              <Textarea
                id="comment"
                placeholder="Share your experience... (e.g., fast delivery, great condition, good communication)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={500}
                className="resize-none"
                rows={4}
              />
              <p className="text-xs text-muted-foreground text-right">
                {comment.length}/500
              </p>
            </div>

            {/* Product Info */}
            <div className="p-3 bg-muted/50 rounded-lg border border-border text-sm">
              <p className="font-medium">About: {listingTitle}</p>
            </div>
          </div>
        )}

        {!submitted && (
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Skip
            </Button>
            <Button onClick={handleSubmitFeedback} disabled={isSubmitting || rating === 0}>
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
              ) : null}
              Submit Feedback
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

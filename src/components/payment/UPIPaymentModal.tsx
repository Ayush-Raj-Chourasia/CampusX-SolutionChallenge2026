import { useState, useEffect } from "react";
import { QrCode, CheckCircle2, Loader2, ArrowLeft, Shield, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface UPIPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  productTitle: string;
  sellerName: string;
  onPaymentSuccess: () => void;
}

type PaymentStep = "UPI_SELECT" | "QR_DISPLAY" | "PROCESSING" | "SUCCESS" | "FAILED";

export const UPIPaymentModal = ({
  isOpen,
  onClose,
  amount,
  productTitle,
  sellerName,
  onPaymentSuccess
}: UPIPaymentModalProps) => {
  const [step, setStep] = useState<PaymentStep>("UPI_SELECT");
  const [selectedUPI, setSelectedUPI] = useState<string>("");
  const [upiId, setUpiId] = useState<string>("");
  const [transactionId, setTransactionId] = useState<string>("");
  const [countdown, setCountdown] = useState<number>(5);

  const upiApps = [
    {
      id: "gpay",
      name: "Google Pay",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/512px-Google_Pay_Logo.svg.png",
      color: "bg-white"
    },
    {
      id: "phonepe",
      name: "PhonePe",
      logo: "/images/phonepe-logo.png",
      color: "bg-white"
    },
    {
      id: "paytm",
      name: "Paytm",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/512px-Paytm_Logo_%28standalone%29.svg.png",
      color: "bg-white"
    },
    {
      id: "other",
      name: "Other UPI Apps",
      logo: "https://cdn-icons-png.flaticon.com/512/6963/6963703.png",
      color: "bg-white"
    },
  ];

  useEffect(() => {
    if (step === "PROCESSING" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (step === "PROCESSING" && countdown === 0) {
      // Simulate successful payment
      const txnId = `TXN${Date.now().toString().slice(-10)}`;
      setTransactionId(txnId);
      setStep("SUCCESS");
      toast.success("Payment Successful!");
      setTimeout(() => {
        onPaymentSuccess();
      }, 2000);
    }
  }, [step, countdown, onPaymentSuccess]);

  const handleUPISelection = (upiType: string) => {
    setSelectedUPI(upiType);
    if (upiType !== "other") {
      setStep("QR_DISPLAY");
    }
  };

  const handleUPIIdSubmit = () => {
    if (!upiId.includes("@")) {
      toast.error("Please enter a valid UPI ID");
      return;
    }
    setStep("QR_DISPLAY");
  };

  const handlePayNow = () => {
    setStep("PROCESSING");
    setCountdown(5);
  };

  const handleClose = () => {
    setStep("UPI_SELECT");
    setSelectedUPI("");
    setUpiId("");
    setTransactionId("");
    setCountdown(5);
    onClose();
  };

  const generateQRCode = () => {
    // Use actual QR code image
    return (
      <div className="w-64 h-64 bg-white rounded-xl p-3 flex items-center justify-center shadow-lg border-2 border-gray-200">
        <img
          src="/images/payment-qr.png"
          onError={(e) => {
            e.currentTarget.src = "https://i.imgur.com/8xM5YH9.png"; // Fallback
          }}
          alt="UPI QR Code"
          className="w-full h-full object-contain"
        />
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <AnimatePresence mode="wait">
          {step === "UPI_SELECT" && (
            <motion.div
              key="upi-select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Secure Escrow Payment
                </DialogTitle>
                <DialogDescription>
                  Choose your preferred UPI payment method
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                {/* Payment Details */}
                <div className="bg-muted rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Product</span>
                    <span className="font-medium">{productTitle}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Seller</span>
                    <span className="font-medium">{sellerName}</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between">
                    <span className="font-semibold">Total Amount</span>
                    <span className="text-2xl font-bold text-primary">₹{amount}</span>
                  </div>
                </div>

                {/* Escrow Notice */}
                <div className="flex items-start gap-2 bg-primary/10 rounded-lg p-3 text-sm border border-primary/20">
                  <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-primary">100% Safe & Secure Payment</p>
                    <p className="text-muted-foreground text-xs mt-1">
                      Payment will be held securely until you confirm delivery. Full refund if item doesn't match.
                    </p>
                  </div>
                </div>

                {/* UPI App Selection */}
                <div className="space-y-3">
                  <p className="text-sm font-medium">Select UPI App</p>
                  <div className="grid grid-cols-2 gap-3">
                    {upiApps.map((app) => (
                      <button
                        key={app.id}
                        onClick={() => handleUPISelection(app.id)}
                        className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-border hover:border-primary hover:shadow-lg transition-all"
                      >
                        <div className={`w-16 h-16 ${app.color} rounded-xl flex items-center justify-center shadow-md p-2`}>
                          <img src={app.logo} alt={app.name} className="w-full h-full object-contain" />
                        </div>
                        <span className="text-sm font-medium">{app.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Manual UPI ID Entry */}
                {selectedUPI === "other" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-2"
                  >
                    <label className="text-sm font-medium">Enter UPI ID</label>
                    <input
                      type="text"
                      placeholder="yourname@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background"
                    />
                    <Button onClick={handleUPIIdSubmit} className="w-full">
                      Continue to Payment
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {step === "QR_DISPLAY" && (
            <motion.div
              key="qr-display"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => setStep("UPI_SELECT")}>
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <DialogTitle>Scan QR Code</DialogTitle>
                </div>
                <DialogDescription>
                  Open {selectedUPI !== "other" ? upiApps.find(a => a.id === selectedUPI)?.name : "your UPI app"} and scan this QR code
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col items-center space-y-4">
                {/* QR Code */}
                <div className="relative">
                  {generateQRCode()}
                  <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-bold">
                    ₹{amount}
                  </div>
                </div>

                {/* Payment Info */}
                <div className="w-full bg-muted rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pay to</span>
                    <span className="font-medium">campusx@escrow</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-bold text-lg">₹{amount}</span>
                  </div>
                </div>

                {/* Timer Warning */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>QR code expires in 10:00</span>
                </div>

                {/* Action Button */}
                <Button onClick={handlePayNow} className="w-full" size="lg">
                  <QrCode className="w-4 h-4 mr-2" />
                  I've Scanned and Paid
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Click after completing payment in your UPI app
                </p>
              </div>
            </motion.div>
          )}

          {step === "PROCESSING" && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-8 space-y-4"
            >
              <Loader2 className="w-16 h-16 text-primary animate-spin" />
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold">Verifying Payment...</h3>
                <p className="text-muted-foreground">
                  Please wait while we confirm your transaction
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-4">
                  <Clock className="w-4 h-4" />
                  <span>Estimated time: {countdown}s</span>
                </div>
              </div>
              <div className="w-full max-w-xs bg-muted rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 5, ease: "linear" }}
                />
              </div>
            </motion.div>
          )}

          {step === "SUCCESS" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-8 space-y-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
                </div>
              </motion.div>

              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-green-500">Payment Successful!</h3>
                <p className="text-muted-foreground">
                  Your payment has been secured in escrow
                </p>
              </div>

              {/* Transaction Details */}
              <div className="w-full bg-muted rounded-lg p-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <span className="font-mono font-medium">{transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount Paid</span>
                  <span className="font-bold text-lg">₹{amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="text-green-500 font-medium">In Escrow</span>
                </div>
                <div className="border-t border-border pt-3 flex items-start gap-2">
                  <Shield className="w-4 h-4 text-primary mt-0.5" />
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p className="font-medium text-foreground">Buyer Protection Active:</p>
                    <p>• Your money is held securely in escrow</p>
                    <p>• Seller gets paid only after you confirm delivery</p>
                    <p>• Full refund if item doesn't match description</p>
                  </div>
                </div>
              </div>

              <Button onClick={handleClose} className="w-full" size="lg">
                Continue Shopping
              </Button>
            </motion.div>
          )}

          {step === "FAILED" && (
            <motion.div
              key="failed"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-8 space-y-4"
            >
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center">
                <AlertCircle className="w-12 h-12 text-red-500" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-red-500">Payment Failed</h3>
                <p className="text-muted-foreground">
                  Something went wrong. Please try again.
                </p>
              </div>
              <div className="flex gap-3 w-full">
                <Button onClick={() => setStep("UPI_SELECT")} variant="outline" className="flex-1">
                  Try Again
                </Button>
                <Button onClick={handleClose} variant="destructive" className="flex-1">
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

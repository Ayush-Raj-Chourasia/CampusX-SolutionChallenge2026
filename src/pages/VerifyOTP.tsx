import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "@/components/icons/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Phone,
  ArrowRight,
  Shield,
  AlertCircle,
  CheckCircle2,
  Clock,
  RotateCcw
} from "lucide-react";
import { toast } from "sonner";

const VerifyOTP = () => {
  const navigate = useNavigate();
  
  // State
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [signupData, setSignupData] = useState<any>(null);
  const [error, setError] = useState("");

  // OTP Management with persistence
  const [timeRemaining, setTimeRemaining] = useState(120);
  const [otpExpiryTime, setOtpExpiryTime] = useState<number | null>(null);
  const [isOtpExpired, setIsOtpExpired] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [attemptsRemaining, setAttemptsRemaining] = useState(5);

  const MAX_RESEND_ATTEMPTS = 3;
  const OTP_VALIDITY_SECONDS = 120; // 2 minutes

  // Initialize from sessionStorage and restore timer state
  useEffect(() => {
    const data = sessionStorage.getItem("signupData");
    if (!data) {
      navigate("/signup");
      return;
    }
    
    const parsedData = JSON.parse(data);
    setSignupData(parsedData);

    // Restore OTP expiry time from sessionStorage (persist across refresh)
    const storedExpiry = sessionStorage.getItem("otpExpiryTime");
    const storedResendCount = sessionStorage.getItem("resendCount");
    
    if (storedResendCount) {
      setResendCount(parseInt(storedResendCount));
    }

    if (storedExpiry) {
      const expiryTime = parseInt(storedExpiry);
      setOtpExpiryTime(expiryTime);
      
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((expiryTime - now) / 1000));
      
      if (remaining > 0) {
        setTimeRemaining(remaining);
        setIsOtpExpired(false);
      } else {
        setTimeRemaining(0);
        setIsOtpExpired(true);
        setError("Verification code expired. Please resend.");
      }
    } else {
      // First time - set expiry time
      const expiryTime = Date.now() + (OTP_VALIDITY_SECONDS * 1000);
      setOtpExpiryTime(expiryTime);
      sessionStorage.setItem("otpExpiryTime", expiryTime.toString());
    }
  }, [navigate]);

  // Main OTP Timer - continues from where it left off
  useEffect(() => {
    if (isOtpExpired || !otpExpiryTime) return;

    const timer = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((otpExpiryTime - now) / 1000));
      
      setTimeRemaining(remaining);
      
      if (remaining <= 0) {
        setIsOtpExpired(true);
        setError("Verification code expired. Please resend.");
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isOtpExpired, otpExpiryTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
    setError("");
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!otp) {
      setError("Please enter the verification code");
      return;
    }

    if (otp.length !== 6) {
      setError("Verification code must be 6 digits");
      return;
    }

    if (isOtpExpired || timeRemaining <= 0) {
      setError("Verification code expired. Please resend.");
      return;
    }

    if (attemptsRemaining <= 0) {
      setError("Verification time expired. Please restart signup.");
      return;
    }

    setIsLoading(true);

    try {
      // Call real backend API to verify OTP
      const API_URL = import.meta.env.VITE_API_URL || 'https://campusx-rg-axgefjeqgae2bpfs.eastasia-01.azurewebsites.net';
      
      const response = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: signupData?.email,
          otp: otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'OTP verification failed');
      }

      // Success! Store JWT token and navigate to marketplace
      if (data.data?.token) {
        sessionStorage.setItem('authToken', data.data.token);
        sessionStorage.setItem('currentUser', JSON.stringify(data.data.user));
      }

      toast.success("✅ Account verified successfully!");

      // Clear signup data and OTP timer from sessionStorage
      sessionStorage.removeItem("signupData");
      sessionStorage.removeItem("otpExpiryTime");
      sessionStorage.removeItem("resendCount");
      
      navigate("/marketplace");

    } catch (error: any) {
      const remaining = attemptsRemaining - 1;
      setAttemptsRemaining(remaining);

      if (remaining === 0) {
        setError("Verification time expired. Please restart signup.");
      } else {
        setError(error.message || `Invalid code. ${remaining} attempt${remaining !== 1 ? "s" : ""} remaining.`);
      }

      setOtp("");
      toast.error("❌ " + (error.message || "Incorrect verification code"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCount >= MAX_RESEND_ATTEMPTS) {
      toast.error("Maximum resend attempts reached. Please signup again.");
      navigate("/signup");
      return;
    }

    setIsResending(true);
    setError("");

    try {
      // Call real backend API to resend OTP (generates NEW OTP, invalidates old one)
      const API_URL = import.meta.env.VITE_API_URL || 'https://campusx-rg-axgefjeqgae2bpfs.eastasia-01.azurewebsites.net';
      
      const response = await fetch(`${API_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: signupData?.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend OTP');
      }

      // NEW OTP generated - old OTP is now invalid
      // Reset timer with NEW expiry time
      const newExpiryTime = Date.now() + (OTP_VALIDITY_SECONDS * 1000);
      setOtpExpiryTime(newExpiryTime);
      sessionStorage.setItem("otpExpiryTime", newExpiryTime.toString());
      
      setTimeRemaining(OTP_VALIDITY_SECONDS);
      setIsOtpExpired(false);
      setOtp("");
      setAttemptsRemaining(5);
      
      const newResendCount = resendCount + 1;
      setResendCount(newResendCount);
      sessionStorage.setItem("resendCount", newResendCount.toString());

      // Update sessionStorage with new OTP (for dev mode)
      if (data.otp) {
        const storedData = JSON.parse(sessionStorage.getItem("signupData") || "{}");
        storedData.otp = data.otp;
        sessionStorage.setItem("signupData", JSON.stringify(storedData));
        console.info("[DEMO] New OTP sent:", data.otp);
      }

      toast.success(`✅ New verification code sent to ${signupData?.email}`);
      
    } catch (error: any) {
      setError(error.message || "Failed to resend OTP");
      toast.error(error.message || "Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToSignup = () => {
    // Keep signupData in sessionStorage so fields can be preserved
    navigate("/signup");
  };

  if (!signupData) {
    return null; // Show nothing while loading
  }

  const isLocked = isOtpExpired && resendCount >= MAX_RESEND_ATTEMPTS;

  return (
    <div className="min-h-screen flex">
      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-6"
        >
          <div className="text-center">
            <Link to="/" className="inline-block mb-2">
              <Logo size="lg" />
            </Link>
            <p className="text-sm text-muted-foreground">Create your account</p>
            <h2 className="text-xl font-medium">Join the verified campus marketplace</h2>
            <div className="mt-3 mb-2">
              <span className="inline-block px-3 py-1 rounded-full bg-muted text-sm font-medium">Step 2</span>
            </div>
            <h1 className="text-3xl font-display font-bold">Check your email</h1>
            <p className="text-muted-foreground mt-2">
              We sent a verification code to<br />
              <span className="font-semibold">{signupData?.collegeEmail}</span>
            </p>
          </div>

          {/* Verification Section */}
          <div className="p-4 bg-muted/50 rounded-lg border border-border">
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={handleOtpChange}
                disabled={isOtpExpired}
                className={`text-center text-4xl tracking-[0.5rem] font-mono font-bold ${
                  isOtpExpired ? "bg-muted" : ""
                }`}
                maxLength={6}
              />
            </div>
          </div>

          {/* Timer Display */}
          <div className={`p-4 rounded-lg border-2 flex items-center justify-between ${
            isOtpExpired 
              ? "bg-red-500/5 border-red-500/30" 
              : timeRemaining <= 30
              ? "bg-yellow-500/5 border-yellow-500/30"
              : "bg-green-500/5 border-green-500/30"
          }`}>
            <div className="flex items-center gap-2">
              <Clock className={`w-5 h-5 ${
                isOtpExpired
                  ? "text-red-500"
                  : timeRemaining <= 30
                  ? "text-yellow-500"
                  : "text-green-600"
              }`} />
              <span className={`text-sm font-semibold ${
                isOtpExpired
                  ? "text-red-600"
                  : timeRemaining <= 30
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}>
                {isOtpExpired ? "Verification code expired" : formatTime(timeRemaining)}
              </span>
            </div>
            {!isOtpExpired && (
              <span className="text-xs text-muted-foreground">Time remaining</span>
            )}
          </div>

          {/* Error / Locked Messages */}
          {isLocked ? (
            <div className={`p-3 rounded-lg border flex gap-2 bg-red-500/5 border-red-500/30`}>
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
              <p className="text-sm text-red-700">Verification time expired. Please restart signup.</p>
            </div>
          ) : error ? (
            <div className={`p-3 rounded-lg border flex gap-2 ${
              isOtpExpired
                ? "bg-red-500/5 border-red-500/30"
                : "bg-red-50 border-red-200"
            }`}>
              <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                isOtpExpired ? "text-red-600" : "text-red-500"
              }`} />
              <p className={`text-sm ${
                isOtpExpired ? "text-red-700" : "text-red-600"
              }`}>
                {error}
              </p>
            </div>
          ) : null}

          {/* OTP Input Form */}
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
              disabled={isLoading || isOtpExpired || isLocked || otp.length < 6 || attemptsRemaining <= 0}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  Verify & Create Account
                  <CheckCircle2 className="w-5 h-5" />
                </>
              )}
            </Button>
          </form>

          {/* Resend Section */}
          <div className="text-center">
            <p className="text-green-600 font-medium">
              Didn't receive code?{' '}
              <button
                onClick={handleResendOtp}
                disabled={!isOtpExpired || isResending || resendCount >= MAX_RESEND_ATTEMPTS || isLocked}
                className={
                  `inline font-medium ml-1 ${!isOtpExpired || isResending || resendCount >= MAX_RESEND_ATTEMPTS || isLocked ? 'text-green-300 pointer-events-none cursor-not-allowed' : 'text-green-600 hover:underline cursor-pointer'}`
                }
              >
                {isResending ? 'Sending...' : `Resend ${resendCount < MAX_RESEND_ATTEMPTS ? `(${MAX_RESEND_ATTEMPTS - resendCount} left)` : ''}`}
              </button>
            </p>
          </div>

          {/* Footer Section (separate & centered) */}
          <div className="mt-6 text-center space-y-3">
            <div>
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="text-sm text-muted-foreground hover:underline cursor-pointer"
              >
                ← Change email address
              </button>
            </div>

            <div>
              <span className="text-sm text-muted-foreground">Already have an account? </span>
              <Link to="/login" className="text-sm text-green-600 hover:underline font-medium cursor-pointer">Sign in</Link>
            </div>

            <div className="flex items-center justify-center gap-2">
              <Shield className="w-4 h-4 text-green-600" />
              <span className="text-xs text-muted-foreground">College-verified accounts only</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary via-primary/90 to-secondary items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative z-10 text-center text-primary-foreground max-w-lg"
        >
          <div className="text-6xl mb-6">📱</div>
          <h2 className="text-3xl font-display font-bold mb-4">
            Secure Your Account
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8">
            We're verifying your phone number to ensure you're a real student. 
            This keeps CampusX safe for everyone.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: "🔐", label: "Encrypted SMS" },
              { icon: "⏱️", label: "2 Min Expires" },
              { icon: "🔄", label: "Resend Allowed" },
              { icon: "✨", label: "One-Time Use" },
            ].map((item) => (
              <div key={item.label} className="p-4 rounded-xl bg-primary-foreground/10 backdrop-blur">
                <div className="text-3xl mb-2">{item.icon}</div>
                <p className="text-sm font-medium">{item.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyOTP;

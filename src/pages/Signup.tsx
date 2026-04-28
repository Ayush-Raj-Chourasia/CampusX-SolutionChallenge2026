import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "@/components/icons/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Lock, 
  ArrowRight, 
  Shield, 
  Eye, 
  EyeOff, 
  User,
  Phone,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";

const Signup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form fields
  const [fullName, setFullName] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [collegeEmail, setCollegeEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Prefill from sessionStorage when coming back from change-email
  useEffect(() => {
    const dataRaw = sessionStorage.getItem("signupData");
    if (!dataRaw) return;
    try {
      const data = JSON.parse(dataRaw);
      if (data.fullName) setFullName(data.fullName);
      if (data.collegeName) setCollegeName(data.collegeName);
      if (data.collegeEmail) setCollegeEmail(data.collegeEmail);
      if (data.phoneNumber) setPhoneNumber(data.phoneNumber);
    } catch (err) {
      // ignore
    }
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Full Name validation
    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (fullName.trim().length < 3) {
      newErrors.fullName = "Full name must be at least 3 characters";
    }

    // College Name validation
    if (!collegeName.trim()) {
      newErrors.collegeName = "College name is required";
    } else if (collegeName.trim().length < 3) {
      newErrors.collegeName = "College name must be at least 3 characters";
    }

    // Phone Number validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!phoneRegex.test(phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be exactly 10 digits";
    }

    // College Email validation
    if (!collegeEmail.trim()) {
      newErrors.collegeEmail = "College email is required";
    } else {
      const email = collegeEmail.trim().toLowerCase();
      const parts = email.split("@");
      if (parts.length !== 2) {
        newErrors.collegeEmail = "Enter a valid email address";
      } else {
        const domain = parts[1];
        const publicDomains = [
          "gmail.com",
          "yahoo.com",
          "outlook.com",
          "hotmail.com",
          "live.com",
          "aol.com",
          "icloud.com"
        ];

        const isPublic = publicDomains.includes(domain);

        const isCollegeDomain = /\.(ac|edu)(\.[a-z]{2,})?$/i.test(domain);

        if (isPublic || !isCollegeDomain) {
          newErrors.collegeEmail = "Please use your college email (no Gmail/Yahoo/etc.)";
        }
      }
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    // Confirm Password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Terms agreement validation
    if (!agreedToTerms) {
      newErrors.terms = "You must agree to the Terms & Conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Call real backend API to create account and send OTP
      const API_URL = import.meta.env.VITE_API_URL || 'https://campusx-rg-axgefjeqgae2bpfs.eastasia-01.azurewebsites.net';
      
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: fullName,
          email: collegeEmail,
          password: password,
          college: collegeName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Store email in sessionStorage for OTP verification page
      sessionStorage.setItem("signupData", JSON.stringify({
        email: collegeEmail,
        name: fullName,
        college: collegeName,
        // For development: backend returns OTP in response (remove in production)
        otp: data.data?.otp
      }));

      toast.success(`✅ Verification code sent to ${collegeEmail}`);

      // For demo: log the OTP to console (backend returns it in dev mode)
      if (data.data?.otp) {
        // eslint-disable-next-line no-console
        console.info("[DEMO] Email OTP:", data.data.otp);
      }

      // Navigate to OTP verification page
      navigate("/verify-otp");
      
    } catch (error: any) {
      toast.error(error.message || 'Registration failed. Please try again.');
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
            <Link to="/" className="inline-block mb-6">
              <Logo size="lg" />
            </Link>
            <h1 className="text-3xl font-display font-bold">Create your account</h1>
            <p className="text-muted-foreground mt-2">
              Join CampusX - The verified student marketplace
            </p>
          </div>

          {/* Main Signup Form */}
          <form onSubmit={handleSignup} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`pl-10 ${errors.fullName ? "border-red-500" : ""}`}
                />
              </div>
              {errors.fullName && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* College Name */}
            <div className="space-y-2">
              <Label htmlFor="collegeName">College Name *</Label>
              <Input
                id="collegeName"
                type="text"
                placeholder="e.g., KIIT, NIT Rourkela, SOA"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                className={errors.collegeName ? "border-red-500" : ""}
              />
              {errors.collegeName && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.collegeName}
                </p>
              )}
            </div>

            {/* College Email */}
            <div className="space-y-2">
              <Label htmlFor="collegeEmail">College Email *</Label>
              <Input
                id="collegeEmail"
                type="email"
                placeholder="you@your-college.ac.in"
                value={collegeEmail}
                onChange={(e) => setCollegeEmail(e.target.value)}
                className={errors.collegeEmail ? "border-red-500" : ""}
              />
              {errors.collegeEmail && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.collegeEmail}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={phoneNumber}
                  onChange={(e) => {
                    const numOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setPhoneNumber(numOnly);
                  }}
                  className={`pl-10 ${errors.phoneNumber ? "border-red-500" : ""}`}
                  maxLength={10}
                />
              </div>
              {errors.phoneNumber && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.phoneNumber}
                </p>
              )}
              {phoneNumber.length > 0 && phoneNumber.length < 10 && (
                <p className="text-sm text-muted-foreground">
                  {phoneNumber.length}/10 digits
                </p>
              )}
            </div>

            {/* Create Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Create Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Re-enter Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`pl-10 pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.confirmPassword}
                </p>
              )}
              {password && confirmPassword && password === confirmPassword && (
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Passwords match
                </p>
              )}
            </div>

            {/* Terms & Conditions */}
            <div className="space-y-3 p-4 bg-muted/50 rounded-lg border border-border">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => {
                    setAgreedToTerms(checked === true);
                    if (errors.terms) {
                      setErrors({ ...errors, terms: "" });
                    }
                  }}
                  className="mt-1"
                />
                <label htmlFor="terms" className="text-sm cursor-pointer leading-relaxed flex-1">
                  I agree to the <Link to="#" className="text-secondary hover:underline font-medium">Terms & Conditions</Link> and <Link to="#" className="text-secondary hover:underline font-medium">Privacy Policy</Link> *
                </label>
              </div>
              {errors.terms && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.terms}
                </p>
              )}
            </div>

            {/* Sign Up Button */}
            <Button 
              type="submit" 
              variant="hero" 
              size="lg" 
              className="w-full"
              disabled={isLoading || !agreedToTerms}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  Proceed to Verification
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-secondary font-medium hover:underline">
                Sign in here
              </Link>
            </p>
          </div>

          {/* Trust Badge */}
          <div className="flex items-center justify-center gap-2 pt-2 border-t">
            <Shield className="w-4 h-4 text-green-600" />
            <span className="text-xs text-muted-foreground">Secure & verified signup</span>
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
          <div className="text-6xl mb-6">🎓</div>
          <h2 className="text-3xl font-display font-bold mb-4">
            Trade Safely with Your Campus Community
          </h2>
          <p className="text-primary-foreground/80 text-lg">
            Join thousands of verified students buying and selling on CampusX.
            Zero fraud. 100% student-to-student trust.
          </p>
          
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { value: "50K+", label: "Students" },
              { value: "₹0", label: "Scams" },
              { value: "100%", label: "Verified" },
            ].map((stat) => (
              <div key={stat.label} className="p-4 rounded-xl bg-primary-foreground/10 backdrop-blur">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-primary-foreground/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;

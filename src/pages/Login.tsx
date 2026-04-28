import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "@/components/icons/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, ArrowRight, Shield, Eye, EyeOff, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Call backend API for authentication
      const API_URL = import.meta.env.VITE_API_URL || 'https://campusx-rg-axgefjeqgae2bpfs.eastasia-01.azurewebsites.net';

      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Check if user needs to verify OTP
        if (response.status === 403 && data.requiresVerification) {
          // Store email for OTP verification page
          sessionStorage.setItem("signupData", JSON.stringify({
            email: data.email,
            name: email.split('@')[0],
          }));
          toast.error(data.message || 'Please verify your email first');
          navigate('/verify-otp');
          return;
        }
        throw new Error(data.message || 'Login failed');
      }

      // Store user data and token in sessionStorage
      sessionStorage.setItem('currentUser', JSON.stringify(data.data.user));
      sessionStorage.setItem('authToken', data.data.token);
      if (data.data.user.theme) {
        sessionStorage.setItem("theme", data.data.user.theme);
      }

      toast.success(`Welcome back, ${data.data.user.name}!`);
      navigate('/marketplace');

    } catch (error: any) {
      toast.error(error.message || 'Invalid email or password');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success("Signed in with Google!");
    navigate("/marketplace");
    setIsLoading(false);
  };

  const handleAppleSignIn = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success("Signed in with Apple!");
    navigate("/marketplace");
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center">
            <Link to="/" className="inline-block mb-8">
              <Logo size="lg" />
            </Link>
            <h1 className="text-2xl font-display font-bold">Welcome back</h1>
            <p className="text-muted-foreground mt-2">
              Sign in to your CampusX account
            </p>
          </div>

          {/* College Email Notice */}
          <div className="p-3 bg-muted/50 rounded-lg border border-border text-sm text-muted-foreground text-center">
            Sign in using your official college email from any recognized institute.
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">College Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="yourname@kiit.ac.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm text-secondary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-secondary font-medium hover:underline">
                Sign up free
              </Link>
            </p>
          </div>

          {/* Trust Badge */}
          <div className="flex items-center justify-center gap-2 pt-4">
            <Shield className="w-4 h-4 text-success" />
            <span className="text-sm text-muted-foreground">College-verified accounts only</span>
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

export default Login;

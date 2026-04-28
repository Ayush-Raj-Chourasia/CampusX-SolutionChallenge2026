import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle2, Users, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const floatingAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

const stats = [
  { value: "40K+", label: "Colleges in India" },
  { value: "₹0", label: "Platform Fees" },
  { value: "100%", label: "Verified Users" },
];

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(var(--secondary)/0.1),transparent_50%)]" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20"
            >
              <Shield className="w-4 h-4 text-success" />
              <span className="text-sm font-medium text-success">100% Verified & Secure</span>
              <Sparkles className="w-4 h-4 text-success" />
            </motion.div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight">
                Your Campus.
                <br />
                <span className="text-gradient">Your Marketplace.</span>
                <br />
                Zero Fraud.
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
                Buy & sell exclusively with verified students from your college. 
                Secure escrow payments. AI-powered negotiations. No scams.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="hero" 
                size="xl" 
                className="group"

                onClick={() => navigate("/signup")}


              >
                Get Started Free
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button 
                variant="hero-outline" 
                size="xl"
                onClick={() => {
                  const element = document.querySelector('#how-it-works');
                  if (element) {

                    element.scrollIntoView({ behavior: "smooth" });

                  }
                }}
              >
                Watch Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-background flex items-center justify-center text-xs font-semibold text-muted-foreground"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} className="w-4 h-4 text-accent fill-accent" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">Loved by 10K+ students</p>
              </div>
            </div>
          </motion.div>

          {/* Right - Floating Cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            {/* Main Product Card */}
            <motion.div
              animate={floatingAnimation}
              className="relative z-20 glass-card rounded-2xl p-6 max-w-sm ml-auto mr-8"
            >
              <div className="aspect-square rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 mb-4 flex items-center justify-center">
                <span className="text-6xl">📚</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Engineering Drawing Kit</h3>
                  <span className="verified-badge">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified
                  </span>
                </div>
                <p className="text-2xl font-bold text-secondary">₹450</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>IIT Delhi • 2nd Year</span>
                </div>
                <div className="escrow-secured">
                  <Shield className="w-4 h-4" />
                  Escrow Protected
                </div>
              </div>
            </motion.div>

            {/* Chat Preview Card */}
            <motion.div
              animate={floatingAnimation}
              transition={{ delay: 1 }}
              className="absolute top-20 -left-4 z-30 glass-card rounded-2xl p-4 w-64"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                  AI
                </div>
                <span className="font-medium text-sm">AI Negotiator</span>
              </div>
              <p className="text-sm text-muted-foreground">
                "Based on market analysis, ₹400 is a fair price for this item in good condition."
              </p>
            </motion.div>

            {/* Stats Card */}
            <motion.div
              animate={floatingAnimation}
              transition={{ delay: 2 }}
              className="absolute bottom-10 left-10 z-10 glass-card rounded-2xl p-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-success">₹2.4Cr</p>
                  <p className="text-xs text-muted-foreground">Scams Prevented</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-3 gap-4 mt-16 max-w-2xl mx-auto"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="text-center p-4 rounded-xl bg-card/50 backdrop-blur border border-border/50"
            >
              <p className="text-2xl md:text-3xl font-bold text-gradient">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

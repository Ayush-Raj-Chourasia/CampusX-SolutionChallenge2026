import { motion } from "framer-motion";
import { 
  Shield, 
  MessageSquare, 
  Wallet, 
  Star, 
  Sparkles, 
  Lock,
  Users,
  CheckCircle2,
  TrendingUp
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "College-Verified Only",
    description: "Every user verified through .edu email and college ID. No outsiders, no scams.",
    color: "from-primary to-secondary",
  },
  {
    icon: Wallet,
    title: "Escrow Payments",
    description: "Money stays protected until delivery is confirmed. Both buyer & seller are safe.",
    color: "from-success to-secondary",
  },
  {
    icon: MessageSquare,
    title: "AI Negotiator",
    description: "Our AI helps find fair prices and auto-negotiates deals for both parties.",
    color: "from-secondary to-accent",
  },
  {
    icon: Star,
    title: "Trust Scores",
    description: "Build reputation with every transaction. Trusted sellers get priority visibility.",
    color: "from-accent to-primary",
  },
  {
    icon: Lock,
    title: "Encrypted Chat",
    description: "End-to-end encrypted messaging. Your conversations stay private.",
    color: "from-primary to-success",
  },
  {
    icon: TrendingUp,
    title: "Price Intelligence",
    description: "AI-powered fair pricing based on market analysis and item condition.",
    color: "from-secondary to-primary",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 mb-6">
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-secondary">Why CampusX?</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Built for <span className="text-gradient">Student Safety</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Every feature designed to eliminate fraud and make trading between students safe, 
            fast, and fair.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group relative p-6 rounded-2xl bg-card border border-border hover:border-secondary/30 transition-all duration-300"
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} p-0.5 mb-4`}>
                  <div className="w-full h-full rounded-[10px] bg-card flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-secondary" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-primary/10 via-secondary/10 to-success/10 border border-border"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-success" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">100% Secure Transactions</h3>
                <p className="text-muted-foreground">Protected by bank-grade encryption</p>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <p className="text-3xl font-bold text-secondary">₹2.4Cr+</p>
                <p className="text-xs text-muted-foreground">Fraud Prevented</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-secondary">50K+</p>
                <p className="text-xs text-muted-foreground">Safe Trades</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-secondary">0</p>
                <p className="text-xs text-muted-foreground">Scam Reports</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

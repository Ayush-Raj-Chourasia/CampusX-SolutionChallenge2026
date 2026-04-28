import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  Shield, 
  Zap, 
  Lock, 
  MessageSquare,
  Users
} from "lucide-react";

const features = [
  {
    icon: CheckCircle2,
    title: "Verified College Email",
    description: "Every user must sign up with their official college email. Instant verification with campus domains.",
  },
  {
    icon: Zap,
    title: "AI Negotiator",
    description: "Our AI analyzes market prices and helps both parties reach a fair deal automatically.",
  },
  {
    icon: Lock,
    title: "Secure Escrow",
    description: "Funds are held safely until both buyer and seller confirm the transaction is complete.",
  },
  {
    icon: MessageSquare,
    title: "Encrypted Messaging",
    description: "Private encrypted chats between buyers and sellers. No data leaks, complete privacy.",
  },
  {
    icon: Users,
    title: "Community Reviews",
    description: "Build your reputation on campus with transparent buyer and seller ratings.",
  },
  {
    icon: Shield,
    title: "Fraud Prevention",
    description: "Advanced AI detection catches scams before they happen. Over ₹2.4Cr in scams prevented.",
  },
];

const Features = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                CampusX <span className="text-gradient">Features</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Built specifically for students. Every feature designed for safety, speed, and simplicity.
              </p>
            </motion.div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 rounded-2xl bg-card border border-border hover:border-secondary/30 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-secondary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16 grid md:grid-cols-3 gap-8 p-8 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-border"
            >
              <div className="text-center">
                <p className="text-3xl font-bold text-gradient mb-2">40K+</p>
                <p className="text-muted-foreground">Colleges in India</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gradient mb-2">₹0</p>
                <p className="text-muted-foreground">Platform Fees</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gradient mb-2">100%</p>
                <p className="text-muted-foreground">Verified Users</p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Features;

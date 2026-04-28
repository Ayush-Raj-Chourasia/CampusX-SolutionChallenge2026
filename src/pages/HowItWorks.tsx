import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { 
  GraduationCap, 
  ShoppingBag, 
  MessageSquare, 
  Shield, 
  PartyPopper,
  ArrowRight
} from "lucide-react";

const steps = [
  {
    icon: GraduationCap,
    title: "Sign Up with College Email",
    description: "Create your account using your official college email. Instant verification for verified domains.",
  },
  {
    icon: ShoppingBag,
    title: "Browse or List Items",
    description: "Explore exclusive listings from your campus or post items you want to sell.",
  },
  {
    icon: MessageSquare,
    title: "Chat & Negotiate",
    description: "Connect with buyers/sellers and use our AI Negotiator to find the perfect price.",
  },
  {
    icon: Shield,
    title: "Secure Escrow Payment",
    description: "Funds are held safely in escrow until delivery is confirmed by both parties.",
  },
  {
    icon: PartyPopper,
    title: "Complete & Review",
    description: "Confirm delivery and leave reviews to build your campus reputation.",
  },
];

const HowItWorks = () => {
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
                How <span className="text-gradient">CampusX</span> Works
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From signup to successful trade in 5 simple steps. We make buying and selling on campus safe and easy.
              </p>
            </motion.div>

            {/* Steps */}
            <div className="space-y-8">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-6 items-start"
                  >
                    {/* Step Number */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-lg font-bold text-primary-foreground">
                        {index + 1}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-2">
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className="w-6 h-6 text-secondary" />
                        <h3 className="text-xl font-semibold">{step.title}</h3>
                      </div>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>

                    {/* Arrow */}
                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute left-6 top-20">
                        <ArrowRight className="w-6 h-6 text-secondary/50 rotate-90" />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Info Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16 p-8 rounded-2xl bg-secondary/10 border border-secondary/20"
            >
              <div className="flex items-start gap-4">
                <Shield className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Why CampusX is Safe</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>✓ All users verified with college email</li>
                    <li>✓ Escrow protection on every transaction</li>
                    <li>✓ Encrypted messaging for privacy</li>
                    <li>✓ Community reviews and ratings</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorks;

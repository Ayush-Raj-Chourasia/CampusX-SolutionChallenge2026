import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const pricingPlans = [
  {
    name: "For Students",
    price: "Free",
    description: "Everything you need to buy and sell on campus",
    features: [
      "Verified college email signup",
      "Unlimited listings",
      "AI-powered negotiations",
      "Encrypted messaging",
      "Community reviews",
      "Escrow payments",
    ],
    cta: "Get Started",
    highlighted: true,
  },
];

const fees = [
  {
    name: "Escrow Fee",
    price: "1-2%",
    description: "Small fee charged on successful transactions through escrow",
  },
  {
    name: "Seller Premium",
    price: "Optional",
    description: "Optional paid features for sellers (coming soon)",
  },
];

const Pricing = () => {
  const navigate = useNavigate();

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
                Simple, <span className="text-gradient">Transparent Pricing</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                CampusX is free for students. No hidden fees, no subscriptions. Pay only on successful transactions.
              </p>
            </motion.div>

            {/* Pricing Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto mb-16 p-8 rounded-2xl bg-card border-2 border-secondary"
            >
              <h3 className="text-2xl font-semibold mb-2">{pricingPlans[0].name}</h3>
              <p className="text-muted-foreground mb-6">{pricingPlans[0].description}</p>
              <p className="text-5xl font-bold text-gradient mb-8">{pricingPlans[0].price}</p>
              
              <ul className="space-y-4 mb-8">
                {pricingPlans[0].features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-success" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                className="w-full" 
                size="lg"
                onClick={() => navigate("/signup")}
              >
                {pricingPlans[0].cta}
              </Button>
            </motion.div>

            {/* Fees Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="text-2xl font-semibold mb-8 text-center">Transaction Fees</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {fees.map((fee, index) => (
                  <div
                    key={index}
                    className="p-6 rounded-2xl bg-card border border-border"
                  >
                    <p className="text-sm text-muted-foreground mb-2">When you pay:</p>
                    <p className="text-3xl font-bold text-gradient mb-2">{fee.price}</p>
                    <h3 className="font-semibold mb-2">{fee.name}</h3>
                    <p className="text-sm text-muted-foreground">{fee.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Info Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-success/10 border border-success/20"
            >
              <h3 className="font-semibold mb-4">Why We Keep It Free</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>• CampusX is built BY students FOR students</li>
                <li>• No ads, no data selling, no premium paywalls</li>
                <li>• Revenue comes only from small transaction fees when you trade</li>
                <li>• Everyone deserves access to a safe campus marketplace</li>
              </ul>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;

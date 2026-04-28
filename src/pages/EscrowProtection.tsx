import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Lock, CheckCircle2, Clock, Shield } from "lucide-react";

const escrowSteps = [
  {
    step: 1,
    icon: CheckCircle2,
    title: "Buyer Initiates Payment",
    description: "Buyer releases funds for the item. Money goes into CampusX escrow, NOT to the seller yet.",
  },
  {
    step: 2,
    icon: Clock,
    title: "Item in Transit",
    description: "Seller ships/hands over the item. Both parties can track progress through the platform.",
  },
  {
    step: 3,
    icon: Lock,
    title: "Buyer Confirms Delivery",
    description: "Once received, buyer confirms the item matches the listing. Only then do funds release.",
  },
  {
    step: 4,
    icon: Shield,
    title: "Funds Released to Seller",
    description: "Seller receives payment. If buyer disputes, we have full protection mechanisms in place.",
  },
];

const EscrowProtection = () => {
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
                Escrow <span className="text-gradient">Protection</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Every transaction on CampusX is protected by our secure escrow system. 
                Your money is safe from the moment you pay.
              </p>
            </motion.div>

            {/* How Escrow Works */}
            <div className="space-y-8 mb-16">
              {escrowSteps.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-6 items-start"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary-foreground" />
                      </div>
                    </div>
                    <div className="flex-1 pt-2">
                      <h3 className="text-lg font-semibold mb-2">
                        Step {item.step}: {item.title}
                      </h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Why Escrow Matters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-border mb-16"
            >
              <h2 className="text-2xl font-semibold mb-6">Why Escrow Protects You</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-secondary" />
                    For Buyers
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>✓ Money never sent directly to seller</li>
                    <li>✓ Guaranteed return if item doesn't arrive</li>
                    <li>✓ Dispute resolution support</li>
                    <li>✓ Full refund within 30 days</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-secondary" />
                    For Sellers
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>✓ Guaranteed payment once confirmed</li>
                    <li>✓ Protection against buyer fraud</li>
                    <li>✓ Secure order management tools</li>
                    <li>✓ Transparent payment tracking</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Additional Safety */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-success/10 border border-success/20"
            >
              <h2 className="text-2xl font-semibold mb-4">Additional Safety Measures</h2>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span>Fraud detection AI monitors every transaction</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span>Encrypted communication between all parties</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span>User ratings prevent repeat offenders</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span>CampusX insurance covers extreme cases</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default EscrowProtection;

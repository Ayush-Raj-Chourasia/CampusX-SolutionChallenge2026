import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Shield, CheckCircle2, AlertCircle, Lock } from "lucide-react";

const safetyPolicies = [
  {
    icon: CheckCircle2,
    title: "Verified User Identification",
    description: "All users must sign up with their official college email. We verify every user against institutional databases to ensure they're genuine students.",
  },
  {
    icon: Lock,
    title: "Secure Payment Processing",
    description: "Every transaction is protected by our escrow system. Money never changes hands between buyer and seller directly.",
  },
  {
    icon: AlertCircle,
    title: "Fraud Detection & Prevention",
    description: "Our AI algorithms monitor every transaction for suspicious activity. We've prevented over ₹2.4 Crores in scams.",
  },
  {
    icon: Shield,
    title: "User Accountability",
    description: "Complete transaction history, ratings, and reviews build accountability. Bad actors are quickly identified and removed.",
  },
];

const TrustSafety = () => {
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
                Trust & <span className="text-gradient">Safety</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                CampusX is built on trust. Learn how we keep every student safe on campus.
              </p>
            </motion.div>

            {/* Policies Grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {safetyPolicies.map((policy, index) => {
                const Icon = policy.icon;
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
                    <h3 className="text-lg font-semibold mb-2">{policy.title}</h3>
                    <p className="text-muted-foreground">{policy.description}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Key Commitments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-success/10 border border-success/20"
            >
              <h2 className="text-2xl font-semibold mb-6">Our Commitments</h2>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span>24/7 Community Moderators monitoring for fraudulent activity</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span>Immediate suspension of users who violate platform guidelines</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span>Full refund policy if fraud is detected</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span>Transparent communication about any security incidents</span>
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

export default TrustSafety;

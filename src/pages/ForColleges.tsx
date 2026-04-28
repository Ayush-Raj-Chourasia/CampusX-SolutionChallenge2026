import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Building2, TrendingUp, ShieldAlert, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const benefits = [
  {
    icon: ShieldAlert,
    title: "Student Safety",
    description: "Create a safer campus by providing verified, scam-free trading infrastructure for your students.",
  },
  {
    icon: TrendingUp,
    title: "Campus Integration",
    description: "Seamless integration with your college domain. Automatic student verification through email.",
  },
  {
    icon: BarChart3,
    title: "Admin Dashboards",
    description: "Comprehensive dashboards to monitor marketplace activity, handle disputes, and ensure safety.",
  },
  {
    icon: Building2,
    title: "Campus Partnership",
    description: "Co-branded marketplace page, custom branding, and featured placement on CampusX.",
  },
];

const ForColleges = () => {
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
                CampusX for <span className="text-gradient">Colleges</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Partner with CampusX to give your students a safe, verified marketplace. 
                Reduce campus scams. Build community trust.
              </p>
            </motion.div>

            {/* Benefits */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
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
                    <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Partnership Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-border mb-16"
            >
              <h2 className="text-2xl font-semibold mb-6">How Campus Partnerships Work</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-bold text-primary-foreground">
                      1
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Campus Registration</h3>
                    <p className="text-sm text-muted-foreground">
                      Sign up your college with CampusX. Verify your .edu or institutional domain.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-bold text-primary-foreground">
                      2
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Domain Verification</h3>
                    <p className="text-sm text-muted-foreground">
                      All student emails are automatically verified through your institutional domain.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-bold text-primary-foreground">
                      3
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Admin Dashboard</h3>
                    <p className="text-sm text-muted-foreground">
                      Get access to a dedicated dashboard to monitor activity and manage your campus community.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-bold text-primary-foreground">
                      4
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Launch</h3>
                    <p className="text-sm text-muted-foreground">
                      Your dedicated campus page goes live. Students from your college can now trade securely.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h3 className="text-2xl font-semibold mb-4">Ready to Partner?</h3>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Contact us to set up a college partnership and help your students trade safely.
              </p>
              <Button 
                size="lg" 
                className="gap-2"
                onClick={() => navigate("/contact")}
              >
                Contact Our Team
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ForColleges;

import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Target, Lightbulb, Users, Heart } from "lucide-react";

const About = () => {
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
                About <span className="text-gradient">CampusX</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                India's first verified campus-only marketplace, built by students, for students.
              </p>
            </motion.div>

            {/* Story */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="text-2xl font-semibold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  CampusX was born from frustration. Our founders were students at IIT Delhi who kept getting scammed on WhatsApp groups and telegram channels. Books were fake, electronics were stolen, cash was lost.
                </p>
                <p>
                  They realized the problem: there was no trusted marketplace for students. Every platform had scammers. So they built CampusX.
                </p>
                <p>
                  Today, CampusX is live in 40,000+ colleges across India. Students buy and sell safely every day. Scammers can't hide behind fake emails. Transactions are protected. Trust is real.
                </p>
              </div>
            </motion.div>

            {/* Mission & Vision */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-8 rounded-2xl bg-card border border-border"
              >
                <Target className="w-8 h-8 text-secondary mb-4" />
                <h3 className="text-xl font-semibold mb-4">Our Mission</h3>
                <p className="text-muted-foreground">
                  To create a safe, scam-free marketplace where every Indian student can buy and sell with confidence.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="p-8 rounded-2xl bg-card border border-border"
              >
                <Lightbulb className="w-8 h-8 text-secondary mb-4" />
                <h3 className="text-xl font-semibold mb-4">Our Vision</h3>
                <p className="text-muted-foreground">
                  A campus where every student trades with trust. Where scams don't exist. Where community matters.
                </p>
              </motion.div>
            </div>

            {/* Values */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="text-2xl font-semibold mb-8">Our Values</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="flex gap-4">
                  <Heart className="w-6 h-6 text-secondary flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Trust First</h3>
                    <p className="text-sm text-muted-foreground">
                      Every decision is made with student safety in mind.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Users className="w-6 h-6 text-secondary flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Community Driven</h3>
                    <p className="text-sm text-muted-foreground">
                      Built by students, for students. Your feedback shapes CampusX.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-8 p-8 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-border"
            >
              <div className="text-center">
                <p className="text-3xl font-bold text-gradient mb-2">40K+</p>
                <p className="text-muted-foreground">Colleges Supported</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gradient mb-2">10K+</p>
                <p className="text-muted-foreground">Active Students</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gradient mb-2">₹2.4Cr</p>
                <p className="text-muted-foreground">Scams Prevented</p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;

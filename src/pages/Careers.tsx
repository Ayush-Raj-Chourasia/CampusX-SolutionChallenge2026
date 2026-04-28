import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Briefcase, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const openings = [
  {
    role: "Full Stack Engineer",
    location: "Delhi / Remote",
    description: "Build scalable systems that handle 100K+ daily transactions.",
  },
  {
    role: "Security Engineer",
    location: "Delhi / Remote",
    description: "Design and maintain fraud detection systems to keep students safe.",
  },
  {
    role: "Community Manager",
    location: "Delhi",
    description: "Manage college partnerships and ensure community trust.",
  },
];

const Careers = () => {
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
                Join the <span className="text-gradient">CampusX</span> Team
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Help us build the most trusted campus marketplace. We're hiring talented builders.
              </p>
            </motion.div>

            {/* Why Join */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-8 mb-16"
            >
              <div className="p-6 rounded-2xl bg-card border border-border text-center">
                <Zap className="w-8 h-8 text-secondary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Real Impact</h3>
                <p className="text-sm text-muted-foreground">
                  Directly prevent fraud for 10K+ students across Indian campuses.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-card border border-border text-center">
                <Users className="w-8 h-8 text-secondary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Great Team</h3>
                <p className="text-sm text-muted-foreground">
                  Work with passionate builders who care about security and trust.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-card border border-border text-center">
                <Briefcase className="w-8 h-8 text-secondary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Competitive</h3>
                <p className="text-sm text-muted-foreground">
                  Competitive salary, equity, and learning opportunities.
                </p>
              </div>
            </motion.div>

            {/* Open Positions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="text-2xl font-semibold mb-8">Open Positions</h2>
              <div className="space-y-4">
                {openings.map((opening, index) => (
                  <div
                    key={index}
                    className="p-6 rounded-2xl bg-card border border-border hover:border-secondary/30 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-semibold">{opening.role}</h3>
                        <p className="text-sm text-muted-foreground">{opening.location}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-4">{opening.description}</p>
                  <Button variant="outline" size="sm" onClick={() => {
                    // Open job details or show coming soon
                    alert(`${opening.role} application coming soon!`);
                  }}>
                    Learn More
                  </Button>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-border text-center"
            >
              <h2 className="text-2xl font-semibold mb-4">Don't see your role?</h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                If you're passionate about building for students, we'd love to hear from you. Send your resume and portfolio.
              </p>
              <Button 
                size="lg"
                onClick={() => window.location.href = "mailto:careers@campusx.co.in"}
              >
                Send Resume to careers@campusx.co.in
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Careers;

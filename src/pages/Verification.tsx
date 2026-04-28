import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { CheckCircle2, Mail, Clock } from "lucide-react";

const verificationSteps = [
  {
    step: 1,
    title: "Sign Up with College Email",
    description: "Use your official college email address (e.g., student@iitdelhi.ac.in, name@manipal.edu)",
  },
  {
    step: 2,
    title: "Email Verification",
    description: "We send a verification link to your college email. Click it to confirm your identity.",
  },
  {
    step: 3,
    title: "Verified Badge",
    description: "Your profile receives a verified badge. Other students know you're legitimate.",
  },
  {
    step: 4,
    title: "Start Trading",
    description: "You can now buy, sell, and message other verified students on CampusX.",
  },
];

const Verification = () => {
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
                College Email <span className="text-gradient">Verification</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                The foundation of CampusX trust. Every user is verified through their college email.
              </p>
            </motion.div>

            {/* Verification Process */}
            <div className="space-y-6 mb-16">
              {verificationSteps.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-6 items-start p-6 rounded-2xl bg-card border border-border hover:border-secondary/30 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-lg font-bold text-primary-foreground">
                      {item.step}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Why College Email */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-border mb-16"
            >
              <h2 className="text-2xl font-semibold mb-6">Why College Email?</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Mail className="w-6 h-6 text-secondary flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Proof of Identity</h3>
                    <p className="text-sm text-muted-foreground">
                      College email is tied to your student status. It's impossible to fake.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Clock className="w-6 h-6 text-secondary flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Instant Verification</h3>
                    <p className="text-sm text-muted-foreground">
                      No documents needed. Verification happens in seconds.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle2 className="w-6 h-6 text-secondary flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Campus Trust</h3>
                    <p className="text-sm text-muted-foreground">
                      Everyone on CampusX is a real student from a real college. No scammers.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Supported Colleges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-card border border-border"
            >
              <h2 className="text-2xl font-semibold mb-6">Supported College Domains</h2>
              <p className="text-muted-foreground mb-4">
                CampusX supports verified college emails from over 40,000 institutions across India:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted">
                  <p className="font-semibold">IIT Colleges</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    iitdelhi.ac.in, iitbombay.ac.in, iitkanpur.ac.in, etc.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted">
                  <p className="font-semibold">NIT Colleges</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    nit.ac.in, nitk.ac.in, nitkr.ac.in, etc.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted">
                  <p className="font-semibold">State Universities</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    du.ac.in, mumbaiuniversity.ac.in, etc.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted">
                  <p className="font-semibold">Private Colleges</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    manipal.edu, jiit.ac.in, vit.ac.in, etc.
                  </p>
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

export default Verification;

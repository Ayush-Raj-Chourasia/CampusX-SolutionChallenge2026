import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24">
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-16"
            >
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                Privacy <span className="text-gradient">Policy</span>
              </h1>
              <p className="text-muted-foreground">
                Last updated: December 2025
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="prose prose-invert max-w-none space-y-8"
            >
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                <p className="text-muted-foreground">
                  CampusX ("we," "us," or "our") operates as India's first verified campus-only marketplace. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
                  when you visit our platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
                <div className="space-y-4 text-muted-foreground">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">2.1 Personal Information</h3>
                    <p>
                      We collect information you voluntarily provide:
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>College email address</li>
                        <li>Full name and profile information</li>
                        <li>Phone number (optional)</li>
                        <li>Academic details (branch, year)</li>
                      </ul>
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">2.2 Transaction Information</h3>
                    <p>
                      We collect data about your transactions on our platform:
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Listings posted or viewed</li>
                        <li>Chat messages (encrypted)</li>
                        <li>Payment and escrow details</li>
                        <li>Ratings and reviews</li>
                      </ul>
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>To provide and improve our services</li>
                  <li>To verify your college email and prevent fraud</li>
                  <li>To process transactions and escrow payments</li>
                  <li>To communicate important updates and support</li>
                  <li>To maintain safety and prevent illegal activity</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
                <p className="text-muted-foreground">
                  We implement industry-standard encryption (SSL/TLS) to protect your personal data. 
                  Your college email is verified and stored securely. Payment data is handled through 
                  PCI-DSS compliant processors. We never store full credit card information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Data Retention</h2>
                <p className="text-muted-foreground">
                  We retain your data only as long as necessary:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Account data: Retained while your account is active</li>
                    <li>Transaction data: Retained for 3 years for disputes</li>
                    <li>Chat data: Encrypted and retained for 1 year</li>
                  </ul>
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
                <p className="text-muted-foreground">
                  You have the right to:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Access your personal data</li>
                    <li>Request correction of inaccurate data</li>
                    <li>Request deletion of your account</li>
                    <li>Export your data</li>
                  </ul>
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
                <p className="text-muted-foreground">
                  For privacy concerns, contact us at: privacy@campusx.co.in
                </p>
              </section>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;

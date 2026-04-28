import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";

const TermsOfService = () => {
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
                Terms of <span className="text-gradient">Service</span>
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
                <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground">
                  By accessing and using CampusX, you accept and agree to be bound by the terms 
                  and provision of this agreement. If you do not agree to abide by the above, 
                  please do not use this service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. User Eligibility</h2>
                <p className="text-muted-foreground">
                  To use CampusX, you must:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Be at least 18 years old or have parental consent</li>
                    <li>Be a verified student with a valid college email</li>
                    <li>Provide accurate and complete information</li>
                    <li>Be a resident of India</li>
                  </ul>
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. User Conduct</h2>
                <p className="text-muted-foreground mb-4">
                  You agree NOT to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Post false, fraudulent, or misleading listings</li>
                  <li>Engage in harassment, threats, or abusive behavior</li>
                  <li>Attempt to manipulate escrow or payment systems</li>
                  <li>Post illegal, stolen, or counterfeit items</li>
                  <li>Attempt to circumvent our verification system</li>
                  <li>Violate any applicable laws or regulations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Escrow & Payments</h2>
                <p className="text-muted-foreground">
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>All transactions through CampusX are protected by escrow</li>
                    <li>Funds are held by CampusX until both parties confirm completion</li>
                    <li>A small fee (1-2%) is charged on successful transactions</li>
                    <li>Disputes are resolved through our dispute resolution system</li>
                    <li>Full refunds are provided if fraud is detected</li>
                  </ul>
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Dispute Resolution</h2>
                <p className="text-muted-foreground">
                  In case of disputes:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Both parties have 14 days to file a dispute</li>
                    <li>CampusX will investigate and mediate</li>
                    <li>Decision is final and binding</li>
                    <li>Repeated disputes may result in account suspension</li>
                  </ul>
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Prohibited Items</h2>
                <p className="text-muted-foreground">
                  The following items cannot be listed or sold:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Weapons, explosives, or dangerous items</li>
                    <li>Drugs or controlled substances</li>
                    <li>Counterfeit or stolen goods</li>
                    <li>Adult content or services</li>
                    <li>Items violating intellectual property rights</li>
                  </ul>
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Account Termination</h2>
                <p className="text-muted-foreground">
                  CampusX reserves the right to terminate accounts for:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Violation of these terms</li>
                    <li>Fraudulent activity or scams</li>
                    <li>Repeated violations of community guidelines</li>
                    <li>Using fake or multiple accounts</li>
                  </ul>
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Liability Disclaimer</h2>
                <p className="text-muted-foreground">
                  CampusX provides the platform "as is." We are not responsible for:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Quality or accuracy of listings</li>
                    <li>Direct meeting between users (off-platform)</li>
                    <li>Lost or damaged items (only escrow disputes covered)</li>
                    <li>Third-party actions</li>
                  </ul>
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">9. Modifications to Terms</h2>
                <p className="text-muted-foreground">
                  We may modify these terms at any time. Continued use of CampusX 
                  after changes constitutes acceptance of the new terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">10. Contact</h2>
                <p className="text-muted-foreground">
                  For questions about these terms, contact: legal@campusx.co.in
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

export default TermsOfService;

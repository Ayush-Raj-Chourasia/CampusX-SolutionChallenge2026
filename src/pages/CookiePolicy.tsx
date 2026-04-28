import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";

const CookiePolicy = () => {
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
                Cookie <span className="text-gradient">Policy</span>
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
                <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies?</h2>
                <p className="text-muted-foreground">
                  Cookies are small files stored on your device when you visit a website. 
                  They help websites remember your preferences and improve your experience.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. How CampusX Uses Cookies</h2>
                <div className="space-y-4 text-muted-foreground">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">2.1 Session Cookies</h3>
                    <p>
                      Used to keep you logged in and maintain your session on CampusX. 
                      These expire when you close your browser.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">2.2 Preference Cookies</h3>
                    <p>
                      Remember your language choice, theme preference (dark/light mode), 
                      and other settings.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">2.3 Security Cookies</h3>
                    <p>
                      Protect your account from fraud and unauthorized access by storing 
                      authentication tokens.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">2.4 Analytics Cookies</h3>
                    <p>
                      Help us understand how users interact with CampusX to improve our platform. 
                      No personal information is tracked.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. Third-Party Cookies</h2>
                <p className="text-muted-foreground">
                  We use third-party services that may set cookies:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Payment processors (for secure transactions)</li>
                    <li>Analytics services (to track usage patterns)</li>
                    <li>Chat services (for real-time messaging)</li>
                  </ul>
                  These services are bound by their own privacy policies.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Cookie Duration</h2>
                <p className="text-muted-foreground">
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Session cookies: Deleted when you close your browser</li>
                    <li>Persistent cookies: Stored for up to 1 year</li>
                    <li>Security tokens: Refreshed regularly for enhanced security</li>
                  </ul>
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Managing Cookies</h2>
                <p className="text-muted-foreground">
                  Most browsers allow you to control cookies through settings:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Chrome: Settings &gt; Privacy and security &gt; Cookies</li>
                    <li>Firefox: Preferences &gt; Privacy &gt; Cookies</li>
                    <li>Safari: Preferences &gt; Privacy &gt; Cookies</li>
                  </ul>
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Disabling Cookies</h2>
                <p className="text-muted-foreground">
                  Note: Disabling cookies may affect functionality on CampusX:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>You may not stay logged in between sessions</li>
                    <li>Your preferences may not be saved</li>
                    <li>Some features may not work properly</li>
                  </ul>
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Data Security</h2>
                <p className="text-muted-foreground">
                  All cookies on CampusX are encrypted and secured:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Transmitted only over HTTPS</li>
                    <li>Cannot be accessed by JavaScript</li>
                    <li>Protected with secure flags</li>
                  </ul>
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Changes to This Policy</h2>
                <p className="text-muted-foreground">
                  We may update this policy occasionally. Continued use of CampusX 
                  means you accept any changes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
                <p className="text-muted-foreground">
                  For cookie-related questions: privacy@campusx.co.in
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

export default CookiePolicy;

import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { AlertCircle } from "lucide-react";

const issueTypes = [
  "Fraudulent Listing",
  "Scam/Payment Issue",
  "Unsafe Behavior",
  "Inappropriate Content",
  "Other",
];

const ReportFraud = () => {
  const [formData, setFormData] = useState({
    issueType: "",
    description: "",
    email: "",
    listingId: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ issueType: "", description: "", email: "", listingId: "" });
    }, 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24">
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                Report <span className="text-gradient">Fraud</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Help us keep CampusX safe. Report suspicious activity immediately.
              </p>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-card border border-border"
            >
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-success" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">Report Submitted</h3>
                  <p className="text-muted-foreground mb-6">
                    Thank you for helping keep CampusX safe. Our team will review your report within 24 hours.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    You'll receive updates at the email you provided.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Issue Type */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Type of Issue
                    </label>
                    <select
                      name="issueType"
                      value={formData.issueType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-secondary"
                    >
                      <option value="">Select an issue type...</option>
                      {issueTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Your Email
                    </label>
                    <Input
                      type="email"
                      name="email"
                      placeholder="your.email@college.ac.in"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Listing ID (Optional) */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Listing ID (if applicable)
                    </label>
                    <Input
                      type="text"
                      name="listingId"
                      placeholder="e.g., LIST-12345"
                      value={formData.listingId}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Describe the Issue
                    </label>
                    <textarea
                      name="description"
                      placeholder="Please provide details about the fraudulent activity..."
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
                    />
                  </div>

                  {/* Privacy Notice */}
                  <div className="p-4 rounded-lg bg-muted border border-border/50">
                    <p className="text-sm text-muted-foreground">
                      Your report will be kept confidential. We take all fraud reports seriously and will investigate promptly.
                    </p>
                  </div>

                  {/* Submit */}
                  <Button type="submit" className="w-full" size="lg">
                    Submit Report
                  </Button>
                </form>
              )}
            </motion.div>

            {/* Help Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 p-8 rounded-2xl bg-warning/10 border border-warning/20"
            >
              <h2 className="text-xl font-semibold mb-4">What to Report</h2>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <span className="text-warning">•</span>
                  <span>Users claiming to be students but not verified</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-warning">•</span>
                  <span>Listings with fake images or misleading information</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-warning">•</span>
                  <span>Payment scams or escrow disputes</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-warning">•</span>
                  <span>Harassment or unsafe behavior</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-warning">•</span>
                  <span>Links to external scam websites</span>
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

export default ReportFraud;

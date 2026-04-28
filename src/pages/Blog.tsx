import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Calendar, User, ArrowRight } from "lucide-react";
import { useState } from "react";

const blogPosts = [
  {
    title: "How to Stay Safe While Buying on Campus",
    excerpt: "Tips and tricks to avoid common scams when buying textbooks, electronics, or other items from students.",
    date: "Dec 15, 2025",
    author: "CampusX Team",
    category: "Safety",
    read: "5 min read",
  },
  {
    title: "The Rise of Campus Commerce",
    excerpt: "Why peer-to-peer trading is transforming how students buy and sell. A look at the market and future trends.",
    date: "Dec 10, 2025",
    author: "Sarah Patel",
    category: "Trends",
    read: "7 min read",
  },
  {
    title: "Building Trust in Digital Marketplaces",
    excerpt: "Deep dive into how CampusX uses verification, escrow, and AI to prevent fraud at scale.",
    date: "Dec 5, 2025",
    author: "Rahul Kumar",
    category: "Engineering",
    read: "10 min read",
  },
  {
    title: "Student Stories: How CampusX Changed My College Life",
    excerpt: "Real stories from students who have successfully bought and sold on CampusX without any scams.",
    date: "Dec 18, 2025",
    author: "Community",
    category: "Stories",
    read: "4 min read",
  },
];

const Blog = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail("");
    }, 2000);
  };

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
                CampusX <span className="text-gradient">Blog</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Stories, insights, and tips about campus commerce, safety, and community.
              </p>
            </motion.div>

            {/* Blog Posts */}
            <div className="space-y-8">
              {blogPosts.map((post, index) => (
                <motion.article
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-8 rounded-2xl bg-card border border-border hover:border-secondary/30 transition-colors group cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="inline-block px-3 py-1 rounded-lg bg-secondary/10 text-secondary text-xs font-medium mb-3">
                        {post.category}
                      </span>
                      <h2 className="text-2xl font-semibold mb-2 group-hover:text-secondary transition-colors">
                        {post.title}
                      </h2>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-secondary transition-colors flex-shrink-0 mt-1" />
                  </div>

                  <p className="text-muted-foreground mb-4">{post.excerpt}</p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {post.author}
                    </div>
                    <span className="text-xs">{post.read}</span>
                  </div>
                </motion.article>
              ))}
            </div>

            {/* Newsletter Signup */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-border text-center"
            >
              <h2 className="text-2xl font-semibold mb-4">Subscribe to Our Blog</h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Get the latest stories, tips, and updates about campus commerce delivered to your inbox.
              </p>
              {subscribed ? (
                <p className="text-success font-medium">✓ Thanks for subscribing!</p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-3 max-w-sm mx-auto">
                  <input
                    type="email"
                    placeholder="your.email@college.ac.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-secondary text-sm"
                    required
                  />
                  <button
                    type="submit"
                    className="px-6 py-2 bg-secondary text-primary-foreground rounded-lg font-medium hover:bg-secondary/90 transition-colors cursor-pointer"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;

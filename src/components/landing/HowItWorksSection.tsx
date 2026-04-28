import { motion } from "framer-motion";
import { 
  GraduationCap, 
  ShoppingBag, 
  MessageSquare, 
  Shield, 
  PartyPopper,
  ArrowRight,
  CheckCircle2,
  Users,
  Zap,
  Lock
} from "lucide-react";

const steps = [
  {
    step: 1,
    icon: GraduationCap,
    title: "Verify Your College Email",
    description: "Sign up using your official college email (institute domain) to get started.",
    highlight: "Takes 30 seconds",
  },
  {
    step: 2,
    icon: Users,
    title: "Create Your Campus Profile",
    description: "Complete your profile with branch, year, and preferences to personalize your experience.",
    highlight: "Verified Profile",
  },
  {
    step: 3,
    icon: ShoppingBag,
    title: "List or Browse Items",
    description: "Post what you're selling or explore campus-exclusive listings from verified students.",
    highlight: "Campus Only",
  },
  {
    step: 4,
    icon: MessageSquare,
    title: "Chat & Negotiate",
    description: "Use encrypted chat with the AI Negotiator to reach a fair price effortlessly.",
    highlight: "AI Assisted",
  },
  {
    step: 5,
    icon: Shield,
    title: "Secure Escrow Payment",
    description: "Pay through secure escrow. Funds are released only after delivery confirmation.",
    highlight: "100% Protected",
  },
  {
    step: 6,
    icon: PartyPopper,
    title: "Complete & Review",
    description: "Confirm delivery, leave reviews, and help build a trusted student marketplace.",
    highlight: "Trusted Community",
  },
];

const whyCampusX = [
  { icon: CheckCircle2, text: "Verified students only" },
  { icon: Zap, text: "AI-powered negotiation" },
  { icon: Lock, text: "Escrow-backed payments" },
  { icon: Users, text: "Campus-exclusive trust" },
];

export const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            How <span className="text-gradient">CampusX</span> Works
          </h2>
          <p className="text-lg text-muted-foreground">
            From signup to successful trade in 6 simple steps. 
            No complexity, just safety and convenience.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-success -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-card rounded-2xl border border-border p-6 hover:border-secondary/30 transition-colors duration-300 h-full">
                  {/* Step Number */}
                  <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground text-sm font-bold">
                    Step {step.step}
                  </div>

                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-4 mt-2">
                    <step.icon className="w-7 h-7 text-secondary" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{step.description}</p>

                  {/* Highlight Badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-success/10 text-success text-xs font-medium">
                    <Shield className="w-3 h-3" />
                    {step.highlight}
                  </div>
                </div>

                {/* Arrow (visible on larger screens between items) */}
                {index < steps.length - 1 && index % 3 !== 2 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-4 -translate-y-1/2 z-10">
                    <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-secondary" />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Why CampusX Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 pt-16 border-t border-border"
        >
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="text-2xl md:text-3xl font-display font-bold mb-4">
              Why <span className="text-gradient">CampusX</span>?
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyCampusX.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4 p-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-5 h-5 text-success" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">{item.text}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

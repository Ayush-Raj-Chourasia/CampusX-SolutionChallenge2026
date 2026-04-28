import { Logo } from "@/components/icons/Logo";
import { Link } from "react-router-dom";
import { 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail,
  Shield,
} from "lucide-react";

const footerLinks = {
  Product: [
    { label: "How it Works", href: "/how-it-works" },
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "For Colleges", href: "/for-colleges" },
  ],
  Safety: [
    { label: "Trust & Safety", href: "/trust-safety" },
    { label: "Escrow Protection", href: "/escrow-protection" },
    { label: "Verification", href: "/verification" },
    { label: "Report Fraud", href: "/report-fraud" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
    { label: "Cookie Policy", href: "/cookie-policy" },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "https://twitter.com/campusx_demo", label: "Twitter", isExternal: true },
  { icon: Instagram, href: "https://www.instagram.com/campusx_demo", label: "Instagram", isExternal: true },
  { icon: Linkedin, href: "https://www.linkedin.com/company/campusx-demo", label: "LinkedIn", isExternal: true },
  { icon: Mail, href: "mailto:support@campusx.com", label: "Email", isExternal: false },
];

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        {/* Top Section */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Logo & Description */}
          <div className="col-span-2 md:col-span-1">
            <Logo size="md" />
            <p className="mt-4 text-sm text-muted-foreground">
              India's first verified campus-only marketplace. 
              Safe, secure, and scam-free trading for students.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-secondary/20 transition-colors cursor-pointer"
                  aria-label={social.label}
                  {...(social.isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  <social.icon className="w-4 h-4 text-muted-foreground" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 py-8 border-t border-border">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted">
            <Shield className="w-5 h-5 text-success" />
            <span className="text-sm font-medium">SSL Secured</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted">
            <Shield className="w-5 h-5 text-success" />
            <span className="text-sm font-medium">Escrow Protected</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted">
            <Shield className="w-5 h-5 text-success" />
            <span className="text-sm font-medium">100% Verified Users</span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="text-center space-y-2 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            © 2025 CampusX. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Made with care by Idotics
          </p>
          <p className="text-sm text-muted-foreground">
            Developed by Idotics
          </p>
        </div>
      </div>
    </footer>
  );
};

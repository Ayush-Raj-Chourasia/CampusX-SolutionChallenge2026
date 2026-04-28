import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/icons/Logo";
import { Button } from "@/components/ui/button";
import { Menu, X, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const navLinks = [
  { label: "How it Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Marketplace", href: "/marketplace", isRoute: true, requiresAuth: true },
  { label: "Sell", href: "/sell", isRoute: true, requiresAuth: true },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    setIsLoggedIn(!!token);

    // Listen for storage changes in case login/logout happens in another tab/component
    const handleStorageChange = () => {
      const token = sessionStorage.getItem('authToken');
      setIsLoggedIn(!!token);
    };

    window.addEventListener('storage', handleStorageChange);
    // Custom event for same-tab updates
    window.addEventListener('auth-change', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-change', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    setIsLoggedIn(false);
    navigate('/');
    // Dispatch event to notify other components
    window.dispatchEvent(new Event('auth-change'));
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    if (isLoggedIn) {
      e.preventDefault();
      navigate('/marketplace');
    }
  };

  const handleNavClick = (link: typeof navLinks[0]) => {
    if (link.isRoute) {
      // Check if route requires authentication
      if (link.requiresAuth) {
        const token = sessionStorage.getItem('authToken');
        if (!token) {
          navigate('/login');
          return;
        }
      }
      navigate(link.href);
    } else {
      // Smooth scroll to section
      const element = document.querySelector(link.href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-4 mt-4">
        <nav className="container mx-auto px-4 py-3 rounded-2xl glass-card">
          <div className="flex items-center justify-between">
            <Link to="/" onClick={handleLogoClick}>
              <Logo size="md" />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                link.isRoute ? (
                  <button
                    key={link.label}
                    onClick={() => handleNavClick(link)}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </button>
                ) : (
                  <button
                    key={link.label}
                    onClick={() => handleNavClick(link)}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </button>
                )
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              {isLoggedIn ? (
                <>
                  <Link to="/marketplace">
                    <Button variant="default" size="sm" className="gap-2">
                      Dashboard
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm">
                      Log In
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button variant="default" size="sm" className="gap-2">
                      <Shield className="w-4 h-4" />
                      Sign Up Free
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden overflow-hidden"
              >
                <div className="pt-4 pb-2 space-y-2">
                  {navLinks.map((link) => (
                    <button
                      key={link.label}
                      onClick={() => handleNavClick(link)}
                      className="block w-full text-left px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                    >
                      {link.label}
                    </button>
                  ))}
                  <div className="pt-4 space-y-2">
                    {isLoggedIn ? (
                      <>
                        <Link to="/marketplace" className="block" onClick={() => setIsOpen(false)}>
                          <Button variant="default" className="w-full">
                            Dashboard
                          </Button>
                        </Link>
                        <Button variant="ghost" className="w-full" onClick={() => { handleLogout(); setIsOpen(false); }}>
                          Log Out
                        </Button>
                      </>
                    ) : (
                      <>
                        <Link to="/login" className="block" onClick={() => setIsOpen(false)}>
                          <Button variant="ghost" className="w-full">
                            Log In
                          </Button>
                        </Link>
                        <Link to="/signup" className="block" onClick={() => setIsOpen(false)}>
                          <Button variant="default" className="w-full gap-2">
                            <Shield className="w-4 h-4" />
                            Sign Up Free
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </div>
    </motion.header>
  );
};

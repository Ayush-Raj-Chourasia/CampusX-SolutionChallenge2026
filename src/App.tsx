import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyOTP from "./pages/VerifyOTP";
import ForgotPassword from "./pages/ForgotPassword";
import Marketplace from "./pages/Marketplace";
import Product from "./pages/Product";
import Chat from "./pages/Chat";
import Messages from "./pages/Messages";
import Sell from "./pages/Sell";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import MyListings from "./pages/MyListings";
import EditListing from "./pages/EditListing";
import Favorites from "./pages/Favorites";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";
import HowItWorks from "./pages/HowItWorks";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import ForColleges from "./pages/ForColleges";
import TrustSafety from "./pages/TrustSafety";
import EscrowProtection from "./pages/EscrowProtection";
import Verification from "./pages/Verification";
import ReportFraud from "./pages/ReportFraud";
import About from "./pages/About";
import Careers from "./pages/Careers";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
<ThemeProvider>
  <LanguageProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <Routes>
          {/* Public Auth Pages */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Marketing / Product Pages (Public) */}
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/for-colleges" element={<ForColleges />} />

          {/* Safety Pages (Public) */}
          <Route path="/trust-safety" element={<TrustSafety />} />
          <Route path="/escrow-protection" element={<EscrowProtection />} />
          <Route path="/verification" element={<Verification />} />
          <Route path="/report-fraud" element={<ReportFraud />} />

          {/* Company Pages (Public) */}
          <Route path="/about" element={<About />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />

          {/* Legal Pages (Public) */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />

          {/* Protected App Pages */}
          <Route
            path="/marketplace"
            element={<ProtectedRoute><Marketplace /></ProtectedRoute>}
          />
          <Route
            path="/product/:id"
            element={<ProtectedRoute><Product /></ProtectedRoute>}
          />
          <Route
            path="/chat/:id"
            element={<ProtectedRoute><Chat /></ProtectedRoute>}
          />
          <Route
            path="/messages"
            element={<ProtectedRoute><Messages /></ProtectedRoute>}
          />
          <Route
            path="/sell"
            element={<ProtectedRoute><Sell /></ProtectedRoute>}
          />
          <Route
            path="/profile"
            element={<ProtectedRoute><Profile /></ProtectedRoute>}
          />
          <Route
            path="/edit-profile"
            element={<ProtectedRoute><EditProfile /></ProtectedRoute>}
          />
          <Route
            path="/my-listings"
            element={<ProtectedRoute><MyListings /></ProtectedRoute>}
          />
          <Route
            path="/edit-listing/:id"
            element={<ProtectedRoute><EditListing /></ProtectedRoute>}
          />
          <Route
            path="/favorites"
            element={<ProtectedRoute><Favorites /></ProtectedRoute>}
          />
          <Route
            path="/settings"
            element={<ProtectedRoute><Settings /></ProtectedRoute>}
          />
          <Route
            path="/help"
            element={<ProtectedRoute><Help /></ProtectedRoute>}
          />
          <Route
            path="/admin"
            element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </LanguageProvider>
</ThemeProvider>

  </QueryClientProvider>
);

export default App;

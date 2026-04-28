import { Link, useNavigate } from "react-router-dom";
import { Logo } from "@/components/icons/Logo";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Shield, Moon, Sun, Loader2 } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useTranslation } from "@/hooks/useTranslation";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = sessionStorage.getItem('authToken');
        const cachedUser = sessionStorage.getItem('currentUser');
        
        // If no token, redirect to login
        if (!token) {
          navigate('/login');
          return;
        }

        // Try to fetch from backend API
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        
        const response = await fetch(`${API_URL}/api/auth/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Backend returns { success: true, data: { user: {...} } }
          const userData = data.data.user || data.data;
          console.log('Profile API Response:', userData); // Debug: check what data we get
          setUser(userData);
          // Update cached user data
          sessionStorage.setItem('currentUser', JSON.stringify(userData));
        } else {
          // Fallback to cached data if API fails
          if (cachedUser) {
            setUser(JSON.parse(cachedUser));
            toast.info('Showing cached profile data');
          } else {
            throw new Error('Failed to load profile');
          }
        }
      } catch (error) {
        console.error('Profile fetch error:', error);
        // Try to use cached data
        const cachedUser = sessionStorage.getItem('currentUser');
        if (cachedUser) {
          setUser(JSON.parse(cachedUser));
        } else {
          toast.error('Failed to load profile');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">No user signed in</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-xl mx-auto bg-card p-6 rounded-xl border border-border">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-xl font-semibold text-white">
              {user.fullName?.charAt(0) || user.name?.charAt(0) || user.collegeEmail?.charAt(0)}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold">{user.fullName || user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.collegeEmail || user.email}</p>
              {user.verified && (
                <div className="mt-1 inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                  <Shield className="w-3 h-3" />
                  <span>Verified</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Phone:</span>
              <span className="font-medium">
                {user.phone || user.phoneNumber || (
                  <span className="text-muted-foreground italic">Not provided</span>
                )}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">College:</span>
              <span className="font-medium">{user.college || user.collegeEmail?.split("@")[1] || "-"}</span>
            </div>
            {(user.branch || user.department) && (
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Branch:</span>
                <span className="font-medium">{user.branch || user.department}</span>
              </div>
            )}
            {user.year && (
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Year:</span>
                <span className="font-medium">{user.year}</span>
              </div>
            )}
            {user.trustScore !== undefined && (
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Trust Score:</span>
                <span className="font-semibold text-primary">{user.trustScore}/100</span>
              </div>
            )}
          </div>

          <div className="mt-6 flex gap-2">
            <Button onClick={() => navigate('/edit-profile')}>Edit Profile</Button>
            <Button variant="outline" onClick={() => { sessionStorage.removeItem('currentUser'); navigate('/login'); }}>Sign out</Button>
          </div>

          {/* Dark Mode Quick Toggle */}
          <div className="mt-6 p-3 bg-muted/50 rounded-lg border border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              {theme === 'dark' ? (
                <Moon className="w-4 h-4 text-primary" />
              ) : (
                <Sun className="w-4 h-4 text-primary" />
              )}
              <span className="text-sm font-medium">{t('darkMode')}</span>
            </div>
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              role="switch"
              aria-checked={theme === 'dark' ? 'true' : 'false'}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                theme === 'dark'
                  ? "bg-primary"
                  : "bg-muted-foreground/30"
              }`}
            >
              <span
                className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                  theme === 'dark' ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4 text-green-600" />
            <span>College-verified accounts only</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

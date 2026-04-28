import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Lock,
  LogOut,
  Bell,
  Eye,
  Moon,
  Sun,
  Globe,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";

const Settings = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();
  const [user, setUser] = useState<any>(null);
  
  // Account settings
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Notification toggles
  const [notifications, setNotifications] = useState({
    newProductNotifications: true,
    newMessageNotifications: true,
  });

  // Privacy & Security toggles
  const [privacy, setPrivacy] = useState({
    showOnlineStatus: true,
    allowNonFavoriteMessages: true,
  });

  useEffect(() => {
    const data = sessionStorage.getItem("currentUser");
    if (data) {
      setUser(JSON.parse(data));
    }

    // Load persisted settings
    try {
      const savedNotifications = sessionStorage.getItem("settings_notifications");
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications));
      }
      const savedPrivacy = sessionStorage.getItem("settings_privacy");
      if (savedPrivacy) {
        setPrivacy(JSON.parse(savedPrivacy));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    sessionStorage.setItem("settings_notifications", JSON.stringify(updated));
    toast.success(
      `${key === "newProductNotifications" ? "Product" : "Message"} notifications ${
        updated[key] ? "enabled" : "disabled"
      }`
    );
  };

  const handlePrivacyToggle = (key: keyof typeof privacy) => {
    const updated = { ...privacy, [key]: !privacy[key] };
    setPrivacy(updated);
    sessionStorage.setItem("settings_privacy", JSON.stringify(updated));
    const label = key === "showOnlineStatus" ? "Online status" : "Non-favorite messages";
    toast.success(`${label} ${updated[key] ? "visible" : "hidden"}`);
  };



  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    // Mock password change
    toast.success("Password changed successfully");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPasswordChange(false);
  };

  const handleLogoutAllDevices = () => {
    toast.success("Logged out from all devices");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("currentUser");
    navigate("/login");
    toast.success("Logged out successfully");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">No user signed in</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-10">
      <div className="sticky top-0 bg-card border-b border-border px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold">{t("settings.title")}</h1>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Account Settings Section */}
        <section className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="bg-muted/50 px-4 py-3 border-b border-border flex items-center gap-3">
            <Lock className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Account Settings</h2>
          </div>

          <div className="divide-y divide-border">
            {/* Change Password */}
            <div className="p-4">
              <div
                onClick={() => setShowPasswordChange(!showPasswordChange)}
                className="flex items-center justify-between cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="flex items-center gap-3">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Change Password</p>
                    <p className="text-xs text-muted-foreground">Update your account password</p>
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 transition-transform ${
                  showPasswordChange ? "rotate-90" : ""
                }`} />
              </div>

              {showPasswordChange && (
                <div className="mt-4 space-y-3 bg-muted/30 p-4 rounded-lg">
                  <input
                    type="password"
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
                  />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handlePasswordChange}>
                      Update Password
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowPasswordChange(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Logout from All Devices */}
            <div className="p-4">
              <div
                onClick={handleLogoutAllDevices}
                className="flex items-center justify-between cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="flex items-center gap-3">
                  <LogOut className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Logout from All Devices</p>
                    <p className="text-xs text-muted-foreground">Sign out from all active sessions</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          </div>
        </section>

        {/* Notifications Settings Section */}
        <section className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="bg-muted/50 px-4 py-3 border-b border-border flex items-center gap-3">
            <Bell className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>

          <div className="divide-y divide-border">
            {/* New Product Notifications */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium">New Product Notifications</p>
                <p className="text-xs text-muted-foreground">Get notified about new items matching your interests</p>
              </div>
              <button
                onClick={() => handleNotificationToggle("newProductNotifications")}
                className={`ml-4 relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.newProductNotifications
                    ? "bg-primary"
                    : "bg-muted"
                }`}
                aria-label="Toggle new product notifications"
                role="switch"
                aria-checked={notifications.newProductNotifications ? 'true' : 'false'}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.newProductNotifications ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* New Message Notifications */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium">New Message Notifications</p>
                <p className="text-xs text-muted-foreground">Get notified when you receive new messages</p>
              </div>
              <button
                onClick={() => handleNotificationToggle("newMessageNotifications")}
                className={`ml-4 relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.newMessageNotifications
                    ? "bg-primary"
                    : "bg-muted"
                }`}
                aria-label="Toggle new message notifications"
                role="switch"
                aria-checked={notifications.newMessageNotifications ? 'true' : 'false'}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.newMessageNotifications ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Privacy & Security Section */}
        <section className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="bg-muted/50 px-4 py-3 border-b border-border flex items-center gap-3">
            <Eye className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Privacy & Security</h2>
          </div>

          <div className="divide-y divide-border">
            {/* Show Online Status */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium">Show Online Status</p>
                <p className="text-xs text-muted-foreground">Let others see when you're active</p>
              </div>
              <button
                onClick={() => handlePrivacyToggle("showOnlineStatus")}
                className={`ml-4 relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  privacy.showOnlineStatus
                    ? "bg-primary"
                    : "bg-muted"
                }`}
                aria-label="Toggle show online status"
                role="switch"
                aria-checked={privacy.showOnlineStatus ? 'true' : 'false'}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    privacy.showOnlineStatus ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Allow Messages from Non-Favorites */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium">Allow Messages from Non-Favorites</p>
                <p className="text-xs text-muted-foreground">Accept messages from any user</p>
              </div>
              <button
                onClick={() => handlePrivacyToggle("allowNonFavoriteMessages")}
                className={`ml-4 relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  privacy.allowNonFavoriteMessages
                    ? "bg-primary"
                    : "bg-muted"
                }`}
                aria-label="Toggle allow messages from non-favorites"
                role="switch"
                aria-checked={privacy.allowNonFavoriteMessages ? 'true' : 'false'}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    privacy.allowNonFavoriteMessages ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* App Preferences Section */}
        <section className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="bg-muted/50 px-4 py-3 border-b border-border flex items-center gap-3">
            <Globe className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">App Preferences</h2>
          </div>

          <div className="divide-y divide-border">
            {/* Dark Mode */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium">{t('darkMode')}</p>
                <p className="text-xs text-muted-foreground">{t('darkModeDescription')}</p>
              </div>
              <button
                onClick={toggleTheme}
                className={`ml-4 relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  theme === 'dark'
                    ? "bg-primary"
                    : "bg-muted"
                }`}
                aria-label="Toggle dark mode"
                role="switch"
                aria-checked={theme === 'dark' ? 'true' : 'false'}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    theme === 'dark' ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Language */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium">{t('language')}</p>
                <p className="text-xs text-muted-foreground">{t('selectLanguage')}</p>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="ml-4 px-3 py-1 rounded border border-border bg-background text-sm"
                aria-label="Select language"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Sign Out Button */}
        <div className="pt-4">
          <Button variant="destructive" className="w-full" onClick={handleLogout}>
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

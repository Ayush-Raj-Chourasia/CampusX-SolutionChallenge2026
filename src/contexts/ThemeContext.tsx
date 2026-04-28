import React, { createContext, useContext, useState, useEffect } from "react";

export type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Check sessionStorage first, then system preference
    const stored = sessionStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
      return stored;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  // Sync with backend on mount if logged in
  useEffect(() => {
    const syncThemeWithBackend = async () => {
      const token = sessionStorage.getItem('authToken');
      if (token) {
        try {
          // Fetch current user profile to get saved theme
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
          const response = await fetch(`${API_URL}/api/auth/profile`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await response.json();
          if (data.success && data.data.user.theme) {
            setThemeState(data.data.user.theme);
          }
        } catch (error) {
          // Silently fail - theme sync is not critical
          if (import.meta.env.DEV) {
            console.log('Theme sync skipped:', error);
          }
        }
      }
    };

    syncThemeWithBackend();
  }, []);

  useEffect(() => {
    // Update DOM and sessionStorage when theme changes
    const htmlElement = document.documentElement;
    if (theme === "dark") {
      htmlElement.classList.add("dark");
    } else {
      htmlElement.classList.remove("dark");
    }
    sessionStorage.setItem("theme", theme);

    // Persist to backend if logged in
    const saveThemeToBackend = async () => {
      const token = sessionStorage.getItem('authToken');
      if (token) {
        try {
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
          await fetch(`${API_URL}/api/auth/profile`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ theme })
          });
        } catch (error) {
          // Silently fail - theme save is not critical
        }
      }
    };

    // Debounce or just save? Since theme change is rare, direct save is fine.
    // However, we need to avoid saving on initial load if it matches. 
    // But keeping it simple for now. 
    // NOTE: This might cause a save on initial load. Ideally we check if it changed.
    saveThemeToBackend();

  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "light" ? "dark" : "light"));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

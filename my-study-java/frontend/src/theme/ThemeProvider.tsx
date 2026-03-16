import React, { createContext, useContext, useEffect, useState } from "react";
import { darkTheme, lightTheme, Theme } from "./themes";

type ThemeName = "dark" | "light";

const ThemeContext = createContext<{
  theme: ThemeName;
  toggle: () => void;
} | null>(null);

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  Object.entries(theme).forEach(([k, v]) => root.style.setProperty(k, v));
}

export function ThemeProvider({ children }: { children?: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>(() => {
    try {
      const stored = localStorage.getItem("app-theme");
      if (stored === "light" || stored === "dark") return stored;
    } catch (e) {}
    // default to dark
    return "dark";
  });

  useEffect(() => {
    applyTheme(theme === "dark" ? darkTheme : lightTheme);
    try {
      localStorage.setItem("app-theme", theme);
    } catch (e) {}
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

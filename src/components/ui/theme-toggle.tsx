"use client";

import * as React from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [isLight, setIsLight] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const hasLightClass = document.documentElement.classList.contains("light");
    setIsLight(hasLightClass);
  }, []);

  const toggleTheme = () => {
    const nextIsLight = !isLight;
    setIsLight(nextIsLight);

    if (nextIsLight) {
      document.documentElement.classList.add("light");
      try {
        localStorage.setItem("google_review_theme", "light");
      } catch {}
    } else {
      document.documentElement.classList.remove("light");
      try {
        localStorage.setItem("google_review_theme", "dark");
      } catch {}
    }
  };

  if (!mounted) {
    return (
      <div
        className={`w-[38px] h-[38px] rounded-full bg-surface border border-border shrink-0 ${className}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`flex items-center justify-center w-[38px] h-[38px] rounded-full bg-surface border border-border text-secondary hover:text-primary hover:border-google-blue/40 transition-all cursor-pointer shadow-xs shrink-0 ${className}`}
      title={isLight ? "Beralih ke Dark Theme (M3 Default)" : "Beralih ke Light Theme (Google Workspace)"}
      aria-label="Toggle Google Theme"
    >
      {isLight ? (
        <Sun size={17} className="text-google-yellow transition-transform duration-200" />
      ) : (
        <Moon size={16} className="text-google-blue transition-transform duration-200" />
      )}
    </button>
  );
}

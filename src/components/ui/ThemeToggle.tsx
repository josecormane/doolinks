"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const getPreferredTheme = (): "light" | "dark" => {
  if (typeof window === "undefined") {
    return "light";
  }

  const savedTheme = window.localStorage.getItem("theme") as "light" | "dark" | null;
  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setMounted(true);
    const preferredTheme = getPreferredTheme();
    setTheme(preferredTheme);
    document.documentElement.classList.toggle("dark", preferredTheme === "dark");
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  if (!mounted) {
    return (
      <button
        className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-2 text-[var(--text)] shadow-sm transition-all hover:border-[var(--accent)] hover:shadow-md"
        aria-label="Switch theme"
      >
        <Moon className="h-5 w-5 text-[var(--accent)]" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] p-2 text-[var(--text)] shadow-sm transition-all hover:border-[var(--accent)] hover:shadow-md"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5 text-[var(--accent)]" />
      ) : (
        <Sun className="h-5 w-5 text-[var(--odoo-gold)]" />
      )}
    </button>
  );
}


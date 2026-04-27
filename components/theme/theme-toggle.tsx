"use client";

import { useEffect, useState } from "react";
import { MoonStar, SunMedium } from "lucide-react";
import { Button } from "@/components/ui/button";

type Theme = "light" | "dark";
const STORAGE_KEY = "elite-theme";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  window.localStorage.setItem(STORAGE_KEY, theme);
}

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const nextTheme = stored ?? systemTheme;

    setTheme(nextTheme);
    applyTheme(nextTheme);
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-11 w-11 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)]" aria-hidden="true" />;
  }

  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <Button
      type="button"
      variant="secondary"
      size="icon"
      aria-label={`Switch to ${nextTheme} mode`}
      onClick={() => {
        setTheme(nextTheme);
        applyTheme(nextTheme);
      }}
    >
      {theme === "dark" ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
    </Button>
  );
}

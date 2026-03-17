"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white/70 px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm backdrop-blur transition hover:bg-white dark:border-white/15 dark:bg-zinc-950/60 dark:text-zinc-100 dark:hover:bg-zinc-950"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="tabular-nums">{isDark ? "Dark" : "Light"}</span>
    </button>
  );
}


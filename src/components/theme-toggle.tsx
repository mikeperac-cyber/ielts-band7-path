"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle dark mode"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        border: "none",
        color: "inherit",
        padding: "4px",
        cursor: "pointer",
        transition: "color var(--transition), transform var(--transition)",
      }}
      className="theme-toggle hover:scale-110"
    >
      <span suppressHydrationWarning>{resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}</span>
    </button>
  );
}

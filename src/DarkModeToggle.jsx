import React from "react";

export default function DarkModeToggle({ dark, setDark }) {
  return (
    <button
      onClick={() => setDark((d) => !d)}
      className="p-2 rounded bg-transparent text-secondary dark:text-tertiary border border-secondary/20 dark:border-tertiary/20 hover:border-secondary dark:hover:border-tertiary hover:bg-secondary/10 dark:hover:bg-tertiary/10 transition-all"
      aria-label="Toggle dark mode"
    >
      {dark ? "🌙" : "☀️"}
    </button>
  );
}
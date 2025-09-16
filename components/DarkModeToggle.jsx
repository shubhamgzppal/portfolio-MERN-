import React from "react";

export default function DarkModeToggle({ dark, setDark, toggleCount }) {
  const isBackgroundDisabled = toggleCount === 2;
  
  return (
    <div className="flex flex-col items-end">
      <button
        onClick={() => setDark(!dark)}
        className="p-2 rounded bg-transparent text-secondary dark:text-tertiary border border-secondary/20 dark:border-tertiary/20 hover:border-secondary dark:hover:border-tertiary hover:bg-secondary/10 dark:hover:bg-tertiary/10 transition-all"
        aria-label="Toggle dark mode"
      >
        {dark ? "Liquid" : "Ball"}{isBackgroundDisabled ? " (3D Off)" : ""}
      </button>
      {toggleCount === 1 && (
        <div className="text-xs mt-1 text-secondary/70 dark:text-tertiary/70">
          1 more click to disable 3D
        </div>
      )}
      {toggleCount === 2 && (
        <div className="text-xs mt-1 text-secondary/70 dark:text-tertiary/70">
          Click again to re-enable 3D
        </div>
      )}
    </div>
  );
}
import React, { useRef, useEffect } from "react";

export default function Sidebar({ open, onClose, theme = "dark" }) {
  const sidebarRef = useRef();

  // Close sidebar if click outside (on mobile)
  useEffect(() => {
    function handleClick(e) {
      // Only close if click is outside the sidebar
      if (
        open &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        onClose();
      }
    }
    if (open) {
      // Use capture phase to ensure this runs before other handlers
      document.addEventListener("mousedown", handleClick, true);
      document.addEventListener("touchstart", handleClick, true);
    }
    return () => {
      document.removeEventListener("mousedown", handleClick, true);
      document.removeEventListener("touchstart", handleClick, true);
    };
  }, [open, onClose]);

  // Conditional text style for better visibility
  const textClass =
    theme === "light"
      ? "text-gray-900 drop-shadow-lg font-semibold"
      : "text-white";

  return (
    <>
      {/* Overlay for mobile and tablet */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={e => {
            // Prevent closing if click is inside the sidebar
            if (sidebarRef.current && sidebarRef.current.contains(e.target)) return;
            onClose();
          }}
        />
      )}
      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 z-50 flex flex-col w-64 h-screen backdrop-blur-lg shadow-card py-4 sm:py-6 px-3 sm:px-4 gap-4 sm:gap-6 lg:gap-8 rounded-r-3xl border-r border-white/10 lg:hidden transition-all ease-in-out duration-500 ${
          open ? "translate-x-0 opacity-100 pointer-events-auto" : "-translate-x-full opacity-0 pointer-events-none"
        }`}
        tabIndex={-1}
        aria-modal="true"
        role="dialog"
      >
        {/* Example sidebar content with improved contrast */}
        <nav className="flex flex-col gap-4">
          <a className={textClass + " text-lg"} href="#hero">Home</a>
          <a className={textClass + " text-lg"} href="#about">About</a>
          <a className={textClass + " text-lg"} href="#projects">Projects</a>
          <a className={textClass + " text-lg"} href="#resume">Resume</a>
          <a className={textClass + " text-lg"} href="#certificates">Certificates</a>
          <a className={textClass + " text-lg"} href="#contact">Contact</a>
        </nav>
        {/* ...existing code... */}
      </aside>
    </>
  );
}

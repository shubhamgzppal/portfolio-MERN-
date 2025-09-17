import React, { useRef, useEffect, useState, useCallback } from "react";
import DarkModeToggle from '../components/DarkModeToggle.jsx'

export default function Sidebar({ open, onClose, theme = "dark", dark, setDark, showBackground, setShowBackground }) {
  const sidebarRef = useRef();
  const [toggleCount, setToggleCount] = useState(0);
  const prevDarkRef = useRef(dark);
  
  useEffect(() => {
    if (dark !== undefined && dark !== prevDarkRef.current) {
      prevDarkRef.current = dark;
      
      setToggleCount((prevCount) => {
        const newCount = prevCount + 1;
        if (newCount === 2) {
          setShowBackground(false);
        } else if (newCount === 3) {
          setShowBackground(true);
          return 0;
        }
        return newCount;
      });
    }
  }, [dark, setShowBackground]);

  useEffect(() => {
    function handleClick(e) {
      if (!open) return;
      if (!sidebarRef.current?.contains(e.target) && !e.target.closest('[aria-label="Open menu"]')) {
        onClose();
      }
    }
    
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("touchstart", handleClick);
    
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("touchstart", handleClick);
    };
  }, [open, onClose]);

  const textClass =
    theme === "light"
      ? "text-gray-900 drop-shadow-lg font-semibold"
      : "text-white";

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 xl:hidden"
          onClick={e => {
            if (sidebarRef.current && sidebarRef.current.contains(e.target)) return;
            onClose();
          }}
        />
      )}
      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 z-50 flex flex-col w-64 h-screen justify-around items-center backdrop-blur-lg bg-primary/95 dark:bg-gray-900/95 shadow-card py-4 sm:py-6 px-3 sm:px-4 gap-6 sm:gap-8 lg:gap-10 rounded-r-3xl border-r border-white/10 xl:hidden transition-all ease-in-out duration-500 ${
          open ? "translate-x-0 opacity-100 pointer-events-auto" : "-translate-x-full opacity-0 pointer-events-none"
        }`}
        tabIndex={-1}
        aria-modal="true"
        role="dialog"
      >

        <nav className="flex flex-col gap-4">
          <a className={textClass + " text-lg"} href="#hero">Home</a>
          <a className={textClass + " text-lg"} href="#about">About</a>
          <a className={textClass + " text-lg"} href="#projects">Projects</a>
          <a className={textClass + " text-lg"} href="#certificates">Certificates</a>
          <a className={textClass + " text-lg"} href="#education">Education</a>
          <a className={textClass + " text-lg"} href="#resume">Resume</a>
          <a className={textClass + " text-lg"} href="#contact">Contact</a>
        </nav>

        <div className="border border-white/10 rounded-full cursor-pointer item-center">
          <div className="flex items-center text-lg px-2 gap-2">
            Change-<DarkModeToggle dark={dark} setDark={setDark} />
          </div>
        </div>
    
        {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/shubhamgzppal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white-100 hover:text-gray-300 transition font-semibold drop-shadow"
            >
              <span className="sr-only">GitHub</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.687-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.594 1.028 2.687 0 3.847-2.337 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .267.18.577.688.479C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" />
              </svg>
            </a>
            <a
              href="#contact"
              className="text-white-100 hover:text-gray-300 transition font-semibold drop-shadow"
            >
              <span className="sr-only">Email</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 4H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 2v.01L12 13 3 6.01V6h18zM3 20V8.236l8.293 6.964a1 1 0 0 0 1.414 0L21 8.236V20H3z" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/shubham-pal-700215253/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white-100 hover:text-gray-300 transition font-semibold drop-shadow"
            >
              <span className="sr-only">LinkedIn</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm15.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v5.595z" />
              </svg>
            </a>
          </div>
      </aside>
    </>
  );
}

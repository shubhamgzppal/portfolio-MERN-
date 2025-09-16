import React from "react";

export default function DarkModeToggle({ dark, setDark }) {
   
  return (
    <div onClick={() => setDark(!dark)} aria-label="Toggle dark mode" >BG🔄</div>
  );
}
import React, { useEffect, useState } from "react";

const getSystem = () =>
  window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

export default function ThemeToggle() {
  const [mode, setMode] = useState(() => localStorage.getItem("theme") || "system");

  useEffect(() => {
    const root = document.documentElement;
    const apply = (m) => {
      if (m === "system") {
        root.removeAttribute("data-theme");
      } else {
        root.setAttribute("data-theme", m);
      }
    };
    if (mode === "system") {
      apply("system");
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => apply("system");
      mq.addEventListener?.("change", handler);
      return () => mq.removeEventListener?.("change", handler);
    } else {
      apply(mode);
    }
  }, [mode]);

  useEffect(() => {
    if (mode === "system") localStorage.removeItem("theme");
    else localStorage.setItem("theme", mode);
  }, [mode]);

  return (
    <div className="theme-segment-wrap">
  <div className="theme-segment">
    <button className="theme-option" onClick={() => setMode("light")} aria-pressed={mode === "light"}>Light</button>
    <button className="theme-option" onClick={() => setMode("dark")} aria-pressed={mode === "dark"}>Dark</button>
    <button className="theme-option" onClick={() => setMode("system")} aria-pressed={mode === "system"}>System</button>
  </div>
</div>


    
  
  );
}

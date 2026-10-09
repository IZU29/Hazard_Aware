"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  // Synchronize state with local storage / system preferences on mount
  useEffect(() => {
    const isDark = 
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") && 
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Toggle function
  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-2 rounded-md text-zinc-800 dark:text-white transition-colors duration-200"
    >
      <img src={darkMode ? "dark_mode.svg" : "light_mode.svg"} alt="" className={darkMode ? "text-white" : "text-[#155EEF]"}/>
    </button>
  );
}
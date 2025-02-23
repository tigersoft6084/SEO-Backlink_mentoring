"use client";

import { useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useUser } from "../../context/UserContext";

export default function ThemeToggle() {
  const { theme, setTheme, toggleTheme } = useTheme();
  const { user } = useUser(); // ✅ Get user context

  // ✅ Ensure theme is "light" when user is not logged in
  useEffect(() => {
    if (!user && theme !== "light") {
      setTheme("light"); // ✅ Force light mode for non-logged-in users
    }
  }, [user, theme, setTheme]);

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-200 dark:bg-slate-800 transition-colors duration-200 hover:bg-gray-300 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
      aria-label="Toggle Theme"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="w-8 h-8 transition-all"
      >
        {/* Sun Core */}
        <circle
          cx="12"
          cy="12"
          r="5"
          fill={theme === "light" ? "#F5F5F5" : "#A0A0A0"}
          stroke={theme === "light" ? "#909090" : "#C0C0C0"}
          strokeWidth="2"
        />
        {/* Sun Rays */}
        <path
          d="M12 1v2M12 21v2M21 12h2M1 12H3M16.95 7.05l1.414-1.414M4.636 19.364l1.414-1.414M16.95 16.95l1.414 1.414M4.636 4.636l1.414 1.414"
          stroke={theme === "light" ? "#909090" : "#C0C0C0"}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}

"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface ThemeContextProps {
  theme: string;
  setTheme: (theme: string) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const storedTheme = sessionStorage.getItem("theme") || "light";

    // Ensure non-logged-in users always get light mode
    const user = sessionStorage.getItem("user");
    const finalTheme = user ? storedTheme : "light";

    setTheme(finalTheme);
    document.body.classList.toggle("dark", finalTheme === "dark");
  }, []);


  const handleSetTheme = (newTheme: string) => { // ✅ New function to correctly update theme
    setTheme(newTheme);
    sessionStorage.setItem("theme", newTheme);
    document.body.classList.toggle("dark", newTheme === "dark");
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    handleSetTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme : handleSetTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

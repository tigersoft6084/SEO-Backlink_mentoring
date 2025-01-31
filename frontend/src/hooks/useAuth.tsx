"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const pathname = usePathname(); // ✅ Get the current page without breaking SSR

  // ✅ Load user from sessionStorage (safer than localStorage)
  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    const storedUser = sessionStorage.getItem("user");

    if (token && storedUser) {
      try {
        const userData: User = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error("Invalid user data in sessionStorage");
        sessionStorage.removeItem("user");
        setUser(null);
      }
    } else {
      // ✅ Delay router push until hydration is complete
      if (pathname !== "/auth/signin") {
        setTimeout(() => {
          window.location.href = "/auth/signin"; // ✅ Use `window.location.href` instead of `router.push()`
        }, 100);
      }
    }
    setIsHydrated(true);
  }, [pathname]); // ✅ Only run once when the page loads

  // ✅ Function to refresh user data when updated
  const refreshUser = () => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      try {
        const userData: User = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  };

  return { user, setUser, refreshUser, isHydrated };
}

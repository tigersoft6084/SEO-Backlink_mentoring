"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const pathname = usePathname(); // ✅ Get the current page without breaking SSR

  // ✅ Load user from sessionStorage (safer than localStorage)
  useEffect(() => {

    if (typeof window === "undefined") return; // ✅ Prevent SSR access


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
      if (pathname !== "/api/auth/signin") {
        setTimeout(() => {
          window.location.href = "/api/auth/signin"; // ✅ Use `window.location.href` instead of `router.push()`
        }, 100);
      }
    }
    setIsHydrated(true);
  }, [pathname]); // ✅ Only run once when the page loads

  // ✅ FIXED: Ensure refreshUser returns a Promise<void>
  const refreshUser = async (): Promise<void> => {
    try {

      const token = sessionStorage.getItem("authToken"); // ✅ Get token from sessionStorage

      if (!token) {
        console.warn("No auth token found, cannot refresh user.");
        return;
      }

      const response = await fetch("/api/usrInfo", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization' : `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();

      // ✅ Update sessionStorage with new user data
      sessionStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user); // ✅ Update state to trigger UI re-render
    } catch (error) {
      console.error("Error refreshing user data:", error);
      sessionStorage.removeItem("user"); // Remove invalid session data
      setUser(null);
    }
  };


  return { user, setUser, refreshUser, isHydrated };
}

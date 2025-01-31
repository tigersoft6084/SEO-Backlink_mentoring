"use client";

import { createContext, useContext, ReactNode } from "react";
import { useAuth } from "../hooks/useAuth"; // ✅ Import custom hook

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  refreshUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { user, setUser, refreshUser, isHydrated } = useAuth();

  // ⛔ Prevent rendering until hydration is complete
  if (!isHydrated) return null;

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

// ✅ Custom hook to use user data globally
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

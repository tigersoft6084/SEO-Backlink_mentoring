"use client";

import { createContext, useContext, useState } from "react";

// Define the types for context value
interface SidebarContextType {
  selectedMenuItem: string;
  setSelectedMenuItem: (item: string) => void;
}

const SidebarContext = createContext<SidebarContextType>({
  selectedMenuItem: "Keyword Search",
  setSelectedMenuItem: () => {},
});

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedMenuItem, setSelectedMenuItem] = useState("Keyword Search");

  return (
    <SidebarContext.Provider value={{ selectedMenuItem, setSelectedMenuItem }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);
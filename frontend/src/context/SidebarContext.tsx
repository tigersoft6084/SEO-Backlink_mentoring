"use client";

import { createContext, useContext, useState } from "react";

const SidebarContext = createContext({
  selectedMenuItem: "",
  setSelectedMenuItem: (item: string) => {},
});

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedMenuItem, setSelectedMenuItem] = useState("");

  return (
    <SidebarContext.Provider value={{ selectedMenuItem, setSelectedMenuItem }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);
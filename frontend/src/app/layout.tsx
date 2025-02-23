"use client";

import { SidebarProvider } from "../context/SidebarContext";
import { UserProvider } from "../context/UserContext"; // Import UserProvider
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "../context/ThemeContext";
import "../styles/globals.css";
import Navbar from "../components/common/Navbar";
import { ExpiredDomainsProvider } from "../context/ExpiredDomainsContext";
import { PlanProvider } from "../context/UserPlanContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <UserProvider>
            <SidebarProvider>
              <ExpiredDomainsProvider>
                <PlanProvider>
                  <Navbar />
                  {children}
                </PlanProvider>
              </ExpiredDomainsProvider>
            </SidebarProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

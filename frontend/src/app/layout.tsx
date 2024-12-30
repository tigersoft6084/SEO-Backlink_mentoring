"use client"

import { SidebarProvider } from "../context/SidebarContext";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "../context/ThemeContext";
import "../styles/globals.css";
import Navbar from "../components/common/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata = {
//   title: "Link Finder",
//   description: "This is about finding links.",
// };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ThemeProvider>
          <SidebarProvider>
            <Navbar />
            {children}
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

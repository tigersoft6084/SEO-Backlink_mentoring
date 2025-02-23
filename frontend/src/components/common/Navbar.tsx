import { useState, useEffect } from "react";
import { useSidebar } from "../../context/SidebarContext";
import ThemeToggle from "./ThemeToggle";
import Image from "next/image";
import { useExpiredDomains } from "../../context/ExpiredDomainsContext";
import { useUser } from "../../context/UserContext"; // ✅ Import useUser
import { FiLogOut } from "react-icons/fi"; // Import Logout Icon
import Link from "next/link";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"], // Regular & Bold
  display : "swap"
});


export default function Navbar() {
  const { selectedMenuItem } = useSidebar(); // Access the selected item
  const { totalExpiredDomains } = useExpiredDomains();
  const { user, setUser  } = useUser(); // ✅ Get user from context
  const [expiredCount, setExpiredCount] = useState(totalExpiredDomains);

  // Effect to update the count when it changes
  useEffect(() => {
    setExpiredCount(totalExpiredDomains);
  }, [totalExpiredDomains]);

    // Logout function
    const handleLogout = () => {
      sessionStorage.removeItem("user"); // ✅ Remove user from storage (or call backend logout API)
      setUser(null); // ✅ Clear user state
      setTimeout(() => {
        window.location.reload(); // ✅ Force UI refresh to prevent flicker
      }, 100);
    };

  return (
    <nav className="fixed top-0 left-0 w-full flex items-center justify-between px-6 py-4 dark:bg-slate-900 z-50">
      {/* Left Section: Logo */}
      <div className="flex items-center space-x-2 ml-6">
        <Image
          src="/images/logotype.svg" // Path to the SVG file in the public directory
          alt="Star Icon"
          width={170}
          height={80}
        />
      </div>

      {/* Center Section: Show when user is logged in */}
      {user ? (
        <div className="absolute left-80 flex items-center space-x-2">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
            {selectedMenuItem}
          </h1>

          {/* Show count only when Expired Domains is selected */}
          {selectedMenuItem === "Expired Domains" && (
            <span className="text-gray-800 dark:text-gray-200 text-3xl font-bold px-2 py-1">
              ({expiredCount})
            </span>
          )}
        </div>
      ) : (
        // Show "aaa" on home page when not logged in
        <div className="justify-end mr-5">

          {/* Navigation & Right Section in One Line */}
          <div className="flex items-center space-x-8">
            {/* Navigation Links */}
            <div className={`hidden md:flex space-x-6 text-gray-700 dark:text-gray-300 ${poppins.className}`} style={{ fontFamily: "Poppins, sans-serif" }}>
              <Link href="#" className="hover:text-gray-900 dark:hover:text-white font-euclid">
                Features
              </Link>
              <Link href="#" className="hover:text-gray-900 dark:hover:text-white font-sans">
                Who’s It For?
              </Link>
              <Link href="#" className="hover:text-gray-900 dark:hover:text-white"  style={{ fontFamily: "Euclid Circular A, sans-serif" }}>
                SEO Toolkit
              </Link>
              <Link href="#" className="hover:text-gray-900 dark:hover:text-white font-[Euclid_Circular_A]">
                Testimonials
              </Link>
              <Link href="#" className="hover:text-gray-900 dark:hover:text-white">
                Pricing
              </Link>
              <Link href="#" className="hover:text-gray-900 dark:hover:text-white">
                FAQ
              </Link>
            </div>

            {/* Vertical Divider */}
            <div className="w-px h-6 bg-gray-300"></div>

            {/* Log In & Sign Up Section */}
            <div className="flex items-center space-x-4">
              <Link href="/api/auth/signin" className="text-blue-600 dark:text-blue-400 hover:underline">
                Log In
              </Link>
              <Link href="/api/auth/signup">
                <button className="px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-full shadow-md hover:from-blue-600 hover:to-purple-600 transition-all">
                  Sign Up
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Right Section: Theme Toggle, Show Only If User is Logged In */}
      {user && (

        <div className="ml-auto flex items-center gap-4">
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="group relative flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-full shadow-md transition-all duration-300 ease-in-out focus:ring-2 focus:ring-purple-600 overflow-hidden hover:w-32"
          >
            {/* Icon (Default View) */}
            <span className="absolute flex items-center justify-center w-full h-full transition-all duration-300 group-hover:opacity-0 group-hover:translate-x-[-10px]">
              <FiLogOut className="text-xl" />
            </span>

            {/* Text (Expands on Hover) */}
            <span className="absolute opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:w-full group-hover:h-full flex items-center justify-center">
              Sign out
            </span>
          </button>
        </div>

      )}
    </nav>
  );
}

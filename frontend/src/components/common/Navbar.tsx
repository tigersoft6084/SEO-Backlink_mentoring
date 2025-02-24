"use client"

import { useState, useEffect } from "react";
import { useSidebar } from "../../context/SidebarContext";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import ThemeToggle from "./ThemeToggle";
import Image from "next/image";
import { useExpiredDomains } from "../../context/ExpiredDomainsContext";
import { useUser } from "../../context/UserContext";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { usePathname } from "next/navigation"; // ✅ Import usePathname

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export default function Navbar() {
  const { selectedMenuItem } = useSidebar();
  const { totalExpiredDomains } = useExpiredDomains();
  const { user, setUser } = useUser();
  const [expiredCount, setExpiredCount] = useState(totalExpiredDomains);
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname(); // ✅ Get current route

  // ✅ Check if the page is Sign In or Sign Up
  const isAuthPage = pathname === "/api/auth/signin" || pathname === "/api/auth/signup";

  useEffect(() => {
    setExpiredCount(totalExpiredDomains);
  }, [totalExpiredDomains]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.setItem("theme", "light"); // ✅ Force theme to light
    document.body.classList.remove("dark"); // ✅ Ensure UI updates immediately

    setUser(null);

    // Redirect to sign-in IMMEDIATELY
    window.location.href = "/api/auth/signin";
  };


  const smoothScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, targetId: string) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      const offsetTop = target.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
      setMenuOpen(false);
    }
  };

  return (
      <nav className={`fixed top-0 left-0 w-full flex items-center justify-between px-6 py-4 z-50 transition-all duration-300
        ${isScrolled ? "bg-white/80 backdrop-blur-md shadow-md dark:bg-slate-900/80 border-b border-gray-300/30" : "bg-transparent dark:bg-slate-900"}
      `}>

      <div className="container mx-auto flex items-center justify-between">

        {/* ✅ Show ONLY logo on Sign In / Sign Up pages */}
        {isAuthPage ? (
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/images/logotype.svg" alt="SurferLink Logo" width={160} height={50} className="dark:hidden" />
            <Image src="/images/logotype_dark.svg" alt="SurferLink Logo" width={160} height={50} className="hidden dark:block" />
          </Link>
        ) : (
          <>
            <Link
              href={user ? "#" : "/"} // ✅ Disable link when logged in
              onClick={(e) => {
                if (user) e.preventDefault(); // ✅ Prevent navigation if logged in
              }}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <Image
                src="/images/logotype.svg"
                alt="SurferLink Logo"
                width={160}
                height={50}
                className={`dark:hidden ${user ? "cursor-not-allowed" : ""}`} // ✅ Make it look disabled
              />
              <Image
                src="/images/logotype_dark.svg"
                alt="SurferLink Logo"
                width={160}
                height={50}
                className={`hidden dark:block ${user ? "cursor-not-allowed" : ""}`} // ✅ Make it look disabled
              />
            </Link>


            {/* User is Logged In */}
            {user ? (
              <div className="absolute left-80 flex items-center space-x-2">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                  {selectedMenuItem}
                </h1>
                {selectedMenuItem === "Expired Domains" && (
                  <span className="text-gray-800 dark:text-gray-200 text-3xl font-bold px-2 py-1">
                    ({expiredCount})
                  </span>
                )}
              </div>
            ) : (
              <div className="justify-end mr-5">

                {/* Navigation & Right Section in One Line */}
                <div className="flex items-center space-x-8">
                  {/* Desktop Navigation */}
                  <div className={`hidden md:flex items-center space-x-6 text-gray-700 dark:text-gray-300 ${poppins.className}`}>
                    <a href="#features" onClick={(e) => smoothScroll(e, "features")} className="hover:text-blue-500 dark:hover:text-white transition-all duration-200">Features</a>
                    <a href="#whos-it-for" onClick={(e) => smoothScroll(e, "whos-it-for")} className="hover:text-blue-500 dark:hover:text-white transition-all duration-200">Who’s It For?</a>
                    <a href="#seo-toolkit" onClick={(e) => smoothScroll(e, "seo-toolkit")} className="hover:text-blue-500 dark:hover:text-white transition-all duration-200">SEO Toolkit</a>
                    <a href="#testimonials" onClick={(e) => smoothScroll(e, "testimonials")} className="hover:text-blue-500 dark:hover:text-white transition-all duration-200">Testimonials</a>
                    <a href="#pricing" onClick={(e) => smoothScroll(e, "pricing")} className="hover:text-blue-500 dark:hover:text-white transition-all duration-200">Pricing</a>
                    <a href="#faq" onClick={(e) => smoothScroll(e, "faq")} className="hover:text-blue-500 dark:hover:text-white transition-all duration-200">FAQ</a>
                  </div>

                  {/* Vertical Divider */}
                  <div className="w-px h-6 bg-gray-300"></div>

                  {/* Log In & Sign Up Section */}
                  <div className="hidden md:flex items-center space-x-4">
                    <Link href="/api/auth/signin" className="text-blue-600 dark:text-blue-400 hover:underline transition-all">Log In</Link>
                    <Link href="/api/auth/signup">
                      <button className="px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-full shadow-md hover:from-blue-600 hover:to-purple-600 transition-all">
                        Sign Up
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Right Section: Theme Toggle & Logout */}
            {user && (
              <div className="ml-auto flex items-center gap-4">
                <ThemeToggle />
                <button
                  onClick={handleLogout}
                  className="group relative flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-full shadow-md transition-all duration-300 ease-in-out focus:ring-2 focus:ring-purple-600 overflow-hidden hover:w-32"
                >
                  <span className="absolute flex items-center justify-center w-full h-full transition-all duration-300 group-hover:opacity-0 group-hover:translate-x-[-10px]">
                    <FiLogOut className="text-xl" />
                  </span>
                  <span className="absolute opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:w-full group-hover:h-full flex items-center justify-center">
                    Sign out
                  </span>
                </button>
              </div>
            )}

            {/* Show Mobile Menu Button ONLY IF NOT LOGGED IN */}
            {!user && (
              <button className="md:hidden text-gray-800 dark:text-white" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
              </button>
            )}
              </>
            )}
      </div>

      {/* Mobile Menu (Only for Non-Logged In Users) */}
      {!user && menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white/95 dark:bg-slate-900/95 shadow-lg md:hidden transition-all duration-300">
          <div className="flex flex-col space-y-4 p-6 text-gray-700 dark:text-gray-300">
            <a href="#features" onClick={(e) => smoothScroll(e, "features")} className="hover:text-blue-500 dark:hover:text-white transition-all duration-200">Features</a>
            <a href="#whos-it-for" onClick={(e) => smoothScroll(e, "whos-it-for")} className="hover:text-blue-500 dark:hover:text-white transition-all duration-200">Who’s It For?</a>
            <a href="#seo-toolkit" onClick={(e) => smoothScroll(e, "seo-toolkit")} className="hover:text-blue-500 dark:hover:text-white transition-all duration-200">SEO Toolkit</a>
            <a href="#testimonials" onClick={(e) => smoothScroll(e, "testimonials")} className="hover:text-blue-500 dark:hover:text-white transition-all duration-200">Testimonials</a>
            <a href="#pricing" onClick={(e) => smoothScroll(e, "pricing")} className="hover:text-blue-500 dark:hover:text-white transition-all duration-200">Pricing</a>
            <a href="#faq" onClick={(e) => smoothScroll(e, "faq")} className="hover:text-blue-500 dark:hover:text-white transition-all duration-200">FAQ</a>
          </div>
        </div>
      )}
    </nav>
  );
}

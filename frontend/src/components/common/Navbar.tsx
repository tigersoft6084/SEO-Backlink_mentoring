import { useState, useEffect } from "react";
import { useSidebar } from "../../context/SidebarContext";
import useExpiredFilterView from "../../hooks/useExpiredFilterView";
import ThemeToggle from "./ThemeToggle";
import Image from "next/image";
import { useExpiredDomains } from "../../context/ExpiredDomainsContext";

export default function Navbar() {
  const { selectedMenuItem } = useSidebar(); // Access the selected item
  const { totalExpiredDomains } = useExpiredDomains();
  const [expiredCount, setExpiredCount] = useState(totalExpiredDomains);

  // Effect to update the count when it changes
  useEffect(() => {
    setExpiredCount(totalExpiredDomains);
  }, [totalExpiredDomains]); // Runs when totalExpiredDomains updates


  return (
    <nav className="relative flex items-center justify-between px-6 py-4 dark:bg-slate-900">
      {/* Left Section: Project Name */}
      <div className="flex items-center space-x-2">
        <div className="text-yellow-500 text-2xl">
          <Image
              src="/images/star.png" // Path to the SVG file in the public directory
              alt="Star Icon"
              width={48} // Adjust size
              height={48} // Adjust size
            />
        </div>
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          Link Finder
        </h1>
      </div>

      {/* Center Section: Dynamic Context */}
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

      {/* Right Section: Theme Toggle */}
      <div className="ml-auto">
        <ThemeToggle />
      </div>
    </nav>
  );
}
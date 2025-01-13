import { useSidebar } from "../../context/SidebarContext";
import ThemeToggle from "./ThemeToggle";
import Image from "next/image";

export default function Navbar() {
  const { selectedMenuItem } = useSidebar(); // Access the selected item

  return (
    <nav className="relative flex items-center justify-between px-6 py-4 dark:bg-gray-800">
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

      {/* Right Section: Dynamic Context */}
      <div className="absolute left-80">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
          {selectedMenuItem}
        </h1>
      </div>

      {/* Right Section: Theme Toggle */}
      <div className="ml-auto">
        <ThemeToggle />
      </div>
    </nav>
  );
}
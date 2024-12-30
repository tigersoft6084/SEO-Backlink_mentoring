import { PROJECT_NAME } from '../../resources/strings';
import ThemeToggle from './ThemeToggle'; // Ensure the theme toggle works globally

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 shadow-md dark:bg-gray-800">
      <div className="flex items-center space-x-2">
        <div className="text-yellow-500 text-2xl">
          ⭐ {/* Replace with an SVG or image if needed */}
        </div>
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          {PROJECT_NAME}
        </h1>
      </div>
      <ThemeToggle />
    </nav>
  );
}

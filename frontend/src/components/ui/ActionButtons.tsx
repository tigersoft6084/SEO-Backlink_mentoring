// ActionButtons.tsx
import { FaArrowDown } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";

export default function ActionButtons() {
  return (
    <div className="flex items-center gap-2">
      {/* CSV Button */}
      <button className="flex items-center gap-2 w-20 h-10 px-4 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
        <FaArrowDown className="text-lg" />
        <span className="text-sm font-medium">CSV</span>
      </button>
      {/* Settings Button */}
      <button className="flex justify-center items-center w-10 h-10 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
        <IoMdSettings className="text-lg" />
      </button>
    </div>
  );
}

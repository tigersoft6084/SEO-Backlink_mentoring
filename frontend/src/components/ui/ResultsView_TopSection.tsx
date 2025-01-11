import { FaSearch } from "react-icons/fa";

interface TopSectionProps {
  responseData: string[]; // Array of strings to display as keys
  onBack: () => void; // Function to handle "Start New Search" action
  maxKeysToShow: number; // Maximum number of keys to display
}

export default function TopSection({ responseData = [], onBack, maxKeysToShow }: TopSectionProps) {
  // Guard to prevent errors if responseData is undefined or not an array
  if (!Array.isArray(responseData)) {
    console.warn("responseData is not an array. Received:", responseData);
    responseData = []; // Default to an empty array
  }

  return (
    <div className="flex justify-between items-center mb-4">
      {/* Display the keys with a limit */}
      <div className="flex gap-2 flex-wrap">
        {responseData.slice(0, maxKeysToShow).map((key, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-gray-300 text-gray-800 rounded-full dark:bg-gray-700 dark:text-gray-300"
          >
            {key}
          </span>
        ))}
        {/* Display a message for extra keys */}
        {responseData.length > maxKeysToShow && (
          <span className="px-3 py-1 text-blue-600 dark:text-blue-300">
            and {responseData.length - maxKeysToShow} more
          </span>
        )}
      </div>

      {/* Button to trigger the onBack function */}
      <button
        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow hover:from-blue-600 hover:to-purple-600 flex items-center space-x-2"
        onClick={onBack}
      >
        <FaSearch />
        <span>Start New Search</span>
      </button>
    </div>
  );
}

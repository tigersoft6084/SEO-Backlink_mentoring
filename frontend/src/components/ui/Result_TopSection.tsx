import { FaSearch } from "react-icons/fa";

interface TopSectionProps {
  keywords: string[];
  onBack: () => void;
  maxKeywordsToShow: number;
}

export default function TopSection({ keywords, onBack, maxKeywordsToShow }: TopSectionProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex gap-2 flex-wrap">
        {keywords.slice(0, maxKeywordsToShow).map((keyword, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full dark:bg-gray-700 dark:text-gray-300"
          >
            {keyword}
          </span>
        ))}
        {keywords.length > maxKeywordsToShow && (
          <span className="px-3 py-1 text-blue-600 dark:text-blue-300">
            and {keywords.length - maxKeywordsToShow} more
          </span>
        )}
      </div>
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

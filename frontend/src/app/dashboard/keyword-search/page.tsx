"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { FaSearch } from "react-icons/fa";

export default function KeywordSearch({ placeholder }) {
  const [keyword, setKeyword] = useState(""); // State to track textarea value
  const router = useRouter(); // Initialize router

  const handleSearch = () => {
    if (keyword) {
      // Navigate to the result page with the keyword as a query parameter
      router.push(`/keyword-search/result?keyword=${encodeURIComponent(keyword)}`);
    }
  };

  return (
    <div className="flex-1 p-6">
      <div className="flex flex-col flex-1 p-10 border rounded-lg shadow-md bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200">
        {/* Location header */}
        <div className="flex items-center text-blue-500 font-medium mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 2c4.418 0 8 3.582 8 8 0 5.25-8 12-8 12S4 15.25 4 10c0-4.418 3.582-8 8-8z"
            />
            <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
          </svg>
          United States
        </div>

        {/* Textarea */}
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-400 dark:text-gray-200"
          placeholder={placeholder}
          rows={10}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)} // Update keyword state on input
        />

        {/* Search button aligned to the right */}
        <button
          className={`mt-4 px-6 py-2 bg-gradient-to-r text-white font-medium rounded-lg flex items-center space-x-2 self-end ${
            keyword
              ? "from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              : "from-blue-300 to-purple-300 cursor-not-allowed"
          }`}
          disabled={!keyword} // Disable button when there is no keyword
          onClick={handleSearch}
        >
          <FaSearch />
          <span>Find Links</span>
        </button>
      </div>
    </div>
  );
}

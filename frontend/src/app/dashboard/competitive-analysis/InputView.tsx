"use client";

import { useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function InputView({ placeholder, onSearch }) {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (keyword.trim()) {
      const keywordsArray = keyword
        .split("\n")
        .map((k) => k.trim())
        .filter(Boolean);

      if (keywordsArray.length > 20) {
        alert("Please enter up to 20 keywords.");
        return;
      }

      try {
        setLoading(true);

        const response = await fetch("/api/bulkKeywordSearch", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            keywords: keywordsArray,
            locationCode: 2840, // Example location code
            languageCode: "en", // Example language code
          }),
        });

        if (response.ok) {
          const responseJSON = await response.json();
          onSearch(responseJSON);
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.error}`);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("An error occurred while processing the request.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
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
        onChange={(e) => setKeyword(e.target.value)}
      />

      {/* Search button */}
      <button
        className={`mt-4 px-6 py-2 bg-gradient-to-r text-white font-medium rounded-lg flex items-center space-x-2 self-end ${
          keyword && !loading
            ? "from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            : "from-blue-300 to-purple-300 cursor-not-allowed"
        }`}
        disabled={!keyword || loading}
        onClick={handleSearch}
      >
        {loading ? (
          <span>Loading...</span>
        ) : (
          <>
            <FaSearch />
            <span>Find Links</span>
          </>
        )}
      </button>
    </div>
  );
}

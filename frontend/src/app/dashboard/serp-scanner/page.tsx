"use client";

import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import LocationHeader from "../../../components/forms/LocationHeader";
import { useUser } from "../../../context/UserContext";

export default function SerpScanner() {
  const [keyword, setKeyword] = useState(""); // State to track input value
  const { user } = useUser();
  const locationFromDB = user?.location || "United States";

  const [location, setLocation] = useState(locationFromDB); // Default location

  const handleSearch = () => {
    if (!keyword) return;
    console.log("Searching for:", keyword); // Replace with actual search logic
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && keyword) {
      handleSearch();
    }
  };

  return (
    <div className="flex-1 p-6">
      <div className="flex flex-col items-center lg:flex-row flex-1 p-8 border rounded-xl shadow-lg bg-white dark:bg-slate-900 dark:border-gray-600 dark:text-gray-200">

        {/* Location header */}
        <div className="-mb-5">
          <LocationHeader location={location} setLocation={setLocation} />
        </div>


        {/* Search input section */}
        <div className="flex flex-col lg:flex-row items-center w-full mt-4 lg:mt-0">
          {/* Input field */}
          <input
            type="text"
            className="flex-1 mx-4 px-6 py-3 text-lg border border-gray-300 rounded-lg dark:bg-slate-800 dark:border-gray-500 dark:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:focus:ring-blue-300 transition-all"
            placeholder="Enter a keyword to scan the backlinks of the top 10 search results"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Enter keywords to search"
          />

          {/* Search button */}
          <button
            className={`mt-4 lg:mt-0 px-6 py-3 bg-gradient-to-r text-white font-medium rounded-lg flex items-center space-x-3 transition-all ${
              keyword
                ? "from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 dark:bg-blue-700 dark:hover:bg-blue-800"
                : "from-blue-300 to-purple-300 cursor-not-allowed"
            }`}
            disabled={!keyword}
            onClick={handleSearch}
            aria-label="Search for links"
          >
            <FaSearch />
            <span className="text-lg">Find Links</span>
          </button>
        </div>
      </div>
    </div>
  );
}

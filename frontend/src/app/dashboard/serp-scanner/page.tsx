"use client";

import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import LocationHeader from "../../../components/forms/LocationHeader";
import { useUser } from "../../../context/UserContext";

export default function SerpScanner() {
  const [keyword, setKeyword] = useState(""); // State to track input value
  const {user} = useUser();
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
      <div className="flex flex-row flex-1 p-10 border rounded-lg shadow-md bg-white dark:bg-slate-900 dark:border-gray-600 dark:text-gray-200">
        {/* Location header */}
        <LocationHeader location={location} setLocation={setLocation}/>

        {/* Input field */}
        <input
          type="text"
          className="flex-1 mx-4 px-4 py-2 border border-gray-300 rounded-lg dark:bg-slate-800 dark:border-gray-500 dark:text-gray-400 focus:ring focus:ring-gray-600 focus:outline-none dark:focus:ring-gray-200"
          placeholder= "Enter a keyword to scan the backlinks of the top 10 search results"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Enter keywords to search"
        />

        {/* Search button */}
        <button
          className={`px-4 py-2 bg-gradient-to-r text-white font-medium rounded-lg flex items-center space-x-2 ${
            keyword
              ? "from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 dark:bg-blue-700 dark:hover:bg-blue-800"
              : "from-blue-300 to-purple-300 cursor-not-allowed"
          }`}
          disabled={!keyword}
          onClick={handleSearch}
          aria-label="Search for links"
        >
          <FaSearch />
          <span>Find Links</span>
        </button>
      </div>
    </div>
  );
}

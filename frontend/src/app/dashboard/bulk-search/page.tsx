"use client";

import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { MdCloudUpload } from "react-icons/md";

export default function BulkSearch({ placeholder }) {
  const [keyword, setKeyword] = useState(""); // State to track textarea value
  const [file, setFile] = useState(null); // State to track uploaded file

  const handleSearch = () => {
    // Add search logic here
    console.log("Search initiated with:", keyword);
  };

  const handleUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile && uploadedFile.type === "text/csv") {
      setFile(uploadedFile);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          const csvContent = event.target.result;
          console.log("CSV Content:", csvContent); // Process CSV content as needed
          if (typeof csvContent === "string") {
            setKeyword(csvContent); // Optionally set the textarea with the CSV content
          }
        }
      };
      reader.readAsText(uploadedFile);
    } else {
      alert("Please upload a valid CSV file.");
    }
  };

  return (
    <div className="flex-1 p-6">
      <div className="flex flex-col flex-1 p-10 border rounded-lg shadow-md bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200">
        {/* Textarea */}
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-400 dark:text-gray-200"
          placeholder={placeholder}
          rows={10}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)} // Update keyword state on input
        />

        {/* Button Row */}
        <div className="flex items-center justify-between mt-4">
          {/* Upload CSV Button */}
          <label className="px-4 py-2 text-blue-600 dark:text-blue-300 flex space-x-2 items-center cursor-pointer">
            <MdCloudUpload />
            <span>Upload a CSV</span>
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleUpload}
            />
          </label>

          {/* Search Button */}
          <button
            className={`px-6 py-2 bg-gradient-to-r text-white font-medium rounded-lg flex items-center space-x-2 ${
              keyword
                ? "from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 dark:bg-blue-700 dark:hover:bg-blue-800"
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
    </div>
  );
}

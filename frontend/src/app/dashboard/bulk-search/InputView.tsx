"use client";

import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { MdCloudUpload } from "react-icons/md";

export default function InputView({ placeholder, onSearch }) {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null); // State to track uploaded file


  const handleSearch = async () => {
    if (domain.trim()) {
      const domainsArray = domain
        .split("\n")
        .map((k) => k.trim())
        .filter(Boolean);

      if (domainsArray.length > 30000) {
        alert("Please enter up to 30000 domains.");
        return;
      }

      // Regular expression to check if the domain format is valid
      const domainRegex = /^(?!:\/\/)(?=[a-zA-Z0-9-]{1,256}\.?[a-zA-Z]{2,6}\b)(?!.*\.\.)(?!.*-$)(?![0-9]+$)(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}$/;

      // Check each domain for validity
      for (let domain of domainsArray) {
        if (!domainRegex.test(domain)) {
          alert(`Invalid domain format: ${domain}`);
          return;
        }
      }

      try {
        setLoading(true);

        const response = await fetch("/api/bulkDomainSearch", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            domains: domainsArray,
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
            // Extract domains from CSV content (assuming CSV format is correct)
            const lines = csvContent.split("\n");
            const domainList = lines
              .slice(1) // Skip header row
              .map((line) => {
                const columns = line.split(","); // Split by commas
                const domain = columns[0].trim(); // Get the domain from the first column
                return domain.replace(/^"|"$/g, ""); // Remove any surrounding quotes
              })
              .filter(Boolean); // Remove any empty lines

            setDomain(domainList.join("\n")); // Set the domain list in the textarea
          }
        }
      };
      reader.readAsText(uploadedFile);
    } else {
      alert("Please upload a valid CSV file.");
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
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
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
          className={`px-6 py-2 bg-gradient-to-r text-white font-medium rounded-lg flex items-center space-x-2 self-end ${
            domain && !loading
              ? "from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 dark:bg-blue-700 dark:hover:bg-blue-800"
              : "from-blue-300 to-purple-300 cursor-not-allowed"
          }`}
          disabled={!domain || loading}
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
    </div>
  );
}

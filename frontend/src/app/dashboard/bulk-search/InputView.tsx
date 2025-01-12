"use client";

import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { MdCloudUpload } from "react-icons/md";
import LocationHeader from "../../../components/forms/LocationHeader";
import TextArea from "../../../components/forms/TextArea";
import UploadButton from "../../../components/forms/UploadButton";
import SearchButton from "../../../components/forms/SearchButton";

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
      <LocationHeader location="United States" />
      <TextArea value={domain} onChange={(e) => setDomain(e.target.value)} placeholder={placeholder} />
      <div className="flex items-center justify-between mt-4">
        <UploadButton onUpload={handleUpload} />
        <SearchButton loading={loading} disabled={!domain || loading} onClick={handleSearch} />
      </div>
    </div>
  );
}

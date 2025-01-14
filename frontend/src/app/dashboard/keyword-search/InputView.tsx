"use client";

import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import LocationHeader from "../../../components/forms/LocationHeader";
import TextArea from "../../../components/forms/TextArea";
import SearchButton from "../../../components/forms/SearchButton";

interface InputViewProps {
  placeholder: string;
  onSearch: (data: any) => void;
}

export default function InputView({ placeholder, onSearch }: InputViewProps) {
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
            depth : 100
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
      <LocationHeader location="United States" />
      <TextArea value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder={placeholder} />
      <SearchButton loading={loading} disabled={!keyword || loading} onClick={handleSearch} />
    </div>
  );
}

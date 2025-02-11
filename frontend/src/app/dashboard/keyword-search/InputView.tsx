"use client";

import { useState } from "react";
import LocationHeader from "../../../components/forms/LocationHeader";
import TextArea from "../../../components/forms/TextArea";
import SearchButton from "../../../components/forms/SearchButton";
import { useUser } from "../../../context/UserContext";

interface InputViewProps {
  placeholder: string;
  onSearch: (data: any) => void;
  setLoading: (loading: boolean) => void;
}

export default function InputView({ placeholder, onSearch, setLoading }: InputViewProps) {
  const [keyword, setKeyword] = useState("");
  const {user} = useUser();

  const locationFromDB = user?.location || "United States";

  const [location, setLocation] = useState(locationFromDB); // Default location

  const handleSearch = async () => {
    if (keyword.trim()) {
      const keywordsArray = keyword
        .split("\n")
        .map((k) => k.trim())
        .filter(Boolean);

      const maxDisplayKeywords = user?.features.resultsPerSearch || 50;
      const maxKeywords = user?.features.bulkKeywords || 1;

      if (keywordsArray.length > maxKeywords ) {
        alert(`Your plan is ${maxKeywords} simultaneous bulk Keywords. Please enter up to ${maxKeywords} keywords.`);
        return;
      }

      setLoading(true);

      try {

        const response = await fetch("/api/bulkKeywordSearch", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            keywords: keywordsArray,
            locationCode: location, // Example location code
            languageCode: "en", // Example language code
            depth : maxDisplayKeywords
          }),
        });

        console.log( keywordsArray,location, maxDisplayKeywords)

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
      }
    }
  };

  return (
    <div className="flex flex-col flex-1 p-10 border rounded-lg shadow-md bg-white dark:bg-slate-800 dark:border-gray-600 dark:text-gray-200">
      <LocationHeader location={location} setLocation={setLocation} />
      <TextArea value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder={`Enter up to ${user?.features.bulkKeywords} keywords (1 per line) to scan Google SERPs.`} />
      <SearchButton disabled={!keyword} onClick={handleSearch} />
    </div>
  );
}

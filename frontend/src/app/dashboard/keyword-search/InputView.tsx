"use client";

import { useEffect, useState } from "react";
import LocationHeader from "../../../components/forms/LocationHeader";
import TextArea from "../../../components/forms/TextArea";
import SearchButton from "../../../components/forms/SearchButton";
import { useUser } from "../../../context/UserContext";

interface InputViewProps {
  placeholder: string;
  onSearch: (data: any) => void;
  setLoading: (loading: boolean) => void;
}

const locations = [
  { name: "United States", code: "2840"},
  { name: "United Kingdom", code: "2826"},
  { name: "Canada", code: "2124"},
  { name: "Spain", code: "2724"},
  { name: "France", code: "2250"},
  { name: "Germany", code: "2276" },
  { name: "Brazil", code: "2076"},
  { name: "Portugal", code: "2620"},
  { name: "Italy", code: "2380"},
  { name: "Belgium", code: "2056"},
  { name: "Switzerland", code: "2756" },
];

export default function InputView({ placeholder, onSearch, setLoading }: InputViewProps) {
  const [keyword, setKeyword] = useState("");
  const {user, location} = useUser();

  const locationFromDB = locations.find(loc => loc.name === user?.location)?.code || "2840"; // Default to "United States" if not found

  const [locationCode, setLocationCode] = useState(locationFromDB);

    // Update locationCode whenever location changes
    useEffect(() => {
      const locationMatch = locations.find((loc) => loc.name === location);
      if (locationMatch) {
        setLocationCode(locationMatch.code);
      }
    }, [location]);

  const handleSearch = async () => {
    if (keyword.trim()) {
      const keywordsArray = keyword
        .split("\n")
        .map((k) => k.trim())
        .filter(Boolean);

      const maxDisplayKeywords = user?.features?.resultsPerSearch || 50;
      const maxKeywords = user?.features?.bulkKeywords || 1;

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
            locationCode: locationCode, // Example location code
            languageCode: "en", // Example language code
            depth : maxDisplayKeywords
          }),
        });

        console.log( keywordsArray,locationCode, maxDisplayKeywords)

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
      <LocationHeader location={locationCode} setLocation={setLocationCode} />
      <TextArea value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder={`Enter up to ${user?.features?.bulkKeywords || 50} keywords (1 per line) to scan Google SERPs.`} />
      <SearchButton disabled={!keyword} onClick={handleSearch} />
    </div>
  );
}

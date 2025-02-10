"use client";

import { useState } from "react";
import LocationHeader from "../../../components/forms/LocationHeader";
import TextArea from "../../../components/forms/TextArea";
import SearchButton from "../../../components/forms/SearchButton";

interface InputViewProps {
  placeholder: string;
  onSearch: (data: any) => void;
  setLoading: (loading: boolean) => void;
}

export default function InputView({ placeholder, onSearch, setLoading }: InputViewProps) {
  const [domains, setKeyword] = useState("");

  const handleSearch = async () => {
    if (domains.trim()) {
      const domainsArray = domains
        .split("\n")
        .map((k) => k.trim())
        .filter(Boolean);

      if (domainsArray.length > 40) {
        alert("Please enter up to 40 domains.");
        return;
      }

      setLoading(true);

      try {

        const response = await fetch("/api/bulkCompetitors", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reqDomains: domainsArray,
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
      }
    }
  };

  return (
    <div className="flex flex-col flex-1 p-10 border rounded-lg shadow-md bg-white dark:bg-slate-800 dark:border-gray-600 dark:text-gray-200">
      <TextArea value={domains} onChange={(e) => setKeyword(e.target.value)} placeholder={placeholder} />
      <SearchButton disabled={!domains} onClick={handleSearch} />
    </div>
  );
}

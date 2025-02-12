"use client";

import { useState } from "react";
import TextArea from "../../../components/forms/TextArea";
import SearchButton from "../../../components/forms/SearchButton";
import { useUser } from "../../../context/UserContext";

interface InputViewProps {
  onSearch: (data: any) => void;
  setLoading: (loading: boolean) => void;
}

export default function InputView({ onSearch, setLoading }: InputViewProps) {
  const [domains, setKeyword] = useState("");
    const {user} = useUser();

  const handleSearch = async () => {
    if (domains.trim()) {
      const domainsArray = domains
        .split("\n")
        .map((k) => k.trim())
        .filter(Boolean);

      let usedFeatures_competitive = user?.usedFeatures?.competitiveAnalysis || 0;
      const maxDisplay = user?.features?.resultsPerSearch || 100;
      const maxKDomains = user?.features?.bulkCompetitive || 1;

      if (usedFeatures_competitive >= (user?.features?.competitiveAnalysis ?? 0)) {
        alert(`You have reached your keyword search limit.`);
        return;
      }

      if (domainsArray.length > maxKDomains) {
        alert(`Your plan is ${maxKDomains} simultaneous bulk competitive analysis. Please enter up to ${maxKDomains} domains.`);
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

      setLoading(true);

      try {

        const response = await fetch("/api/bulkCompetitors", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reqDomains: domainsArray,
            displayDepth : maxDisplay
          }),
        });

        if (response.ok) {

          usedFeatures_competitive++;

          const saveFeaturesResponse = await fetch("/api/saveUsedFeatures", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userEmail : user?.email,
              competitiveAnalysis: usedFeatures_competitive,
            }),
          })
          if(saveFeaturesResponse){
            const responseJSON = await response.json();
            onSearch(responseJSON);
          }
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
      <TextArea value={domains} onChange={(e) => setKeyword(e.target.value)} placeholder={`Competitor domain or URL per line. ${user?.features?.bulkCompetitive || 100} maximum`} />
      <SearchButton disabled={!domains} onClick={handleSearch} />
    </div>
  );
}

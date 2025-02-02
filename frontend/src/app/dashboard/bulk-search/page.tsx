"use client";

import InputView from "./InputView";
import { useSearchView } from "../../../hooks/useSearchView";
import ResultsView from "../../../components/ui/ResultsView";
import { useState } from "react";
import Lottie from "react-lottie-player";
import findLinks from '../../../../public/preload/findLinks.json'

export default function BulkSearch() {
  const {
    currentView,
    responseData,
    switchToResults,
    switchToInput,
  } = useSearchView();
    const [loading, setLoading] = useState(false);

  const pageName = "BulkSearch"

  const handleSearch = async (data: any) => {
    setLoading(true); // Start loading animation

    try {
      // Store the response and show results
      switchToResults(data);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false); // Stop loading animation
    }
  };

  return (
    <div className="flex-1 px-6 pt-6 bg-gray-100 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      {loading ? (
        // Show Lottie animation while loading
        <div className="flex justify-center items-center h-screen" style={{marginTop : "-100px"}}>
          <Lottie loop animationData={findLinks} play style={{ width: 200, height: 200 }} />
        </div>
      ) :currentView === "input" ? (
        <InputView
          placeholder="Send up to 30000 URLs maximum, 1 per line."
          onSearch={handleSearch}
          setLoading={setLoading} // Pass down loading function
        />
      ) : (
        <ResultsView responseData={responseData} onBack={switchToInput} pageName={pageName} />
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import ResultsView from "../../../components/ui/ResultsView";
import { useSearchView } from "../../../hooks/useSearchView";
import InputView from "./InputView";
import Lottie from "react-lottie-player";
import findLinks from '../../../../public/lottie/findLinks.json'


export default function KeywordSearch() {
  const { currentView, responseData, switchToResults, switchToInput } = useSearchView();
  const [loading, setLoading] = useState(false);

  const pageName = "KeywordSearch"; // Define the pageName here

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
    <div className="flex-1 p-6 bg-gray-100 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      {loading ? (
        // Show Lottie animation while loading
        <div className="flex flex-col justify-center items-center h-screen" style={{marginTop : "-100px"}}>
          <Lottie loop animationData={findLinks} play style={{ width: 200, height: 200 }} />
          <p className="text-gray-500 dark:text-gray-300 text-lg font-semibold mt-4 loaderL">
            Fetching results... This may take a second.
          </p>
        </div>
      ) : currentView === "input" ? (
        // Show InputView only when not loading
        <InputView
          placeholder="Enter up to 20 keywords (1 per line) to scan Google SERPs."
          onSearch={handleSearch}
          setLoading={setLoading} // Pass down loading function
        />
      ) : (
        // Show results when loading is complete
        <ResultsView responseData={responseData} onBack={switchToInput} pageName = {pageName}/>
      )}
    </div>
  );
}
